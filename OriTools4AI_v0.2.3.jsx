#target "illustrator"

app.preferences.setBooleanPreference("ShowExternalJSXWarning", false);
//---------------------------------------------------------------------------------------------------------------//
//  OriTools for Adobe Illustrator                                                                           //
//  Writer: Kucha  >>2022<< - https://space.bilibili.com/28181671  Or  www.twitter.com/kucha_Mai                 //
//  AI高版本映射Autocad专色，需要删除色板中的专色才能正确使用                                                     //
//---------------------------------------------------------------------------------------------------------------//


if (!app.homeScreenVisible) {//不在欢迎界面
    app.executeMenuCommand('doc-color-rgb');//;默认转换为RGB色彩空间 
//Global:定义全局变量--------------------------------------------------
    var CurDoc = app.activeDocument;
    var DocLayers = CurDoc.layers; 
    var DocArtbds = CurDoc.artboards; 
    
    if (CurDoc.spots.length > 1) { CurDoc.spots.removeAll(); }//移除专色色板
    var GlbCol_Black = new RGBColor();//7号色
        GlbCol_Black.red = GlbCol_Black.green = GlbCol_Black.blue = 0;
    var GlbCol_DGrey = new RGBColor();//250号色
        GlbCol_DGrey.red = GlbCol_DGrey.green = GlbCol_DGrey.blue = 51;
    var GlbCol_LGrey = new RGBColor();//251号色
        GlbCol_LGrey.red = GlbCol_LGrey.green = GlbCol_LGrey.blue = 91;
 
//Global:定义窗口和按钮功能------------------------------------------
    var ScriptVer = "0.2.3";//插件版本
    var OriWin = new Window("dialog", "OriTools4AI_v" + ScriptVer, undefined);
        OriWin.margins = 5;//边距

    var MainPnl = OriWin.add('panel',undefined,'主功能');
    var SubfPnl = OriWin.add('panel',undefined,'子功能');
    var FilePnl = OriWin.add('panel',undefined,'文件保存');
        FilePnl.margins=SubfPnl.margins=MainPnl.margins=10;//边距
        FilePnl.spacing=SubfPnl.spacing=MainPnl.spacing=5;//间隔

    //定义按钮
    var BTM01 = MainPnl.add('button', undefined, '一键快捷');//FastTrack
    var BTM02 = MainPnl.add('button', undefined, '选峰谷辅');//Select_MVALines
    /*
    var RELayS = SubfPnl.add('checkbox', undefined, '恢复图层状态');//Remove_ExistArtbd
        RELayS.value = true;
    */
    var MNote = MainPnl.add('statictext', undefined, '一键快捷含子功能01～09');
        MNote.justify = 'Left';
        MNote.enabled = false;

    var BTS01 = SubfPnl.add('button', undefined, '01-图层全打开');//ShowAllLayer
    var BTS02 = SubfPnl.add('button', undefined, '02-层按名排序');//ChgLayOrder
    var ArtNote01 = SubfPnl.add('checkbox', undefined, '排序前图层全开');//Remove_ExistArtbd
        ArtNote01.value = false ;

    var BTS03 = SubfPnl.add('button', undefined, '03-解除所有组');//Ungroup_All
    var MskNote = SubfPnl.add('checkbox', undefined, '解组时保留剪切蒙版');//Remove_Clipping_Masks
        MskNote.value = false;
    var BTS04 = SubfPnl.add('button', undefined, '04-删字段背景');//Remove_FieldBG
    var BTS05 = SubfPnl.add('button', undefined, '05-移动绿色线');//Mv_GreenLine2Lay
    var BTS06 = SubfPnl.add('button', undefined, '06-改色及线型');//Chg_ColFormat

    var BTS11 = SubfPnl.add('button', undefined, '07-矩形转画板');//Obj_2Artboard
    var ArtNote02 = SubfPnl.add('checkbox', undefined, '删除旧的画板');//Remove_ExistArtbd
        ArtNote02.value = true;
    var ArtNote03 = SubfPnl.add('checkbox', undefined, '关闭图框层和零层');//UnShow_PageLay
        ArtNote03.value = true; 

    var BTS12 = SubfPnl.add('button', undefined, '08-文字置顶层');//Text_2Front
    var BTS13 = SubfPnl.add('button', undefined, '09-白色置底层');//White_2Back

    var BTF01 = FilePnl.add('button', undefined, '存为AIPDF');//saveAs_AiPDF
    var BTF02 = FilePnl.add('button', undefined, '另存为SVG');//saveAs_SVG
    var BTF03 = FilePnl.add('button', undefined, '另存为JPE');//saveAs_JPEG

    //按钮尺寸统一，也可分别设置
    BTM01.size = BTM02.size = [200, 20];
    BTS01.size = BTS02.size = BTS03.size = BTS04.size = BTS05.size = BTS06.size = [200, 20]
    ArtNote01.size = ArtNote02.size = ArtNote03.size = [200, 20]
    BTS11.size = BTS12.size = BTS13.size = [200, 20]
    MskNote.size = [200, 20]
    BTF01.size = BTF02.size = BTF03.size = [200, 20];

    // 版权信息
    var Copyright = OriWin.add('statictext', undefined, '\u00A9 Kucha 2024');
        Copyright.enabled = false;
    //------------------------------------------------------
    BTM01.onClick = function() {//FastTrack
        OriWin.close();//关闭窗口 

        var functionArray = [
            ShowAllLayer(false),
            Chg_LayOrder(false), 
            Ungroup_All(), 
            Remove_FieldBG(), 
            Mv_GreenLine2Lay(), 
            Chg_ColFormat(), 
            Obj_2Artboard(),
            Text_2Front(), 
            White_2Back(), 
            saveAs_AiPDF(false)
            //alert('\n当前文档已处理完毕')
        ]
        for (var i = 0, l = functionArray.length; i < l; i++) {
            $.sleep(500)
            functionArray();
        }//每执行一个函数暂停500s
        
        app.redraw();
    } 
    BTM02.onClick = function () {//Select_MVALines
        OriWin.close();//关闭窗口
        Select_MVALines()
    }
    //
    BTS01.onClick = function () { ShowAllLayer(true)}
    BTS02.onClick = function () { Chg_LayOrder(true)}
    BTS03.onClick = function () { OriWin.close(); Ungroup_All(); alert('\n所有成组对象都已解组') }
    BTS04.onClick = function () { if (Remove_FieldBG()) { alert('\n已删除字段背景RGB192灰面'); } else { alert('\n文档中未找到RGB192的灰面'); } }
    BTS05.onClick = function () { if (Mv_GreenLine2Lay()) { alert('\n绿线已移到图层<D-05-Auxiliary>'); } else { alert('\n文档中未找到G255的绿线'); } }
    BTS06.onClick = function () { Chg_ColFormat(); alert('\n层内对象的颜色已调整'); }

    BTS11.onClick = function() {Obj_2Artboard()}
    BTS12.onClick = function() {Text_2Front()}
    BTS13.onClick = function() {White_2Back()}
    //
    BTF01.onClick = function() {saveAs_AiPDF(true)}
    BTF02.onClick = function() {SaveAs_SVG(true)}
    BTF03.onClick = function() {SaveAs_JPG(true)}
    //-----------------------------------------------------

    OriWin.show();//显示窗口

//Global:定义窗口和按钮功能------------------------------------------


//~function_00------------------------------------------------------
    //避免层名不存在而导致错误
    function GetTgtLayArt(Lst, Nam) {
        try {
            return Lst.getByName(Nam);
        } catch(err) {
            return null;
        }
    }
    //判断是否要改色
    function judge_ChgCol(item, isStroke) {
        var isChgCol = true;//默认改色

        if (isStroke) {
            var ObjCol = item.strokeColor;
        } else {
            var ObjCol = item.fillColor;
        }
        var ObjRed = Math.round(ObjCol.red);
        var ObjGreen = Math.round(ObjCol.green);
        var ObjBlue = Math.round(ObjCol.blue);
        
        if (
            (ObjRed == 0 && ObjGreen == 0 && ObjBlue == 0) || //黑色
            (ObjRed == 255 && ObjGreen == 255 && ObjBlue == 255) ||//白色
            (ObjRed == 51 && ObjGreen == 51 && ObjBlue == 51) ||//深灰
            (ObjRed == 91 && ObjGreen == 91 && ObjBlue == 91) //浅灰
        ) { isChgCol = false; }
        return isChgCol;
    }
    //如果父路径是组/复合路径，则收集所有子路径项
    //Gather any children pathItems in case their parent is a Group/Compound Path
    function get_AllPathItems(parent) {
        var list = [];
        for (var i = 0; i < parent.pageItems.length; i++) {
        var item = parent.pageItems[i];
        if (item.pageItems && item.pageItems.length)
            list = [].concat(list, get_AllPathItems(item));
        else if (/path/i.test(item.typename) && !/compound/i.test(item.typename))
            list.push(item);
        }
        return list;
    }
    //Gather All textframes
    function get_AllTextFrames(parent) {
        var list = [];
        for (var i = 0; i < parent.pageItems.length; i++) {
        var item = parent.pageItems[i];
        if (item.pageItems && item.pageItems.length)
            list = [].concat(list, get_AllTextFrames(item));
        else if (item.typename=="TextFrame")
            list.push(item);
        }
        return list;
    }

//~function_01------------------------------------------------------
    function Select_MVALines() {//~~Select all lines in the special layer
        CurDoc.selection = null; //取消全选
        var TmpLayLst = ["D-05-Auxiliary", "D-06-Mountain", "D-07-MtnHide", "D-08-Valley", "D-09-VayHide"];

        for (var i = 0; i < TmpLayLst.length; i++) {
            var TgtLay = GetTgtLayArt(DocLayers,TmpLayLst[i]);
            if (!TgtLay) continue;
            else {TgtLay.hasSelectedArtwork = true;}
        }//只选特定图层  
    }
    function ShowAllLayer(Flag){//~~Adjust layer order (Alphabetized)  
        for (i = 0; i < DocLayers.length; i++) {
            if (!DocLayers[i].visible){
                DocLayers[i].visible = true;//显示图层
            }
        }//全打开
        if (Flag){
            if(!visibleLayers.length == 0){
                alert('\n图层已经全部打开');OriWin.close();
            }
        }
        app.redraw();
    }  
    function Chg_LayOrder(Flag){//~~Adjust layer order (Alphabetized)  
        function sortLayers(abcLayers) {	
            for (var ri=0; ri<abcLayers.length;ri++) {
                abcLayers[ri].zOrder(ZOrderMethod.SENDTOBACK);
            };
        } 

        var visibleLayers = [];  
        for (i = 0; i < DocLayers.length; i++) {
            if(ArtNote01.value){
                DocLayers[i].visible = true;//显示图层
            }//图层全开
            if(DocLayers[i].visible){visibleLayers.push(DocLayers[i]);}//图层可见则收集
        }
        if(!visibleLayers.length == 0){
            sortLayers(visibleLayers.sort(function (a, b) { return a > b }));//层按名排序
        }//可见图层存在
        if (Flag){
            if(!visibleLayers.length == 0){
                alert('\n可见层顺序已按名称调整');OriWin.close();
            }else{alert('\n不存在可见层!!');}
        }
        app.redraw();
    }  
    function Ungroup_All() {//~~Ungroup_All in layer
        //https://github.com/rjduran/adobe-scripting
        //收集所有子项
        function get_AllChild(parent) {
            var allChilds = [];
            if (Object.prototype.toString.call(parent) === '[object Array]') {
                allChilds.push.apply(allChilds, parent);
            } else {
                for (var i = 0; i < parent.pageItems.length; i++) {
                    allChilds.push(parent.pageItems[i]);
                }
            }

            if (parent.layers) {
                for (var l = 0; l < parent.layers.length; l++) {
                    childsArr.push(parent.layers[l]);
                }
            }

            return allChilds;
        }
        //解组函数(含嵌套组)
        function ungroup(obj) {//解组
            if (MskNote.value && obj.clipped) {
                return;
            }
            //
            var childArr = get_AllChild(obj);
            if (childArr.length < 1) {
                obj.remove();
                return;
            }
            for (var i = 0; i < childArr.length; i++) {
                var item = childArr[i];
                try {
                    if (item.parent.typename !== 'Layer') {
                        item.move(obj, ElementPlacement.PLACEBEFORE);//移动对象到前面
                        // Push empty paths in array 
                        if ((item.typename === 'PathItem' && !item.filled && !item.stroked) ||
                            (item.typename === 'CompoundPathItem' && !item.pathItems[0].filled && !item.pathItems[0].stroked) ||
                            (item.typename === 'TextFrame' && item.textRange.fillColor == '[NoColor]' && item.textRange.strokeColor == '[NoColor]'))
                            clearArr.push(item);
                    }
                    //
                    if (item.typename === 'GroupItem' || item.typename === 'Layer') {
                        ungroup(item);
                    }
                    //
                } catch (err) { }
            }
        }

        var clearArr = []; 
        for (var i = 0; i < DocLayers.length; i++) {
            
            //记录或者恢复图层状态
            var LayStatus_Visible = DocLayers[i].visible;
            DocLayers[i].visible = true;//显示图层
            var LayStatus_Locked = DocLayers[i].locked;
            DocLayers[i].locked = false;//解锁图层
            

            // 层内对象解组(All)
            if (DocLayers[i].groupItems.length > 0) {
                ungroup(DocLayers[i]);
            }

            
            //记录或者恢复图层状态
            DocLayers[i].visible = LayStatus_Visible;
            DocLayers[i].locked = LayStatus_Locked;
            
        }

        //解组后是否保留剪切蒙版
        if (!MskNote.value) {
            for (var i = 0; i < clearArr.length; i++) {
                clearArr[i].remove();
            }
        }
    } 
    function Remove_FieldBG() {//~~Remove_FieldBG
        CurDoc.selection = null; //取消全选

        var FindCol = new RGBColor();
        FindCol.red = FindCol.green = FindCol.blue = 192;//字段灰色
        CurDoc.defaultFillColor = FindCol;//当前色
        CurDoc.defaultStrokeColor = new NoColor();//描边颜色为空
        
        app.executeMenuCommand("Find Fill & Stroke menu item");
        
        // 遍历所选对象并删除
        var CurSelect = CurDoc.selection;

        if (CurSelect[0]){
            for (var i = CurSelect.length - 1; i >= 0; i--) {
                CurSelect[i].remove();
            }
            app.redraw();

            return true;
        }else{return false;}
    }
    function Mv_GreenLine2Lay() {//~~Move all the green lines to layer: D-05-Auxiliary
        var TgtLay = GetTgtLayArt(DocLayers,'D-05-Auxiliary')
        if(!TgtLay){
            CurDoc.layers.add().name = 'D-05-Auxiliary';
            var TgtLay = GetTgtLayArt(DocLayers,'D-05-Auxiliary')
        }
        
        CurDoc.selection = null; //取消全选

        var FindCol = new RGBColor();
            FindCol.green = 255;
            FindCol.red = FindCol.blue = 0;
            CurDoc.defaultStrokeColor = FindCol;//当前色
        CurDoc.defaultFillColor = new NoColor();//填色颜色为空
    
        app.executeMenuCommand("Find Fill & Stroke menu item");
        
        var CurSelect = CurDoc.selection;
        if (CurSelect[0]){
            for (var i = 0; i < CurSelect.length; i++) {
                CurSelect[i].move(TgtLay, ElementPlacement.PLACEATEND);
                CurSelect[i].selected = false;
            }
            app.redraw();

            return true;
        }else{return false;}
    }
    function Chg_ColFormat() {//~~Change the color in layer (FillColor and StrokeColor)
        var ChgLay_Black = ["D-03-SymStd", "D-10-BdrRef"];
        var ChgLay_DGrey = ["D-02-TextStep", "D-11-Border"];
        var ChgLay_LGrey = ["D-12-Exist"];
        //
        var ChgLay_BlackFormat = ["D-06-Mountain", "D-08-Valley", "D-04-SymRef", "D-05-Auxiliary"];
        var ChgLay_LGreyFormat = ["D-07-MtnHide", "D-09-VayHide"];
        //
        var ChgLay_BlackStroke = ["D-14-FaceDark"];
        var ChgLay_FillOpacity = ["D-13-FaceOth"];
        var ChgLay_BlackOpacity = ["D-01-Layout"];

        //DefineFunction
        function ReStyle_AllWithin(layLst, newColor, chgFill, chgStroke, chgFormat, ColOpacity, Stkpacity) {
            for (var i = 0; i < layLst.length; i++) {
                CurDoc.selection = null; //取消全选
                var TgtLay = GetTgtLayArt(DocLayers,layLst[i]);
                
                if (!TgtLay) continue;
                else {
                    
                    //记录或者恢复图层状态
                    var LayStatus_visible = TgtLay.visible;//Recording TgtLay status
                    TgtLay.visible = true;//显示图层
                    
                    var AllPathLst = get_AllPathItems(TgtLay);
                    for (var n = 0; n < AllPathLst.length; n++) {
                        var Pitem = AllPathLst[n];
                        if (chgFill && Pitem.filled && judge_ChgCol(Pitem, false)) {// Change fillColor
                            if (newColor) { Pitem.fillColor = newColor; }
                            if (ColOpacity) { Pitem.opacity = ColOpacity; }
                        }
                        if (chgStroke && Pitem.stroked && judge_ChgCol(Pitem, true)) {// Change strokeColor
                            if (newColor) { Pitem.strokeColor = newColor; }
                            if (Stkpacity) { Pitem.opacity = Stkpacity; }
                        }
                        if (chgFormat && Pitem.stroked) {// Change Pitem strokeFormat when it exists
                            Pitem.strokeCap = StrokeCap.BUTTENDCAP; //ROUNDENDCAP, PROJECTINGENDCAP
                            Pitem.strokeJoin = StrokeJoin.ROUNDENDJOIN; //BEVELENDJOIN, MITERENDJOIN
                        }
                    }
                    var AllTextLst = get_AllTextFrames(TgtLay);
                    for (var n = 0; n < AllTextLst.length; n++) {
                        var Titem = AllTextLst[n].textRange.characterAttributes;
                        if (chgFill && Titem.fillColor.typename != "NoColor" && judge_ChgCol(Titem, false)) {// Change fillColor
                            if (newColor) {Titem.fillColor = newColor;}
                            //if (ColOpacity != false) { AllTextLst[n].opacity = ColOpacity; }
                        }
                        if (chgStroke && Titem.strokeColor.typename != "NoColor" && judge_ChgCol(Titem, true)) {// Change strokeColor
                            if (newColor) { Titem.strokeColor = newColor;}
                            //if (Stkpacity) { AllTextLst[n].opacity = Stkpacity; }
                        }
                    }
                    
                    //记录或者恢复图层状态
                    TgtLay.visible = LayStatus_visible;//Restore TgtLay state
                    
                }
            }
        }

        //UsingFunction
        //change StrokeColor and FillColor
        ReStyle_AllWithin(ChgLay_Black, GlbCol_Black, true, true, false, false, false);
        ReStyle_AllWithin(ChgLay_DGrey, GlbCol_DGrey, true, true, false, false, false);
        ReStyle_AllWithin(ChgLay_LGrey, GlbCol_LGrey, true, true, false, false, false);
        //change StrokeColor and FillColor and lineFormat and opacity
        ReStyle_AllWithin(ChgLay_BlackFormat, GlbCol_Black, true, true, true, false, false);
        ReStyle_AllWithin(ChgLay_LGreyFormat, GlbCol_LGrey, true, true, true, false, false);
        //just change StrokeColor and opacity
        ReStyle_AllWithin(ChgLay_BlackStroke, GlbCol_Black, false, true, false, false, false);
        //StrokeColor and FillColor and No change in opacity
        ReStyle_AllWithin(ChgLay_FillOpacity, false, true, false, false, 50, false);
        ReStyle_AllWithin(ChgLay_BlackOpacity, GlbCol_Black, true, true, true, 20, false);

        app.redraw();
    }
    function Obj_2Artboard() {//~~Create Artboard from multiple objects
        function Remove_EmptyArtboards() {
            //https://community.adobe.com/t5/illustrator-discussions/is-it-possible-to-remove-all-the-empty-artboards-using-script/td-p/8850778
            CurDoc.selection = null;
            for (var i = CurDoc.artboards.length - 1; i >= 0; i--) {
                if (CurDoc.artboards.length > 1) {
                    CurDoc.artboards.setActiveArtboardIndex(i);
                    selectedObjects = CurDoc.selectObjectsOnActiveArtboard();
        
                    if (CurDoc.selection.length < 1 || CurDoc.selection == null) {
                        CurDoc.artboards[i].remove();
                    }
                }
            }
        };
        function collectRec4Lay(TgtLay) {// 收集图层中所有矩形对象
            function isRectangle(item) {//判断对象是否为矩形
                if (item.typename === 'PathItem' && item.closed && item.pathPoints.length === 4) {
                    var pathPoints = item.pathPoints;
                    var p01 = pathPoints[0].anchor;
                    var p02 = pathPoints[1].anchor;
                    var p03 = pathPoints[2].anchor;
            
                    var Dis01 = Math.sqrt(Math.pow(p02[0] - p01[0], 2) + Math.pow(p02[1] - p01[1], 2));
                    var Dis02 = Math.sqrt(Math.pow(p03[0] - p02[0], 2) + Math.pow(p03[1] - p02[1], 2));
                    return Math.abs(Math.abs(Dis01 * Dis02) - Math.abs(item.area)) < 1e-6;
                }
                return false;
            }
            var RecLst = [];
            for (var i = 0; i < TgtLay.pageItems.length; i++) {
                var item = TgtLay.pageItems[i];
                if (isRectangle(item)) { RecLst.push(item);}
            }
            if (RecLst) {
                return RecLst;
            } else {
                return null;
            }
        };
        function CompareRecBounds(Rec01, Rec02) {//比较矩形对象的几何边界：先上下后左右
            //[左上角XY和右下角XY]
            var Rec01Bounds = Rec01.geometricBounds;
            var Rec02Bounds = Rec02.geometricBounds;
            //按先上下后左右的顺序重新排列对象的顺序
            if (Math.abs(Rec01Bounds[1] - Rec02Bounds[1]) <= 100) {//左上角Y的之差小于100约等于30mm
                return Rec01Bounds[0] - Rec02Bounds[0];//比较X，小的先出
            } else {
                return Rec02Bounds[1] - Rec01Bounds[1];//比较Y，大的先出
            }
        };

        var TgtLay = GetTgtLayArt(DocLayers,'D-16-Page')
        TgtLay.visible = true;//显示图层

        var OldArtbdNams = [];
        for (var i = 0; i < DocArtbds.length; i++) {
          OldArtbdNams.push(DocArtbds[i].name);
        }//收集旧画板名称

        var RecLst4Lay = collectRec4Lay(TgtLay);//收集图层中的矩形

        if (TgtLay && RecLst4Lay[0]) {
            RecLst4Lay.sort(CompareRecBounds);//排序
            //逐个选择矩形对象并新增画板
            for (var i = 0; i < RecLst4Lay.length; i++) {
                DocArtbds.add(RecLst4Lay[i].geometricBounds);
            };//根据所选矩形新建画板
            if (ArtNote02.value) {
                for (var i = DocArtbds.length - 1; i >= 0; i--) {
                    var CurArtbdNam = DocArtbds[i].name;
                    for (var j = 0; j < OldArtbdNams.length; j++) {
                        if (CurArtbdNam === OldArtbdNams[j]) {
                            DocArtbds[i].remove();
                        }
                    }
                }//删除旧画板
                //Remove_EmptyArtboards()//移除空画板
            }//根据画板名称，删除原先收集的旧画板
            if(ArtNote03.value){
                TgtLay.visible = false;//关闭图层
                var TgtLay2 = GetTgtLayArt(DocLayers,'0')
                if (TgtLay2){TgtLay2.visible = false;}//关闭0图层
            }//关闭图层
        } else {
            alert('\n文档不存在图层<D-16-Page>\n或图层<D-16-Page>不含矩形');
        };

        app.redraw();
    }
    function Text_2Front() {//~~send Text to front
        CurDoc.selection = null; //取消全选

        app.executeMenuCommand("Text Objects menu item");
        app.executeMenuCommand("sendToFront");

        CurDoc.selection = null; //取消全选
        app.redraw();
    }
    function White_2Back() {//~~send white fill to the back
        CurDoc.selection = null; //取消全选
        var FindCol = new RGBColor();
        FindCol.red = FindCol.green = FindCol.blue = 255;//纯白色

        CurDoc.defaultFillColor = FindCol;//当前色
        CurDoc.defaultStrokeColor = new NoColor();//描边颜色为空

        app.executeMenuCommand("Find Fill & Stroke menu item");
        app.executeMenuCommand("sendToBack");

        CurDoc.selection = null; //取消全选
        app.redraw();
    }
    
//~function_02------------------------------------------------------
    function saveAs_AiPDF(Flag){
        //获取脚本路径
            //var scriptFile = new File($.fileName);
            //var SavePath = scriptFile.parent.fsName + "\\--Export--\\--JPEG--";
            var SavePath = "~/Desktop/--Export--/--AI+PDF--/"
            if (!Folder(SavePath).exists){Folder(SavePath).create() }//如果文件夹不存在则新建
            
            var saveOpts = new PDFSaveOptions();
            saveOpts.preserveEditability = true;
            CurDoc.saveAs(new File(SavePath), saveOpts);

            CurDoc.saveAs(new File(SavePath), new IllustratorSaveOptions());//另存为AI
            app.redraw();
        if (Flag){alert('\n文件导出完成，请查看桌面文件夹!');}
        
    }
    function SaveAs_SVG(Flag) {
        var SavePath = "~/Desktop/--Export--/--SVG--/"
        if (!Folder(SavePath).exists){Folder(SavePath).create() }//如果文件夹不存在则新建

        for(var i = 0; i < DocArtbds.length; i++) {
            DocArtbds.setActiveArtboardIndex(i);//设置活动画板
                var SetExp = new ExportOptionsSVG();
                SetExp.saveMultipleArtboards = true;
                SetExp.artboardRange = (i + 1).toString();
                
                SetExp.embedRasterImages = true;
                SetExp.cssProperties = SVGCSSPropertyLocation.STYLEATTRIBUTES;
                SetExp.fontSubsetting = SVGFontSubsetting.None;
                SetExp.documentEncoding = SVGDocumentEncoding.UTF8;
            
            CurDoc.exportFile(new File(SavePath), ExportType.SVG, SetExp);
        }
        app.redraw();
        
        if (Flag){alert('\n文件导出完成，请查看桌面文件夹!'); var Flag = false}
    }
    function SaveAs_JPG(Flag) {
        var SavePath = "~/Desktop/--Export--/-JPEG--/"
        if (!Folder(SavePath).exists){Folder(SavePath).create() }//如果文件夹不存在则新建

        for(var i = 0; i < DocArtbds.length; i++) {// 循环遍历文档中的所有画板
            DocArtbds.setActiveArtboardIndex(i);//设置活动画板
            var SetExp = new ExportOptionsJPEG();// 创建一个导出设置为JPEG格式的对象
                //SetExp.saveMultipleArtboards = true;
                //SetExp.artboardRange = (i+1).toString();

                SetExp.antiAliasing = true;
                SetExp.artBoardClipping = true //剪切到画板
                SetExp.optimization = true  // 优化以便于在web上查看
                SetExp.qualitySetting = 100;
                SetExp.horizontalScale = SetExp.verticalScale = 400;
            
            var DocNam = CurDoc.name.split('.')[0]// 获取当前文档的名称并去掉后缀
            var jpgName = new File(SavePath + "/" + String(DocNam) + "-" + (i+1).toString());// 创建一个包含保存路径和文件名的File对象
            CurDoc.exportFile(jpgName, ExportType.JPEG, SetExp); 
        }
        app.redraw();

        if (Flag){alert('\n文件导出完成，请查看桌面文件夹!'); var Flag = false}
    }
    
} else {
    alert('\n请先打开任一文档！');//Plz open a CurDoc first.
}


/* 
    for (i = 0; i < DocLayers.length; i++) {
        var GlbLayStatus_Visible = [];
        var GlbLayStatus_UnLcked = [];
        if (!DocLayers[i].visible){
            DocLayers[i].visible = true;//显示图层
            GlbLayStatus_Visible.push(DocLayers[i].name);
        }
        if (DocLayers[i].locked){
            DocLayers[i].locked = false;//解锁图层
            GlbLayStatus_UnLcked.push(DocLayers[i].name);
        }
    }//全打开和全解锁,并收集关闭和锁定的图层列表
    for (var i = DocLayers.length - 1; i >= 0; i--) {
        var CurLayNam = DocLayers[i].name;
        for (var j = 0; j < GlbLayStatus_Visible.length; j++) {
            if (CurLayNam === GlbLayStatus_Visible[j]) {
                DocLayers[i].visible = false;
            }
        }//关闭图层
        for (var k = 0; k < GlbLayStatus_UnLcked.length; k++) {
            if (CurLayNam === GlbLayStatus_UnLcked[k]) {
                DocLayers[i].locked = true;
            }
        }//锁定图层
    }//根据图层名称恢复图层状态
*/