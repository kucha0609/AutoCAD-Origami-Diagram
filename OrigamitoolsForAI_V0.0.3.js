#target illustrator  

app.preferences.setBooleanPreference("ShowExternalJSXWarning", false);
//---------------------------------------------------------------------------------------------------------------//
//  OrigamiTools for Adobe Illustrator                                                                           //
//  Writer: Kucha  >>2022<< - https://space.bilibili.com/28181671  Or  www.twitter.com/kucha_Mai                 //
//---------------------------------------------------------------------------------------------------------------//

//~Define Variables
    var document = app.activeDocument;
    var allLayers = app.activeDocument.layers; 
    //~~
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


//~other function
    //~~Change the color in a specific layer (FillColor and StrokeColor)
    function Changecolor(){
    //DefineVariables
        var blackstrokeLayers = ["D-14-深色填充"];
        var blackLayers = ["D-01-版面", "D-04-参考符号", "D-06-峰线", "D-08-谷线", "D-10-边界线(参考)"];
        var darkGreyLayers = ["D-02-文字", "D-05-辅助线", "D-11-边界线"];
        var lightGreyLayers = ["D-07-峰线(隐藏)", "D-09-谷线(隐藏)", "D-12-已有线条"];

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
    //DefineFunction
        function restyleAllPathItemsWithin(layers, color, changeFill, changeStroke) {
            app.selection = null;

            // Iterate through our layer list:
            for (var i = 0; i < layers.length; i++) {
                // Get our target layer:
                var layer = getLayer(layers[i]);

                // If a layer wasn't found or there are no items to restyle, continue looping:
                //if (!layer || !layer.pathItems.length) continue;
                if (!layer) continue;
                else {
                    var _layerStatus = layer.visible;
                    layer.visible = true;
                    var list = getAllPathItems(layer);
                    for (var index = 0; index < list.length; index++) {
                        var pathItem = list[index];
                        if (changeStroke && pathItem.stroked) {     // Change stroke only when changeStrokevalue is true
                            pathItem.stroked = true;    
                            pathItem.strokeColor = color;
                        }
                        if (changeFill && pathItem.filled) {
                            pathItem.filled = true;    
                            pathItem.fillColor = color;
                        }
                    }
                    layer.visible = _layerStatus;
                }
            }
        }
    //UsingFunction
        restyleAllPathItemsWithin(blackLayers, black, true, true);
        restyleAllPathItemsWithin(darkGreyLayers, darkGrey, true, true);
        restyleAllPathItemsWithin(lightGreyLayers, lightGrey, true, true);
        //just changeStroke
        restyleAllPathItemsWithin(blackstrokeLayers, black, false, true);

    }
    //~~change StrokeCap and StrokeJoin
    function lineFormat(){
        //https://community.adobe.com/t5/illustrator-discussions/how-to-change-the-strokecap-of-all-objects-in-a-few-layers/m-p/12631175#M304391
        
        //DefineVariables
        var targetLayers = ["D-05-辅助线", "D-06-峰线", "D-07-峰线(隐藏)", "D-08-谷线", "D-09-谷线(隐藏)"];

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
        //Change lineFormat
        function restyleAllPathItemsWithin(layers) {
            app.selection = null;
            
            for (var i = 0; i < layers.length; i++) {
            var layer = getLayer(layers[i]);
                if (!layer) continue;
                else {
                    var _layerStatus = layer.visible;
                    layer.visible = true;
                    var list = getAllPathItems(layer);
                    for (var index = 0; index < list.length; index++) {
                        var pathItem = list[index];
                        //pathItem.stroked = true; // open stroke
                        pathItem.strokeCap = StrokeCap.BUTTENDCAP; //ROUNDENDCAP, PROJECTINGENDCAP
                        pathItem.strokeJoin = StrokeJoin.ROUNDENDJOIN; //BEVELENDJOIN, MITERENDJOIN
                    }
                    layer.visible = _layerStatus;
                }
            }
        }
        //Using function
        restyleAllPathItemsWithin(targetLayers);
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
                if (ilayer.visible) {  
                    visibleLayers.push(ilayer);  
                }  
            }
            //
            var alphabetizedLayers = visibleLayers.sort( function(a,b) { return a > b } );
            sortLayers(app.documents, alphabetizedLayers)
        } 
    //~~Save the file in AI format
        function saveAiFile(){
            //Get the path where the script is located
            var scriptFile = new File($.fileName);
            var scriptPath = scriptFile.parent.fsName + "\\--Export--\\";
            if (!Folder(scriptPath).exists){Folder(scriptPath).create() }
            
            var aiDoc = new File(scriptPath);
            var saveOptions = new IllustratorSaveOptions();
               // saveOptions.compatibility = Compatibility.ILLUSTRATOR8;
               // saveOptions.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
                app.activeDocument.saveAs(aiDoc, saveOptions);
            
        }


//~mainFunction
main()
function main(){  
    if(app.documents.length < 1) {
        alert("Please open a document first")
    }else{
        Changecolor()
        lineFormat()
        adjustLayerOrder()
        saveAiFile()
    } 
}