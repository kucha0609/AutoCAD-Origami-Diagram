(defun c:RE430 ();RenameBlock
  (setvar "cmdecho" 0)(command "undo" "be")
  ;--改块名-- 
    (setq BlockList (list        
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
                

                
    ))
        
    (while BlockList
      (setq aa (car BlockList)
            BlockList (cdr BlockList))
      
      (if (and (tblsearch "Block" (car aa)) (not (tblsearch "Block" (cadr aa))))
        (command "_.rename" "b" (car aa) (cadr aa))
      );end if
    )
    
    (while (= 1 (getvar "cmdactive")) (command pause));等待上一个命令完成
  ;--改文字样式名,关闭UCS坐标--
    (command "_.rename" "S" "kucha制图" "OriTools" )
    (command "UCSICON" "OFF")
  ;--改图层名--
    (setq LayList (list        
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
    ))
        
    (while LayList
      (setq Name (car LayList)
            LayList (cdr LayList))
      
      (if (and (tblsearch "Layer" (car Name)) (not (tblsearch "Layer" (cadr Name))))
        (command "_.rename" "LA" (car Name) (cadr Name))
      );end if
    )
    
    (while (= 1 (getvar "cmdactive")) (command pause));等待上一个命令完成
  ;--改图层特性--
      ;加载线型
        (progn
          (setq l0 (list "--Mtn--" "--Vay--" "--Aux--" "--Bdr--"))
            
          (defun LoadLinetypes ( lts / acapp acdoc aclts aclin ) (vl-load-com)
            (defun str->lst ( str del / pos )
              (if (setq pos (vl-string-search del str))
                (vl-remove "" (cons (substr str 1 pos) (str->lst (substr str (+ pos 1 (strlen del))) 
                                                        
              del)))
                (list str)
              )
            )
              (setq acdoc (vla-get-ActiveDocument (setq acapp (vlax-get-acad-object)))
                    aclts (vla-get-Linetypes acdoc)
              )
              (setq aclin
                (apply 'append
                  (mapcar '(lambda ( directory ) (vl-directory-files directory "*.lin" 1))
                    (str->lst
                      (vla-get-SupportPath (vla-get-Files (vla-get-Preferences acapp))) ";"
                    )
                  )
                )
              )
              (apply 'and
                (mapcar
                  (function
                    (lambda ( lt )
                      (or (tblsearch "LTYPE" lt)
                        (vl-some
                          (function
                            (lambda ( lin )
                              (vl-catch-all-apply 'vla-load (list aclts lt lin)) (tblsearch "LTYPE" lt)
                            )
                          )
                          aclin
                        )
                      )
                    )
                  )
                  lts
                )
              )  
          )
            
          (LoadLinetypes l0)
            (if (not (tblsearch "Ltype" "--Mtn--"))
              (progn
                (entmake (list '(0 . "LTYPE") '(100 . "AcDbSymbolTableRecord") '
                              (100 . "AcDbLinetypeTableRecord") '(2 . "--Mtn--") '
                              (70 . 0) '(3 . "Mountain Line — - - — - - —") '
                              (72 . 65) '(73 . 6) '(40 . 4.0) '(49 . 2.0) '
                              (74 . 0) '(49 . -0.5) '(74 . 0) '(49 . 0.25) '
                              (74 . 0) '(49 . -0.5) '(74 . 0) '(49 . 0.25) '
                              (74 . 0) '(49 . -0.5) '(74 . 0)
                        )
                )
              )                                  
            )
            ;----
            (if (not (tblsearch "Ltype" "--Vay--"))
              (progn
                (entmake (list '(0 . "LTYPE") '(100 . "AcDbSymbolTableRecord") '
                              (100 . "AcDbLinetypeTableRecord") '(2 . "--Vay--") '
                              (70 . 0) '(3 . "Valley Line —  —  —  —  —") '
                              (72 . 65) '(73 . 2) '(40 . 3.0) '(49 . 2.0) '
                              (74 . 0) '(49 . -1.0) '(74 . 0)
                        )
                )
              )                                  
            )
            ;----
            (if (not (tblsearch "Ltype" "--Aux--"))
              (progn                             
                (entmake (list '(0 . "LTYPE") '(100 . "AcDbSymbolTableRecord") '
                              (100 . "AcDbLinetypeTableRecord") '(2 . "--Aux--") '
                              (70 . 0) '(3 . "Auxiliary Line - - - - - - - - -") '
                              (72 . 65) '(73 . 2) '(40 . 2.0) '(49 . 1.0) '
                              (74 . 0) '(49 . -1.0) '(74 . 0)
                        )
                )
              )                                  
            )
            ;----
            (if (not (tblsearch "Ltype" "--Bdr--"))
              (progn
                (entmake (list '(0 . "LTYPE") '(100 . "AcDbSymbolTableRecord") '
                              (100 . "AcDbLinetypeTableRecord") '(2 . "--Bdr--") '
                              (70 . 0) '(3 . "Dotted line · · · · · · ·") '
                              (72 . 65) '(73 . 2) '(40 . 1.0) '(49 . 0.0) '
                              (74 . 0) '(49 . -1.0) '(74 . 0)
                        )
                )
              )                                  
            )                                    
        )
      ;改图层线型
        (command "_.layer" "L" "--Aux--" "D-05-Auxiliary" "")
        (command "_.layer" "L" "--Mtn--" "D-06-Mountain" "")
        (command "_.layer" "L" "--Mtn--" "D-07-MtnHide" "")
        (command "_.layer" "L" "--Vay--" "D-08-Valley" "")
        (command "_.layer" "L" "--Vay--" "D-09-VayHide" "")
        (command "_.layer" "L" "--Bdr--" "D-10-BdrRef" "")
    

      ;|
        (while (= 1 (getvar "cmdactive")) (command pause));等待上一个命令完成
      ;改图层说明
        (command "_.layer" "D" "L=Layout" "D-01-Layout" "Y" "")
        (command "_.layer" "D" "T=Text" "D-02-TextStep" "Y" "")
        (command "_.layer" "D" "SS=Symbols_Standard" "D-03-SymStd" "Y" "")
        (command "_.layer" "D" "SR=Symbols_Reference" "D-04-SymRef" "Y" "")
        (command "_.layer" "D" "A=Auxiliary_line" "D-05-Auxiliary" "Y" "")
        (command "_.layer" "D" "M=Mountain_line" "D-06-Mountain" "Y" "")
        (command "_.layer" "D" "MH=Mountain_Hide" "D-07-MtnHide" "Y" "")
        (command "_.layer" "D" "V=Valley_line" "D-08-Valley" "Y" "")
        (command "_.layer" "D" "VH=Valley_Hide" "D-09-VayHide" "Y" "")
        (command "_.layer" "D" "BR=Border_Reference" "D-10-BdrRef" "Y" "")
        (command "_.layer" "D" "B=Border_line" "D-11-Border" "Y" "")
        (command "_.layer" "D" "E=Existing_Line" "D-12-Exist" "Y" "")
        (command "_.layer" "D" "OF=Other_Face" "D-13-OthFace" "Y" "")
        (command "_.layer" "D" "DF=Dark_Face" "D-14-DarkFace" "Y" "")
        (command "_.layer" "D" "P=Page" "D-15-Page" "Y" "")
      |;

  (while (= 1 (getvar "cmdactive")) (command pause));等待上一个命令完成
  ;(vla-PurgeAll(vla-get-activedocument(vlax-get-acad-object)));PU清理无用对象
  (command "undo" "e")
  (setvar "cmdecho" 1)(princ)
)