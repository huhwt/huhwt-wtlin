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

import * as parms from "./parms.js";
import * as uti from "./utils.js";

export const CLUSTERsA = [ "surName", "soundDM", "soundSTD" ];
export const CLUSTERsAt = { "surName": ["Nachname wird direkt übernommen", "Sn"],
                            "soundDM": ["Nachname umgesetzt gem. Soundex-DaitchMokotoff", "Dm"], 
                            "soundSTD": ["Nachname umgesetzt gem. Soundex-Russell", "Std"]
                          };

var cAmode = "soundDM";

export function getCLUSTERsA() {
    return this.CLUSTERsA[cAmode];
}

var Ycount = 11;        // rowcount
var Xcount = 17;        // colcount

export function initCLUSTERs(dmanObj) {
    function makeIDX(_key) {
        let idm_scXX = new Map();
        idm_scXX = parms.oGETmap(_key);
        let idx_scXX = [];
        idx_scXX = parms.oGETarr(_key);
        for ( let ia=0; ia < idx_scXX.length; ia++ ) {
            let xk = idx_scXX[ia];
            let xn = idm_scXX.get(xk);
            let xkn = "Z~z";
            if (xn) {
                xkn = xn[0].toUpperCase() + "~" + xk;
            }
            idx_scXX[ia] = xkn;
        }
        idx_scXX.sort();
        return idx_scXX;
    }

    function makeIDXarr(_key) {
        let idx_scXX = [];
        idx_scXX = parms.oGETarr(_key);
        for ( let ia=0; ia < idx_scXX.length; ia++ ) {
            let xk = idx_scXX[ia];
            let xkn = "Z~z";
            if (xk) {
                xkn = xk[0].toUpperCase() + "~" + xk;
            }
            idx_scXX[ia] = xkn;
        }
        idx_scXX.sort();
        return idx_scXX;
    }

    let idx_scDM = makeIDX("idxDmName");
    let idx_scR = makeIDX("idxStdName");
    let idx_surn = makeIDXarr("idxNames");

    let _count = Xcount * Ycount;
    if (_count < idx_scDM.length) {
        let _clh = uti.PZ_low_high(idx_scDM.length);
        Xcount = _clh.h;
        Ycount = _clh.l;
    }

    let Yspace = Math.round((dmanObj.height - 100) / Ycount) * 6;
    let Xspace = Math.round((dmanObj.width - 200) / Xcount) * 4;
    let vy0 = 0 - (Yspace * Ycount / 2);
    let vx0 = 0 - (Xspace * Xcount / 2);
    let clust_grid = [];
    let icg = 0;
    let vy = vy0;
    for (let iy=0; iy<=Ycount; iy++) {
        let vx = vx0;
        for (let ix=0; ix<=Xcount; ix++) {
            clust_grid[icg] = {x: vx, y: vy, cgInd: icg};
            icg++;
            vx += Xspace;
        }
        vy += Yspace;
    }

    dmanObj.clust_grid = { X0: vx0, Y0: vy0, Xcnt: Xcount, Ycnt: Ycount, Xd: Xspace, Yd: Yspace, cgInd: icg };

    let len_grid = Ycount * Xcount;         // overall number of positions

    var map_scDM = makeCLUSTxxx(idx_scDM, clust_grid, len_grid);
    var map_scR = makeCLUSTxxx(idx_scR, clust_grid, len_grid);
    var map_surn = makeCLUSTxxx(idx_surn, clust_grid, len_grid);

    parms.oSET("clustDmName", map_scDM);
    parms.oSET("clustStdName", map_scR);
    parms.oSET("clustNames", map_surn);

    let clustDmName = parms.oGETmap("clustDmName");
    console.log("initCLUSTERs->clustDmName", clustDmName);
    let clustStdName = parms.oGETmap("clustStdName");
    console.log("initCLUSTERs->clustStdName", clustStdName);
}

function makeCLUSTxxx(idx_XXX, clust_grid, len_grid) {
    let len_XXX = idx_XXX.length;         // lenght of array
    let mul_XXX = len_grid/len_XXX;       // multiplier for spreading the array index to overall index
    let out_XXX = new Map();
    for (let ix=0; ix<len_XXX; ix++) {
        let ic = Math.floor(ix*mul_XXX);
        let cxy = clust_grid[ic];
        let ikn = idx_XXX[ix];
        ikn = ikn.slice(2);
        out_XXX.set(ikn, cxy);
    }
    return out_XXX;
}

export function makeCLUSTERs(nodes, dmanObj) {
    let map_scDM = parms.oGETmap("clustDmName");
    let map_scR = parms.oGETmap("clustStdName");
    let map_surn = parms.oGETmap("clustNames");

    var clusters = new Map();

    nodes.forEach( function(n, i) {
        let sc = n.sn_scR;
        if(!clusters.has(sc)) {
            let pxy = map_scR.get(sc);
            if (pxy) 
                clusters.set(sc, pxy);
        }
    });
    nodes.forEach( function(n, i) {
        if(!clusters.has(n.surname)) {
            let pxy = map_surn.get(n.surname);
            if (pxy) 
                clusters.set(n.surname, pxy);
        }
    });
    nodes.forEach( function(n, i) {
        let sc = n.sn_scDM;
        if(!clusters.has(sc)) {
            let pxy = map_scDM.get(n.sn_scDM);
            if (pxy) {
                clusters.set(sc, pxy);
            } else {
                console.log(n, sc, n.sn_scDM);
            }
        }
    });

    return clusters;
}
