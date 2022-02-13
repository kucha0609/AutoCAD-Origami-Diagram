#target "illustrator"
#targetengine com.adobe.illustrator.demo.flashplayer

app.preferences.setBooleanPreference("ShowExternalJSXWarning", false);
//---------------------------------------------------------------------------------------------------------------//
//  OrigamiTools for Adobe Illustrator                                                                           //
//  Writer: Kucha  >>2022<< - https://space.bilibili.com/28181671  Or  www.twitter.com/kucha_Mai                 //
//---------------------------------------------------------------------------------------------------------------//

var win = new Window ("dialog" ,"OrigamiToolsForAI_Kucha");
    win.margins=10;
    win.spacing=5;

//折叠面板

var winsize =win.add("group");
    winsize.margins=2;
    winsize.spacing=2;

    ButtonMax = winsize .add('radiobutton',undefined,'Expand');
    ButtonMax.value = true;
    ButtonMin = winsize .add('radiobutton',undefined,'Collapse');


    ButtonMin.onClick=function(){
        win.bounds.height=30//展开之间高度  
        panelHeight=win.bounds.height;
        
    };
    ButtonMax.onClick=function(){
        win.bounds.height=360
        panelHeight=win.bounds.height;//外框高度
        
    };



//窗口和面板默认为列方向，组为行方向
var a1 =win.add("group");
var s1 =a1.add("panel");

    s1.margins=5;
    s1.spacing=3;


var x1 = s1.add('panel',undefined,'Panel-01');
var x2 = s1.add('panel',undefined,'Panel-02');
var x3 = s1.add('panel',undefined,'Panel-03');
    x3.margins=x2.margins=x1.margins=10;
    x3.spacing=x2.spacing=x1.spacing=3;
//

var ep011 = x1.add('button',undefined,'most_Functions');
var ep012 = x1.add('button',undefined,'Object_to_Artboard');

var ep021 = x2.add('button',undefined,'change_Color_Format');
var ep022 = x2.add('button',undefined,'adjust_LayerOrder');
var ep023 = x2.add('button',undefined,'to_RGB');
var ep024 = x2.add('button',undefined,'to_CMYK');

var ep031 = x3.add('button',undefined,'saveAs_AI');
var ep032 = x3.add('button',undefined,'saveAs_PDF');
var ep033 = x3.add('button',undefined,'saveAs_JPEG');

/*
var T1=x2.add('statictext',undefined,'脚本来源于:');
var T2=x2.add('statictext',undefined,'www.epinv.com');   
T1.size=T2.size=[150,25];//统一的按钮尺寸。也可分别设置
*/
ep012.size=ep011.size=[160,20];//统一的按钮尺寸。也可分别设置
ep024.size=ep023.size=ep022.size=ep021.size=[160,20];//统一的按钮尺寸。也可分别设置
ep033.size=ep032.size=ep031.size=[160,20];//统一的按钮尺寸。也可分别设置




//------------------------------------------------------
    //~Define Variables
    var document = app.activeDocument;
    var allLayers = app.activeDocument.layers; 
    //Define color
    var black = new RGBColor();
        black.red = 0;
        black.green = 0;
        black.blue = 0;
    var darkGrey = new RGBColor();
        darkGrey.red = 85;
        darkGrey.green = 85;
        darkGrey.blue = 85;
    var lightGrey = new RGBColor();
        lightGrey.red = 128;
        lightGrey.green = 128;
        lightGrey.blue = 128;



//~BASE Function
//~~avoid failures due to non-existent layer names.
    function getLayer(layerName) {
        try {
            return document.layers.getByName(layerName);
        } catch(err) {
            return null;
        }
    }
//Gather any children pathItems in case their parent is a Group/Compound Path
    function getAllPathItems(parent) {
        var list = [];
        for (var i = 0; i < parent.pageItems.length; i++) {
        var item = parent.pageItems[i];
        if (item.pageItems && item.pageItems.length)
            list = [].concat(list, getAllPathItems(item));
        else if (/path/i.test(item.typename) && !/compound/i.test(item.typename))
            list.push(item);
        }
        return list;
    }
//Gather All textframes
    function getAllTextFrames(parent) {
        var list = [];
        for (var i = 0; i < parent.pageItems.length; i++) {
        var item = parent.pageItems[i];
        if (item.pageItems && item.pageItems.length)
            list = [].concat(list, getAllTextFrames(item));
        else if (item.typename=="TextFrame")
            list.push(item);
        }
        return list;
    }
//judge color
    function judgeColor(item, isStroke){
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


//~other function
//~~Change the color in layer (FillColor and StrokeColor)
    function changeColorAndFormat(){
    //DefineVariables
        var blackLayers = ["D-03-符号", "D-10-边界线(参考)"];
        var blackAndFormatLayers = ["D-06-峰线", "D-08-谷线" , "D-04-参考符号"];
        var blackAndopacity = ["D-01-版面"];
        //
        var darkGreyLayers = ["D-02-文字" , "D-11-边界线"];
        var darkGreyAndFormatLayers = ["D-05-辅助线"];
        //
        var lightGreyLayers = [ "D-12-已有线条"];
        var lightGreyAndFormatLayers = ["D-07-峰线(隐藏)", "D-09-谷线(隐藏)"];
        //
        var blackStrokeLayers = ["D-14-深色填充"];


    //DefineFunction
        function restyleAllWithin(layers, color, changeFill, changeStroke,changeFormat,opacity) {
            app.selection = null;
            // Iterate through our layer list:
            for (var i = 0; i < layers.length; i++) {
                // Get our target layer:
                var layer = getLayer(layers[i]);
                // If a layer wasn't found or there are no items to restyle, continue looping:
                //if (!layer || !layer.pathItems.length) continue;
                if (!layer) continue;
                else {
                    var _layerStatus = layer.visible;//Recording layer status
                    layer.visible = true;
                    //If pathitem exists in the layer
                    var listPath = getAllPathItems(layer);
                    for (var index = 0; index < listPath.length; index++) {
                        var pathItem = listPath[index];

                        if (changeFill && pathItem.filled && judgeColor(pathItem, false)) {// Change pathItem fillColor when it exists
                            pathItem.filled = true;    
                            pathItem.fillColor = color;
                            if (opacity){pathItem.opacity = 100;}
                        }
                        if (changeStroke &&  pathItem.stroked && judgeColor(pathItem, true)) {// Change pathItem strokeColor when it exists
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
                    var listText = getAllTextFrames(layer);
                    for (var index = 0; index < listText.length; index++) {
                        //var xxx=listText[index]
                        var textFrames=listText[index].textRange.characterAttributes;

                        if (changeFill && textFrames.fillColor.typename!="NoColor" && judgeColor(textFrames, false)) {// Change textFrames fillColor when it exists
                            textFrames.fillColor = color;
                            if (opacity){listText[index].opacity = 100;}
                        }
                        if (changeStroke && textFrames.strokeColor.typename!="NoColor" && judgeColor(textFrames, true)) {// Change textFrames strokeColor when it exists
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
        //change StrokeColor and FillColor and lineFormat
        restyleAllWithin(blackAndFormatLayers, black, true, true, true, true);
        restyleAllWithin(darkGreyAndFormatLayers, darkGrey, true, true, true, true);
        restyleAllWithin(lightGreyAndFormatLayers, lightGrey, true, true, true, true);
        //just change StrokeColor
        restyleAllWithin(blackStrokeLayers, black, false, true, false, true);
        //StrokeColor and FillColor and No change in opacity
        restyleAllWithin(blackAndopacity, black, true, true, true, false);

    }

//~~Adjust layer order (Alphabetized)
    function adjustLayerOrder(){  
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
        var myLayer = document.layers.getByName('D-15-图框');  
            myLayer.visible = false;
    } 


    
//~~Create Artboard from multiple objects
    function objectToArtboard(){
    try {//if the layer exists, only objects from the layer are used
            var myLayer = document.layers.getByName('D-15-图框');  
            var _layerStatus = myLayer.visible;//Recording layer status
                myLayer.visible = true;
                //myLayer.pathItems.selected = true
                
                myLayer.hasSelectedArtwork = true; 
                
            for(i=0;i<document.selection.length;i++){
                app.activeDocument.artboards.add(document.selection[i].geometricBounds);
                //selec[i].remove();//Delete the selected
            }
            document.selection = null; 
            myLayer.visible = _layerStatus;//Restore layer state
            myLayer.visible = false;
        }  
    catch (e) {//If the layer doesn't exist, only the selected object is used
            for(i=0;i<document.selection.length;i++){
                app.activeDocument.artboards.add(document.selection[i].geometricBounds);
                //selection[0].remove();
            }
            document.selection = null; 
        }  
    }

//~~Save the file in AI format
    function saveAiFile(){
        //Get the path where the script is located
            //var scriptFile = new File($.fileName);
            //var scriptPath = scriptFile.parent.fsName + "\\--Export--";
        var scriptPath = "~/Desktop/--Export--/"
        if (!Folder(scriptPath).exists){Folder(scriptPath).create() }
        
        var aiDoc = new File(scriptPath);
        var saveOptions = new IllustratorSaveOptions();
        // saveOptions.compatibility = Compatibility.ILLUSTRATOR8;
        // saveOptions.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
            app.activeDocument.saveAs(aiDoc, saveOptions);
        
    }
//~~Save the file in PDF format
    function savePdfFile(){
        //Get the path where the script is located
            //var scriptFile = new File($.fileName);
            //var scriptPath = scriptFile.parent.fsName + "\\--Export--\\--PDF--";
        var scriptPath = "~/Desktop/--Export--/--PDF--/"
        if (!Folder(scriptPath).exists){Folder(scriptPath).create() }
        
        var pdfName = new File(scriptPath);
        var saveOptions = new PDFSaveOptions();
        // saveOptions.compatibility = Compatibility.ILLUSTRATOR8;
        // saveOptions.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
            app.activeDocument.saveAs(pdfName, saveOptions);
        
    }

//~~Save the file in PDF format
    function saveJPEGFile() {
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

        }
    }




//------------------------------------------------------




//------------------------------------------------------
ep011.onClick = function() {//main
        if(app.documents.length < 1) {
            alert("Please open a document first")
        }else{
            changeColorAndFormat()
            adjustLayerOrder()
            saveAiFile()
            //objectToArtboard()
        } 
    }
ep012.onClick = function() {//Object_to_Artboard
    objectToArtboard()
    }

//
ep021.onClick = function() {//changeColorAndFormat
            changeColorAndFormat()
    }
ep022.onClick = function() {//adjustLayerOrder
            adjustLayerOrder()
    }
ep023.onClick = function() {//to_RGB
    if(app.documents.length < 1) {
        alert("Please open a document first")
    }else{
        app.executeMenuCommand('doc-color-rgb')
    } 
    }
ep024.onClick = function() {//to_CMYK
    if(app.documents.length < 1) {
        alert("Please open a document first")
    }else{
        app.executeMenuCommand('doc-color-cmyk')
    } 
    }

//
ep031.onClick = function() {//saveAiFile
            saveAiFile()
    }
ep032.onClick = function() {//savePdfFile
            savePdfFile()
    }
ep033.onClick = function() {//saveJPEGFile
            saveJPEGFile()
    }
//------------------------------------------------------

win.show();