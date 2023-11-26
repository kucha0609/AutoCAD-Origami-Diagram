(defun C:UpOriVer  (/ DOC *Old_SysVar* *error* K:ReBlkNam K:ExpBlk4kNam K:MovBlk2Lay K:ReStyle LayLst BlkLst Lay SS i en pt La)
  (setq DOC (vla-get-activedocument (vlax-get-acad-object)))
  (setq LayLst (vla-get-layers DOC) BlkLst (vla-get-blocks DOC))
  (progn ;基础函数
      (defun *error* (x)  ;出错函数
        (if *LockLst* (foreach Lay *LockLst* (vla-put-lock (vla-item LayLst Lay) :vlax-true)));恢复图层状态
        (if *Old_SysVar* (foreach xx *Old_SysVar* (apply 'setvar xx)));参数恢复
        (vla-endundomark DOC);错误时结束编组
      )
      ;更新块名:如果不存在就改名，如果存在就替换
      (defun K:ReBlkNam (Lst / Old_Nam New_Nam SS en pt La)
          ;(K:ReBlkNam (List 原块名 现块名))
          (setq Old_Nam (car Lst)
                New_Nam (cadr Lst)
          )
          (if (tblsearch "Block" New_Nam);新块存在
              (if (setq SS (ssget "A" (list (cons 0 "INSERT")(cons 2 Old_Nam))))
                  (repeat (setq i (SSlength SS))
                    (setq en (SSname SS (setq i (1- i)))
                          pt (Cdr (ASSoc 10 (Entget en)))
                          La (Cdr (ASSoc 8 (Entget en)))
                    )
                    (entmake (list '(0 . "INSERT") (cons 8 La)(cons 2 New_Nam) (cons 10 pt)));插入点
                    (entdel en)
                  )    
              )
              (if (tblsearch "Block" Old_Nam)
                  (vla-put-name (vla-item BlkLst Old_Nam) New_Nam)
              )
          )
          (princ)
      )
      ;更新层名(非零层):如果不存在就改名，如果存在就合并
      (defun K:ReLayNam (Lst / Old_Nam New_Nam)
          ;(K:ReLayNam (List 原层名 现层名))
          (setq Old_Nam (car Lst)
                New_Nam (cadr Lst)
          )
          ;(setvar "CLAYER" "0");切换到0层
          (if (tblsearch "Layer" Old_Nam);旧层存在
              (if (tblsearch "Layer" New_Nam);新层存在
                  (command "_.LAYMRG" "N" Old_Nam "" "N" New_Nam "Y")
                  (vla-put-name (vla-item LayLst Old_Nam) New_Nam)
              )
          )
          (princ)
      )
      ;块移到指定图层(块内对象随块层):Flag为T时块内对象颜色随层
      (defun K:MovBlk2Lay (BlkNam LayNam Flag / BlkDealLst SS i en obj Nam)
        ;(K:MovBlk2Lay "0-TitleRef" "D-01-Layout" T)
        (if (setq SS (ssget "A" '((0 . "INSERT"))))
            (repeat (setq i (SSlength SS))
              (setq en  (SSname SS (setq i (1- i)))
                    obj (vlax-ename->vla-object en)
              )
              (setq Nam 
                        (if (vlax-property-available-p obj 'effectivename) 
                            (vla-get-effectivename obj) ;动态块名
                            (vla-get-name obj) ;静态块名
                        )
              )
              (if 
                  (and
                      (eq Nam BlkNam)
                      (tblsearch "Layer" LayNam);图层存在
                  )
                  (progn
                      (K:CatchApply 'vla-put-layer (list obj LayNam))
                      (if (not (member BlkNam BlkDealLst))
                          (progn
                              (vlax-map-collection (vla-item (vla-get-blocks Doc) BlkNam) 
                                  '(lambda (obj) 
                                        (K:CatchApply 'vla-put-Layer (list obj LayNam))
                                        (if Flag (K:CatchApply 'vla-put-Color (list obj 256)))
                                    )
                              );处理块内对象
                              (command "ATTSYNC" "N" BlkNam)
                              (setq BlkDealLst (cons BlkNam BlkDealLst))
                          )
                      )
                  )    
              )
            )
        )
      )
      ;更新文字样式(字体默认HarmonyOS Sans SC)
      (defun K:ReStyle (Old_Nam New_Nam / blk obj SS att)
          ;(K:ReStyle "kucha制图" "OriTools")
          (mapcar
            '(lambda (DATA / TS)
                (setq TS (vla-get-TextStyles (vla-get-activedocument (vlax-get-acad-object))))
                (K:CatchApply 'vla-setfont (list (vla-add TS (nth 0 DATA)) (nth 1 DATA) "false" "false" 1 0))
                (K:CatchApply 'vla-put-width (list (vla-add TS (nth 0 DATA)) (nth 2 DATA)));设置宽度
            )
            (list
                (list New_Nam "HarmonyOS Sans SC" 1.0)
                (list "Standard" "HarmonyOS Sans SC" 1.0)
            )
          );创建文字样式
          (setvar "TextStyle" New_Nam);将OriTools设置为当前字体样式
          (if (tblsearch "style" Old_Nam);旧样式存在
            (progn
              (vlax-for blk (vla-get-blocks DOC) 
                (vlax-for obj blk 
                    (if (vlax-property-available-p obj 'stylename) 
                      (K:CatchApply 'vla-put-stylename (list obj New_Nam))
                    )
                )
              );改所有文字
              (setq SS (ssget "A" '((0 . "INSERT") (66 . 1))))
              (vlax-for blk (vla-get-activeselectionset DOC) 
                (foreach att (vlax-invoke blk 'getattributes) 
                  (K:CatchApply 'vla-put-stylename (list att New_Nam))
                )
              );更新属性块
            )
          )
      )
      ;分解名称包含在表中的块(支持动态块)
      (defun K:ExpBlk4kNam (Lst / SS i en obj ObjNam)
          (if (setq SS (ssget "A" '((0 . "INSERT"))))
              (repeat (setq i (SSlength SS))
                (setq en  (SSname SS (setq i (1- i)))
                      obj (vlax-ename->vla-object en)
                )
                (setq ObjNam (if (vlax-property-available-p obj 'effectivename) 
                              (vla-get-effectivename obj) ;动态块名
                              (vla-get-name obj) ;静态块名
                            )
                )
                (if (member ObjNam Lst)
                  (progn
                    (vlax-invoke obj 'EXPLODE)
                    (vla-delete obj)
                  )    
                )
              )
          )
      )
  )

  (while (eq 8 (logand 8 (getvar 'undoctl))) 
      (vla-endundomark DOC)
  );关闭以前的编组
  (vla-startundomark DOC);记录编组
    (progn  ;记录系统变量及设置初始值
        (setq *Old_SysVar* '()) ;清空变量,避免出错
        (setq *Old_SysVar* (mapcar 
                            '(lambda (a / b) 
                                (if (setq b (getvar (car a))) 
                                  (progn 
                                    (apply 'setvar a)
                                    (list (car a) b)
                                  )
                                )
                              )
                            (list 
                              (list "cmdecho" 0) ;关闭回显
                            )
                          )
        ) ;记录参数
        (setvar "clayer" "0") ;临时切到0图层
    )
    (vla-PurgeAll DOC);清理无用对象
    (vlax-for xx LayLst 
        (if (eq (vla-get-lock xx) :vlax-true) 
          (progn 
            (setq *LockLst* (cons (vla-get-name xx) *LockLst*))
            (vla-put-lock xx :vlax-false)
          )
        )
    );临时解锁图层
    (progn ;版本更新
        ;4.3.0-->>文字样式改名为OriTools,字体由思源黑体更新为鸿蒙
            (K:ReStyle "kucha制图" "OriTools")
        ;---------------------

        (while (> (getvar "CMDACTIVE") 0) (command PAUSE)) ;等待前面的命令完成
        ;4.3.2-->>中文块转英文块、图层名称变英文、版头移到图层D-01-Layout并随层
          (mapcar 'K:ReLayNam
              (list
                (list "D-01-版面" "D-01-Layout")
                (list "D-02-文字" "D-02-TextStep")
                (list "D-03-符号" "D-03-SymStd")
                (list "D-04-参考符号" "D-04-SymRef")
                (list "D-05-辅助线" "D-05-Auxiliary")
                (list "D-06-峰线" "D-06-Mountain")
                (list "D-07-峰线(隐藏)" "D-07-MtnHide")
                (list "D-08-谷线" "D-08-Valley")
                (list "D-09-谷线(隐藏)" "D-09-VayHide")
                (list "D-10-边界线(参考)" "D-10-BdrRef")
                (list "D-11-边界线" "D-11-Border")
                (list "D-12-已有线条" "D-12-Exist")
                (list "D-13-其它填充" "D-13-OthFace")
                (list "D-14-深色填充" "D-14-DarkFace")
                (list "D-15-图框" "D-15-Page")
              )
          )
          (K:MovBlk2Lay "0-版头参考" "D-01-Layout" T)
          (while (> (getvar "CMDACTIVE") 0) (command PAUSE)) ;等待前面的命令完成
          (mapcar 'K:ReBlkNam
            (list
              ;01-Symbols
                (list "0-版头参考" "0-TitleRef")
                (list "0-A4图纸" "0-PgeSize")
                (list "0-A4页码" "0-PgeNum")
                          
                (list "0-颜色参考" "0-ColRef")
                              
                (list "1-点对点" "1-TwoPoint")
                (list "1-单点" "1-OnePoint")
                (list "1-垂直" "1-RtAngle")
                (list "1-平行" "1-Parallel")
                (list "1-角平分" "1-DivAng")
                (list "1-等分" "1-DivLen")

                (list "2-向前折" "2-VayFold")
                (list "2-预折" "2-FoldUnf")
                (list "2-段折" "2-SwvFold")
                (list "2-向前折-传统" "2-VayFoldT")
                (list "2-向后折-平角" "2-MtnFold")
                (list "2-向后折-钝角" "2-MtFoldS")
                            
                (list "3-沉折" "3-Sink")
                (list "3-特殊点" "3-SinkPt")
                (list "3-撑开" "3-OpFlap")
                (list "3-拉出" "3-PullOut")
                            
                (list "4-翻面" "4-TurnOver")
                (list "4-放大" "4-ZomIn")
                (list "4-旋转" "4-Rotation")
                (list "4-缩小" "4-ZomOut")
                            
                (list "5-重复" "5-Repeat")
                (list "5-返回" "5-ReturnTo")            
                (list "5-对侧重复" "5-RepeatT")
                (list "5-拉开" "5-HoldPull")
                            
                (list "6-纸层-向外" "6-FlapF")
                (list "6-纸层-向内" "6-FlapB")
                (list "6-标记点" "6-MarkPt")
                (list "6-视点" "6-ViewPt")
                            
                (list "7-裁剪" "7-CutPaper")
                (list "7-纸张颜色" "7-ColTips")
                          
              ;02-Frame+Steps    
                (list "0-首页-3x3" "FNum-3x3")
                (list "0-A4角标" "PgFooter")
                (list "0-步骤-3x4" "Grid-3x4")
                (list "0-序号-3x4" "Num-3x4")

                (list "0-步骤-3x3" "Grid-3x3")
                (list "0-序号-3x3" "Num-3x3")
                (list "0-步骤-3x2" "Grid-3x2")
                (list "0-序号-3x2" "Num-3x2")

                (list "0-步骤-2x4" "Grid-2x4")
                (list "0-序号-2x4" "Num-2x4")
                (list "0-步骤-2x3" "Grid-2x3")
                (list "0-序号-2x3" "Num-2x3")
                (list "0-步骤-2x2" "Grid-2x2")
                (list "0-序号-2x2" "Num-2x2")

                (list "0-步骤-4x4" "Grid-4x4")
                (list "0-序号-4x4" "Num-4x4")
                (list "0-步骤-4x3" "Grid-4x3")
                (list "0-序号-4x3" "Num-4x3")    
                          
              ;03-Text_Base
                (list "0-垂直折" "0-Vertical-Fold")
                (list "0-向前折-特殊" "0-Flip-ToFront")
                (list "0-向后折-特殊" "0-Flip-ToBack")
                (list "0-向后折" "0-MtnFold-ToBack")

                (list "0-向前折" "1-VayFold_")
                (list "0-向前折-已有线" "1-VayFold-Line")
                (list "0-向前折-标记" "1-VayFold-Marks")
                (list "0-向前折-点对点" "1-VayFold-Pt2Pt")
                (list "0-向前折-角平分" "1-VayFold-DivAng")
                (list "0-向前折-两点" "1-VayFold-TwoPt")
                (list "0-向前折-边对边" "1-VayFold-Edge")

                (list "0-预折" "1-FoldUnf_")
                (list "0-预折-标记" "1-FoldUnf-Marks")
                (list "0-预折-点对点" "1-FoldUnf-Pt2Pt")
                (list "0-预折-角平分" "1-FoldUnf-DivAng")
                (list "0-预折-两点" "1-FoldUnf-TwoPt")
                (list "0-预折-边对边" "1-FoldUnf-Edge")

                (list "3-途中图" "2-Flatten")
                (list "3-结果展示" "2-Result-Current")
                (list "3-收拢-折痕" "2-Collapse-Crease")
                (list "3-抓住并拉动" "2-Hold-Pull")

                (list "3-区域-放大" "3-Zoom-Into")
                (list "3-区域-缩小" "3-Zoom-Out")

                (list "4-改变顺序-向内" "3-Flap-ToBack")
                (list "4-改变顺序-向外" "3-Flap-ToFront")

                (list "4-步骤-重复" "4-Repeat-Steps")
                (list "4-塑造模型" "4-Shape-Model")
                (list "4-完成" "4-Completed")

              ;04-Text_Other
                (list "1-开放沉折" "0-Sink-Open")
                (list "1-闭合沉折" "0-Sink-Closed")
                (list "1-延展沉折" "0-Sink-Spread")
                (list "1-往返沉折" "0-Sink-in-out")        
                (list "1-复杂沉折" "0-Sink-Complex")
                (list "1-反向沉折" "0-Sink-Undo")

                (list "1-内翻折" "1-RevFold-Inside")
                (list "1-外翻折" "1-RevFold-Outside")

                (list "2-兔耳折" "1-RabbitFold")
                (list "2-兔耳折-特殊" "1-RabbitFold-Special")
                (list "2-兔耳折-向后" "1-RabbitFold-ToBack")

                (list "2-旋转折" "2-SwvFold_")
                (list "2-旋转折-标记" "2-SwvFold-Marks")
                (list "2-旋转折-角平分" "2-SwvFold-DivAng")

                (list "2-段折-单侧" "2-Pleat-Fold")
                (list "2-段折-向内" "2-CrimpFold-Outside")
                (list "2-段折-向外" "2-CrimpFold-Inside")

                (list "1-花瓣折" "2-PetalFold")
                (list "1-花瓣折-标记" "2-PetalFold-Marks")
                (list "1-花瓣折-特殊" "2-PetalFold-Special")

                (list "2-撑开折" "3-Squash-Fold")
                (list "2-打开纸层" "3-Open-Flap")

                (list "3-纸层-压入" "3-Push-Inside")
                (list "3-纸层-推出" "3-Push-Outside")
                (list "3-纸层-拉出" "3-Pull-Inner")

                (list "3-透视图-进入" "4-XR-View")
                (list "3-透视图-退出" "4-Normal-view")

                (list "4-改变视角" "4-Change-VP")
                (list "4-步骤-重复" "4-Repeat-Step")
                (list "4-步骤-返回" "4-Return-Step")
                (list "4-步骤-断面" "4-Cross-Sec") 
              
            )
          )
        ;---------------------
        
        (while (> (getvar "CMDACTIVE") 0) (command PAUSE)) ;等待前面的命令完成
        ;4.3.3-->>增加浅色图层D-15-DarkLight,图层名称相应修改
            (mapcar 'K:ReLayNam
                (list
                  (list "D-13-OthFace" "D-13-FaceOth")
                  (list "D-14-DarkFace" "D-14-FaceDark")
                  (list "D-15-Page" "D-16-Page")
                )
            )
        ;---------------------
      
        (while (> (getvar "CMDACTIVE") 0) (command PAUSE)) ;等待前面的命令完成
        ;6.1-->>两种圆点标记更新为一种
          (K:ExpBlk4kNam (list "1-OnePoint" "1-TwoPoint"))
          (while (> (getvar "CMDACTIVE") 0) (command PAUSE)) ;等待前面的命令完成
          (if (setq SS (SSget "A" (list '(0 . "CIRCLE") '(8 . "D-04-SymRef"))))
            (progn
              (if (not (tblsearch "Block" "1-MkPoint")) 
                (progn
                  (entmake (list '(0 . "Block") (cons 2 "1-MkPoint") '(70 . 0) (cons 10 '(0.0 0.0 0.0))))
                  (entmake (list '(0 . "CIRCLE") (cons 8 "D-04-SymRef") (cons 10 '(0.0 0.0 0.0)) (cons 40 1.0)))
                  (entmake '((0 . "ENDBLK")))
                )
              );创建块
              (repeat (setq i (SSlength SS))
                (setq en (SSname SS (setq i (1- i)))
                      pt (Cdr (ASSoc 10 (Entget en)))
                )
                (entmake (list '(0 . "INSERT") (cons 8 "D-04-SymRef")(cons 2 "1-MkPoint") (cons 10 pt)));插入点
                (entdel en)
              )
            )
          )
        ;---------------------
      
        (while (> (getvar "CMDACTIVE") 0) (command PAUSE)) ;等待前面的命令完成
        ;6.5-->>纸张块名更新、线型名称更新
          (mapcar 'K:ReBlkNam
              (list
                  (list "0-PgeSize" "0-A4Page")
                  (list "K-pgeSize-A3" "0-A3Page")
              )
          )
        ;---------------------

        (while (> (getvar "CMDACTIVE") 0) (command PAUSE)) ;等待前面的命令完成
        ;20231125-->>单位精度、图层颜色及线型基础再检查---------------------
          (vla-PurgeAll DOC);清理无用对象
          ;--Units_单位精度
          (SetVar "LUNITS" 2);设置线性单位。1 科学 2 小数 3 工程 4 建筑 5 分数
          (SetVar "LUPREC" 1);设置所有只读线性单位和可编辑线性单位（其精度小于或等于当前 luprec 的值）的小数位位数。
          (SetVar "AUNITS" 0);设置角度单位:0.十进制度数 1.度/分/秒 2.百分度 3.弧度 4.勘测单位
          (SetVar "AUPREC" 1);设置所有只读角度单位（显示在状态行上）和可编辑角度单位（其精度小于或等于当前 auprec 的值）的小数位数。
          (K:GetOriLay);获取折纸图层
          (foreach 
              xx 
              (mapcar
                '(lambda (X) (list (nth 0 X) (nth 1 X)));只取颜色和对象
                (cddddr (reverse *OriLst:LayerProps*))
              )
              (if (tblsearch "Layer" (car xx))
                (progn
                  (vla-put-color (vla-Item LayLst (car xx)) (cadr xx));改图层色
                  (if (setq SS (ssget "x" (list (cons 8 (car xx)))))
                      (command "chprop" SS "" "color" "bylayer" "ltype" "bylayer" "");将所选对象颜色、线型设置为随层
                  )
                )
              )
          );随层颜色复原
        ;---------------------
    )
    (if *LockLst* (foreach Lay *LockLst* (vla-put-lock (vla-item LayLst Lay) :vlax-true)));恢复图层状态
    (vla-regen DOC acallviewports);刷新视口
    (K:LangTips 
        "版本相关的名称已更新(仅名称)"
        "Version-related name has been updated (Just name)"
    )
  (vla-endundomark DOC);结束编组

  (foreach xx *Old_SysVar* (apply 'setvar xx));参数恢复
  (princ)
)