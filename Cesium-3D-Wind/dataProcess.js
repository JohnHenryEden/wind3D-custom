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
                let unitLon = Math.abs((parseFloat(imageMeta.rightlon) - parseFloat(imageMeta.leftlon))) / imgWidth;
                let lonArray = [];
                for(let i = 0; i < imgWidth; i++){
                    let lonPixel = parseFloat(imageMeta.leftlon) + (unitLon * i)
                    lonPixel = lonPixel < 0 ? lonPixel + 360 : lonPixel
                    lonPixel = lonPixel > 360 ? lonPixel - 360 : lonPixel
                    lonArray.push(lonPixel)
                }
                lonArray.push(parseFloat(imageMeta.rightlon));
                data.lon = {}
                data.lon.array = new Float32Array(lonArray);
                data.lon.min = parseFloat(imageMeta.leftlon);
                data.lon.max = parseFloat(imageMeta.rightlon);

                
                let unitLat = ((parseFloat(imageMeta.toplat) + 90) - (parseFloat(imageMeta.bottomlat) + 90)) / imgHeight;
                let latArray = [];
                for(let i = 0; i < imgHeight; i++){
                    latArray.push(parseFloat(imageMeta.bottomlat) + (unitLat * i))
                }
                latArray.push(parseFloat(imageMeta.toplat));
                data.lat = {};
                data.lat.array = new Float32Array(latArray);
                data.lat.min = parseFloat(imageMeta.bottomlat);
                data.lat.max = parseFloat(imageMeta.toplat);
                
                data.lev = {};
                data.lev.array = new Float32Array([1]);
                data.lev.min = Math.min(...data.lev.array);
                data.lev.max = Math.max(...data.lev.array);

                data.U = {};
                let Umax = parseFloat(imageMeta.uMax);
                let Umin = parseFloat(imageMeta.uMin);
                let Uarray = [];
                // 逆算转换公式
                paddedData.forEach((v, i) => {
                    if(i % 4 === 0 && paddedData[i + 2] === 0){
                        let u = ((v * (Umax - Umin)) / 255) + Umin
                        Uarray.push(u)
                    }else if(i % 4 === 0 && paddedData[i + 2] !== 0){
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
                paddedData.forEach((v, i) => {
                    if(i % 4 === 1 && paddedData[i + 1] === 0){
                        let vdata = ((v * (Vmax - Vmin)) / 255) + Vmin
                        Varray.push(vdata)
                    }else if(i % 4 === 1 && paddedData[i + 1] !== 0){
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
            let unitLon = Math.abs((parseFloat(imageMeta.rightlon) - parseFloat(imageMeta.leftlon))) / imgWidth;
            let lonArray = [];
            for(let i = 0; i < imgWidth; i++){
                let lonPixel = parseFloat(imageMeta.leftlon) + (unitLon * i)
                lonPixel = lonPixel < 0 ? lonPixel + 360 : lonPixel
                lonPixel = lonPixel > 360 ? lonPixel - 360 : lonPixel
                lonArray.push(lonPixel)
            }
            lonArray.push(parseFloat(imageMeta.rightlon));
            data.lon = {}
            data.lon.array = new Float32Array(lonArray);
            data.lon.min = parseFloat(imageMeta.leftlon);
            data.lon.max = parseFloat(imageMeta.rightlon);

            
            let unitLat = ((parseFloat(imageMeta.toplat) + 90) - (parseFloat(imageMeta.bottomlat) + 90)) / imgHeight;
            let latArray = [];
            for(let i = 0; i < imgHeight; i++){
                latArray.push(parseFloat(imageMeta.bottomlat) + (unitLat * i))
            }
            latArray.push(parseFloat(imageMeta.toplat));
            data.lat = {};
            data.lat.array = new Float32Array(latArray);
            data.lat.min = parseFloat(imageMeta.bottomlat);
            data.lat.max = parseFloat(imageMeta.toplat);
            
            data.lev = {};
            data.lev.array = new Float32Array([1]);
            data.lev.min = Math.min(...data.lev.array);
            data.lev.max = Math.max(...data.lev.array);

            data.U = {};
            let Umax = parseFloat(imageMeta.uMax);
            let Umin = parseFloat(imageMeta.uMin);
            let Uarray = [];
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