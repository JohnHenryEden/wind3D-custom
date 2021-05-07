# 基于Cesium的windy风场可视化, 包含数据获取
### 基于3D-Wind-Field [Demo](https://raymanng.github.io/3D-Wind-Field/demo/)修改

## Q&A
### 如何启动demo?
为Cesium-3D-Wind下的index.html创建一个服务器，可以用anywhere，express等。

### 如何下载数据?
在windows平台中，使用data/gfsdata文件夹下的download.py文件，需要anaconda3环境和[eccodes插件](https://perillaroc.github.io/eccodes-tutorial-cn/)。执行完毕后正常会生成一个uv图数据，一个json元数据和一个热力图数据。热力图暂时无用。

### 对Windy切片数据的处理
我对原生Cesium做了修改，支持对每张UrlTemplateImageryProvider获取的图像进行处理，代码中有示例，可以全文搜索一下找到位置。

## 原有项目的Credits
This demo makes use of below repos:
- [3D-Wind-Field Demo](https://raymanng.github.io/3D-Wind-Field/demo/)
- [CesiumJS](https://github.com/AnalyticalGraphicsInc/cesium)
- [Spector.js](https://github.com/BabylonJS/Spector.js)
- [netcdfjs](https://github.com/cheminfo-js/netcdfjs)
- A good Cesium [tutorial](https://github.com/cesiumlab/cesium-custom-primitive).

This demo makes use of TDS server of [NOAA GFS](https://www.ncdc.noaa.gov/data-access/model-data/model-datasets/global-forcast-system-gfs) for WMS layer display
