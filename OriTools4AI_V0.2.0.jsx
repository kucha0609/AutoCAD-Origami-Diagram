﻿#target "illustrator"

app.preferences.setBooleanPreference("ShowExternalJSXWarning", false);
//---------------------------------------------------------------------------------------------------------------//
//  OrigamiTools for Adobe Illustrator                                                                           //
//  Writer: Kucha  >>2022<< - https://space.bilibili.com/28181671  Or  www.twitter.com/kucha_Mai                 //
//---------------------------------------------------------------------------------------------------------------//


if (app.documents.length > 0) {

// Global_Variables--------------------------------------------------
    var document = app.activeDocument;
    var allLayers = app.activeDocument.layers; 
    var black = new RGBColor();//7号色
        black.red = black.green = black.blue = 0;
    var darkGrey = new RGBColor();//250号色
        darkGrey.red = darkGrey.green = darkGrey.blue = 51;
    var lightGrey = new RGBColor();//251号色
        lightGrey.red = lightGrey.green = lightGrey.blue = 91;

//~Create_Window_and_Panel------------------------------------------
    var Script_Name  = "OriTools4AI", Script_Version = "_V0.2.0";
    var win = new Window('dialog', Script_Name + Script_Version, undefined);
        win.margins=10;

    //~~Create Panel and button
    var P01 = win.add('panel',undefined,'Panel-01');
    var P02 = win.add('panel',undefined,'Panel-02');
    var P03 = win.add('panel',undefined,'Panel-03');
        P03.margins=P02.margins=P01.margins=10;
        P03.spacing=P02.spacing=P01.spacing=5;

    //
    var ep011 = P01.add('button',undefined,'Most_Functions');
    var ep012 = P01.add('button',undefined,'Lines_in_Layer');

    var ep021 = P02.add('button',undefined,'Adjust_LayerOrder');
    var ep022 = P02.add('button',undefined,'Change_Color_Format');
    var ep023 = P02.add('button',undefined,'Move_GreenLine');
    var ep024 = P02.add('button',undefined,'Object_to_Artboard');
    var ep027 = P02.add('button',undefined,'Ungroup_All');
        var Rmv_Clipp = P02.add('checkbox', undefined, 'Remove_Clipping_Masks');
        Rmv_Clipp.value = false;

    var ep025 = P02.add('button',undefined,'Text_to_Front');
    var ep026 = P02.add('button',undefined,'White_to_Back');
    
    var ep033 = P03.add('button',undefined,'saveAs_AI');
    var ep034 = P03.add('button',undefined,'saveAs_PDF');
    var ep035 = P03.add('button',undefined,'saveAs_JPEG');

    ep012.size=ep011.size=[180,20];//统一的按钮尺寸。也可分别设置
    Rmv_Clipp.size=ep027.size=ep026.size=ep025.size=ep024.size=ep023.size=ep022.size=ep021.size=[180,20];//统一的按钮尺寸。也可分别设置
    ep035.size=ep034.size=ep033.size=[180,20];//统一的按钮尺寸。也可分别设置

    // Copyright block
    var Copyright = win.add('statictext', undefined, '\u00A9 Kucha 2022');
        Copyright.justify = 'center';
        Copyright.enabled = false;

    //------------------------------------------------------
    ep011.onClick = function() {//Most_Functions
        win.close();
        for (var i = 0; i < allLayers.length; i++) {allLayers[i].visible = true};//图层全开

        var functionArray = [
            Ungroup_All(), 
            White_to_Back(), 
            Move_Green_Line(), 
            Change_Color_Format(), 
            Text_to_Front(), 
            Object_to_Artboard(),
            Adjust_LayerOrder(), 
            save_as_Ai(), 
            Save_as_PDF()
        ]
        for (var i = 0, l = functionArray.length; i < l; i++) {
            $.sleep(500)
            functionArray();
        }
    } 
    ep012.onClick = function() {//Lines_in_Layer
        win.close();
        Lines_in_Layer()
        }
    //
    ep021.onClick = function() {//adjustLayerOrder
        Adjust_LayerOrder()
        }
    ep022.onClick = function() {//changeColorAndFormat
        Change_Color_Format()
        }
    ep023.onClick = function() {//moveGreenLine
        Move_Green_Line()
        }
    ep024.onClick = function() {//Object_to_Artboard
        Object_to_Artboard()
        }
    ep025.onClick = function() {//Text_to_Front
        Text_to_Front()
        }
    ep026.onClick = function() {//White_to_Back
        White_to_Back()
        }
    ep027.onClick = function() {//Ungroup_All
        win.close();
        Ungroup_All()
        } 
    //
    ep033.onClick = function() {//saveAiFile
        save_as_Ai()
        }
    ep034.onClick = function() {//savePdfFile
        Save_as_PDF()
        }
    ep035.onClick = function() {//saveJPEGFile
        Save_as_JPEG()
        }
    //-----------------------------------------------------

win.show();
//~Create_Window_and_Panel------------------------------------------


//~function_00------------------------------------------------------
    //~~avoid failures due to non-existent layer names.
    function getLayer(layerName) {
        try {
            return document.layers.getByName(layerName);
        } catch(err) {
            return null;
        }
    }
    //Gather any children pathItems in case their parent is a Group/Compound Path
    function get_All_PathItems(parent) {
        var list = [];
        for (var i = 0; i < parent.pageItems.length; i++) {
        var item = parent.pageItems[i];
        if (item.pageItems && item.pageItems.length)
            list = [].concat(list, get_All_PathItems(item));
        else if (/path/i.test(item.typename) && !/compound/i.test(item.typename))
            list.push(item);
        }
        return list;
    }
    //Gather All textframes
    function get_All_TextFrames(parent) {
        var list = [];
        for (var i = 0; i < parent.pageItems.length; i++) {
        var item = parent.pageItems[i];
        if (item.pageItems && item.pageItems.length)
            list = [].concat(list, get_All_TextFrames(item));
        else if (item.typename=="TextFrame")
            list.push(item);
        }
        return list;
    }
    //Gather All Child
    function get_All_Child(parent) {
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
    //judge color
    function judge_Color(item, isStroke){
        var isChangeColor = true;

        if(isStroke){
            var _color = item.strokeColor
        }else{
            var _color = item.fillColor
        }
        
        var _red = Math.round(_color.red);
        var _green = Math.round(_color.green);
        var _blue = Math.round(_color.blue);
        //
        var _cyan = Math.round(_color.cyan);
        var _yellow = Math.round(_color.yellow);
        var _magenta = Math.round(_color.magenta);
        var _black = Math.round(_color.black);
        //

        if(
            (_red == 0 &&_green == 0 && _blue == 0) || 
            (_red == 255 &&_green == 255 && _blue == 255) || 
            (_cyan == 93 &&_magenta == 88 && _yellow == 89 && _black == 80) || 
            (_cyan == 0 &&_magenta == 0 && _yellow == 0 && _black == 0)
        )

        isChangeColor = false;
            
        return isChangeColor;
    }
//~function_00------------------------------------------------------





//~function_01------------------------------------------------------
    //~~Move all the green lines to layer: D-05-Auxiliary
    function Move_Green_Line() {
        for (var i = 0; i < allLayers.length; i++) {allLayers[i].visible = true};//图层全开

        var layerName = "D-05-Auxiliary";
        try {
            var _layer = app.activeDocument.layers[layerName];
        } catch (e) {
            app.activeDocument.layers.add().name = layerName;
            var _layer = app.activeDocument.layers[layerName];
        }
        
        document.selection = null; 


        var _TempCol = new RGBColor();
             _TempCol.green = 255;
            _TempCol.red = _TempCol.blue = 0;
        document.defaultStrokeColor = _TempCol;

        app.executeMenuCommand("Find Stroke Color menu item");

        var _allItems = app.selection;
        for (var i = 0; i < _allItems.length; i++) {
            _allItems[i].move(_layer, ElementPlacement.PLACEATEND);
            _allItems[i].selected = false;
        }

        app.redraw();
        }
    //~~Change the color in layer (FillColor and StrokeColor)
    function Change_Color_Format(){
    //DefineVariables
        var blackLayers = ["D-03-SymStd", "D-10-BdrRef"];
        var darkGreyLayers = ["D-02-TextStep" , "D-11-Border"];
        var lightGreyLayers = ["D-12-Exist"];
        //
        var blackAndFormatLayers = ["D-06-Mountain", "D-08-Valley" , "D-04-SymRef"];
        var lightGreyAndFormatLayers = ["D-07-MtnHide", "D-09-VayHide", "D-05-Auxiliary"];
        //
        var blackStrokeLayers = ["D-14-FaceDark"];
        var blackAndOpacity = ["D-01-Layout"];


    //DefineFunction
        function restyleAllWithin(layers, color, changeFill, changeStroke,changeFormat,opacity) {
            // Iterate through our layer list:
            for (var i = 0; i < layers.length; i++) {
                document.selection = null; 
                // Get our target layer:
                var layer = getLayer(layers[i]);
                // If a layer wasn't found or there are no items to restyle, continue looping:
                //if (!layer || !layer.pathItems.length) continue;
                if (!layer) continue;
                else {
                    var _layerStatus = layer.visible;//Recording layer status
                    layer.visible = true;
                    //If pathitem exists in the layer
                    var listPath = get_All_PathItems(layer);
                    for (var index = 0; index < listPath.length; index++) {
                        var pathItem = listPath[index];

                        if (changeFill && pathItem.filled && judge_Color(pathItem, false)) {// Change pathItem fillColor when it exists
                            pathItem.filled = true;    
                            pathItem.fillColor = color;
                            if (opacity){pathItem.opacity = 100;}
                        }
                        if (changeStroke &&  pathItem.stroked && judge_Color(pathItem, true)) {// Change pathItem strokeColor when it exists
                            pathItem.stroked = true;   
                            pathItem.strokeColor = color;
                            if (opacity){pathItem.opacity = 100;}

                        }
                        if (changeFormat &&  pathItem.stroked) {// Change pathItem strokeFormat when it exists
                            pathItem.strokeCap = StrokeCap.BUTTENDCAP; //ROUNDENDCAP, PROJECTINGENDCAP
                            pathItem.strokeJoin = StrokeJoin.ROUNDENDJOIN; //BEVELENDJOIN, MITERENDJOIN
                        }

                    }
                    ///If textFrames exists in the layer
                    var listText = get_All_TextFrames(layer);
                    for (var index = 0; index < listText.length; index++) {
                        //var xxx=listText[index]
                        var textFrames=listText[index].textRange.characterAttributes;

                        if (changeFill && textFrames.fillColor.typename!="NoColor" && judge_Color(textFrames, false)) {// Change textFrames fillColor when it exists
                            textFrames.fillColor = color;
                            if (opacity){listText[index].opacity = 100;}
                        }
                        if (changeStroke && textFrames.strokeColor.typename!="NoColor" && judge_Color(textFrames, true)) {// Change textFrames strokeColor when it exists
                            textFrames.strokeColor = color;
                            if (opacity){listText[index].opacity = 100;}
                        } 
                    }
                    layer.visible = _layerStatus;//Restore layer state

                }
            }
        }

    //UsingFunction
        //change StrokeColor and FillColor
        restyleAllWithin(blackLayers, black, true, true, false, true);
        restyleAllWithin(darkGreyLayers, darkGrey, true, true, false, true);
        restyleAllWithin(lightGreyLayers, lightGrey, true, true, false, true);
        //change StrokeColor and FillColor and lineFormat and opacity
        restyleAllWithin(blackAndFormatLayers, black, true, true, true, true);
        restyleAllWithin(lightGreyAndFormatLayers, lightGrey, true, true, true, true);
        //just change StrokeColor and opacity
        restyleAllWithin(blackStrokeLayers, black, false, true, false, true);
        //StrokeColor and FillColor and No change in opacity
        restyleAllWithin(blackAndOpacity, black, true, true, true, false);

        app.redraw();
        }
    //~~Adjust layer order (Alphabetized)
    function Adjust_LayerOrder(){  
        function sortLayers(_obj, abcLayers) {	
            for (var ri=0; ri<abcLayers.length;ri++) {
                abcLayers[ri].zOrder(ZOrderMethod.SENDTOBACK);
            };
        } 
        //
        var visibleLayers = [];  
        for(i=0; i<allLayers.length; i++){  
            var ilayer = allLayers[i];  
            var _layerStatus = ilayer.visible;//Recording layer status
                ilayer.visible = true;
            if (ilayer.visible) {  
                visibleLayers.push(ilayer);  
            }  

        }
        //
        var alphabetizedLayers = visibleLayers.sort( function(a,b) { return a > b } );
        sortLayers(app.documents, alphabetizedLayers)
        //
        ilayer.visible = _layerStatus;//Restore layer state
        document.layers.getByName('D-16-Page').visible = false;  
        app.redraw();
        } 
    //~~send Text to front
    function Text_to_Front() {
        document.selection = null; 

        app.executeMenuCommand("Text Objects menu item")
        app.executeMenuCommand("sendToFront")
        
        document.selection = null; 
        app.redraw();
        }
    //~~send white fill to the back
    function White_to_Back() {
        document.selection = null;//取消选择
        var _TempCol = new RGBColor();
            _TempCol.red = _TempCol.green = _TempCol.blue = 255;
        document.defaultFillColor = _TempCol;
    
        app.executeMenuCommand("Find Fill Color menu item")
        app.executeMenuCommand("sendToBack")
        
        document.selection = null; 
        app.redraw();
        }
    //~~Select all lines in the special layer
    function Lines_in_Layer() {
        Move_Green_Line()
        document.selection = null; 
        var LayerName = ["D-05-Auxiliary", "D-06-Mountain", "D-07-MtnHide", "D-08-Valley", "D-09-VayHide"];
        //
        for (var i = 0; i < allLayers.length; i++) {allLayers[i].visible = false};
        for (var i = 0; i < LayerName.length; i++) {
            var layer = getLayer(LayerName[i]);
            if (!layer) continue;
            else {
                layer.visible = true;
            }
        }
        app.executeMenuCommand("selectall");
        }
    //~~Create Artboard from multiple objects
    function Object_to_Artboard(){
        function Remove_Empty_Artboards() {
            //https://community.adobe.com/t5/illustrator-discussions/is-it-possible-to-remove-all-the-empty-artboards-using-script/td-p/8850778
            var document = app.activeDocument, selectedObjects;
            document.selection = null;
        
            for (var i = document.artboards.length - 1; i >= 0; i--) {
        
                if (document.artboards.length > 1) {
                    document.artboards.setActiveArtboardIndex(i);
                    
                    selectedObjects = document.selectObjectsOnActiveArtboard();
        
                    if (document.selection.length < 1 || document.selection == null) {
                        document.artboards[i].remove();
                    }
                }
            }
        };
        var myLayer = document.layers.getByName('D-16-Page');  
            myLayer.visible = true;
            //myLayer.pathItems.selected = true
            myLayer.hasSelectedArtwork = true; 
        app.executeMenuCommand("copy");
        app.executeMenuCommand("pasteFront");

            app.executeMenuCommand("setCropMarks");
            Remove_Empty_Artboards()
            myLayer.visible = false;

        app.redraw();
        }
    //~~Ungroup_All in layer
    function Ungroup_All() {//https://github.com/rjduran/adobe-scripting
        //define
        var clearArr = []; 
        function ungroup(obj) {

        if (!Rmv_Clipp.value && obj.clipped) { 
            return; 
        }
        //
        var childArr = get_All_Child(obj);
        if (childArr.length < 1) {
            obj.remove();
            return;
        }
        for (var i = 0; i < childArr.length; i++) {
            var element = childArr[i];
            try {
                //
                if (element.parent.typename !== 'Layer') {
                element.move(obj, ElementPlacement.PLACEBEFORE);
        
            // Push empty paths in array 
                if ((element.typename === 'PathItem' && !element.filled && !element.stroked) ||
                    (element.typename === 'CompoundPathItem' && !element.pathItems[0].filled && !element.pathItems[0].stroked) ||
                    (element.typename === 'TextFrame' && element.textRange.fillColor == '[NoColor]' && element.textRange.strokeColor == '[NoColor]'))
                    clearArr.push(element);
                }
                //
                if (element.typename === 'GroupItem' || element.typename === 'Layer') {
                ungroup(element);
                }
                //
            } catch (e) { }
        }
        
        }
        //ungroup in all layers
        for (var i = 0; i < allLayers.length; i++) {
        //Recording layer status
        var doclayer = allLayers[i]
        var _layerVisibleStatus = doclayer.visible;
        var _layerLockedStatus = allLayers[i].locked;
            doclayer.visible = true;
            doclayer.locked = false;
        // ungroup in all layers
        if (doclayer.groupItems.length > 0) {
            ungroup(doclayer);
        }
        doclayer.visible = _layerVisibleStatus;
        doclayer.locked = _layerLockedStatus;
        }
        // Remove empty clipping masks after ungroup
        if (Rmv_Clipp.value) {
        for (var i = 0; i < clearArr.length; i++) {
            clearArr[i].remove();
        }
        }
        }
//~function_01------------------------------------------------------





//~function_02------------------------------------------------------
    //~~Save the file in AI format
    function save_as_Ai(){
        //Get the path where the script is located
            //var scriptFile = new File($.fileName);
            //var scriptPath = scriptFile.parent.fsName + "\\--Export--";
        var scriptPath = "~/Desktop/--Export--/--AI+PDF--/"
        if (!Folder(scriptPath).exists){Folder(scriptPath).create() }
        
        var aiDoc = new File(scriptPath);
        var saveOptions = new IllustratorSaveOptions();
        // saveOptions.compatibility = Compatibility.ILLUSTRATOR8;
        // saveOptions.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
        app.activeDocument.saveAs(aiDoc, saveOptions);
        app.redraw();
        }
    //~~Save the file in PDF format
    function Save_as_PDF(){
        //Get the path where the script is located
            //var scriptFile = new File($.fileName);
            //var scriptPath = scriptFile.parent.fsName + "\\--Export--\\--PDF--";
        var scriptPath = "~/Desktop/--Export--/--AI+PDF--/"
        if (!Folder(scriptPath).exists){Folder(scriptPath).create() }
        
        var pdfName = new File(scriptPath);
        var saveOptions = new PDFSaveOptions();
        // saveOptions.compatibility = Compatibility.ILLUSTRATOR8;
        // saveOptions.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
        app.activeDocument.saveAs(pdfName, saveOptions);
        app.redraw();
        }
    //~~Save the file in PDF format
    function Save_as_JPEG() {
        //Get the path where the script is located
            //var scriptFile = new File($.fileName);
            //var scriptPath = scriptFile.parent.fsName + "\\--Export--\\--JPEG--";
        var scriptPath = "~/Desktop/--Export--/-JPEG--/"
        if (!Folder(scriptPath).exists){Folder(scriptPath).create() }

        for(var i = 0; i < app.activeDocument.artboards.length; i++) {
            app.activeDocument.artboards.setActiveArtboardIndex(i);

            var exportOptions = new ExportOptionsJPEG();
                exportOptions.saveMultipleArtboards = true;
                exportOptions.artboardRange = (i+1).toString();

                exportOptions.antiAliasing = true;
                exportOptions.artBoardClipping = true
                exportOptions.optimization = true  //ptimized for web viewing 
                exportOptions.qualitySetting = 100;
                exportOptions.horizontalScale = exportOptions.verticalScale = 300;

            var docName = app.activeDocument.name.split('.')[0]
            //var jpgName = new File(scriptPath + "/TextFile_" + (i+1).toString());
            var jpgName = new File(scriptPath + "/" + String(docName) + "-" + (i+1).toString());

            app.activeDocument.exportFile(jpgName, ExportType.JPEG, exportOptions);
            app.redraw();
            win.close();
        }
        }
//~function_02------------------------------------------------------




} else {
    alert('\nPlease open a document first.');
}