const PNG = require('pngjs').PNG;
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('tmp.json'));
const name = process.argv[2];
const leftlon = process.argv[3];
const rightlon = process.argv[4];
const toplat = process.argv[5];
const bottomlat = process.argv[6];
const oldU = data.u.messages[0];
const oldV = data.v.messages[0];

let u = {};
let v = {};

oldU.forEach(item => {
    u[item.key] = item.value
});

oldV.forEach(item => {
    v[item.key] = item.value
});

const width = u.Ni;
const height = u.Nj - 1;

const png = new PNG({
    colorType: 2,
    filterType: 4,
    width: width,
    height: height
});
const heatmap = new PNG({
    colorType: 2,
    filterType: 4,
    width: width,
    height: height
});

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const k = y * width + (x + width / 2) % width;
        let uvValue = Math.abs((u.values[k] + v.values[k]) / 2)
        let heatmapLegend = [
            [[0, 0.3], [30, 88, 154]],
            [[0.3, 0.6], [36, 116, 190]],
            [[0.6, 0.9], [42, 162, 170]],
            [[0.9, 1.2], [41, 162, 168]],
            [[1.2, 1.5], [42, 190, 119]],
            [[1.5, 1.8], [42,216,70]],
            [[1.8, 2.1], [108,227,49]],
            [[2.1, 3], [156,229,45]],
            [[3, 10], [241,234,40]],
            [[10, 20], [248,153,39]],
            [[20, 1000], [255,41,39]]
        ]
        let color = []
        heatmapLegend.forEach(map => {
            if(uvValue > map[0][0] && uvValue <= map[0][1]){
                color = map[1]
            }
        })
        heatmap.data[i + 0] = color[0];
        heatmap.data[i + 1] = color[1];
        heatmap.data[i + 2] = color[2];
        heatmap.data[i + 3] = 255;
    }
}
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const k = y * width + (x + width / 2) % width;
        png.data[i + 0] = Math.floor(255 * (u.values[k] - u.minimum) / (u.maximum - u.minimum)); // u: east-west
        png.data[i + 1] = Math.floor(255 * (v.values[k] - v.minimum) / (v.maximum - v.minimum)); // v: north-south
        png.data[i + 2] = 0;
        png.data[i + 3] = 255;
    }
}
png.pack().pipe(fs.createWriteStream(name + '.png'));
heatmap.pack().pipe(fs.createWriteStream(name + '-heatmap.png'));

fs.writeFileSync(name + '.json', JSON.stringify({
    source: 'http://nomads.ncep.noaa.gov',
    date: formatDate(u.dataDate + '', u.dataTime),
    width: width,
    height: height,
    leftlon: leftlon,
    rightlon: rightlon,
    toplat: toplat,
    bottomlat: bottomlat,
    uMin: u.minimum,
    uMax: u.maximum,
    vMin: v.minimum,
    vMax: v.maximum
}, null, 2) + '\n');

function formatDate(date, time) {
    return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2) + 'T' +
        (time < 10 ? '0' + time : time) + ':00Z';
}
