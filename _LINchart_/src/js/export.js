///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Interface Management - Exports
//
///////////////////////////////////////////////////////////////////////////////

// import { TFMRenderer } from "./TFMrenderer.js";
// import { TAMRenderer } from "./TAMrenderer.js";
import { initMenubar } from "./interaction.js";
// import { default as i18n } from "./i18n.js";
import * as parms from "./parms.js";
import { timestamp } from './utils.js';
import { putDB } from "./dbman.js";

const LINEAGE_DESCRIPTION = "LINEAGE - Genealogic Force Diagram";

var downloadableFile = null;

export function createDownloadSVG(svgText, filename)
{
    const data = new Blob([svgText], { type: 'image/svg+xml' });
    const a = document.createElement('a');

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (downloadableFile !== null)
        window.URL.revokeObjectURL(downloadableFile);
    downloadableFile = URL.createObjectURL(data);

    a.href = downloadableFile;
    a.download = filename;
    a.click();
}


///////////////////////////////////////////////////////////////////////////////

export function createDownloadFromBlob(blob, filename)
{
    const a = document.createElement('a');
    a.download = filename;
    a.href = URL.createObjectURL(blob);

    // revoke URL after 60s to free memory
    setTimeout(() => URL.revokeObjectURL(a.href), 60000);
    setTimeout(() => a.click(), 0);
}


// Remove unnecessary values from data before export.
// This is "replacing function" for JSON.stringify().
export function removeInternalValuesFromJSON(key, value)
{
    switch (key)
    {
        case "source":
        case "target":
            return value.id; // don't include the whole node object, only the id

        case "index":
        case "distance":
        case "r":
        case "vx":
        case "vy":
        case "fx":
        case "fy":
        case "labelwidth":
            return undefined; // ignore

        default:
            return value;
    }
}


export function getParameters()
{
    let _mapParms = parms.GETall();                     // get all parms as Map
                                                        // because of this won't be imbedded in output:
    let _objParms = Object.fromEntries(_mapParms);      // ... change it to an object
    let _retParms = {};
    _retParms = Object.assign(_retParms, _objParms);    // ... imbed the object's properties 
    return _retParms;                                   // this kind of presentation will work in output
}

export function dumpGRAPH(_GRAPH)
{
    let _mapP = _GRAPH.persons;
    let _mapF = _GRAPH.families;

    let _objP = Object.fromEntries(_mapP);
    let _retP = {};
    _retP = Object.assign(_retP, _objP);

    let _objF = Object.fromEntries(_mapF);
    let _retF = {};
    _retF = Object.assign(_retF, _objF);

    return [_retP, _retF];
}

// Input: object with key/value pairs, e.g.
// { "PARAM_1" : true, "Param_2" : 42, ...}
export function load_tamParameters(params)
{
    for (const [key, value] of Object.entries(params))
    {

        let _key = key;
        if (_key.startsWith('PARAM_', 0)) {
            _key = _key.slice(6);
        }
        if (parms.TEST(_key)) {
            switch (_key)
            {
                case "USE_MOUSEOVER":
                    parms.SET("USE_MOUSEOVER", false); // deactivate interactive features by default
                    break;
                case "SHOW_YEARVALUES":
                    parms.SET("SHOW_YEARVALUES", false); // deactivate interactive features by default
                    break;
                case "SHOW_GRAPH":
                    parms.SET("SHOW_GRAPH", true); // always show graph on default
                    break;
                default:
                    parms.SET(_key, value);
            }
        } else {
            // ("Unknown parameter", key, ":", value);
            console.log(i18n("U_parm", { pk: key, pv: value } ));
        }
    }

    initMenubar(); // update visuals based on parameter values
}

// Let's earmark the data
export function getMetadata(_ext='')
{
    let metadata =
    {
        "exportedBy" : LINEAGE_DESCRIPTION + _ext,
        "version" : d3.select("#version").text()
    };

    return metadata;
}

export function dump_Htree(d) {
    let _nodes = [];
    let _links = [];
    let _stop = new Map();
    let _gen = 0;
    let _lfd = 0;
    let _kek = 1;
    let _h_faktor = parms.H_faktor;
    let _h_gen = parms.H_gen;
    d.sr = 2;
    loop_d(d, _nodes, _links, 'r', _gen, _kek);
    function loop_d(d, _nodes, _links, _tag, _gen, _kek) {
        if ( _stop.has(d.id) ) {
            return;
        }
        _stop.set(d.id, d.id);
        let _dx = d.x;
        let _dy = d.y;
        let _dfixed = false;
        if ( _gen <= _h_gen ) {
           [ _dx, _dy, _dfixed ] = fix_d(_kek);
        }
        _nodes.push({
            "id": d.id,
            "name": d.givenname + ' /' + d.surname.toUpperCase() + '/ K-' + _kek,
            "gname": d.givenname, 
            "sname": d.surname.toUpperCase(), 
            "value": d.Yvalue, 
            "sex": d.sex, 
            "valued": d.valued, 
            "x": _dx, 
            "y": _dy, 
            "fixed": _dfixed, 
            "cr": d.cr, 
            "r": d.r * d.sr, 
            "bdate": d.bdate,
            "ddate": d.ddate,
            "gen": _gen,
            "tag": _tag,
            "lfd": _lfd,
            "kek": _kek
            });
        _lfd += 1;
        let _kekp = 2 * _kek;
        let _dparentFam = d.parentFamily;
        if ( _dparentFam ) {
            let _dfather = _dparentFam.husband;
            let _dmother = _dparentFam.wife;
            if ( _dfather ) {
                _links.push({
                    "source": _dfather.id,
                    "target": d.id,
                    "directed": true
                });
                _gen += 1;
                if (_gen <= _h_gen) {
                    loop_d(_dfather, _nodes, _links, 'f', _gen, _kekp);
                }
                _gen -= 1;
            }
            if ( _dmother ) {
                _links.push({
                    "source": _dmother.id,
                    "target": d.id,
                    "directed": true
                });
                _gen += 1;
                if (_gen <= _h_gen) {
                    loop_d(_dmother, _nodes, _links, 'm', _gen, (_kekp + 1));
                }
                _gen -= 1;
            }
        }
    }
    function fix_d(_kek) {
        let _dx = 0;
        let _dy = 0;
        let _dfixed = true;
        if (_kek > 1) {
            let _dxy = parms.H_shift[_kek];
            _dx = _dxy[0] * _h_faktor;
            _dy = _dxy[1] * _h_faktor;
        }
        return [ _dx, _dy, _dfixed ];
    }
    let content = [JSON.stringify(
        {
            "metadata": getMetadata(' - H-Tree'),
            "parameters": getParameters(),
            "nodes": _nodes,
            "links": _links
        },
        null, 2)];
    let blob = new Blob(content, { type: "text/json" });
    let _fileName = parms.GET("FILENAME");
    let filenameWithoutSuffix = _fileName.slice(0, _fileName.lastIndexOf('.'));

    let _primID = d.id;
    // createDownloadFromBlob(blob, filenameWithoutSuffix + "_H-" + _primID + ".tam");

    let _primName = d.givenname + '/' + d.surname + '/';
    let idb_key = _primName + "-" + _primID;
    let dataset = 
        {   "H_tree": [
                {
                    "storeID": idb_key,
                    "primID": _primID,
                    "timestamp": timestamp(),
                    "metadata": getMetadata(' - H-Tree'),
                    "parameters": getParameters(),
                    "nodes": _nodes,
                    "links": _links
                }
            ]
        };
    let idb = putDB("wtTAM","H-Tree", dataset.H_tree);

    localStorage.setItem( "actH_tree", idb_key );
}
