const { once } = require('events');
const PNG = require('pngjs').PNG;
const turf = require('@turf/turf');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('./data/textData/ocean_flow.txt'),
      crlfDelay: Infinity
    });

    let lon = []
    let lat = []
    let u = []
    let v = []
    let uFeature = []
    let vFeature = []
    let dateTime = null
    rl.on('line', (line) => {
        // 处理行。
        let lineData = line.split(',')
        dateTime = lineData[8]
        lon.push(parseFloat(lineData[0]))
        lat.push(parseFloat(lineData[1]))
        u.push(parseFloat(lineData[2]))
        v.push(parseFloat(lineData[3]))
        uFeature.push(turf.point([parseFloat(lineData[0]), parseFloat(lineData[1])], {u: parseFloat(lineData[2])}))
        vFeature.push(turf.point([parseFloat(lineData[0]), parseFloat(lineData[1])], {v: parseFloat(lineData[3])}))
    });
    await once(rl, 'close');
    
    uFeature = turf.featureCollection(uFeature)
    vFeature = turf.featureCollection(vFeature)

    let ugrid = turf.interpolate(uFeature, 0.1, {gridType: 'triangle'})
    let vgrid = turf.interpolate(vFeature, 0.1, {gridType: 'triangle'})

    debugger
    // fs.writeFileSync('ocean_flow.json', JSON.stringify(meta, null, 2) + '\n');
    console.log('文件已处理');
  } catch (err) {
    console.error(err);
  }
})();