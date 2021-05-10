var DataProcess = (function () {
    var data;
    var imageMeta;
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
    var loadUvHeatmapImage = function(filePath){
        return new Promise(function (resolve) {
            var img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = filePath;
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
                this.heatmapImage = paddedData;
                resolve(paddedData);
            }
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
                let unitLon = (parseInt(imageMeta.rightlon) - parseInt(imageMeta.leftlon)) / imgWidth;
                let lonArray = [];
                for(let i = 0; i < imgWidth; i++){
                    lonArray.push(parseInt(imageMeta.leftlon) + (unitLon * i))
                }
                lonArray.push(parseInt(imageMeta.rightlon));
                data.lon = {}
                data.lon.array = new Float32Array(lonArray);
                data.lon.min = parseInt(imageMeta.leftlon);
                data.lon.max = parseInt(imageMeta.rightlon);

                
                let unitLat = ((parseInt(imageMeta.toplat) + 90) - (parseInt(imageMeta.bottomlat) + 90)) / imgHeight;
                let latArray = [];
                for(let i = 0; i < imgHeight; i++){
                    latArray.push(parseInt(imageMeta.bottomlat) + (unitLat * i))
                }
                latArray.push(parseInt(imageMeta.toplat));
                data.lat = {};
                data.lat.array = new Float32Array(latArray);
                data.lat.min = parseInt(imageMeta.bottomlat);
                data.lat.max = parseInt(imageMeta.toplat);
                
                data.lev = {};
                data.lev.array = new Float32Array([1]);
                data.lev.min = Math.min(...data.lev.array);
                data.lev.max = Math.max(...data.lev.array);

                data.image = {};
                data.image.data = new Uint8Array(paddedData);;
                resolve(data);
            };
        });
    }

    var loadData = async function (image) {
        var ncFilePath = fileOptions.dataDirectory + fileOptions.dataFile;
        var uvImageFilePath = fileOptions.dataDirectory + fileOptions.imgDataFile;
        var uvImageMetaFilePath = fileOptions.dataDirectory + fileOptions.imgMetaDataFile;
        // await loadNetCDF(ncFilePath);
        imageMeta = await loadUvImageMeta(uvImageMetaFilePath);
        if(image){
            await loadUvImage(image);
        }else {
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