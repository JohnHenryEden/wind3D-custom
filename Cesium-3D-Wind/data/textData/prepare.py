import os, sys
import scipy
import math
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.interpolate import griddata
import numpy.ma as ma
import png
from PIL import Image

req_date = "2021-02-24 08:00:00"
lon = []
lat = []
u = []
v = []
dateTime = ""
print("数据解析中")
for line in open("./ocean_flow.txt"): 
    data = line.split(",")
    if(data[6] == req_date):
        lon.append(float(data[0]))
        lat.append(float(data[1]))
        u.append(float(data[2]))
        v.append(float(data[3]))
        dateTime = data[8]


leftLon = min(lon)
rightLon = max(lon)
topLat = max(lat)
bottomLat = min(lat)
minU = min(u)
maxU = max(u)
minV = min(v)
maxV = max(v)


def interp2d_station_to_grid(lon,lat,data,loc_range = [18,54,73,135],
                             det_grid = 1 ,method = 'cubic'):
    '''
    func : 将站点数据插值到等经纬度格点
    inputs:
        lon: 站点的经度
        lat: 站点的纬度
        data: 对应经纬度站点的 气象要素值
        loc_range: [lat_min,lat_max,lon_min,lon_max]。站点数据插值到loc_range这个范围
        det_grid: 插值形成的网格空间分辨率
        method: 所选插值方法，默认 0.125
    return:
        
        [lon_grid,lat_grid,data_grid]
    '''
    #step1: 先将 lon,lat,data转换成 n*1 的array数组
    lon = np.array(lon).reshape(-1,1)
    lat = np.array(lat).reshape(-1,1)
    data = np.array(data).reshape(-1,1)
    
    #shape = [n,2]
    points = np.concatenate([lon,lat],axis = 1)
    
    #step2:确定插值区域的经纬度网格
    lat_min = loc_range[0]
    lat_max = loc_range[1]
    lon_min = loc_range[2]
    lon_max = loc_range[3]
    
    lon_grid, lat_grid = np.meshgrid(np.arange(lon_min,lon_max+det_grid,det_grid), 
                       np.arange(lat_min,lat_max+det_grid,det_grid))
    
    #step3:进行网格插值
    grid_data = griddata(points,data,(lon_grid,lat_grid),method = method)
    grid_data = grid_data[:,:,0]
    
    #保证纬度从上到下是递减的
    if lat_grid[0,0]<lat_grid[1,0]:
        lat_grid = lat_grid[-1::-1]
        grid_data = grid_data[-1::-1]
    
    return [lon_grid,lat_grid,grid_data]

ugrid = interp2d_station_to_grid(lon, lat, u, [bottomLat, topLat, leftLon, rightLon], 0.01)
vgrid = interp2d_station_to_grid(lon, lat, v, [bottomLat, topLat, leftLon, rightLon], 0.01)
ugrid = ugrid[2]
vgrid = vgrid[2]
uvImage = []
heatImage = []
height = len(ugrid)
width = len(ugrid[0])
for i in range(len(ugrid)):
    uvImage.append([])
    heatImage.append([])
    for j in range(len(ugrid[i])):
        pixel = [0, 0, 0, 255]
        heatPixel = [0, 0, 0, 255]
        u = ugrid[i][j]
        v = vgrid[i][j]
        if(math.isnan(u) and math.isnan(v)):
            pixel[2] = 255
            heatPixel[3] = 0
            for color in pixel:
                uvImage[i].append(color)
            for color in heatPixel:
                heatImage[i].append(color)
        else:
            pixel[0] = int(255 * ((u - minU) / (maxU - minU)))
            pixel[1] = int(255 * ((v - minV) / (maxV - minV)))

            dataMeasure = math.sqrt(math.pow(pixel[0], 2) + pow(pixel[1], 2))

            if(dataMeasure < 160):
                heatPixel[0] = 98
                heatPixel[1] = 113
                heatPixel[2] = 184
            if(dataMeasure >= 160 and dataMeasure < 170):
                heatPixel[0] = 66
                heatPixel[1] = 110
                heatPixel[2] = 166
            if(dataMeasure >= 170 and dataMeasure < 180):
                heatPixel[0] = 69
                heatPixel[1] = 134
                heatPixel[2] = 167
            if(dataMeasure >= 180 and dataMeasure < 190):
                heatPixel[0] = 76
                heatPixel[1] = 145
                heatPixel[2] = 137
            if(dataMeasure >= 190 and dataMeasure < 200):
                heatPixel[0] = 78
                heatPixel[1] = 146
                heatPixel[2] = 117
            if(dataMeasure >= 200 and dataMeasure < 210):
                heatPixel[0] = 76
                heatPixel[1] = 160
                heatPixel[2] = 86
            if(dataMeasure >= 210 and dataMeasure < 220):
                heatPixel[0] = 94
                heatPixel[1] = 164
                heatPixel[2] = 62
            if(dataMeasure >= 220 and dataMeasure < 230):
                heatPixel[0] = 116
                heatPixel[1] = 159
                heatPixel[2] = 56
            if(dataMeasure >= 230 and dataMeasure < 240):
                heatPixel[0] = 141
                heatPixel[1] = 63
                heatPixel[2] = 93
            if(dataMeasure >= 240 and dataMeasure < 250):
                heatPixel[0] = 94
                heatPixel[1] = 112
                heatPixel[2] = 160
            if(dataMeasure >= 250):
                heatPixel[0] = 91
                heatPixel[1] = 136
                heatPixel[2] = 161

            if(pixel[0] > 255):
                pixel[0] = 255
            if(pixel[0] < 0):
                pixel[0] = 0
            if(pixel[1] > 255):
                pixel[1] = 255
            if(pixel[1] < 0):
                pixel[1] = 0
            pixel[2] = 0
            for color in pixel:
                uvImage[i].append(color)
            for color in heatPixel:
                heatImage[i].append(color)
png.from_array(uvImage, 'RGBA').save("ocean_flow.png")
png.from_array(heatImage, 'RGBA').save("ocean_flow_heat.png")
map_coast = Image.open('map_transparent.png')
data_png = Image.open('ocean_flow.png')
heat_png = Image.open('ocean_flow_heat.png')
data_png.paste(map_coast, (0, 0), map_coast)
heat_png.paste(map_coast, (0, 0), map_coast)
data_png.save('ocean_flow.png')
heat_png.save('ocean_flow_heat.png')
# 蓝色替换透明
i = 1
j = 1
heat_img = Image.open('ocean_flow_heat.png')
width = heat_img.size[0]#长度
height = heat_img.size[1]#宽度
for i in range(0,width):#遍历所有长度的点
  for j in range(0,height):#遍历所有宽度的点
   data = (heat_img.getpixel((i,j)))#打印该图片的所有点
   if (data[0] < 45 and data[2] >= 50):
     heat_img.putpixel((i,j),(0,0,0,0))
heat_img.save('ocean_flow_heat.png')#保存修改像素点后的图片

meta = {
    "leftlon": leftLon,
    "rightlon": rightLon,
    "toplat": topLat,
    "bottomlat": bottomLat,
    "uMin": minU,
    "uMax": maxU,
    "vMin": minV,
    "vMax": maxV,
    "width": width,
    "height": height,
    "date": dateTime
}

print(meta)

with open('ocean_flow.json', 'w', encoding='utf-8') as f:
    json.dump(meta, f, ensure_ascii=False, indent=4)