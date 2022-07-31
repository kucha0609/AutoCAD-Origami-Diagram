(defun c:RE432 ();RenameBlock
(setvar "cmdecho" 0)(command "undo" "be")
(command "_rename" "s" "kucha��ͼ" "OriTools");��ͼ����ʽ
  
;--Units_��λ����
  (SetVar "LUNITS" 2);�������Ե�λ��1 ��ѧ 2 С�� 3 ���� 4 ���� 5 ����
  (SetVar "LUPREC" 1);��������ֻ�����Ե�λ�Ϳɱ༭���Ե�λ���侫��С�ڻ���ڵ�ǰ luprec ��ֵ����С��λλ����
  (SetVar "AUNITS" 0);���ýǶȵ�λ:0.ʮ���ƶ��� 1.��/��/�� 2.�ٷֶ� 3.���� 4.���ⵥλ
  (SetVar "AUPREC" 1);��������ֻ���Ƕȵ�λ����ʾ��״̬���ϣ��Ϳɱ༭�Ƕȵ�λ���侫��С�ڻ���ڵ�ǰ auprec ��ֵ����С��λ����
;--�Ŀ���-- 
    (setq BlockList (list        
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
                

                
    ))
      
    (while BlockList
      (setq aa (car BlockList)
            BlockList (cdr BlockList))
      
      (if (and (tblsearch "Block" (car aa)) (not (tblsearch "Block" (cadr aa))))
        (command "_.rename" "b" (car aa) (cadr aa))
      );end if
    )
  
  (while (= 1 (getvar "cmdactive")) (command pause));�ȴ���һ���������
;--��ͼ����--
    (setq LayList (list        
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
    ))
        
    (while LayList
      (setq Name (car LayList)
            LayList (cdr LayList))
      
      (if (and (tblsearch "Layer" (car Name)) (not (tblsearch "Layer" (cadr Name))))
        (command "_.rename" "LA" (car Name) (cadr Name))
      );end if
    )
  
  (while (= 1 (getvar "cmdactive")) (command pause));�ȴ���һ���������
;--��ͼ������--
    ;��������
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
                            (70 . 0) '(3 . "Mountain Line �� - - �� - - ��") '
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
                            (70 . 0) '(3 . "Valley Line ��  ��  ��  ��  ��") '
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
                            (70 . 0) '(3 . "Dotted line �� �� �� �� �� �� ��") '
                            (72 . 65) '(73 . 2) '(40 . 1.0) '(49 . 0.0) '
                            (74 . 0) '(49 . -1.0) '(74 . 0)
                      )
              )
            )                                  
          )                                    
      )
    ;��ͼ������
      (command "_.layer" "L" "--Aux--" "D-05-Auxiliary" "")
      (command "_.layer" "L" "--Mtn--" "D-06-Mountain" "")
      (command "_.layer" "L" "--Mtn--" "D-07-MtnHide" "")
      (command "_.layer" "L" "--Vay--" "D-08-Valley" "")
      (command "_.layer" "L" "--Vay--" "D-09-VayHide" "")
      (command "_.layer" "L" "--Bdr--" "D-10-BdrRef" "")
      (while (= 1 (getvar "cmdactive")) (command pause));�ȴ���һ���������
  
    ;|
    ;��ͼ��˵��
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
      (while (= 1 (getvar "cmdactive")) (command pause));�ȴ���һ���������
    |;
  

  
  
;20220727-add_new_layer
  ;--��ͼ����--
  (while (= 1 (getvar "cmdactive")) (command pause));�ȴ���һ���������
  (command "_.rename" "LA" "D-15-Page" "D-16-Page")
  (command "_.rename" "LA" "D-13-OthFace" "D-13-FaceOth")
  (command "_.rename" "LA" "D-14-DarkFace" "D-14-FaceDark")
  ;--��ͼ������--
  (while (= 1 (getvar "cmdactive")) (command pause));�ȴ���һ���������
  (command "_.layer" "D" "FO=Face_Other" "D-13-FaceOth" "Y" "")
  (command "_.layer" "D" "FD=Face_Dark" "D-14-FaceDark" "Y" "")
  
  (command "undo" "e")
  (setvar "cmdecho" 1)(princ)


)