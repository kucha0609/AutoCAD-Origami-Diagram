#target illustrator  

//---------------------------------------------------------------------------------------------------------------//
//  OrigamiTools for Adobe Illustrator                                                                           //
//  Writer: Kucha  >>2022<< - https://space.bilibili.com/28181671  Or  www.twitter.com/kucha_Mai                 //
//---------------------------------------------------------------------------------------------------------------//

//Define Variables
    var document = app.activeDocument;
    var allLayers = app.activeDocument.layers; 
//Define Function
    //~avoid failures due to non-existent layer names.
        function getLayer(layerName) {
            try {
                return document.layers.getByName(layerName);
            } catch(err) {
                return null;
            }
        }
    //~Adjust layer order (Alphabetized)
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
    //~Change the color in a specific layer (FillColor and StrokeColor)
        function Changecolor(){
            //DefineVar
                var fillLayer = ["D-02-文字"];
                var strokeLayer = ["D-11-边界线"];

                var darkGreyCMYK = new CMYKColor();
                    darkGreyCMYK.cyan = 72;
                    darkGreyCMYK.magenta = 65;
                    darkGreyCMYK.yellow = 62;
                    darkGreyCMYK.black = 17;

                var lightGreyCMYK = new CMYKColor();
                    lightGreyCMYK.cyan = 72;
                    lightGreyCMYK.magenta = 65;
                    lightGreyCMYK.yellow = 62;
                    lightGreyCMYK.black = 17;
            //DefineFunction
                function fillColorInLayer(Color1, TargetLayer1){
                    app.selection = null;
                    for (var i = 0; i < allLayers.length; i++) {
                        var curLayer = getLayer(TargetLayer1[i]);
                        if (curLayer = TargetLayer1[i]) {
                            //Change the ColorSpace
                            document.documentColorSpace = DocumentColorSpace.CMYK;
                            //Select objects in layer
                            document.activeLayer = document.layers[TargetLayer1]; 
                            document.activeLayer.hasSelectedArtwork = true; 
                            //Change Color
                            document.defaultFilled = true;
                            document.defaultStroked = false;
                            document.defaultFillColor = Color1;
                            //Deselect objects in layer
                            document.activeLayer.hasSelectedArtwork = false;
                        }
                    }
                }
                function strokeColorInLayer(Color2, TargetLayer2){
                    app.selection = null;
                    for (var i = 0; i < allLayers.length; i++) {
                        var curLayer = getLayer(TargetLayer2[i]);
                        if (curLayer = TargetLayer2[i]) {
                            //Change the ColorSpace
                            document.documentColorSpace = DocumentColorSpace.CMYK;
                            //Select objects in layer
                            document.activeLayer = document.layers[TargetLayer2]; 
                            document.activeLayer.hasSelectedArtwork = true; 
                            //Change Color
                            document.defaultFilled = false;
                            document.defaultStroked = true;
                            document.defaultStrokeColor = Color2;
                            //Deselect objects in layer
                            document.activeLayer.hasSelectedArtwork = false;
                        }
                    }
                }
            //UsingFunctions
                fillColorInLayer(lightGreyCMYK, fillLayer)
                strokeColorInLayer(lightGreyCMYK, strokeLayer)
        }
    //~change StrokeCap and StrokeJoin
        function lineFormat(){
        //https://community.adobe.com/t5/illustrator-discussions/how-to-change-the-strokecap-of-all-objects-in-a-few-layers/m-p/12631175#M304391

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
                var list = getAllPathItems(layer);
                for (var index = 0; index < list.length; index++) {
                var pathItem = list[index];
                pathItem.stroked = true; // open stroke
                pathItem.strokeCap = StrokeCap.BUTTENDCAP; //ROUNDENDCAP, PROJECTINGENDCAP
                pathItem.strokeJoin = StrokeJoin.ROUNDENDJOIN; //BEVELENDJOIN, MITERENDJOIN
                }
            }
            }
        }
        //Using function
        restyleAllPathItemsWithin(targetLayers);

        }
    //Save the file in AI format
        function saveAiFile(){
            //Get the path where the script is located
            var scriptFile = new File($.fileName);
            var scriptPath = scriptFile.parent.fsName + "\\--Export--\\";
            if (!Folder(scriptPath).exists){Folder(scriptPath).create() }
            
            var aiDoc = new File(scriptPath);
            var saveOptions = new IllustratorSaveOptions();
                saveOptions.compatibility = Compatibility.ILLUSTRATOR8;
                saveOptions.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
                app.activeDocument.saveAs(aiDoc, saveOptions);
            
        }

//mainFunction
main()
function main(){  
    if(app.documents.length < 1) {
        alert("Please open a document first")
    }else{
        adjustLayerOrder();  
        lineFormat()
        Changecolor()
        saveAiFile()
    } 
}
