///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Parameters Management
//
///////////////////////////////////////////////////////////////////////////////

export const InterpolationType = {'MIN': 1, 'AVG': 2, 'MAX': 3};
export const Sex = {'MALE': 1, 'FEMALE': 2};
export const Mode = [ 'TREE', 'TIME', 'CLUSTER'];
export const LINloop_Speed = [ 2400, 1600, 1000, 600, 400];   // -> lPARMS oploopspeed
// -> lPARMS viewboxdim
//          lfd   X-0    Y-0  Width Height
export const VIEW_PORT_DIMS = {
    '2x2': ['1', -1000, -533, 2000, 2000],
    '4x4': ['2', -2000, -1066, 4000, 4000],
    '6x6': ['3', -3000, -1600, 6000, 6000],
    '9x9': ['4', -4500, -2400, 9000, 9000],
    '12x12': ['5', -6000, -3200, 12000, 12000]
};
export const ZOOMfactor = 1.1486983549970351;

const NODE_RADIUS = 10;

/**
 *  Parameter-Array - basic Parameters
 */
const PARMSarr = [
    // LIN-Menu
    [ "SHOW_LINmenu", true],
    // SLIDERtimeline
    [ "SHOW_TLslider", true],
    // Load File
    [ "FILENAME" , ""],
    [ "SOURCE_FILE" , ""],
    // Save
    // Interaction
    [ "ENERGIZE" , true],
    [ "USE_MOUSEOVER" , false],
    [ "SHOW_YEARVALUES" , false],
    [ "SHOW_TOOLTIPS" , true],
    [ "TOOLTIP_DRAG_OPACITY" , 0.5],

    // Force Simulation -- Force-Layout parameters
    [ "GRAVITY_X" , 0.06],
    [ "GRAVITY_Y" , 0.06],
    [ "GRAVITY_X_x" , 0.08],
    [ "GRAVITY_Y_x" , 0.08],
    [ "REPULSION_STRENGTH_T" , 400],
    [ "REPULSION_STRENGTH_x" , 10],
    [ "LINK_STRENGTH" , 0.8],
    [ "LINK_STRENGTH_TL" , 0.1],
    [ "SF_STRENGTH" , 0],
    [ "FRICTION" , 0.4],

    // Graph appearance
    [ "SHOW_GRAPH" , true],
    [ "SHOW_LINKS" , true],
    [ "SHOW_NAMES" , true],
    [ "LINK_WIDTH" , 2],
    [ "NODE_RADIUS" , NODE_RADIUS],
    [ "PERSON_LABEL_OPACITY" , 0.7],
    [ "PERSON_LABELS_BELOW_NODE" , true],   // internal use only
    [ "PERSON_LABELS_BELOW_DIST", 12],

    // Map appearance
    [ "SHOW_CONTOURS" , false],
    [ "REVERSE_COLORMAP" , false],
    [ "INTERPOLATE_NN" , false],
    [ "EMBED_LINKS" , true],
    [ "SHOW_TUNNELS" , true],
    [ "SHADING" , true],
    [ "SCALARFIELD_DILATION_ITERS" , 2],
    [ "RANGE_MIN" , 0],                     // minimum value
    [ "RANGE_MAX" , 10],                    // maximum value
    [ "CONTOUR_STEP" , 10],                 // value range between contours
    [ "CONTOUR_BIG_STEP" , 50],             // value range between thick contours
    [ "INDICATOR_FONTSIZE" , 15],
    [ "INDICATOR_EPSILON" , 0.1],           // internal use only
    [ "HEIGHT_SCALE" , 50],
    [ "SCALARFIELD_RESOLUTION" , 400],
    [ "LINK_SAMPLE_STEPSIZE" , 2],
    [ "UNDERGROUND_THRESHOLD" , 10],

    // Others

    [ "ALPHA_T" , 1.0],                       // internal use only
    [ "ALPHA_x" , 0.5],                       // internal use only
    [ "SF_INTERPOLATION_TYPE" , InterpolationType.MIN],

    [ "FONT_SIZE" , 20],
    [ "NAME_SIZE" , 12],
    [ "LINK_DISTANCE" , 8 * NODE_RADIUS],
    [ "LINK_OPACITY" , 1],
    [ "ARROW_RADIUS" , 14],
    [ "LABEL_COLOR" , "black"],
    [ "LINK_COLOR" , "black"],

    // Scalarfield Appearance
    [ "RENDER_UPDATE_INTERVAL" , 2],        // number of simulation updates before updating the tick visualization
    [ "ARROW_DISTANCE_FACTOR" , 1.0],

    // Contour Map Appearance 
    [ "CONTOUR_WIDTH" , 0.5],               // pixel width of small contours

    // Others
    [ "MANY_SEEDS" , true],

    [ "ACTIVE_LOCALE" , "de"],
    [ "PROCREATION_AGE" , 25],
    [ "STATE", ""],

    [ "MODE", "TREE"],                      // active mode
    [ "STORE_MODE", "TREE"],                // only this mode may be stored

    [ "YEAR", 0],                           // actual year
    [ "YEARs", 0],                          // start year
    [ "YEARe", 0],                          // end year
    [ "YEARsO", 0],                         // start year OriginalData
    [ "YEAReO", 0],                         // end year OriginalData
    [ "YEARdelta", 0],                      // count year up/down
    [ "actYear", 0],                        // holds YEAR in case of exporting/importing data
];

const PARMS = new Map(PARMSarr);

/**
 * Parameter-Array - Object parameters -> not serializable objects
 */
const oPARMSarr = [
    // Scalarfield Appearance
    [ "COLORMAP" , d3.interpolateGnBu],
    // Nodes Appearance
    [ "NODES_COLORMAP" , d3.interpolateRainbow],
    // Others
    [ "RENDERER" , Object]
];

const oPARMS = new Map(oPARMSarr);

/**
 * Parameter-Array - LINEAGE filters 
 */
const lPARMSarr = [
    // show CLUSTERsAt
    [ "doShow_cA", false ],
    // show names_list
    [ "doShow_nl", false ],
    // index FILTERa
    [ "fAind", 0],
    // cbfilterAny - true: Auch Teile eines Namens werden erkannt - false: surname komplett
    [ "cbfilterAny", false],
    // cbfilterSpouse - true: mit Partnern - false: nur gem. Namens-Filter
    [ "cbfilterSpouse", false],
    // oploopspeed - 0.. ..4 - 2400...1600...1000...600...400 - d3.interval LINloop_Speed
    [ "oploopspeed", 4],
    // viewboxdim - 0.. ..4 - 2x2...4x4...6x6...8x8...10x10 - viewport dimensions
    [ "viewboxdim", '6x6']
];

const lPARMS = new Map(lPARMSarr);

// Zielpositionen für H-Diagramm - 5 Vorfahren-Generationen
export const H_shift = [
    [ 0, 0],                                   // -dummy-
    [ 0, 0],                                   // kek  1          gen 0
    [-4, 0.0],[ 4, 0.0],                       // kek  2- 3       gen 1
    [-4,-2.7],[-4, 2.7],[ 4,-2.7],[ 4, 2.7],   // kek  4- 7       gen 2
    [-6,-3.0],[-2,-3.0],[-2, 3.0],[-6, 3.0],   // kek  8-11       gen 3
    [ 2,-3.0],[ 6,-3.0],[ 2, 3.0],[ 6, 3.0],   // kek 12-15       ...
    [-6,-4.0],[-6,-2.0],[-2,-4.0],[-2,-2.0],   // kek 16-19       gen 4
    [-2, 4.0],[-2, 2.0],[-6, 2.0],[-6, 4.0],   // kek 20-23       ...
    [ 2,-4.0],[ 2,-2.0],[ 6,-4-0],[ 6,-2.0],   // kek 24-27       ...
    [ 2, 4.0],[ 2, 2.0],[ 6, 4.0],[ 6, 2.0],   // kek 28-31       ...
    [-7,-4.6],[-5,-4.4],[-7,-1.4],[-5,-1.6],   // kek 32-35       gen 5
    [-3,-4.6],[-1,-4.4],[-1,-1.4],[-3,-1.6],   // kek 36-39       ...
    [-3, 4.6],[-1, 4.4],[-3, 1.6],[-1, 1.4],   // kek 40-43       ...
    [-7, 1.6],[-5, 1.4],[-7, 4.6],[-5, 4.4],   // kek 44-47       ...
    [ 1,-4.6],[ 3,-4.4],[ 1,-1.4],[ 3,-1.6],   // kek 48-51       ...
    [ 5,-4.6],[ 7,-4.4],[ 5,-1.6],[ 7,-1.4],   // kek 52-55       ...
    [ 1, 4.6],[ 3, 4.4],[ 1, 1.6],[ 3, 1.4],   // kek 56-59       ...
    [ 5, 4.6],[ 7, 4.4],[ 5, 1.6],[ 7, 1.4],   // kek 60-63       ...
   ];
// Multiplikator Spreizung H-Diagramm
export const H_faktor = 120;
// Referenz Vorfahren-Generationen
export const H_gen = 5;

export function GET(key) {
    if (PARMS.has(key)) {
        return PARMS.get(key);
    } else if (oPARMS.has(key)) {
        return oPARMS.get(key);
    }
    return null;
}
export function SET(key, value) {
    PARMS.set(key, value);
}
export function TEST(key) {
    return PARMS.has(key);
}

export function oGETmap(key) {
    let _obj = oGET(key);
    if (_obj instanceof Map) { return _obj; }

    let _map = new Map();
    if ( _obj ) _map = new Map(Object.entries(_obj));
    return _map;
}

export function oGETarr(key) {
    let _obj = oGET(key);
    if (_obj instanceof Array) { return _obj; }

    let _arr = [];
    if ( _obj ) _arr = [..._obj.keys()];
    return _arr;
}

export function oGET(key) {
    if (oPARMS.has(key)) {
        return oPARMS.get(key);
    } else {
        return null;
    }
}
export function oSET(key, value) {
    oPARMS.set(key, value);
}

export function lGET(key) {
    if (lPARMS.has(key)) {
        return lPARMS.get(key);
    } else {
        return null;
    }
}
export function lSET(key, value) {
    lPARMS.set(key, value);
}

export function delPARMS(pTYPE, key) {
    switch (pTYPE) {
        case "lPARMS":
            lPARMS.delete(key);
            break;
        case "oPARMS":
            oPARMS.delete(key);
            break;
        default:
            PARMS.delete(key);
            break;
        }
}

export function TOGGLE(key) {
    if (PARMS.has(key)) {
        let boolV = PARMS.get(key);
        PARMS.set(key, !boolV);
    } else {
        let boolV = lPARMS.get(key);
        lPARMS.set(key, !boolV);
    }
}

export function GETall() {
    return PARMS;
}

var PyearMod = false;
var PdataMod = false;
var PfilterMod = false;

export function yearMod(val=null) {
    if (val !== null) {
        // if (val != PyearMod) { console.log("yearMod ", PyearMod, "->", val); }
        PyearMod = val;
    }
    return PyearMod;
}
export function dataMod(val=null) {
    if (val !== null) {
        // if (val != PdataMod) { console.log("dataMod ", PdataMod, "->", val); }
        PdataMod = val;
    }
    return PdataMod;
}
export function filterMod(val=null) {
    if (val !== null) {
        // if (val != PfilterMod) { console.log("filterMod ", PfilterMod, "->", val); }
        PfilterMod = val;
    }
    return PfilterMod;
}

export const tickLengthCheck = { 'XXL': 2000, 'XL': 1000, 'L': 400, 'M': 100, 'min': 0};
export const tickCounterCheck = { 'XXL': 50, 'XL': 20, 'L': 10, 'M': 4, 'min': 2};
export const tickCountCycles = { 'XXL': 1, 'XL': 1, 'L': 1, 'M': 1, 'min': 1};

export function testTickLevel(_nLength) {
    let _tLevel = checkTickLevel(_nLength);
    SET("RENDERER_UPDATE_LEVEL", _tLevel.pref);
    let _tCount = getTickCount(_tLevel.pref);
    SET("RENDER_UPDATE_INTERVAL", _tCount);
    let _tickParms = {
        tLevelP : _tLevel.pref,
        tLevelV : _tLevel.val,
        tCount : _tCount.check,
        tCval : _tCount.val,
        tCycles: _tCount.cyc
    };
    return _tickParms;
}
/**
 * set tickcounter-Level depending on NODE.length - 'XXL' for large NODE-sets, 'min' is default
 */
function checkTickLevel(_nLength) {
    if ( _nLength >= tickLengthCheck.XXL )
        return { pref: 'XXL', val: tickLengthCheck.XXL };
    if ( _nLength >= tickLengthCheck.XL )
        return { pref: 'XL', val: tickLengthCheck.XL };
    if ( _nLength >= tickLengthCheck.L )
        return { pref: 'L', val: tickLengthCheck.L };
    if ( _nLength >= tickLengthCheck.M )
        return { pref: 'M', val: tickLengthCheck.M };

    return { pref: 'min', val: tickLengthCheck.min };
}
/**
 * gives the tickcounter-value for correspondig tickcounter-level
 */
export function getTickCount(_nTc) {
    switch (_nTc)
    {
        case 'min':
            return { check: tickCounterCheck.min, val: tickLengthCheck.min, cyc: tickCountCycles.min };
        case 'M':
            return { check: tickCounterCheck.M, val: tickLengthCheck.M, cyc: tickCountCycles.M };
        case 'L':
            return { check: tickCounterCheck.L, val: tickLengthCheck.L, cyc: tickCountCycles.L };
        case 'XL':
            return { check: tickCounterCheck.XL, val: tickLengthCheck.XL, cyc: tickCountCycles.XL };
        case 'XXL':
            return { check: tickCounterCheck.XXL, val: tickLengthCheck.XXL, cyc: tickCountCycles.XXL };
        default:
            return { check: tickCounterCheck.min, val: tickLengthCheck.min, cyc: tickCountCycles.min };
        }
}
export function TClevel_down(_nTc) {
    switch (_nTc)
    {
        case 'min':
            return 'min';
        case 'M':
            return 'min';
        case 'L':
            return 'M';
        case 'XL':
            return 'L';
        case 'XXL':
            return 'XL';
        default:
            return 'min';
        }
}
