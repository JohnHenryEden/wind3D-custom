class Wind3D {
    constructor(panel, mode) {
        var options = {
            baseLayerPicker: false,
            geocoder: false,
            infoBox: false,
            fullscreenElement: 'cesiumContainer',
            scene3DOnly: true,
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

        DataProcess.loadData().then(
            (data) => {
                this.particleSystem = new ParticleSystem(this.scene.context, data,
                    this.panel.getUserInput(), this.viewerParameters);
                this.addPrimitives();

                this.setupEventListeners();

                if (mode.debug) {
                    this.debug();
                }
            });

        this.imageryLayers = this.viewer.imageryLayers;
        this.setGlobeLayer(this.panel.getUserInput());
    }

    addPrimitives() {
        // the order of primitives.add() should respect the dependency of primitives
        this.scene.primitives.add(this.particleSystem.particlesComputing.primitives.calculateSpeed);
        this.scene.primitives.add(this.particleSystem.particlesComputing.primitives.updatePosition);
        this.scene.primitives.add(this.particleSystem.particlesComputing.primitives.postProcessingPosition);

        this.scene.primitives.add(this.particleSystem.particlesRendering.primitives.segments);
        this.scene.primitives.add(this.particleSystem.particlesRendering.primitives.trails);
        this.scene.primitives.add(this.particleSystem.particlesRendering.primitives.screen);
    }

    updateViewerParameters() {
        var viewRectangle = this.camera.computeViewRectangle(this.scene.globe.ellipsoid);
        var lonLatRange = Util.viewRectangleToLonLatRange(viewRectangle);
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

        let provider = new Cesium.UrlTemplateImageryProvider({
            url: 'https://ims.windy.com/im/v3.0/forecast/cmems/2021051112/2021051113/wm_grid_257/{zTile}/{xTile}/{yTile}/seacurrents-surface.jpg',
            customTags: {
                zTile: function (imageryProvider, x, y, level) {
                    var originZ =  caculateOriginTileZ(level,x,y);
                    return originZ;
                },
                xTile: function (imageryProvider, x, y, level) {
                    var originX =  caculateOriginTileX(level,x,y);
                    return originX;
                },
                yTile: function (imageryProvider, x, y, level) {
                    var originY =  caculateOriginTileY(level,x,y);
                    return originY;
                },
            }
        })
        provider.callback = function (image, x, y, level) {
            console.log(image)
            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')
            canvas.width = image.width
            canvas.height = image.height
            // 不知道为什么，绘制的图像上下颠倒了，需要颠倒回来
            // 裁切一下，剪掉上面那块
            ctx.scale(1, -1);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height, 0, -canvas.height, canvas.width, canvas.height)
            // return canvas;
            let heatTileCanvas = loadWindySource(canvas, image, { z: level, x: x, y: y })
            return heatTileCanvas;
        }
        this.viewer.imageryLayers.addImageryProvider(provider);

        // 加载windy陆地底图
        var windyLandLayer_test = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
            // url : "http://172.17.6.23:9001/services/dpBaseMap/_alllayers/{zTile}/{y}/{x}.png",
            url: "https://tiles.windy.com/tiles/v9.0/grayland/{z}/{x}/{y}.png",
        }), {
            show: true
        });
        windyLandLayer_test.alpha = 0.8;
        this.viewer.imageryLayers.add(windyLandLayer_test);
        
        // 加载windy陆地轮廓底图
        var windyLandLineLayer_test = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
            url: "https://tiles.windy.com/tiles/v10.0/darkmap/{z}/{x}/{y}.png",
            customTags: {
                zTile: function (imageryProvider, x, y, level) {
                    return level;
                },
                xTile: function (imageryProvider, x, y, level) {
                    return x;
                },
                yTile: function (imageryProvider, x, y, level) {
                    return y;
                },
            }
        }), {
            show: true
        });
        this.viewer.imageryLayers.add(windyLandLineLayer_test);
        // 场景的日照效果
        this.scene.globe.enableLighting = false;
        // this.scene.globe.globeAlpha = 0.001;
        // this.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0f2935').withAlpha(0.5);//#012855 // 没有影像时地球的基础颜色，默认为蓝色
        // this.scene.requestRenderMode = true;
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

    setupEventListeners() {
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
                that.addPrimitives();
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
