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

export const CLUSTERsA = [ "surName", "soundDM", "soundSTD" ];
export const CLUSTERsAt = { "surName": "Nachname wird direkt übernommen",
                            "soundDM": "Nachname umgesetzt gem. Soundex-DaitchMokotoff", 
                            "soundSTD": "Nachname umgesetzt gem. Soundex-Russell"
                          };

var cAmode = "soundDM";

export function getCLUSTERsA() {
    return this.CLUSTERsA[cAmode];
}

var CLUSTER_COL_SPACING = 10;
var CLUSTER_ROW_SPACING = 40;

var Ycount = 11;        // rowcount
var Xcount = 17;        // colcount

export function initCLUSTERs(dmanObj) {
    let idx_scDM = [];
    idx_scDM = parms.oGETarr("idxDmName");
    idx_scDM.sort();
    let idx_scR = [];
    idx_scR = parms.oGETarr("idxStdName");
    idx_scR.sort();
    let idx_surn = [];
    idx_surn = parms.oGETarr("idxNames");
    idx_surn.sort();

    let Yspace = Math.round((dmanObj.height - 100) / Ycount) * 3;
    let Xspace = Math.round((dmanObj.width - 200) / Xcount) * 3;
    let vy0 = 0 - (Yspace * Ycount / 2);
    let vx0 = 0 - (Xspace * Xcount / 2);
    let clust_grid = [];
    let icg = 0;
    let vy = vy0;
    for (let iy=0; iy<Ycount; iy++) {
        let vx = vx0;
        for (let ix=0; ix<Xcount; ix++) {
            clust_grid[icg] = {x: vx, y: vy, cgInd: icg};
            icg++;
            vx += Xspace;
        }
        vy += Yspace;
    }

    dmanObj.clust_grid = { X0: vx0, Y0: vy0, Xcnt: Xcount, Ycnt: Ycount, Xd: Xspace, Yd: Yspace };

    let len_grid = Ycount * Xcount;         // overall number of positions

    var map_scDM = makeCLUSTxxx(idx_scDM, clust_grid, len_grid);
    var map_scR = makeCLUSTxxx(idx_scR, clust_grid, len_grid);
    var map_surn = makeCLUSTxxx(idx_surn, clust_grid, len_grid);

    parms.oSET("clustDmName", map_scDM);
    parms.oSET("clustStdName", map_scR);
    parms.oSET("clustNames", map_surn);
}

function makeCLUSTxxx(idx_XXX, clust_grid, len_grid) {
    let len_XXX = idx_XXX.length;         // lenght of array
    let mul_XXX = len_grid/len_XXX;       // multiplier for spreading the array index to overall index
    let out_XXX = new Map();
    for (let ix=0; ix<len_XXX; ix++) {
        let ic = Math.floor(ix*mul_XXX);
        let cxy = clust_grid[ic];
        out_XXX.set(idx_XXX[ix], cxy);
    }
    return out_XXX;
}

export function makeCLUSTERs(nodes, dmanObj) {
    let map_scDM = parms.oGETmap("clustDmName");
    let map_scR = parms.oGETmap("clustStdName");
    let map_surn = parms.oGETmap("clustNames");

    let clusters = [];

    nodes.forEach( function(n, i) {
        let sc = 'D' + n.sn_scDM;
        if(clusters[sc] == null) {
            let pxy = map_scDM.get(n.sn_scDM);
            clusters[sc] = pxy;
        }
    });
    nodes.forEach( function(n, i) {
        let sc = 'S' + n.sn_scR;
        if(clusters[sc] == null) {
            let pxy = map_scR.get(n.sn_scR);
            clusters[sc] = pxy;
        }
    });
    nodes.forEach( function(n, i) {
        if(clusters[n.surname] == null) {
            let pxy = map_surn.get(n.surname);
            clusters[n.surname] = pxy;
        }
    });

    return clusters;
}
