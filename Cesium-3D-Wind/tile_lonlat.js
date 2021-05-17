/**
 *
 * @param {*} tile {level, col, row}
 * @param {*} offset {x, y}  [0-255]
 */
function getMecartorTileLonlat(tile, offset) {
  const { level, col, row, size = 256 } = tile;
  const { x, y } = offset;
  const range = getMecartorTileRange(tile);
  const { xmin, xmax, ymin, ymax } = range;

  const mecatorX = xmin + ((xmax - xmin) * x) / size;
  const mecatorY = ymin + ((ymax - ymin) * y) / size;

  let lonlat = mecartoTolonlat(mecatorX, mecatorY);
  return lonlat;
}

function getMecartorTileRange(tile) {
  const { level, col, row } = tile;
  const MKT_LONG_RADIO = 20037508.34;
  const xRadio = MKT_LONG_RADIO;
  const yRadio = MKT_LONG_RADIO;
  const resolotion = (2 * xRadio) / Math.pow(2, level);

  let rect = { xmin: 0, xmax: 0, ymin: 0, ymax: 0 };

  rect.xmin = col * resolotion - xRadio;
  rect.xmax = (col + 1) * resolotion - xRadio;
  rect.ymin = yRadio - (row + 1) * resolotion;
  rect.ymax = yRadio - row * resolotion;

  return rect;
}

function mecartoTolonlat(x, y) {
  var dx = (x / 20037508.34) * 180;
  var dy = (y / 20037508.34) * 180;
  var M_PI = Math.PI;
  dy = (180 / M_PI) * (2 * Math.atan(Math.exp((dy * M_PI) / 180)) - M_PI / 2);

  return { lon: dx, lat: dy };
}


// 单元测试
/* let tile = { level: 0, col: 0, row: 1 };
let offset = { x: 127, y: 255 }; */

let tile = { level: 5, col: 26, row: 10 };
let offset = { x: 127, y: 255 };

let lonlat = getMecartorTileLonlat(tile, offset);
console.log("lonlat", lonlat);
