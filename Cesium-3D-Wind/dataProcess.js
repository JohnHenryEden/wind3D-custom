var DataProcess = (function () {
    var data;
    var imageMeta;
    var heatmapImage;
    var loadUvImageMeta = function(filePath){
        return new Promise(function (resolve) {
            var request = new XMLHttpRequest();
            request.open('GET', filePath);

            request.onload = function () {
                resolve(JSON.parse(request.response));
            }
            request.send();
        })
    }
    var loadUvImage = function(filePath){
        return new Promise(function (resolve) {
            var img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = filePath;
            data = {};
            data.image = img;
            img.onload = function () {
                var imgWidth = img.width;
                var imgHeight = img.height;
                var canvas = document.createElement('canvas');
                canvas.width = imgWidth;
                canvas.height = imgHeight;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                var imageData = ctx.getImageData(0, 1, imgWidth, imgHeight);
                var paddedData = imageData.data;
                imageMeta.lonArray = []
                imageMeta.latArray = []
                let lonUnit = Math.abs(parseFloat(imageMeta.rightlon) - parseFloat(imageMeta.leftlon)) / imgWidth;
                let latUnit = Math.abs(parseFloat(imageMeta.toplat) - parseFloat(imageMeta.bottomlat)) / imgHeight;
                for (let index = 0; index < imgWidth; index++) {
                    imageMeta.lonArray.push(parseFloat(imageMeta.leftlon) + (lonUnit * index))
                }
                for (let index = 0; index < imgHeight; index++) {
                    imageMeta.latArray.push(parseFloat(imageMeta.bottomlat) + (latUnit * index))
                }
                data.lon = {}
                debugger
                data.lon.array = new Float32Array(imageMeta.lonArray);
                data.lon.min = parseFloat(imageMeta.leftlon);
                data.lon.max = parseFloat(imageMeta.rightlon);
    
                
                data.lat = {};
                data.lat.array = new Float32Array(imageMeta.latArray);
                data.lat.min = parseFloat(imageMeta.bottomlat);
                data.lat.max = parseFloat(imageMeta.toplat);
                
                
                data.lonLatArray = []
                data.latArray = {}
                let lonLatArray = [];
                let latArrayMin = 0;
                let latArrayMax = 0;
                for(let i = 0; i < imageMeta.lonArray.length; i++){
                    for(let j = 0; j < imageMeta.latArray.length; j++){
                        let lon0 = imageMeta.lonArray[i] 
                        let lon1 = imageMeta.lonArray[i + 1]
                        let lat0 = imageMeta.latArray[j]
                        let lat1 = imageMeta.latArray[j + 1]
                        if(lon1 === undefined){
                            lon1 = 360
                        }
                        if(lat1 === undefined){
                            lat1 = imageMeta.latArray[0] * -1
                        }
                        lonLatArray.push(Math.abs(lon0 - lon1));
                        lonLatArray.push(Math.abs(lat0 - lat1));
                        if(j === 510){
                            latArrayMin = Math.abs(lat0 - lat1)
                        }
                        if(lat0 === 0){
                            latArrayMax = Math.abs(lat0 - lat1)
                        }
                    }
                }
                data.lonLatArray = new Float32Array(lonLatArray);
                data.latArray.min = latArrayMin;
                data.latArray.max = latArrayMax;
                data.lev = {};
                data.lev.array = new Float32Array([1]);
                data.lev.min = Math.min(...data.lev.array);
                data.lev.max = Math.max(...data.lev.array);
    
                data.U = {};
                let Umax = parseFloat(imageMeta.uMax);
                let Umin = parseFloat(imageMeta.uMin);
                let Uarray = [];
                let UImagearray = [];
                // 逆算转换公式
                paddedData.forEach((v, i) => {
                    if(i % 4 === 0 && paddedData[i + 2] < 50){
                        let u = ((v * (Umax - Umin)) / 255) + Umin
                        Uarray.push(u) 
                    }else if(i % 4 === 0 && paddedData[i + 2] >= 50){
                        let u = 9999
                        Uarray.push(u) 
                    }
                })
                data.U.array = new Float32Array(Uarray);
                data.U.min = Umin;
                data.U.max = Umax;
    
                data.V = {};
                let Vmax = parseFloat(imageMeta.uMax);
                let Vmin = parseFloat(imageMeta.uMin);
                let Varray = [];
                let VImagearray = [];
                paddedData.forEach((v, i) => {
                    if(i % 4 === 1 && paddedData[i + 1] < 50){
                        let vdata = ((v * (Vmax - Vmin)) / 255) + Vmin
                        Varray.push(vdata) 
                    }else if(i % 4 === 1 && paddedData[i + 1] >= 50){
                        let vdata = 9999
                        Varray.push(vdata) 
                    }
                })
                data.V.array = new Float32Array(Varray);
                data.V.min = Vmin;
                data.V.max = Vmax;
                
                resolve(data);
            };
        });
    }
    var loadUvCanvasImage = function(uvcanvas){
        return new Promise(function (resolve) {
            var imgWidth = uvcanvas.width;
            var imgHeight = uvcanvas.height;
            var ctx = uvcanvas.getContext('2d');

            var imageData = ctx.getImageData(0, 1, imgWidth, imgHeight);
            var paddedData = imageData.data;
            data.lon = {}
            data.lon.array = new Float32Array(imageMeta.lonArray);
            data.lon.min = parseFloat(imageMeta.leftlon);
            data.lon.max = parseFloat(imageMeta.rightlon);

            
            data.lat = {};
            data.lat.array = new Float32Array(imageMeta.latArray);
            data.lat.min = parseFloat(imageMeta.bottomlat);
            data.lat.max = parseFloat(imageMeta.toplat);
            
            
            data.lonLatArray = []
            data.latArray = {}
            let lonLatArray = [];
            let latArrayMin = 0;
            let latArrayMax = 0;
            for(let i = 0; i < imageMeta.lonArray.length; i++){
                for(let j = 0; j < imageMeta.latArray.length; j++){
                    let lon0 = imageMeta.lonArray[i] 
                    let lon1 = imageMeta.lonArray[i + 1]
                    let lat0 = imageMeta.latArray[j]
                    let lat1 = imageMeta.latArray[j + 1]
                    if(lon1 === undefined){
                        lon1 = 360
                    }
                    if(lat1 === undefined){
                        lat1 = imageMeta.latArray[0] * -1
                    }
                    lonLatArray.push(Math.abs(lon0 - lon1));
                    lonLatArray.push(Math.abs(lat0 - lat1));
                    if(j === 510){
                        latArrayMin = Math.abs(lat0 - lat1)
                    }
                    if(lat0 === 0){
                        latArrayMax = Math.abs(lat0 - lat1)
                    }
                }
            }
            data.lonLatArray = new Float32Array(lonLatArray);
            data.latArray.min = latArrayMin;
            data.latArray.max = latArrayMax;
            data.lev = {};
            data.lev.array = new Float32Array([1]);
            data.lev.min = Math.min(...data.lev.array);
            data.lev.max = Math.max(...data.lev.array);

            data.U = {};
            let Umax = parseFloat(imageMeta.uMax);
            let Umin = parseFloat(imageMeta.uMin);
            let Uarray = [];
            let UImagearray = [];
            // 逆算转换公式
            paddedData.forEach((v, i) => {
                if(i % 4 === 0 && paddedData[i + 2] < 50){
                    let u = ((v * (Umax - Umin)) / 255) + Umin
                    Uarray.push(u) 
                }else if(i % 4 === 0 && paddedData[i + 2] >= 50){
                    let u = 9999
                    Uarray.push(u) 
                }
            })
            data.U.array = new Float32Array(Uarray);
            data.U.min = Umin;
            data.U.max = Umax;

            data.V = {};
            let Vmax = parseFloat(imageMeta.uMax);
            let Vmin = parseFloat(imageMeta.uMin);
            let Varray = [];
            let VImagearray = [];
            paddedData.forEach((v, i) => {
                if(i % 4 === 1 && paddedData[i + 1] < 50){
                    let vdata = ((v * (Vmax - Vmin)) / 255) + Vmin
                    Varray.push(vdata) 
                }else if(i % 4 === 1 && paddedData[i + 1] >= 50){
                    let vdata = 9999
                    Varray.push(vdata) 
                }
            })
            data.V.array = new Float32Array(Varray);
            data.V.min = Vmin;
            data.V.max = Vmax;
            
            resolve(data);
        });
    }

    var loadData = async function (canvas, meta) {
        var ncFilePath = fileOptions.dataDirectory + fileOptions.dataFile;
        var uvImageFilePath = fileOptions.dataDirectory + fileOptions.imgDataFile;
        var uvImageMetaFilePath = fileOptions.dataDirectory + fileOptions.imgMetaDataFile;
        // await loadNetCDF(ncFilePath);
        if(meta){
            imageMeta = meta
        }else{
            imageMeta = await loadUvImageMeta(uvImageMetaFilePath);
        }
        if(canvas){
            await loadUvCanvasImage(canvas);
        }else{
            await loadUvImage(uvImageFilePath);
        }
        return data;
    }

    var randomizeParticles = function (maxParticles, viewerParameters) {
        var array = new Float32Array(4 * maxParticles);
        for (var i = 0; i < maxParticles; i++) {
            array[4 * i] = Cesium.Math.randomBetween(viewerParameters.lonRange.x, viewerParameters.lonRange.y);
            array[4 * i + 1] = Cesium.Math.randomBetween(viewerParameters.latRange.x, viewerParameters.latRange.y);
            array[4 * i + 2] = Cesium.Math.randomBetween(data.lev.min, data.lev.max);
            array[4 * i + 3] = 0.0;
        }
        return array;
    }

    return {
        loadData: loadData,
        randomizeParticles: randomizeParticles
    };

})();