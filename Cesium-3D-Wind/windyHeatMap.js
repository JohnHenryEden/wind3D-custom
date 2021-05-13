var renderObj = null;
var JpgSource = null;
JpgSource = function () {
    this.url = "";
    this.status = "undefined";
    this.data = null;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.transformR = null;
    this.transformG = null;
    this.transformB = null;
}

var render = function () {
    var t = this;
    t.zoom2zoom = {
        ultra: [0, 0, 0, 2, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        high: [0, 0, 0, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        normal: [0, 0, 0, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        low: [0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
    },
        t.getTrans = function (e, n) {
            return t.tileW(e) / t.tileW(n)
        }
        ,
        t.tileW = function (e) {
            return Math.pow(2, e)
        }
        ;
    var n = Object.keys(t.zoom2zoom);
    t.getDataZoom = function (e, i) {
        var s = e.dataQuality;
        if (Number.isInteger(s))
            return Math.min(e.maxTileZoom, i - s);
        var a = e.upgradeDataQuality ? n[Math.max(n.indexOf(s) - 1, 0)] : s;
        return Math.min(e.maxTileZoom, t.zoom2zoom[a][i])
    }
        ,
        t.whichTile = function (e, n) {
            if (!n.fullPath)
                return null;
            var i = e.z
                , s = t.getDataZoom(n, i)
                , a = t.getTrans(i, s)
                , r = Math.floor(e.x / a)
                , o = Math.floor(e.y / a)
                , l = e.x % a
                , c = e.y % a
                , d = n.fullPath.replace("<z>", s).replace("<y>", o).replace("<x>", r)
                , u = t.tileW(s);
            return r < 0 || o < 0 || r >= u || o >= u ? null : {
                url: d,
                x: r,
                y: o,
                z: s,
                intX: l,
                intY: c,
                trans: a,
                transformR: n.transformR || null,
                transformG: n.transformG || null,
                transformB: n.transformB || null
            }
        },
        t.testJPGtransparency = function (e, t) {
            return 192 & e[t + 2] || 192 & e[t + 6] || 192 & e[t + 1030] || 192 & e[t + 1034]
        }
        ,
        t.testPNGtransparency = function (e, t) {
            return !(e[t + 3] && e[t + 7] && e[t + 1028 + 3] && e[t + 1028 + 7])
        }
        ,
        t.wTables = {},
        t.getWTable = function (e) {
            if (e in t.wTables)
                return t.wTables[e];
            var n, i, s, a = 0;
            if (!(e <= 32))
                return null;
            for (n = new Uint16Array(4 * e * e),
                s = 0; s < e; s++)
                for (i = 0; i < e; i++)
                    n[a++] = (e - s) * (e - i),
                        n[a++] = (e - s) * i,
                        n[a++] = s * (e - i),
                        n[a++] = i * s;
            return t.wTables[e] = n,
                n
        }
        ,
        t.createCombinedFillFun = function (e, n, i, s) {
            var a = n.colors
                , r = i.colors
                , o = n.value2index.bind(n)
                , l = i.value2index.bind(i)
                , c = t.createFillFun(e, 2, n)
                , d = t.createFillFun(e, 2, i)
                , u = function (t, n, i, s) {
                    e[t] = n,
                        e[t + 1] = i,
                        e[t + 2] = s
                };
            return function (e, t, n, i) {
                var h = s(n, i);
                if (!(h < 0 || h > 4)) {
                    if (0 === h)
                        return c(e, t, n);
                    if (4 === h)
                        return d(e, t, i);
                    var f = (t << 8) + e << 2
                        , m = o(n)
                        , p = l(i)
                        , v = a[m++]
                        , g = a[m++]
                        , y = a[m++]
                        , w = r[p++]
                        , b = r[p++]
                        , T = r[p++];
                    switch (h) {
                        case 1:
                            u(f, w, b, T),
                                u(f + 4, v, g, y),
                                u(f + 1024, v, g, y),
                                u(f + 1028, v, g, y);
                            break;
                        case 2:
                            u(f, w, b, T),
                                u(f + 4, w, b, T),
                                u(f + 1024, v, g, y),
                                u(f + 1028, v, g, y);
                            break;
                        case 3:
                            u(f, w, b, T),
                                u(f + 4, w, b, T),
                                u(f + 1024, w, b, T),
                                u(f + 1028, v, g, y)
                    }
                }
            }
        }
        ,
        t.createFillFun = function (e, t, n) {
            var i = currentsColors
                , s = function (t) {
                    return isNaN(t) ? 1024 : Math.max(0, Math.min(1020, (t - 0) / 0.015625 << 2))
                    // return 1024
                };
            switch (t) {
                case 1:
                    return function (t, n, a) {
                        var r = (n << 8) + t << 2
                            , o = s(a);
                        e[r++] = i[o++],
                            e[r++] = i[o++],
                            e[r] = i[o]
                    }
                        ;
                case 2:
                    return function (t, n, a) {
                        var r = (n << 8) + t << 2
                            , o = s(a)
                            , l = i[o++]
                            , c = i[o++]
                            , d = i[o];
                        e[r] = e[r + 4] = l,
                            e[r + 1] = e[r + 5] = c,
                            e[r + 2] = e[r + 6] = d,
                            e[r += 1024] = e[r + 4] = l,
                            e[r + 1] = e[r + 5] = c,
                            e[r + 2] = e[r + 6] = d
                    }
            }
        }
        ;
    var i = document.createElement("canvas")
        , s = i.getContext("2d");
    return i.width = i.height = 256,
        s.fillStyle = "black",
        s.fillRect(0, 0, 256, 256),
        t.canvas = i,
        t.imgData = s.getImageData(0, 0, 256, 256),
        t.interpolateNearest = function (e, t, n, i, s, a, r, o, l, c) {
            null !== e && (r = e[t],
                o = e[t + 1],
                l = e[t + 2],
                c = e[t + 3]);
            var d = Math.max(r, o, l, c);
            return d === r ? n : d === o ? i : d === l ? s : d === c ? a : void 0
        }
        ,
        t
}

var today = new Date();
var year = today.getFullYear();
var month = (today.getMonth() + 1) >= 10 ? today.getMonth() + 1 : "0" + (today.getMonth() + 1)
var forcastDay = today.getDate() >= 10 ? today.getDate() : "0" + today.getDate()
// 预报日期
var forcastDate = year + "" + month + "" + forcastDay;
//初始化从预报时间点后1个小时开始
var nextHourtip = 1; 
// 预报时间点，开始预报时间点为，晚上20点后1个小时，UTC12点=中国晚上20点
var forcastHour = (12 + nextHourtip);
// 洋流预报数据解析参数
var oceanHeatMapParams = {
    JPGtransparency: true,
    PNGtransparency: false,
    acTime: forcastDate + forcastHour, // 预报时间，晚上20点后一小时一个预报，预报3天后数据,传参用UTC时间(比中国时间少8个小时)
    dataQuality: "normal",
    directory: "forecast/cmems",
    fileSuffix: "jpg",
    filename: "seacurrents",
    // fullPath: "https://ims.windy.com/im/v3.0/forecast/cmems/2021051112/2021051113/wm_grid_257/<z>/<x>/<y>/seacurrents-surface.jpg",
    fullPath: "https://ims.windy.com/im/v3.0/{directory}/{refTime}/{acTime}/wm_grid_257/<z>/<x>/<y>/seacurrents-surface.jpg",
    hasMoreLevels: false,
    imVersion: 3,
    isolines: "off",
    layer: "currents",
    level: "surface",
    maxTileZoom: 3,
    overlay: "currents",
    path: "2021042607",
    product: "cmems",
    refTime: forcastDate + "12", // 预报开始时间,中国时间第二天的晚上20点,传参用UTC时间(比中国时间少8个小时)
    renderFrom: "RG",
    sea: true,
    server: "https://ims.windy.com",
    transformB: null,
    transformG: null,
    transformR: null,
    upgradeDataQuality: false,
}

// 预报小时数计数器，最大72小时
var hourCount = 1;
// 预报天数计数器
var dayNum = 0;
// 定时器每3s切换一次从当天晚上21点到3天后晚上20点之间每小时的洋流预报热力图
// var startPlayForcast = setInterval(function () {
//     hourCount++
//     forcastHour = forcastHour + 1
//     // 计算预报天数，0-23点为一天时长，超过23点进入下一天0点
//     dayNum = dayNum + parseInt(forcastHour / 24)
//     if (parseInt(forcastHour / 24) >= 1) {
//         // 当时间点到了晚上23点后，时间点应变为第二天0点开始
//         forcastDay = (today.getDate() + dayNum) >= 10 ? today.getDate() + dayNum : "0" + (today.getDate() + dayNum)
//         forcastHour = 0;
//     }
//     if (hourCount > 72) {
//         // 完成3天预报后，重新从当天晚上21点循环进行预报
//         hourCount = 1;
//         dayNum = 0;
//         forcastDay = (today.getDate() + dayNum) >= 10 ? today.getDate() + dayNum : "0" + (today.getDate() + dayNum)
//     }
//     // 预报时间点完整年月日
//     forcastDate = year + "" + month + "" + forcastDay
//     let forcastHourStr = forcastHour >= 10 ? forcastHour : "0" + forcastHour
//     oceanHeatMapParams.acTime = forcastDate + forcastHourStr;
//     wind3D.setOceanWindyData();
// }, 3000)

// 定时器每10s清除一次旧的洋流热力图图层
var clearOldOceanWindyLayer = setInterval(function () {
    wind3D.clearOldOceanWindyLayer()
}, 10000)


var caculateRender = new render();
// 计算生成windy 洋流热力图 的jpg 数据源的zxy
function caculateOriginTile(z, x, y) {
    var witchTile = caculateRender.whichTile({ z: z, x: x, y: y }, oceanHeatMapParams);
    return witchTile;
}

// 解析windy jpg到热力图canvas的过程
function loadWindySource(heatMapCanvas, c, zxy) {
    var heatTileUrl = "";
    renderObj = new render();
    var witchTile = renderObj.whichTile({ z: zxy.z, x: zxy.x, y: zxy.y }, oceanHeatMapParams);
    var parseSoure = new JpgSource();
    parseSoure.status = "loading";
    var l = heatMapCanvas.getContext("2d");
    var n = l.getImageData(0, 0, c.width, c.height);
    parseSoure.data = n.data;
    var i = function (e, t) {
        var n, i, s, a, r = new ArrayBuffer(28), o = new Uint8Array(r), l = new Float32Array(r), c = 4 * t * 4 + 8;
        for (a = 0; a < 28; a++)
            n = e[c],
                i = e[c + 1],
                s = e[c + 2],
                n = Math.round(n / 64),
                i = Math.round(i / 16),
                s = Math.round(s / 64),
                o[a] = (n << 6) + (i << 2) + s,
                c += 16;
        return l
    }(parseSoure.data, 257)
        , s = i[0]
        , r = (i[1] - i[0]) / 255
        , d = i[2]
        , u = (i[3] - i[2]) / 255
        , h = i[4]
        , f = (i[5] - i[4]) / 255;
    parseSoure.decodeR = parseSoure.transformR ? function (t) {
        return parseSoure.transformR(t * r + s)
    }
        : function (e) {
            return e * r + s
        }
        ,
        parseSoure.decodeG = parseSoure.transformG ? function (t) {
            return parseSoure.transformG(t * u + d)
        }
            : function (e) {
                return e * u + d
            }
        ,
        parseSoure.decodeB = parseSoure.transformB ? function (t) {
            return e.transformB(t * f + h)
        }
            : function (e) {
                return e * f + h
            }
        ,
        a = 0;
    var resultHeatCanvas = transformSoureToHeatMap(parseSoure, witchTile);
    return resultHeatCanvas;
}

/**
 * jpg imagedata解析热力图canvas
 * @param {*} r 解析jpg数据源imagedata 
 * @param {*} a 转化热力图切片参数对象witchTile
 * @returns canvas
 */
function transformSoureToHeatMap(r, a) {
    var n = 2;
    var o, l = oceanHeatMapParams, c = l.isMultiColor, d = r.data, h = renderObj.imgData.data;
    "png" === l.fileSuffix ? l.PNGtransparency && (o = renderObj.testPNGtransparency) : l.JPGtransparency && (o = renderObj.testJPGtransparency);
    var f, m, p, v, g, y, w, b, T, S, L, E, A = !1, M = 0 | a.trans, P = 0 | Math.log2(M), C = 0 | Math.log2(M * M), _ = 0 | a.intX, x = 0 | a.intY, R = 256 >> P, D = renderObj.getWTable(M), O = 0, N = 0, I = _ * R | 0, k = x * R | 0, U = 0, F = 0, H = 256, G = 0, z = 0, B = 0, V = 0, j = 0, q = 0, Y = 0, Z = 0, X = 0, Q = 0, $ = 0, J = null, K = "B" === l.renderFrom, ee = "RG" === l.renderFrom, te = r.decodeR, ne = r.decodeG;
    for (c ? (T = renderObj.createCombinedFillFun(h, null, null, null),
        S = renderObj.createFillFun(h, n, null)) : T = S = renderObj.createFillFun(h, n, null),
        K && (te = r.decodeB),
        E = 0; E < 256; E += n)
        for (B = E - ((F = E >> P) << P),
            L = 0; L < 256; L += n)
            z = L - ((U = L >> P) << P),
                H !== U && (N = 2056 + U + I + (((G = F + k) << 8) + G) << 2,
                    void 0 !== o && (A = o(d, N)),
                    !0 === K && (N += 2),
                    V = d[N],
                    j = d[N + 4],
                    q = d[N + 1028],
                    Y = d[N + 1032],
                    !0 === ee && (Z = d[N + 1],
                        X = d[N + 5],
                        Q = d[N + 1029],
                        $ = d[N + 1033]),
                    H = U),
                A ? S(L, E, NaN) : (w = te(null !== D ? V * D[O = z + (B << P) << 2] + j * D[O + 1] + q * D[O + 2] + Y * D[O + 3] >> C : V * (f = (1 - (g = z / M)) * (1 - (y = B / M))) + j * (m = g * (1 - y)) + q * (p = y * (1 - g)) + Y * (v = g * y)),
                    !0 === ee && (b = ne(null !== D ? Z * D[O] + X * D[O + 1] + Q * D[O + 2] + $ * D[O + 3] >> C : Z * f + X * m + Q * p + $ * v)),
                    c ? T(L, E, w, b) : T(L, E, ee ? Math.sqrt(w * w + b * b) : w));

    var resultCavas = renderObj.canvas;
    resultContext = resultCavas.getContext("2d");
    resultContext.putImageData(renderObj.imgData, 0, 0);
    return resultCavas;
}
