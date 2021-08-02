class Wind3D {
    OceanWindyLayers = []
    constructor(panel, mode) {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZjEwYjdhYS1lYzQ4LTQ5M2EtYTg5My02MDhhMTE1YTJlYmYiLCJpZCI6MTA0MSwiaWF0IjoxNTI2Nzg4NTcwfQ.3T6RRTRCIXu08pYcznhkseiYsLRgQxI3eq4ziLMcvtY';

        var options = {
            baseLayerPicker: false,
            geocoder: false,
            animation:false,
            infoBox: false,
            homeButton: false,
            navigationHelpButton: false,
            timeline: false,
            fullscreenElement: 'cesiumContainer',
            scene3DOnly: true,
            lonLatRange: null,
            skyAtmosphere: false,
            terrainProvider : Cesium.createWorldTerrain({
                url: Cesium.IonResource.fromAssetId(1),
                requestVertexNormals : true
            })
            // sceneMode: Cesium.SceneMode.COLUMBUS_VIEW // 2.5D模式
        }

        if (mode.debug) {
            options.useDefaultRenderLoop = false;
        }
        
        this.viewer = new Cesium.Viewer('cesiumContainer', options);
        this.viewer.scene.globe.enableLighting = false;
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer.shadows = false;
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
        this.addSeaPlane()
        this.imageryLayers = this.viewer.imageryLayers;
        this.setGlobeLayer(this.panel.getUserInput());
    }

    addSeaPlane(){
        let that = this;
        let positions = Cesium.Cartesian3.fromDegreesArray([
            112.0,20.0,
            112.0,24.0,
            115.0,24.0,
            115.0,20.0,
        ])
        this.seaPlaneEntity = this.viewer.entities.add({
            rectangle:{
                coordinates: Cesium.Rectangle.fromCartesianArray(positions),
                height: 50,
                show: new Cesium.CallbackProperty(function () {
                    if(that.panel.getUserInput().seaHeight > 0){
                        return true
                    }
                    return false
                }, false),
                extrudedHeight: new Cesium.CallbackProperty(function () {
                    return that.panel.getUserInput().seaHeight
                }, false),
                perPositionHeight: true,
                material: Cesium.Color.CYAN.withAlpha(0.6)
            }
        })
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
        let globeLayer = userInput.globeLayer;
        // switch (globeLayer.type) {
        //     case "NaturalEarthII": {
        //         this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
        //             url: "http://t2.tianditu.gov.cn/img_w/wmts?tk=d0661913245178667ddfe496f4d38749&service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
        //             layer: "tdtBasicLayer",
        //             style: "default",
        //             format: "image/jpeg",
        //             tileMatrixSetID: "GoogleMapsCompatible",
        //             show: false
        //         }))
        //         break;
        //     }
        // }
        let that = this;
        DataProcess.loadData().then(
            (data) => {
                that.particleSystem = new ParticleSystem(that.scene.context, data,
                    that.panel.getUserInput(), that.viewerParameters);
                that.addPrimitives(that.particleSystem);
                that.setupEventListeners(that.particleSystem);
                
                let lonRange = DataProcess.getPixelRange().lon; 
                let latRange = DataProcess.getPixelRange().lat;
                

                let heatmapProvider = new Cesium.SingleTileImageryProvider({
                    url: fileOptions.dataDirectory + fileOptions.imgDataHeatmap,
                    rectangle: Cesium.Rectangle.fromDegrees(lonRange[0], latRange[0], lonRange[1], latRange[1])
                })
                heatmapProvider.defaultAlpha = 0.6

                that.viewer.imageryLayers.addImageryProvider(heatmapProvider)

                that.camera.flyTo({
                    destination: Cesium.Rectangle.fromDegrees(lonRange[0], latRange[0], lonRange[1], latRange[1]),
                    orientation : {
                        heading : 0.0,
                        pitch : Cesium.Math.toRadians(-85.0),
                        roll : 0.0
                    }
                })

                if (mode.debug) {
                    that.debug();
                }
            });
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
                that.particleSystem.applyUserInput(that.panel.getUserInput());
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
        // window.addEventListener('layerOptionsChanged', function () {
        //     that.setGlobeLayer(that.panel.getUserInput());
        // });
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
