class Wind3D {
    OceanWindyLayers = []
    constructor(panel, mode) {
        var options = {
            baseLayerPicker: false,
            geocoder: false,
            infoBox: false,
            fullscreenElement: 'cesiumContainer',
            scene3DOnly: true,
            lonLatRange: null
            // sceneMode: Cesium.SceneMode.COLUMBUS_VIEW // 2.5D模式
        }

        if (mode.debug) {
            options.useDefaultRenderLoop = false;
        }

        this.viewer = new Cesium.Viewer('cesiumContainer', options);
        this.scene = this.viewer.scene;
        this.camera = this.viewer.camera;

        this.panel = panel;

        this.viewerParameters = {
            lonRange: new Cesium.Cartesian2(),
            latRange: new Cesium.Cartesian2(),
            pixelSize: 0.0
        };
        // use a smaller earth radius to make sure distance to camera > 0
        this.globeBoundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO, 0.99 * 6378137.0);
        this.updateViewerParameters();


        this.imageryLayers = this.viewer.imageryLayers;
        this.setGlobeLayer(this.panel.getUserInput());
    }

    addPrimitives(particleSystem) {
        // the order of primitives.add() should respect the dependency of primitives
        this.scene.primitives.add(particleSystem.particlesComputing.primitives.calculateSpeed);
        this.scene.primitives.add(particleSystem.particlesComputing.primitives.updatePosition);
        this.scene.primitives.add(particleSystem.particlesComputing.primitives.postProcessingPosition);

        this.scene.primitives.add(particleSystem.particlesRendering.primitives.segments);
        this.scene.primitives.add(particleSystem.particlesRendering.primitives.trails);
        this.scene.primitives.add(particleSystem.particlesRendering.primitives.screen);
    }

    updateViewerParameters() {
        var viewRectangle = this.camera.computeViewRectangle(this.scene.globe.ellipsoid);
        var lonLatRange = this.lonLatRange || Util.viewRectangleToLonLatRange(viewRectangle);
        this.viewerParameters.lonRange.x = lonLatRange.lon.min;
        this.viewerParameters.lonRange.y = lonLatRange.lon.max;
        this.viewerParameters.latRange.x = lonLatRange.lat.min;
        this.viewerParameters.latRange.y = lonLatRange.lat.max;

        var pixelSize = this.camera.getPixelSize(
            this.globeBoundingSphere,
            this.scene.drawingBufferWidth,
            this.scene.drawingBufferHeight
        );

        if (pixelSize > 0) {
            this.viewerParameters.pixelSize = pixelSize;
        }
    }

    setGlobeLayer(userInput) {
        this.viewer.imageryLayers.removeAll();
        this.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        var globeLayer = userInput.globeLayer;
        switch (globeLayer.type) {
            case "NaturalEarthII": {

                this.viewer.imageryLayers.addImageryProvider(
                    new Cesium.TileMapServiceImageryProvider({
                        url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
                    })
                );
                break;
            }
            case "WMS": {
                this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
                    url: userInput.WMS_URL,
                    layers: globeLayer.layer,
                    parameters: {
                        ColorScaleRange: globeLayer.ColorScaleRange
                    }
                }));
                break;
            }
            case "UVImage": {
                this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
                    url: userInput.WMS_URL,
                    layers: globeLayer.layer,
                    parameters: {
                        ColorScaleRange: globeLayer.ColorScaleRange
                    }
                }));
                break;
            }
            case "WorldTerrain": {
                this.viewer.imageryLayers.addImageryProvider(
                    Cesium.createWorldImagery()
                );
                this.viewer.terrainProvider = Cesium.createWorldTerrain();
                break;
            }
        }

        DataProcess.loadData().then(
            (data) => {
                that.particleSystem = new ParticleSystem(that.scene.context, data,
                    that.panel.getUserInput(), that.viewerParameters);
                that.addPrimitives(that.particleSystem);
                that.setupEventListeners(that.particleSystem);

                if (mode.debug) {
                    that.debug();
                }
            });
        let that = this;
        let provider = new Cesium.UrlTemplateImageryProvider({
            url: 'https://ims.windy.com/im/v3.0/{directory}/{refTime}/{acTime}/wm_grid_257/{originTilezxy}/seacurrents-surface.jpg',
            customTags: {
                directory: function (imageryProvider, x, y, level) {
                    var directory = oceanHeatMapParams.directory;
                    return directory;
                },
                refTime: function (imageryProvider, x, y, level) {
                    var refTime = oceanHeatMapParams.refTime;
                    return refTime;
                },
                acTime: function (imageryProvider, x, y, level) {
                    var acTime = oceanHeatMapParams.acTime;
                    return acTime;
                },
                originTilezxy: function (imageryProvider, x, y, level) {
                    var originTile = caculateOriginTile(level, x, y);
                    return originTile.z + "/" + originTile.x + "/" + originTile.y;
                }
            }
        })
        provider.callback = function (image, x, y, level) {
            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')
            canvas.width = image.width
            canvas.height = image.height
            // 不知道为什么，绘制的图像上下颠倒了，需要颠倒回来
            // 裁切一下，剪掉上面那块
            ctx.scale(1, -1);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height, 0, -canvas.height, canvas.width, canvas.height)
            // 原始jpg转换成热力图canvas
            let heatTileCanvas = loadWindySource(canvas, image, { z: level, x: x, y: y })
            return heatTileCanvas;
        }
        // this.oceanWindyImageLayer = new Cesium.ImageryLayer(provider);
        // this.viewer.imageryLayers.add(this.oceanWindyImageLayer);
        // this.lastOceanWindyLayer = this.oceanWindyImageLayer;


        let providerUv = new Cesium.UrlTemplateImageryProvider({
            url: 'https://ims.windy.com/im/v3.0/{directory}/{refTime}/{acTime}/wm_grid_257/{z}/{x}/{y}/seacurrents-surface.jpg',
            maximumLevel : 2,
            customTags: {
                directory: function (imageryProvider, x, y, level) {
                    var directory = oceanHeatMapParams.directory;
                    return directory;
                },
                refTime: function (imageryProvider, x, y, level) {
                    var refTime = oceanHeatMapParams.refTime;
                    return refTime;
                },
                acTime: function (imageryProvider, x, y, level) {
                    var acTime = oceanHeatMapParams.acTime;
                    return acTime;
                },
                originTilezxy: function (imageryProvider, x, y, level) {
                    var originTile = caculateOriginTile(level, x, y);
                    return originTile.z + "/" + originTile.x + "/" + originTile.y;
                }
            }
        })
        this.scene.primitives.removeAll();
        let dataCanvas = document.createElement('canvas');
        let dataCtx = dataCanvas.getContext('2d');
        dataCanvas.width = providerUv.tileWidth * 2;
        dataCanvas.height = providerUv.tileHeight * 2;
        let dataCanvasLoaded = new Promise(function(resolve, reject){
            let nw = false;
            let ne = false;
            let sw = false;
            let se = false;
            providerUv.callback = function (image, x, y, level) {
                let canvas = document.createElement('canvas')
                let ctx = canvas.getContext('2d')
                canvas.width = image.width
                canvas.height = image.height
                // 不知道为什么，绘制的图像上下颠倒了，需要颠倒回来
                // 裁切一下，剪掉上面那块
                ctx.scale(1, -1);
                // 增添绘制到dataCanvas
                if(y === 0){
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height - 8, 0, -canvas.height, canvas.width, canvas.height)
                }else {
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height - 8, 0, -canvas.height, canvas.width, canvas.height)
                }
                if(level === 1){
                    // let ibm = null;
                    // if(y === 0){
                    //     ibm = createImageBitmap(canvas, 0, 0, canvas.width, canvas.height)
                    // }else {
                    //     ibm = createImageBitmap(canvas, 0, 0, canvas.width, canvas.height,)
                    // }
                    // if(ibm !== null){
                    //     ibm.then(function(res){
                    //         if(y === 0){
                    //             dataCtx.drawImage(res, canvas.width * x, canvas.width * y)
                    //         }else {
                    //             dataCtx.drawImage(res, canvas.width * x, canvas.width * y)
                    //         }
                    //         switch (true){
                    //             case (x === 0 && y === 0):
                    //                 nw = true;
                    //                 break;
                    //             case (x === 0 && y === 1):
                    //                 ne = true;
                    //                 break;
                    //             case (x === 1 && y === 0):
                    //                 sw = true;
                    //                 break;
                    //             case (x === 1 && y === 1):
                    //                 se = true;
                    //                 break;
                    //         }
                    //         if((nw === ne === sw === se) && nw === true){
                    //             // 必须确保全部加载出来，否则粒子效果会出错
                    //             setTimeout(() => {
                    //                 console.log(dataCanvas.toDataURL())
                    //                 resolve(dataCanvas);
                    //             }, 1000);
                    //         }
                    //     })
                    // }
                }
                return canvas;
            }
        });
        let uvLayer = this.viewer.imageryLayers.addImageryProvider(providerUv);
        
        uvLayer.alpha = 0.01;
        dataCanvasLoaded.then(function(dataCanvas){
            let meta = {
                "width": dataCanvas.width,
                "height": dataCanvas.height,
                "leftlon": 0,
                "rightlon": 360,
                "toplat": 90,
                "bottomlat": -90,
                "uMin": -50.5715,
                "uMax": 50.7785,
                "vMin": -50.995,
                "vMax": 50.865
            }
            DataProcess.loadData(dataCanvas, meta).then(
                (data) => {
                    that.particleSystem = new ParticleSystem(that.scene.context, data,
                        that.panel.getUserInput(), that.viewerParameters);
                    that.scene.primitives.removeAll();
                    that.addPrimitives(that.particleSystem);
                    console.log(that.scene.primitives.length)
                    that.setupEventListeners(that.particleSystem);
    
                    if (mode.debug) {
                        that.debug();
                    }
                });
                
            var uv_Test = new Cesium.ImageryLayer(new Cesium.SingleTileImageryProvider({
                url: dataCanvas.toDataURL(),
            }), {
                show: true
            });
            uv_Test.alpha = 0.5;
            that.viewer.imageryLayers.add(uv_Test);
        })
        // 加载windy陆地底图
        var windyLandLayer_test = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
            url: "https://tiles.windy.com/tiles/v9.0/grayland/{z}/{x}/{y}.png",
        }), {
            show: true
        });
        windyLandLayer_test.alpha = 1.0;
        this.viewer.imageryLayers.add(windyLandLayer_test);

        // 加载windy陆地轮廓底图
        var windyLandLineLayer_test = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
            url: "https://tiles.windy.com/tiles/v10.0/darkmap/{z}/{x}/{y}.png",
        }), {
            show: true
        });
        this.viewer.imageryLayers.add(windyLandLineLayer_test);
        // 场景的日照效果
        this.scene.globe.enableLighting = false;
        // 贴地遮盖开启(深度检测)
        this.scene.globe.depthTestAgainstTerrain = true;
        // 关闭大气层
        this.scene.globe.showGroundAtmosphere = false;
        this.scene.skyAtmosphere.show = true;
        this.scene.fog.enabled = true;
        this.scene.fog.density = 0.00005;// 地面 0.00005 海底0.00008
        this.scene.fog.minimumBrightness = 0.03; // 0.03
        this.scene._hdr = false;
        var skyAtmosphere = this.scene.skyAtmosphere;
        this.scene.globe.showGroundAtmosphere = false;

        skyAtmosphere.hueShift = 0.0;
        skyAtmosphere.saturationShift = 0.1;
        skyAtmosphere.brightnessShift = 0.08; // 地面0.08 海底
    }

    setOceanWindyData() {
        let provider = new Cesium.UrlTemplateImageryProvider({
            url: 'https://ims.windy.com/im/v3.0/{directory}/{refTime}/{acTime}/wm_grid_257/{originTilezxy}/seacurrents-surface.jpg',
            customTags: {
                directory: function (imageryProvider, x, y, level) {
                    var directory = oceanHeatMapParams.directory;
                    return directory;
                },
                refTime: function (imageryProvider, x, y, level) {
                    var refTime = oceanHeatMapParams.refTime;
                    return refTime;
                },
                acTime: function (imageryProvider, x, y, level) {
                    var acTime = oceanHeatMapParams.acTime;
                    return acTime;
                },
                originTilezxy: function (imageryProvider, x, y, level) {
                    var originTile = caculateOriginTile(level, x, y);
                    return originTile.z + "/" + originTile.x + "/" + originTile.y;
                }
            }
        })
        provider.callback = function (image, x, y, level) {
            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')
            canvas.width = image.width
            canvas.height = image.height
            // 不知道为什么，绘制的图像上下颠倒了，需要颠倒回来
            // 裁切一下，剪掉上面那块
            ctx.scale(1, -1);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height, 0, -canvas.height, canvas.width, canvas.height)
            // 原始jpg转换成热力图canvas
            let heatTileCanvas = loadWindySource(canvas, image, { z: level, x: x, y: y })
            return heatTileCanvas;
        }
        if (this.lastOceanWindyLayer) {
            this.OceanWindyLayers.push(this.lastOceanWindyLayer);
        }
        let oceanWindyImageLayer = new Cesium.ImageryLayer(provider);
        this.viewer.imageryLayers.add(oceanWindyImageLayer);
        this.viewer.imageryLayers.lower(oceanWindyImageLayer);
        this.viewer.imageryLayers.lower(oceanWindyImageLayer);
        this.lastOceanWindyLayer = oceanWindyImageLayer;
    }

    clearOldOceanWindyLayer() {
        if (this.OceanWindyLayers.length > 0) {
            let len = this.OceanWindyLayers.length;
            for (let i = 0; i < len-1; i++) {
                let windyLayer = this.OceanWindyLayers[i];
                if (windyLayer) {
                    this.viewer.imageryLayers.remove(windyLayer)
                }
                this.OceanWindyLayers.splice(i, 1);
                len--;
                i--;
            }
            console.log(this.OceanWindyLayers);
        }
    }

    setupEventListeners(particleSystem) {
        const that = this;

        this.camera.moveStart.addEventListener(function () {
            that.scene.primitives.show = false;
        });

        this.camera.moveEnd.addEventListener(function () {
            that.updateViewerParameters();
            that.particleSystem.applyViewerParameters(that.viewerParameters);
            that.scene.primitives.show = true;
        });

        var resized = false;
        window.addEventListener("resize", function () {
            resized = true;
            that.scene.primitives.show = false;
            that.scene.primitives.removeAll();
        });

        this.scene.preRender.addEventListener(function () {
            if (resized) {
                that.particleSystem.canvasResize(that.scene.context);
                resized = false;
                that.scene.primitives.removeAll();
                if(particleSystem){
                    that.addPrimitives(particleSystem);
                }else {
                    that.addPrimitives(that.particleSystem);
                }
                that.scene.primitives.show = true;
            }
        });

        window.addEventListener('particleSystemOptionsChanged', function () {
            that.particleSystem.applyUserInput(that.panel.getUserInput());
        });
        window.addEventListener('layerOptionsChanged', function () {
            that.setGlobeLayer(that.panel.getUserInput());
        });
    }

    debug() {
        const that = this;

        var animate = function () {
            that.viewer.resize();
            that.viewer.render();
            requestAnimationFrame(animate);
        }

        animate();
    }
}
