///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Interaction Management
//
///////////////////////////////////////////////////////////////////////////////

import * as parms from "./parms.js";
import { chkZeichen } from "./utils.js";

var idxColorDim = [];               // Index of Colors
var idxNameDm = new Map();
var idxNameStd = new Map();
var idxDmName = new Map();
var idxStdName = new Map();
var idxNames = new Map();
var idxNames0 = new Map();
var s_lName = "";
var m_fChar = new Map();
var l_colorDim = 0;
const color = d3.scaleSequential(d3.interpolateWarm); // Sinebow);


export function initIDX(NODES)
{
    idxColorDim = [];
    idxNameDm.clear();
    idxNameStd.clear();
    idxDmName.clear();
    idxStdName.clear();
    idxNames.clear();
    idxNames0.clear();

    m_fChar = fChar();

    NODES.forEach(buildColorDim);
    // set the colors for single first letters
    let alpha = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    alpha.forEach(function(_ch) {
        if (idxColorDim.indexOf(_ch) < 0) {
            idxColorDim.push(_ch);
        }
    });
    idxColorDim.sort();
    l_colorDim = idxColorDim.length;

    NODES.forEach(buildNames);

    parms.oSET("idxNameDm", idxNameDm);
    parms.oSET("idxNameStd", idxNameStd);
    parms.oSET("idxDmName", idxDmName);
    parms.oSET("idxStdName", idxStdName);
    parms.oSET("idxNames", idxNames);
    parms.oSET("idxNames0", idxNames0);
    // console.log("idxDmName", idxDmName);
    // console.log("idxColorDim", idxColorDim);
}

export function initIDXy(yNODES)
{
    idxNameDm.clear();
    idxNameStd.clear();
    idxDmName.clear();
    idxStdName.clear();
    idxNames.clear();
    idxNames0.clear();
    yNODES.forEach(buildNames);
    parms.oSET("idyNameDm", idxNameDm);
    parms.oSET("idyNameStd", idxNameStd);
    parms.oSET("idyDmName", idxDmName);
    parms.oSET("idyStdName", idxStdName);
    parms.oSET("idyNames", idxNames);
    parms.oSET("idyNames0", idxNames0);
}

export function swapIDX(_NLx)
{
    let renderer = parms.oGET("RENDERER");
    let linObj = renderer.instance;
    switch (_NLx) {
        case "NLy":
            let ynodes = linObj.yNODES;
            initIDXy(ynodes);
            break;
        default:
            idxNameDm.clear();
            idxNameStd.clear();
            idxDmName.clear();
            idxStdName.clear();
            idxNames.clear();
            idxNames0.clear();
            idxNameDm = parms.oGETmap("idxNameDm");
            idxNameStd = parms.oGETmap("idxNameStd");
            idxDmName = parms.oGETmap("idxDmName");
            idxStdName = parms.oGETmap("idxStdName");
            idxNames = parms.oGETmap("idxNames");
            idxNames0 = parms.oGETmap("idxNames0");
            break;
    }
}


function buildColorDim(n) {
    if (n.sortname != 0) {
        if (idxColorDim.indexOf(n.sortname) < 0) {
            idxColorDim.push(n.sortname);
        }
    }
}

function buildNames(n) {
    if (n.sn_scDM != 0) {
        if ( !idxNameDm.has(n.surname) ) {
            idxNameDm.set(n.surname, n.sn_scDM);
        }
        if (idxDmName.has(n.sn_scDM)) {
            let _names = idxDmName.get(n.sn_scDM);
            if (_names != null) {
                if (_names.indexOf(n.surname) < 0) {
                    _names += n.surname + ' ';
                    idxDmName.set(n.sn_scDM, _names);
                }
            } else {
                _names = n.surname + ' ';
                idxDmName.set(n.sn_scDM, _names);
            }
        } else {
            idxDmName.set(n.sn_scDM, n.surname);
        }
}
    if (n.sn_scR != 0) {
        if ( !idxNameStd.has(n.surname) ) {
            idxNameStd.set(n.surname, n.sn_scR);
        }
        if (idxStdName.has(n.sn_scR)) {
            let _names = idxStdName.get(n.sn_scR);
            if (_names != null) {
                if (_names.indexOf(n.surname) < 0) {
                    _names += n.surname + ' ';
                    idxStdName.set(n.sn_scR, _names);
                }
            } else {
                _names = n.surname + ' ';
                idxStdName.set(n.sn_scR, _names);
            }
        } else {
            idxStdName.set(n.sn_scR, n.surname);
        }
}
    if (idxNames.has(n.surname)) {
        let _ncnt = idxNames.get(n.surname) + 1;
        idxNames.set(n.surname, _ncnt);
    } else {
        idxNames.set(n.surname, 1);
    }

    if (n.surname) {
        if (n.surname != s_lName) {
            s_lName = n.surname;
            let sn0 = n.surname[0].toUpperCase();
            sn0 = m_fChar.get(sn0);
            if ( !idxNames0.has(sn0) ) {
                idxNames0.set(sn0, "");
            }
            let _in0 = idxNames0.get(sn0);
            let _sn = n.surname + ';';
            if (_in0.indexOf(_sn) < 0) {
                _in0 += _sn;
                idxNames0.set(sn0, _in0);
            }
        }
    }
}

export function getColor(_cname) {
    // input:   a kind-of-name
    // output:  corresponding color
    let i_colorDim = idxColorDim.indexOf(_cname);
    if (i_colorDim < 0) { 
        i_colorDim = 0; 
    } else { i_colorDim = i_colorDim / l_colorDim; }
    let t_color = color(i_colorDim);
    return t_color;
}

export function getNameDm(surname) {
    // input:   surname
    // output:  corresponding soundex-DaitchMotokoff | null
    if (idxNameDm.has(surname)) {
        return idxNameDm.get(surname);
    } else {
        return null;
    }
}

export function getNameStd(surname) {
    // input:   surname
    // output:  corresponding soundex-Russell | null
    if (idxNameStd.has(surname)) {
        return idxNameStd.get(surname);
    } else {
        return null;
    }
}

export function getNames0(sn0) {
    // input:   surname[0]
    // output:  corresponding surnames | null
    if (idxNames0.has(sn0)) {
        return idxNames0.get(sn0);
    } else {
        return null;
    }
}

function fChar() {
    let _chars = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    let _cM = new Map();
    _chars.forEach(function(_ch) {
        let _cha = chkZeichen(_ch);
        if (_cha.length == 1) {
            _cM.set(_cha, _ch);
        } else {
            for (let i = 1; i < _cha.length-1; i++) {
                _cM.set(_cha[i], _ch);
            }
        }
    });
    return _cM;
}