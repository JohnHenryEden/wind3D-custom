
var currentsColors = {
    "0": 64,
    "1": 77,
    "2": 144,
    "3": 255,
    "4": 53,
    "5": 84,
    "6": 143,
    "7": 255,
    "8": 49,
    "9": 97,
    "10": 144,
    "11": 255,
    "12": 49,
    "13": 112,
    "14": 144,
    "15": 255,
    "16": 51,
    "17": 123,
    "18": 140,
    "19": 255,
    "20": 55,
    "21": 123,
    "22": 125,
    "23": 255,
    "24": 61,
    "25": 121,
    "26": 110,
    "27": 255,
    "28": 60,
    "29": 124,
    "30": 93,
    "31": 255,
    "32": 55,
    "33": 129,
    "34": 75,
    "35": 255,
    "36": 52,
    "37": 132,
    "38": 59,
    "39": 255,
    "40": 50,
    "41": 135,
    "42": 50,
    "43": 255,
    "44": 50,
    "45": 137,
    "46": 50,
    "47": 255,
    "48": 50,
    "49": 140,
    "50": 50,
    "51": 255,
    "52": 52,
    "53": 142,
    "54": 49,
    "55": 255,
    "56": 63,
    "57": 143,
    "58": 44,
    "59": 255,
    "60": 77,
    "61": 143,
    "62": 40,
    "63": 255,
    "64": 93,
    "65": 141,
    "66": 37,
    "67": 255,
    "68": 109,
    "69": 139,
    "70": 38,
    "71": 255,
    "72": 126,
    "73": 136,
    "74": 42,
    "75": 255,
    "76": 140,
    "77": 133,
    "78": 49,
    "79": 255,
    "80": 143,
    "81": 130,
    "82": 50,
    "83": 255,
    "84": 143,
    "85": 127,
    "86": 50,
    "87": 255,
    "88": 143,
    "89": 124,
    "90": 50,
    "91": 255,
    "92": 143,
    "93": 121,
    "94": 50,
    "95": 255,
    "96": 143,
    "97": 118,
    "98": 50,
    "99": 255,
    "100": 143,
    "101": 115,
    "102": 50,
    "103": 255,
    "104": 142,
    "105": 111,
    "106": 50,
    "107": 255,
    "108": 141,
    "109": 105,
    "110": 51,
    "111": 255,
    "112": 139,
    "113": 100,
    "114": 53,
    "115": 255,
    "116": 137,
    "117": 94,
    "118": 54,
    "119": 255,
    "120": 135,
    "121": 88,
    "122": 56,
    "123": 255,
    "124": 133,
    "125": 83,
    "126": 59,
    "127": 255,
    "128": 131,
    "129": 77,
    "130": 61,
    "131": 255,
    "132": 129,
    "133": 73,
    "134": 62,
    "135": 255,
    "136": 127,
    "137": 68,
    "138": 63,
    "139": 255,
    "140": 125,
    "141": 64,
    "142": 64,
    "143": 255,
    "144": 122,
    "145": 60,
    "146": 65,
    "147": 255,
    "148": 120,
    "149": 56,
    "150": 67,
    "151": 255,
    "152": 117,
    "153": 52,
    "154": 68,
    "155": 255,
    "156": 118,
    "157": 50,
    "158": 72,
    "159": 255,
    "160": 123,
    "161": 50,
    "162": 77,
    "163": 255,
    "164": 127,
    "165": 50,
    "166": 83,
    "167": 255,
    "168": 131,
    "169": 50,
    "170": 89,
    "171": 255,
    "172": 135,
    "173": 50,
    "174": 94,
    "175": 255,
    "176": 139,
    "177": 50,
    "178": 100,
    "179": 255,
    "180": 142,
    "181": 51,
    "182": 105,
    "183": 255,
    "184": 138,
    "185": 52,
    "186": 110,
    "187": 255,
    "188": 133,
    "189": 55,
    "190": 116,
    "191": 255,
    "192": 127,
    "193": 57,
    "194": 121,
    "195": 255,
    "196": 121,
    "197": 60,
    "198": 125,
    "199": 255,
    "200": 114,
    "201": 63,
    "202": 129,
    "203": 255,
    "204": 107,
    "205": 67,
    "206": 131,
    "207": 255,
    "208": 100,
    "209": 68,
    "210": 132,
    "211": 255,
    "212": 92,
    "213": 69,
    "214": 133,
    "215": 255,
    "216": 84,
    "217": 70,
    "218": 132,
    "219": 255,
    "220": 78,
    "221": 75,
    "222": 134,
    "223": 255,
    "224": 72,
    "225": 84,
    "226": 135,
    "227": 255,
    "228": 67,
    "229": 93,
    "230": 133,
    "231": 255,
    "232": 66,
    "233": 100,
    "234": 132,
    "235": 255,
    "236": 67,
    "237": 104,
    "238": 132,
    "239": 255,
    "240": 68,
    "241": 108,
    "242": 132,
    "243": 255,
    "244": 69,
    "245": 111,
    "246": 132,
    "247": 255,
    "248": 70,
    "249": 115,
    "250": 132,
    "251": 255,
    "252": 72,
    "253": 119,
    "254": 132,
    "255": 255,
    "256": 73,
    "257": 122,
    "258": 132,
    "259": 255,
    "260": 75,
    "261": 123,
    "262": 132,
    "263": 255,
    "264": 78,
    "265": 124,
    "266": 132,
    "267": 255,
    "268": 80,
    "269": 124,
    "270": 133,
    "271": 255,
    "272": 82,
    "273": 125,
    "274": 133,
    "275": 255,
    "276": 84,
    "277": 126,
    "278": 133,
    "279": 255,
    "280": 86,
    "281": 126,
    "282": 134,
    "283": 255,
    "284": 89,
    "285": 127,
    "286": 134,
    "287": 255,
    "288": 91,
    "289": 128,
    "290": 135,
    "291": 255,
    "292": 93,
    "293": 128,
    "294": 135,
    "295": 255,
    "296": 95,
    "297": 129,
    "298": 135,
    "299": 255,
    "300": 97,
    "301": 130,
    "302": 136,
    "303": 255,
    "304": 100,
    "305": 130,
    "306": 136,
    "307": 255,
    "308": 102,
    "309": 131,
    "310": 136,
    "311": 255,
    "312": 104,
    "313": 132,
    "314": 137,
    "315": 255,
    "316": 106,
    "317": 132,
    "318": 137,
    "319": 255,
    "320": 108,
    "321": 133,
    "322": 138,
    "323": 255,
    "324": 111,
    "325": 134,
    "326": 138,
    "327": 255,
    "328": 113,
    "329": 134,
    "330": 138,
    "331": 255,
    "332": 115,
    "333": 135,
    "334": 139,
    "335": 255,
    "336": 117,
    "337": 136,
    "338": 139,
    "339": 255,
    "340": 119,
    "341": 136,
    "342": 139,
    "343": 255,
    "344": 122,
    "345": 137,
    "346": 140,
    "347": 255,
    "348": 124,
    "349": 138,
    "350": 140,
    "351": 255,
    "352": 126,
    "353": 138,
    "354": 141,
    "355": 255,
    "356": 128,
    "357": 139,
    "358": 141,
    "359": 255,
    "360": 130,
    "361": 140,
    "362": 141,
    "363": 255,
    "364": 133,
    "365": 140,
    "366": 142,
    "367": 255,
    "368": 135,
    "369": 141,
    "370": 142,
    "371": 255,
    "372": 137,
    "373": 142,
    "374": 142,
    "375": 255,
    "376": 139,
    "377": 142,
    "378": 143,
    "379": 255,
    "380": 141,
    "381": 143,
    "382": 143,
    "383": 255,
    "384": 144,
    "385": 144,
    "386": 144,
    "387": 255,
    "388": 144,
    "389": 144,
    "390": 144,
    "391": 255,
    "392": 144,
    "393": 144,
    "394": 144,
    "395": 255,
    "396": 144,
    "397": 144,
    "398": 144,
    "399": 255,
    "400": 144,
    "401": 144,
    "402": 144,
    "403": 255,
    "404": 144,
    "405": 144,
    "406": 144,
    "407": 255,
    "408": 144,
    "409": 144,
    "410": 144,
    "411": 255,
    "412": 144,
    "413": 144,
    "414": 144,
    "415": 255,
    "416": 144,
    "417": 144,
    "418": 144,
    "419": 255,
    "420": 144,
    "421": 144,
    "422": 144,
    "423": 255,
    "424": 144,
    "425": 144,
    "426": 144,
    "427": 255,
    "428": 144,
    "429": 144,
    "430": 144,
    "431": 255,
    "432": 144,
    "433": 144,
    "434": 144,
    "435": 255,
    "436": 144,
    "437": 144,
    "438": 144,
    "439": 255,
    "440": 144,
    "441": 144,
    "442": 144,
    "443": 255,
    "444": 144,
    "445": 144,
    "446": 144,
    "447": 255,
    "448": 144,
    "449": 144,
    "450": 144,
    "451": 255,
    "452": 144,
    "453": 144,
    "454": 144,
    "455": 255,
    "456": 144,
    "457": 144,
    "458": 144,
    "459": 255,
    "460": 144,
    "461": 144,
    "462": 144,
    "463": 255,
    "464": 144,
    "465": 144,
    "466": 144,
    "467": 255,
    "468": 144,
    "469": 144,
    "470": 144,
    "471": 255,
    "472": 144,
    "473": 144,
    "474": 144,
    "475": 255,
    "476": 144,
    "477": 144,
    "478": 144,
    "479": 255,
    "480": 144,
    "481": 144,
    "482": 144,
    "483": 255,
    "484": 144,
    "485": 144,
    "486": 144,
    "487": 255,
    "488": 144,
    "489": 144,
    "490": 144,
    "491": 255,
    "492": 144,
    "493": 144,
    "494": 144,
    "495": 255,
    "496": 144,
    "497": 144,
    "498": 144,
    "499": 255,
    "500": 144,
    "501": 144,
    "502": 144,
    "503": 255,
    "504": 144,
    "505": 144,
    "506": 144,
    "507": 255,
    "508": 144,
    "509": 144,
    "510": 144,
    "511": 255,
    "512": 144,
    "513": 144,
    "514": 144,
    "515": 255,
    "516": 144,
    "517": 144,
    "518": 144,
    "519": 255,
    "520": 144,
    "521": 144,
    "522": 144,
    "523": 255,
    "524": 144,
    "525": 144,
    "526": 144,
    "527": 255,
    "528": 144,
    "529": 144,
    "530": 144,
    "531": 255,
    "532": 144,
    "533": 144,
    "534": 144,
    "535": 255,
    "536": 144,
    "537": 144,
    "538": 144,
    "539": 255,
    "540": 144,
    "541": 144,
    "542": 144,
    "543": 255,
    "544": 144,
    "545": 144,
    "546": 144,
    "547": 255,
    "548": 144,
    "549": 144,
    "550": 144,
    "551": 255,
    "552": 144,
    "553": 144,
    "554": 144,
    "555": 255,
    "556": 144,
    "557": 144,
    "558": 144,
    "559": 255,
    "560": 144,
    "561": 144,
    "562": 144,
    "563": 255,
    "564": 144,
    "565": 144,
    "566": 144,
    "567": 255,
    "568": 144,
    "569": 144,
    "570": 144,
    "571": 255,
    "572": 144,
    "573": 144,
    "574": 144,
    "575": 255,
    "576": 144,
    "577": 144,
    "578": 144,
    "579": 255,
    "580": 144,
    "581": 144,
    "582": 144,
    "583": 255,
    "584": 144,
    "585": 144,
    "586": 144,
    "587": 255,
    "588": 144,
    "589": 144,
    "590": 144,
    "591": 255,
    "592": 144,
    "593": 144,
    "594": 144,
    "595": 255,
    "596": 144,
    "597": 144,
    "598": 144,
    "599": 255,
    "600": 144,
    "601": 144,
    "602": 144,
    "603": 255,
    "604": 144,
    "605": 144,
    "606": 144,
    "607": 255,
    "608": 144,
    "609": 144,
    "610": 144,
    "611": 255,
    "612": 144,
    "613": 144,
    "614": 144,
    "615": 255,
    "616": 144,
    "617": 144,
    "618": 144,
    "619": 255,
    "620": 144,
    "621": 144,
    "622": 144,
    "623": 255,
    "624": 144,
    "625": 144,
    "626": 144,
    "627": 255,
    "628": 144,
    "629": 144,
    "630": 144,
    "631": 255,
    "632": 144,
    "633": 144,
    "634": 144,
    "635": 255,
    "636": 144,
    "637": 144,
    "638": 144,
    "639": 255,
    "640": 144,
    "641": 144,
    "642": 144,
    "643": 255,
    "644": 144,
    "645": 144,
    "646": 144,
    "647": 255,
    "648": 144,
    "649": 144,
    "650": 144,
    "651": 255,
    "652": 144,
    "653": 144,
    "654": 144,
    "655": 255,
    "656": 144,
    "657": 144,
    "658": 144,
    "659": 255,
    "660": 144,
    "661": 144,
    "662": 144,
    "663": 255,
    "664": 144,
    "665": 144,
    "666": 144,
    "667": 255,
    "668": 144,
    "669": 144,
    "670": 144,
    "671": 255,
    "672": 144,
    "673": 144,
    "674": 144,
    "675": 255,
    "676": 144,
    "677": 144,
    "678": 144,
    "679": 255,
    "680": 144,
    "681": 144,
    "682": 144,
    "683": 255,
    "684": 144,
    "685": 144,
    "686": 144,
    "687": 255,
    "688": 144,
    "689": 144,
    "690": 144,
    "691": 255,
    "692": 144,
    "693": 144,
    "694": 144,
    "695": 255,
    "696": 144,
    "697": 144,
    "698": 144,
    "699": 255,
    "700": 144,
    "701": 144,
    "702": 144,
    "703": 255,
    "704": 144,
    "705": 144,
    "706": 144,
    "707": 255,
    "708": 144,
    "709": 144,
    "710": 144,
    "711": 255,
    "712": 144,
    "713": 144,
    "714": 144,
    "715": 255,
    "716": 144,
    "717": 144,
    "718": 144,
    "719": 255,
    "720": 144,
    "721": 144,
    "722": 144,
    "723": 255,
    "724": 144,
    "725": 144,
    "726": 144,
    "727": 255,
    "728": 144,
    "729": 144,
    "730": 144,
    "731": 255,
    "732": 144,
    "733": 144,
    "734": 144,
    "735": 255,
    "736": 144,
    "737": 144,
    "738": 144,
    "739": 255,
    "740": 144,
    "741": 144,
    "742": 144,
    "743": 255,
    "744": 144,
    "745": 144,
    "746": 144,
    "747": 255,
    "748": 144,
    "749": 144,
    "750": 144,
    "751": 255,
    "752": 144,
    "753": 144,
    "754": 144,
    "755": 255,
    "756": 144,
    "757": 144,
    "758": 144,
    "759": 255,
    "760": 144,
    "761": 144,
    "762": 144,
    "763": 255,
    "764": 144,
    "765": 144,
    "766": 144,
    "767": 255,
    "768": 144,
    "769": 144,
    "770": 144,
    "771": 255,
    "772": 144,
    "773": 144,
    "774": 144,
    "775": 255,
    "776": 144,
    "777": 144,
    "778": 144,
    "779": 255,
    "780": 144,
    "781": 144,
    "782": 144,
    "783": 255,
    "784": 144,
    "785": 144,
    "786": 144,
    "787": 255,
    "788": 144,
    "789": 144,
    "790": 144,
    "791": 255,
    "792": 144,
    "793": 144,
    "794": 144,
    "795": 255,
    "796": 144,
    "797": 144,
    "798": 144,
    "799": 255,
    "800": 144,
    "801": 144,
    "802": 144,
    "803": 255,
    "804": 144,
    "805": 144,
    "806": 144,
    "807": 255,
    "808": 144,
    "809": 144,
    "810": 144,
    "811": 255,
    "812": 144,
    "813": 144,
    "814": 144,
    "815": 255,
    "816": 144,
    "817": 144,
    "818": 144,
    "819": 255,
    "820": 144,
    "821": 144,
    "822": 144,
    "823": 255,
    "824": 144,
    "825": 144,
    "826": 144,
    "827": 255,
    "828": 144,
    "829": 144,
    "830": 144,
    "831": 255,
    "832": 144,
    "833": 144,
    "834": 144,
    "835": 255,
    "836": 144,
    "837": 144,
    "838": 144,
    "839": 255,
    "840": 144,
    "841": 144,
    "842": 144,
    "843": 255,
    "844": 144,
    "845": 144,
    "846": 144,
    "847": 255,
    "848": 144,
    "849": 144,
    "850": 144,
    "851": 255,
    "852": 144,
    "853": 144,
    "854": 144,
    "855": 255,
    "856": 144,
    "857": 144,
    "858": 144,
    "859": 255,
    "860": 144,
    "861": 144,
    "862": 144,
    "863": 255,
    "864": 144,
    "865": 144,
    "866": 144,
    "867": 255,
    "868": 144,
    "869": 144,
    "870": 144,
    "871": 255,
    "872": 144,
    "873": 144,
    "874": 144,
    "875": 255,
    "876": 144,
    "877": 144,
    "878": 144,
    "879": 255,
    "880": 144,
    "881": 144,
    "882": 144,
    "883": 255,
    "884": 144,
    "885": 144,
    "886": 144,
    "887": 255,
    "888": 144,
    "889": 144,
    "890": 144,
    "891": 255,
    "892": 144,
    "893": 144,
    "894": 144,
    "895": 255,
    "896": 144,
    "897": 144,
    "898": 144,
    "899": 255,
    "900": 144,
    "901": 144,
    "902": 144,
    "903": 255,
    "904": 144,
    "905": 144,
    "906": 144,
    "907": 255,
    "908": 144,
    "909": 144,
    "910": 144,
    "911": 255,
    "912": 144,
    "913": 144,
    "914": 144,
    "915": 255,
    "916": 144,
    "917": 144,
    "918": 144,
    "919": 255,
    "920": 144,
    "921": 144,
    "922": 144,
    "923": 255,
    "924": 144,
    "925": 144,
    "926": 144,
    "927": 255,
    "928": 144,
    "929": 144,
    "930": 144,
    "931": 255,
    "932": 144,
    "933": 144,
    "934": 144,
    "935": 255,
    "936": 144,
    "937": 144,
    "938": 144,
    "939": 255,
    "940": 144,
    "941": 144,
    "942": 144,
    "943": 255,
    "944": 144,
    "945": 144,
    "946": 144,
    "947": 255,
    "948": 144,
    "949": 144,
    "950": 144,
    "951": 255,
    "952": 144,
    "953": 144,
    "954": 144,
    "955": 255,
    "956": 144,
    "957": 144,
    "958": 144,
    "959": 255,
    "960": 144,
    "961": 144,
    "962": 144,
    "963": 255,
    "964": 144,
    "965": 144,
    "966": 144,
    "967": 255,
    "968": 144,
    "969": 144,
    "970": 144,
    "971": 255,
    "972": 144,
    "973": 144,
    "974": 144,
    "975": 255,
    "976": 144,
    "977": 144,
    "978": 144,
    "979": 255,
    "980": 144,
    "981": 144,
    "982": 144,
    "983": 255,
    "984": 144,
    "985": 144,
    "986": 144,
    "987": 255,
    "988": 144,
    "989": 144,
    "990": 144,
    "991": 255,
    "992": 144,
    "993": 144,
    "994": 144,
    "995": 255,
    "996": 144,
    "997": 144,
    "998": 144,
    "999": 255,
    "1000": 144,
    "1001": 144,
    "1002": 144,
    "1003": 255,
    "1004": 144,
    "1005": 144,
    "1006": 144,
    "1007": 255,
    "1008": 144,
    "1009": 144,
    "1010": 144,
    "1011": 255,
    "1012": 144,
    "1013": 144,
    "1014": 144,
    "1015": 255,
    "1016": 144,
    "1017": 144,
    "1018": 144,
    "1019": 255,
    "1020": 144,
    "1021": 144,
    "1022": 144,
    "1023": 255,
    "1024": 128,
    "1025": 128,
    "1026": 128,
    "1027": 255
  }