(defun C:UpOriVer  (/ DOC *Old_SysVar* *error* K:ReBlkNam K:ExpBlk4kNam K:MovBlk2Lay K:ReStyle LayLst BlkLst Lay SS i en pt La)
  (setq DOC (vla-get-activedocument (vlax-get-acad-object)))
  (setq LayLst (vla-get-layers DOC) BlkLst (vla-get-blocks DOC))
  (progn ;��������
      (defun *error* (x)  ;������
        (if *LockLst* (foreach Lay *LockLst* (vla-put-lock (vla-item LayLst Lay) :vlax-true)));�ָ�ͼ��״̬
        (if *Old_SysVar* (foreach xx *Old_SysVar* (apply 'setvar xx)));�����ָ�
        (vla-endundomark DOC);����ʱ��������
      )
      ;���¿���:��������ھ͸�����������ھ��滻
      (defun K:ReBlkNam (Lst / Old_Nam New_Nam SS en pt La)
          ;(K:ReBlkNam (List ԭ���� �ֿ���))
          (setq Old_Nam (car Lst)
                New_Nam (cadr Lst)
          )
          (if (tblsearch "Block" New_Nam);�¿����
              (if (setq SS (ssget "A" (list (cons 0 "INSERT")(cons 2 Old_Nam))))
                  (repeat (setq i (SSlength SS))
                    (setq en (SSname SS (setq i (1- i)))
                          pt (Cdr (ASSoc 10 (Entget en)))
                          La (Cdr (ASSoc 8 (Entget en)))
                    )
                    (entmake (list '(0 . "INSERT") (cons 8 La)(cons 2 New_Nam) (cons 10 pt)));�����
                    (entdel en)
                  )    
              )
              (if (tblsearch "Block" Old_Nam)
                  (vla-put-name (vla-item BlkLst Old_Nam) New_Nam)
              )
          )
          (princ)
      )
      ;���²���(�����):��������ھ͸�����������ھͺϲ�
      (defun K:ReLayNam (Lst / Old_Nam New_Nam)
          ;(K:ReLayNam (List ԭ���� �ֲ���))
          (setq Old_Nam (car Lst)
                New_Nam (cadr Lst)
          )
          ;(setvar "CLAYER" "0");�л���0��
          (if (tblsearch "Layer" Old_Nam);�ɲ����
              (if (tblsearch "Layer" New_Nam);�²����
                  (command "_.LAYMRG" "N" Old_Nam "" "N" New_Nam "Y")
                  (vla-put-name (vla-item LayLst Old_Nam) New_Nam)
              )
          )
          (princ)
      )
      ;���Ƶ�ָ��ͼ��(���ڶ�������):FlagΪTʱ���ڶ�����ɫ���
      (defun K:MovBlk2Lay (BlkNam LayNam Flag / BlkDealLst SS i en obj Nam)
        ;(K:MovBlk2Lay "0-TitleRef" "D-01-Layout" T)
        (if (setq SS (ssget "A" '((0 . "INSERT"))))
            (repeat (setq i (SSlength SS))
              (setq en  (SSname SS (setq i (1- i)))
                    obj (vlax-ename->vla-object en)
              )
              (setq Nam 
                        (if (vlax-property-available-p obj 'effectivename) 
                            (vla-get-effectivename obj) ;��̬����
                            (vla-get-name obj) ;��̬����
                        )
              )
              (if 
                  (and
                      (eq Nam BlkNam)
                      (tblsearch "Layer" LayNam);ͼ�����
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
                              );������ڶ���
                              (command "ATTSYNC" "N" BlkNam)
                              (setq BlkDealLst (cons BlkNam BlkDealLst))
                          )
                      )
                  )    
              )
            )
        )
      )
      ;����������ʽ(����Ĭ��HarmonyOS Sans SC)
      (defun K:ReStyle (Old_Nam New_Nam / blk obj SS att)
          ;(K:ReStyle "kucha��ͼ" "OriTools")
          (mapcar
            '(lambda (DATA / TS)
                (setq TS (vla-get-TextStyles (vla-get-activedocument (vlax-get-acad-object))))
                (K:CatchApply 'vla-setfont (list (vla-add TS (nth 0 DATA)) (nth 1 DATA) "false" "false" 1 0))
                (K:CatchApply 'vla-put-width (list (vla-add TS (nth 0 DATA)) (nth 2 DATA)));���ÿ��
            )
            (list
                (list New_Nam "HarmonyOS Sans SC" 1.0)
                (list "Standard" "HarmonyOS Sans SC" 1.0)
            )
          );����������ʽ
          (setvar "TextStyle" New_Nam);��OriTools����Ϊ��ǰ������ʽ
          (if (tblsearch "style" Old_Nam);����ʽ����
            (progn
              (vlax-for blk (vla-get-blocks DOC) 
                (vlax-for obj blk 
                    (if (vlax-property-available-p obj 'stylename) 
                      (K:CatchApply 'vla-put-stylename (list obj New_Nam))
                    )
                )
              );����������
              (setq SS (ssget "A" '((0 . "INSERT") (66 . 1))))
              (vlax-for blk (vla-get-activeselectionset DOC) 
                (foreach att (vlax-invoke blk 'getattributes) 
                  (K:CatchApply 'vla-put-stylename (list att New_Nam))
                )
              );�������Կ�
            )
          )
      )
      ;�ֽ����ư����ڱ��еĿ�(֧�ֶ�̬��)
      (defun K:ExpBlk4kNam (Lst / SS i en obj ObjNam)
          (if (setq SS (ssget "A" '((0 . "INSERT"))))
              (repeat (setq i (SSlength SS))
                (setq en  (SSname SS (setq i (1- i)))
                      obj (vlax-ename->vla-object en)
                )
                (setq ObjNam (if (vlax-property-available-p obj 'effectivename) 
                              (vla-get-effectivename obj) ;��̬����
                              (vla-get-name obj) ;��̬����
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
  );�ر���ǰ�ı���
  (vla-startundomark DOC);��¼����
    (progn  ;��¼ϵͳ���������ó�ʼֵ
        (setq *Old_SysVar* '()) ;��ձ���,�������
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
                              (list "cmdecho" 0) ;�رջ���
                            )
                          )
        ) ;��¼����
        (setvar "clayer" "0") ;��ʱ�е�0ͼ��
    )
    (vla-PurgeAll DOC);�������ö���
    (vlax-for xx LayLst 
        (if (eq (vla-get-lock xx) :vlax-true) 
          (progn 
            (setq *LockLst* (cons (vla-get-name xx) *LockLst*))
            (vla-put-lock xx :vlax-false)
          )
        )
    );��ʱ����ͼ��
    (progn ;�汾����
        ;4.3.0-->>������ʽ����ΪOriTools,������˼Դ�������Ϊ����
            (K:ReStyle "kucha��ͼ" "OriTools")
        ;---------------------

        (while (> (getvar "CMDACTIVE") 0) (command PAUSE)) ;�ȴ�ǰ����������
        ;4.3.2-->>���Ŀ�תӢ�Ŀ顢ͼ�����Ʊ�Ӣ�ġ���ͷ�Ƶ�ͼ��D-01-Layout�����
          (mapcar 'K:ReLayNam
              (list
                (list "D-01-����" "D-01-Layout")
                (list "D-02-����" "D-02-TextStep")
                (list "D-03-����" "D-03-SymStd")
                (list "D-04-�ο�����" "D-04-SymRef")
                (list "D-05-������" "D-05-Auxiliary")
                (list "D-06-����" "D-06-Mountain")
                (list "D-07-����(����)" "D-07-MtnHide")
                (list "D-08-����" "D-08-Valley")
                (list "D-09-����(����)" "D-09-VayHide")
                (list "D-10-�߽���(�ο�)" "D-10-BdrRef")
                (list "D-11-�߽���" "D-11-Border")
                (list "D-12-��������" "D-12-Exist")
                (list "D-13-�������" "D-13-OthFace")
                (list "D-14-��ɫ���" "D-14-DarkFace")
                (list "D-15-ͼ��" "D-15-Page")
              )
          )
          (K:MovBlk2Lay "0-��ͷ�ο�" "D-01-Layout" T)
          (while (> (getvar "CMDACTIVE") 0) (command PAUSE)) ;�ȴ�ǰ����������
          (mapcar 'K:ReBlkNam
            (list
              ;01-Symbols
                (list "0-��ͷ�ο�" "0-TitleRef")
                (list "0-A4ͼֽ" "0-PgeSize")
                (list "0-A4ҳ��" "0-PgeNum")
                          
                (list "0-��ɫ�ο�" "0-ColRef")
                              
                (list "1-��Ե�" "1-TwoPoint")
                (list "1-����" "1-OnePoint")
                (list "1-��ֱ" "1-RtAngle")
                (list "1-ƽ��" "1-Parallel")
                (list "1-��ƽ��" "1-DivAng")
                (list "1-�ȷ�" "1-DivLen")

                (list "2-��ǰ��" "2-VayFold")
                (list "2-Ԥ��" "2-FoldUnf")
                (list "2-����" "2-SwvFold")
                (list "2-��ǰ��-��ͳ" "2-VayFoldT")
                (list "2-�����-ƽ��" "2-MtnFold")
                (list "2-�����-�۽�" "2-MtFoldS")
                            
                (list "3-����" "3-Sink")
                (list "3-�����" "3-SinkPt")
                (list "3-�ſ�" "3-OpFlap")
                (list "3-����" "3-PullOut")
                            
                (list "4-����" "4-TurnOver")
                (list "4-�Ŵ�" "4-ZomIn")
                (list "4-��ת" "4-Rotation")
                (list "4-��С" "4-ZomOut")
                            
                (list "5-�ظ�" "5-Repeat")
                (list "5-����" "5-ReturnTo")            
                (list "5-�Բ��ظ�" "5-RepeatT")
                (list "5-����" "5-HoldPull")
                            
                (list "6-ֽ��-����" "6-FlapF")
                (list "6-ֽ��-����" "6-FlapB")
                (list "6-��ǵ�" "6-MarkPt")
                (list "6-�ӵ�" "6-ViewPt")
                            
                (list "7-�ü�" "7-CutPaper")
                (list "7-ֽ����ɫ" "7-ColTips")
                          
              ;02-Frame+Steps    
                (list "0-��ҳ-3x3" "FNum-3x3")
                (list "0-A4�Ǳ�" "PgFooter")
                (list "0-����-3x4" "Grid-3x4")
                (list "0-���-3x4" "Num-3x4")

                (list "0-����-3x3" "Grid-3x3")
                (list "0-���-3x3" "Num-3x3")
                (list "0-����-3x2" "Grid-3x2")
                (list "0-���-3x2" "Num-3x2")

                (list "0-����-2x4" "Grid-2x4")
                (list "0-���-2x4" "Num-2x4")
                (list "0-����-2x3" "Grid-2x3")
                (list "0-���-2x3" "Num-2x3")
                (list "0-����-2x2" "Grid-2x2")
                (list "0-���-2x2" "Num-2x2")

                (list "0-����-4x4" "Grid-4x4")
                (list "0-���-4x4" "Num-4x4")
                (list "0-����-4x3" "Grid-4x3")
                (list "0-���-4x3" "Num-4x3")    
                          
              ;03-Text_Base
                (list "0-��ֱ��" "0-Vertical-Fold")
                (list "0-��ǰ��-����" "0-Flip-ToFront")
                (list "0-�����-����" "0-Flip-ToBack")
                (list "0-�����" "0-MtnFold-ToBack")

                (list "0-��ǰ��" "1-VayFold_")
                (list "0-��ǰ��-������" "1-VayFold-Line")
                (list "0-��ǰ��-���" "1-VayFold-Marks")
                (list "0-��ǰ��-��Ե�" "1-VayFold-Pt2Pt")
                (list "0-��ǰ��-��ƽ��" "1-VayFold-DivAng")
                (list "0-��ǰ��-����" "1-VayFold-TwoPt")
                (list "0-��ǰ��-�߶Ա�" "1-VayFold-Edge")

                (list "0-Ԥ��" "1-FoldUnf_")
                (list "0-Ԥ��-���" "1-FoldUnf-Marks")
                (list "0-Ԥ��-��Ե�" "1-FoldUnf-Pt2Pt")
                (list "0-Ԥ��-��ƽ��" "1-FoldUnf-DivAng")
                (list "0-Ԥ��-����" "1-FoldUnf-TwoPt")
                (list "0-Ԥ��-�߶Ա�" "1-FoldUnf-Edge")

                (list "3-;��ͼ" "2-Flatten")
                (list "3-���չʾ" "2-Result-Current")
                (list "3-��£-�ۺ�" "2-Collapse-Crease")
                (list "3-ץס������" "2-Hold-Pull")

                (list "3-����-�Ŵ�" "3-Zoom-Into")
                (list "3-����-��С" "3-Zoom-Out")

                (list "4-�ı�˳��-����" "3-Flap-ToBack")
                (list "4-�ı�˳��-����" "3-Flap-ToFront")

                (list "4-����-�ظ�" "4-Repeat-Steps")
                (list "4-����ģ��" "4-Shape-Model")
                (list "4-���" "4-Completed")

              ;04-Text_Other
                (list "1-���ų���" "0-Sink-Open")
                (list "1-�պϳ���" "0-Sink-Closed")
                (list "1-��չ����" "0-Sink-Spread")
                (list "1-��������" "0-Sink-in-out")        
                (list "1-���ӳ���" "0-Sink-Complex")
                (list "1-�������" "0-Sink-Undo")

                (list "1-�ڷ���" "1-RevFold-Inside")
                (list "1-�ⷭ��" "1-RevFold-Outside")

                (list "2-�ö���" "1-RabbitFold")
                (list "2-�ö���-����" "1-RabbitFold-Special")
                (list "2-�ö���-���" "1-RabbitFold-ToBack")

                (list "2-��ת��" "2-SwvFold_")
                (list "2-��ת��-���" "2-SwvFold-Marks")
                (list "2-��ת��-��ƽ��" "2-SwvFold-DivAng")

                (list "2-����-����" "2-Pleat-Fold")
                (list "2-����-����" "2-CrimpFold-Outside")
                (list "2-����-����" "2-CrimpFold-Inside")

                (list "1-������" "2-PetalFold")
                (list "1-������-���" "2-PetalFold-Marks")
                (list "1-������-����" "2-PetalFold-Special")

                (list "2-�ſ���" "3-Squash-Fold")
                (list "2-��ֽ��" "3-Open-Flap")

                (list "3-ֽ��-ѹ��" "3-Push-Inside")
                (list "3-ֽ��-�Ƴ�" "3-Push-Outside")
                (list "3-ֽ��-����" "3-Pull-Inner")

                (list "3-͸��ͼ-����" "4-XR-View")
                (list "3-͸��ͼ-�˳�" "4-Normal-view")

                (list "4-�ı��ӽ�" "4-Change-VP")
                (list "4-����-�ظ�" "4-Repeat-Step")
                (list "4-����-����" "4-Return-Step")
                (list "4-����-����" "4-Cross-Sec") 
              
            )
          )
        ;---------------------
        
        (while (> (getvar "CMDACTIVE") 0) (command PAUSE)) ;�ȴ�ǰ����������
        ;4.3.3-->>����ǳɫͼ��D-15-DarkLight,ͼ��������Ӧ�޸�
            (mapcar 'K:ReLayNam
                (list
                  (list "D-13-OthFace" "D-13-FaceOth")
                  (list "D-14-DarkFace" "D-14-FaceDark")
                  (list "D-15-Page" "D-16-Page")
                )
            )
        ;---------------------
      
        (while (> (getvar "CMDACTIVE") 0) (command PAUSE)) ;�ȴ�ǰ����������
        ;6.1-->>����Բ���Ǹ���Ϊһ��
          (K:ExpBlk4kNam (list "1-OnePoint" "1-TwoPoint"))
          (while (> (getvar "CMDACTIVE") 0) (command PAUSE)) ;�ȴ�ǰ����������
          (if (setq SS (SSget "A" (list '(0 . "CIRCLE") '(8 . "D-04-SymRef"))))
            (progn
              (if (not (tblsearch "Block" "1-MkPoint")) 
                (progn
                  (entmake (list '(0 . "Block") (cons 2 "1-MkPoint") '(70 . 0) (cons 10 '(0.0 0.0 0.0))))
                  (entmake (list '(0 . "CIRCLE") (cons 8 "D-04-SymRef") (cons 10 '(0.0 0.0 0.0)) (cons 40 1.0)))
                  (entmake '((0 . "ENDBLK")))
                )
              );������
              (repeat (setq i (SSlength SS))
                (setq en (SSname SS (setq i (1- i)))
                      pt (Cdr (ASSoc 10 (Entget en)))
                )
                (entmake (list '(0 . "INSERT") (cons 8 "D-04-SymRef")(cons 2 "1-MkPoint") (cons 10 pt)));�����
                (entdel en)
              )
            )
          )
        ;---------------------
      
        (while (> (getvar "CMDACTIVE") 0) (command PAUSE)) ;�ȴ�ǰ����������
        ;6.5-->>ֽ�ſ������¡��������Ƹ���
          (mapcar 'K:ReBlkNam
              (list
                  (list "0-PgeSize" "0-A4Page")
                  (list "K-pgeSize-A3" "0-A3Page")
              )
          )
        ;---------------------

        (while (> (getvar "CMDACTIVE") 0) (command PAUSE)) ;�ȴ�ǰ����������
        ;20231125-->>��λ���ȡ�ͼ����ɫ�����ͻ����ټ��---------------------
          (vla-PurgeAll DOC);�������ö���
          ;--Units_��λ����
          (SetVar "LUNITS" 2);�������Ե�λ��1 ��ѧ 2 С�� 3 ���� 4 ���� 5 ����
          (SetVar "LUPREC" 1);��������ֻ�����Ե�λ�Ϳɱ༭���Ե�λ���侫��С�ڻ���ڵ�ǰ luprec ��ֵ����С��λλ����
          (SetVar "AUNITS" 0);���ýǶȵ�λ:0.ʮ���ƶ��� 1.��/��/�� 2.�ٷֶ� 3.���� 4.���ⵥλ
          (SetVar "AUPREC" 1);��������ֻ���Ƕȵ�λ����ʾ��״̬���ϣ��Ϳɱ༭�Ƕȵ�λ���侫��С�ڻ���ڵ�ǰ auprec ��ֵ����С��λ����
          (K:GetOriLay);��ȡ��ֽͼ��
          (foreach 
              xx 
              (mapcar
                '(lambda (X) (list (nth 0 X) (nth 1 X)));ֻȡ��ɫ�Ͷ���
                (cddddr (reverse *OriLst:LayerProps*))
              )
              (if (tblsearch "Layer" (car xx))
                (progn
                  (vla-put-color (vla-Item LayLst (car xx)) (cadr xx));��ͼ��ɫ
                  (if (setq SS (ssget "x" (list (cons 8 (car xx)))))
                      (command "chprop" SS "" "color" "bylayer" "ltype" "bylayer" "");����ѡ������ɫ����������Ϊ���
                  )
                )
              )
          );�����ɫ��ԭ
        ;---------------------
    )
    (if *LockLst* (foreach Lay *LockLst* (vla-put-lock (vla-item LayLst Lay) :vlax-true)));�ָ�ͼ��״̬
    (vla-regen DOC acallviewports);ˢ���ӿ�
    (K:LangTips 
        "�汾��ص������Ѹ���(������)"
        "Version-related name has been updated (Just name)"
    )
  (vla-endundomark DOC);��������

  (foreach xx *Old_SysVar* (apply 'setvar xx));�����ָ�
  (princ)
)