import requests
import subprocess
import os, sys
import string
from Naked.toolshed.shell import execute_js

GFS_DATE= "20210508" # 日期
GFS_TIME= "00" # 时间
RES= "1p00" # 分辨率
leftlon=0
rightlon=360
toplat=90
bottomlat=-90
BBOX= string.Template("leftlon=${leftlon}&rightlon=${rightlon}&toplat=${toplat}&bottomlat=${bottomlat}") # 范围
BBOX = BBOX.substitute(vars())
LEVEL= "lev_10_m_above_ground=on" # 数据层级
GFS_URL= string.Template("https://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_${RES}.pl?file=gfs.t${GFS_TIME}z.pgrb2.${RES}.f000&${LEVEL}&${BBOX}&dir=%2Fgfs.${GFS_DATE}%2F${GFS_TIME}%2Fatmos")
GFS_URL = GFS_URL.substitute(vars())
U_URL= string.Template("${GFS_URL}&var_UGRD=on")
U_URL = U_URL.substitute(vars())
V_URL= string.Template("${GFS_URL}&var_VGRD=on")
V_URL = V_URL.substitute(vars())

print("下载中" + U_URL)
r1 = requests.get(U_URL)
with open("utmp.grib",'wb') as f:
    f.write(r1.content)
r2 = requests.get(V_URL)
with open("vtmp.grib",'wb') as f:
    f.write(r2.content)

POWERSHELL_COMMAND = r'C:\WINDOWS\system32\WindowsPowerShell\v1.0\powershell.exe'

subprocess.Popen([POWERSHELL_COMMAND,
    '-ExecutionPolicy', 'Unrestricted',
    'grib_set', '-r -s packingType=grid_simple utmp.grib utmp.grib'],
    stdout = subprocess.PIPE,
    stderr = subprocess.PIPE)
subprocess.Popen([POWERSHELL_COMMAND,
    '-ExecutionPolicy', 'Unrestricted',
    'grib_set', '-r -s packingType=grid_simple vtmp.grib vtmp.grib'],
    stdout = subprocess.PIPE,
    stderr = subprocess.PIPE)

U_DUMP = os.popen('grib_dump -j utmp.grib').read()
V_DUMP = os.popen('grib_dump -j vtmp.grib').read()

print("解析中")

JSON = '{"u": ' + U_DUMP + ', "v": ' + V_DUMP + '}'

with open("tmp.json",'w') as f:
    f.write(JSON)
    
os.remove('./utmp.grib')
os.remove('./vtmp.grib')

args = GFS_DATE + GFS_TIME + ' ' + str(leftlon) + ' ' + str(rightlon) + ' ' + str(toplat) + ' ' + str(bottomlat)

execute_js('./prepare.js', args)

os.remove('./tmp.json')

print("解析完毕")