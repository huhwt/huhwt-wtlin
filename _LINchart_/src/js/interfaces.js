///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Interface Management - ImportsS
//
///////////////////////////////////////////////////////////////////////////////

import { load_tamParameters } from "./export.js";
import { DATAman } from "./DATAman.js";
import { LINEAGErenderer } from "./LIN_MAIN.js";
import { loadGedcom, estimateMissingDates, processGedcom, processGedcomN } from "./gedcom.js";
// import { default as i18n } from "./i18n.js";
import * as parms from "./parms.js";
import { toggleSVG, set_tamDefaultParameters, set_linDefaultParameters } from "./interaction.js";
import { putDB, getDB, readFromDB } from "./dbman.js";
import { getBaseURL, getBaseREF, logOBJ, rebuildOBJ } from "./utils.js";
import { initIDX, getColor} from "./indexman.js";

let tfmNodePositions = null;

const RENDERtype = {
    "LINEAGE": 0,
    "TAM": 1,
};

export function setRange(nodes, CurrentYear)
{
    let _rangeMin = 1e8;
    let _rangeMax = -1e8;

    nodes.forEach(node => 
    {
        // automatically adjust TAM height range to min and max values
        if (node.Yvalue)
        {
            let _nvalue = node.Yvalue;
            if ( _nvalue < 1500 ) {
                _nvalue = 1500;
            } else {
                if ( _nvalue > CurrentYear ) {
                _nvalue = CurrentYear;
                }
            }
            _rangeMin = Math.min(_rangeMin, _nvalue);
            _rangeMax = Math.max(_rangeMax, _nvalue);
            if ( node.valueD ) {
                _nvalue = node.valueD;
                if ( _nvalue < 1500 ) {
                    _nvalue = 1500;
                } else {
                    if ( _nvalue > CurrentYear ) {
                    _nvalue = CurrentYear;
                    }
                }
                    _rangeMax = Math.max(_rangeMax, _nvalue);
            }
        }
    });
    
    // Range-Hack: avoid too dark shades of blue
    let _yearS = _rangeMin;
    _yearS -= (_yearS % 10);
    if (_rangeMin > 1500)
        _rangeMin = 1500;
    let range = _rangeMax - _rangeMin;
    // _rangeMin = Math.floor(_rangeMin - range / 7);
    _rangeMin -= (_rangeMin % 10);
    _rangeMax -= (_rangeMax % 10);
    _rangeMax += 10;

    parms.SET("RANGE_MAX", _rangeMax);
    parms.SET("RANGE_MIN", _rangeMin);
    d3.select("#settings_range_min").property("value", parms.GET("RANGE_MIN"));    
    d3.select("#settings_range_max").property("value", parms.GET("RANGE_MAX"));
    parms.SET("YEARs", _yearS);
    parms.SET("YEARe", _rangeMax);
    let _aYear = parms.GET("actYear");
    if ( _aYear == 0 ) { 
        parms.SET("YEAR", _rangeMax);
    } else {
        parms.SET("YEAR", parms.GET("actYear"));
    }
}

function readSingleFile(e)
{
    let file = e.target.files[0];
    if (!file)
        return;
    
    let act_parms = parms.GETall();

    let reader = new FileReader();
    let renderer = parms.oGET("RENDERER");
    let _rendertype = renderer.RENDERtype;
    let isTREErenderer = (_rendertype == RENDERtype.LINEAGE);
    let renderer_new = false;
    let linObj = renderer.instance;
    if (renderer) {
        if ( linObj.SVG_DRAGABLE_NODES ) {
            linObj.SVG_DRAGABLE_NODES
                .on("mouseover", null)
                .on("mouseenter", null)
                .on("mousemove", null)
                .on("mouseout", null)
                ;
        }
        if ( linObj.SVG_DRAGABLE_OTHERS ) {
            linObj.SVG_DRAGABLE_OTHERS
                .on("mouseover", null)
                .on("mouseenter", null)
                .on("mousemove", null)
                .on("mouseout", null)
                ;
        }
    }

    let folder = parms.GET("SOURCE_FOLDER");
    if (folder == null) {
        folder = "data";
        parms.SET("SOURCE_FOLDER", folder);
    }
    reader.onload = function (e, reader) {
        var url = e.target.result;
        parms.SET("FILENAME", file.name);
        parms.SET("FILE_FOLDER", folder);
        let _tfilename = document.getElementById("filename");
        if (_tfilename) { _tfilename.value = file.name; }
    
        if (renderer) {
            linObj.FORCE_SIMULATION.stop();
            toggleSVG(renderer);
            linObj.DATAman.resetSVGLayers(renderer);
            // linObj.sliderTL = linObj.DATAman.resetTslider();
        }

        if (file.name.endsWith(".ged")) {

            if (_rendertype !== RENDERtype.LINEAGE) {
                renderer = new LINEAGErenderer();
                toggleSVG(renderer);
                renderer_new = true;
                parms.oSET("RENDERER", renderer);
            } else {
                let linObj = renderer.instance;
                toggleSVG(renderer);
                resetTREE(linObj);
            }
            set_linDefaultParameters();
            set_tamDefaultParameters();
            parms.SET("SOURCE_FILE", file.name);

            loadGedcom(folder + "/" + file.name,
                function (gedcom, text) {
                    estimateMissingDates(gedcom, parms.GET("PROCREATION_AGE"));
                    renderer.load_GRAPH_DATA(text);
                    renderer.createFamilyForceGraph(gedcom);
                    renderer.tickCounterTotal = 0;
                    renderer.tickCounterCycles = 5;
                });
        }
        else if (file.name.endsWith(".tlin")) {

            if (_rendertype !== RENDERtype.LINEAGE) {
                renderer = new LINEAGErenderer();
                toggleSVG(renderer);
                renderer_new = true;
                parms.oSET("RENDERER", renderer);
            } else {
                let linObj = renderer.instance;
                toggleSVG(renderer);
                resetTREE(renderer);
            }

            d3.json(folder + "/" + file.name)
                .then(
                    function (json) { 
                        processTLIN(json); 
                    });
            renderer.tickCounterTotal = 0;
            renderer.tickCounterCycles = 5;
    }
        else
            console.error(i18n("U_f_t"));               // "Unrecognized file type"
    };
    reader.readAsDataURL(file);
}

function processTLIN(json)
{
    set_linDefaultParameters();
    // first try to load parameters from .tlin
    if ("parameters" in json) {
        console.log(i18n("L_pf_f"));                   // Loading parameters from file.
        load_tamParameters(json.parameters);
    }
    else {
        console.log(i18n("F_dnc_p"));                   // File does not contain parameters
        set_tamDefaultParameters();
    }

    let fOBJ = json.fOBJ;
    parms.oSET("names_list", fOBJ.names_list);
    parms.oSET("names_lidx", fOBJ.names_lidx);
    parms.oSET("names_sSTD", fOBJ.names_sSTD);
    parms.oSET("names_sDM", fOBJ.names_sDM);
    parms.oSET("names_filterA", fOBJ.names_filterA);
    let ds_text = json.nodeData;
    let ds_names = json.names;
    processGedcomN(ds_text, ds_names, function(gedcom) {
        estimateMissingDates(gedcom, parms.GET("PROCREATION_AGE"));
        prepareODATA(gedcom, json.nodePositions);
    });

    initLINEAGE();
    renderAction("TREE");

}


// Reset LINEAGErenderer
function resetTREE(linObj) {
    linObj.RENDERhelper.resetScalarField(linObj);
    if (linObj.SVG_NODE_CIRCLES)  linObj.SVG_NODE_CIRCLES.remove();
    if (linObj.SVG_LINKS)  linObj.SVG_LINKS.remove();
    if (linObj.SVG_NODE_LABELS)  linObj.SVG_NODE_LABELS.remove();
    if (linObj.SVG_GROUP_LABELS)  linObj.SVG_GROUP_LABELS.remove();
    if (linObj.SVG_DRAGABLE_NODES)  linObj.SVG_DRAGABLE_NODES.remove();
    if (linObj.SVG_DRAGABLE_OTHERS)  linObj.SVG_DRAGABLE_OTHERS.remove();
    linObj.NODES = [];
    linObj.LINKS = [];
    linObj.PNODES = [];
    linObj.FNODES = [];
    linObj.LINKNODES = [];
    linObj.FAMILYLINKS = [];
}

///////////////////////////////////////////////////////////////////////////////

// Wrapper by rp
export function onChangeFile(event)
{
    var fileinput = document.getElementById("browse");
    var textinput = document.getElementById("filename");
    textinput.value = fileinput.files[0].name;

    readSingleFile(event);
}

///////////////////////////////////////////////////////////////////////////////


// load data, choose renderer based on the filetype and create force graph
export function loadFileFromDisk(folder)
{
    parms.SET("SOURCE_FOLDER", folder);
    let _fileName = parms.GET("FILENAME");
    parms.SET("SOURCE_FILE", _fileName);
    let renderer = parms.oGET("RENDERER");
    if (renderer) {
        toggleSVG(renderer);
        let linObj = renderer.instance;
        linObj.SVG_DRAGABLE_NODES
            .on("mouseover", null)
            .on("mouseenter", null)
            .on("mousemove", null)
            .on("mouseout", null)
            ;
        if ( linObj.SVG_DRAGABLE_OTHERS ) {
            linObj.SVG_DRAGABLE_OTHERS
                .on("mouseover", null)
                .on("mouseenter", null)
                .on("mousemove", null)
                .on("mouseout", null)
                ;
        }
    }
    let _rendertype = renderer.RENDERtype;
    let isTREErenderer = renderer instanceof LINEAGErenderer;
    let renderer_new = true;
    let _state = parms.GET("STATE");

    if (_fileName.endsWith(".ged"))
    {
        if (_rendertype !== RENDERtype.LINEAGE) {
            renderer = new LINEAGErenderer();
            toggleSVG(renderer);
            renderer_new = true;
            parms.oSET("RENDERER", renderer);
        }

        set_linDefaultParameters();
        set_tamDefaultParameters();
        loadGedcom(folder + "/" + _fileName,
            function(gedcom, text) {
                let _states = parms.GETall();
                estimateMissingDates(gedcom, parms.GET("PROCREATION_AGE"));
                renderer.load_GRAPH_DATA(text);
                renderer.createFamilyForceGraph(gedcom);
                renderer.tickCounterTotal = 0;
                renderer.tickCounterCycles = 5;
            }
        );
    }
    else if (_fileName.endsWith(".tlin"))
    {
        d3.json(folder + "/" + _fileName)
            .then(
                function(json) {
                    processTLIN(json);
                }
            );
    }
    else {
        console.error(i18n("U_f_t"));                   // Unrecognized file type
    }
}

// load data from indexedDB, choose renderer based on store-name and create force graph
export function loadDataFromIDB(storeName, key) {
    let renderer = parms.oGET("RENDERER");
    if (renderer) {
        toggleSVG(renderer);
        let linObj = renderer.instance;
        linObj.SVG_DRAGABLE_NODES
            .on("mouseover", null)
            .on("mouseenter", null)
            .on("mousemove", null)
            .on("mouseout", null)
            ;
        if ( linObj.SVG_DRAGABLE_OTHERS ) {
            linObj.SVG_DRAGABLE_OTHERS
                .on("mouseover", null)
                .on("mouseenter", null)
                .on("mousemove", null)
                .on("mouseout", null)
                ;
        }
    }

    if ( storeName == "TREEdata")
    {
        if (renderer) {
            renderer = null;
        }

        renderer = new LINEAGErenderer();
        toggleSVG(renderer);
        let renderer_new = true;
        parms.oSET("RENDERER", renderer);

        const dbaction = readFromDB("wtLIN", "TREEdata", key);
        dbaction.then( value => { 
                        console.log("loadDataFromIDB - wtLIN-TREEdata", key , value);
                        let content = [JSON.stringify(
                            {
                                "metadata": value.metadata,
                                "parameters": value.parameters,
                                "nodePositions": value.nodePositions,
                                "nodeData": value.nodeData
                            },
                            null, 2)];
                        processTLIN(value);
                        renderer.tickCounterTotal = 0;
                        renderer.tickCounterCycles = 5;
                     } )
                .catch(err => { console.log(err); } )
                ;
        return;
    }

    if ( storeName == "Gedcom")
    {
        const PARMactionF = readFromDB("wtLINparm", "FILTERs", key);
        PARMactionF.then( value => { 
                        console.log(value);
                        let fOBJs = processIDBfilter(value);
                        let dataset = {
                            "fOBJsData":  [{
                                "storeID": "fOBJ",
                                "fOBJs": fOBJs
                            }],
                        };
                        putDB('wtLINparm', 'FILTERs', dataset.fOBJsData);
                    } )
                    .catch(err => { console.log(err); } )
                    ;
        const PARMactionC = readFromDB("wtLINparm", "CLUSTERs", key);
        PARMactionC.then( value => { 
                        console.log(value);
                        parms.oSET("CLUSTERsA", value);
                    } )
                    .catch(err => { console.log(err); } )
                    ;
        const LOADaction = readFromDB("wtLIN", "Gedcom", key);
        LOADaction.then( value => { 
                        console.log(value);
                        processIDBgedcom(value);
                        initLINEAGE();
                        renderAction(parms.GET("SIMmode"));
                     } )
                   .catch(err => { console.log(err); } )
                   ;
        return;
    }

}

function processIDBfilter(filterdata)
{
    // "names_list": names_list,
    // "names_lidx": names_lidx,
    // "names_sSTD": names_sSTD,
    // "names_sDM": names_sDM
    let names_list = JSON.parse(filterdata.names_list);
    let names_lidx = JSON.parse(filterdata.names_lidx);
    let names_sSTD = JSON.parse(filterdata.names_sSTD);
    let names_sDM = JSON.parse(filterdata.names_sDM);
    let names_filterA = {
        0: ""
    };
    let Ofilterdata = {
        "names_list": names_list,
        "names_lidx": names_lidx,
        "names_sSTD": names_sSTD,
        "names_sDM": names_sDM,
        "names_filterA": names_filterA
    };
    parms.oSET("names_list", names_list);
    parms.oSET("names_lidx", names_lidx);
    parms.oSET("names_sSTD", names_sSTD);
    parms.oSET("names_sDM", names_sDM);
    parms.oSET("names_filterA", names_filterA);
    return rebuildOBJ(Ofilterdata);
}

function processIDBgedcom(dataset)
{
    set_linDefaultParameters();
    if ("parameters" in dataset) {
        console.log(i18n("L_pf_f"));                   // Loading parameters from source.
        load_tamParameters(dataset.parameters);
    }
    else {
        console.log(i18n("F_dnc_p"));                   // Source does not contain parameters
        set_tamDefaultParameters();
    }
    let ds_text = dataset.nodeData;
    let ds_names = dataset.nameData;
    let dsname = processFILENAME(dataset.dsname);
    processGedcomN(ds_text, ds_names, function(gedcom) {
        estimateMissingDates(gedcom, parms.GET("PROCREATION_AGE"));
        prepareODATA(gedcom);
    });
}

function processFILENAME(_dsname) {
    let dsname = _dsname.replace('wtLIN-','');
    parms.SET("FILENAME", dsname);
    let _tfilename = document.getElementById("filename");
    if (_tfilename) { _tfilename.value = dsname; }
    return dsname;
}


function prepareODATA(gedcom, nodePositions = null)
{
    let CurrentYear = new Date().getFullYear();

    let NODES = [];
    let LINKS = [];

    // list nodes
    //--------------------------------------------------------------------

    var nodeMap = new Map();

    let _noderadius = parms.GET("NODE_RADIUS");
    // convert to timestap in ms
    let datestr = "1 jan 1500";
    let datems = Date.parse(datestr);
    let defdate = new Date(datems);
    let defYear = defdate.getFullYear();

    gedcom.persons.forEach(p =>
    {
        // set person data
        p.type = "PERSON";
        p.sr = 1;
        p.r0 = _noderadius;
        p.r = p.r0 * p.sr;
        p.cr = p.sex == parms.Sex.FEMALE ? p.r0 : 0;
        p.Yvalue = p.bdate ? p.bdate.getFullYear() : defYear;
        if ( p.Yvalue && p.Yvalue > CurrentYear) {
            p.Yvalue = CurrentYear;
        }

        p.YvalueD = p.ddate ? p.ddate.getFullYear() : null;

        // set node positions (if available)
        if (nodePositions && nodePositions[p.id])
        {
            p.x = nodePositions[p.id].x;
            p.y = nodePositions[p.id].y;
            // p.vis = { 'x': p.x, 'y': p.y };
            if (nodePositions[p.id].fixed) { // restore fixed state
                p.fx = p.x;
                p.fy = p.y;
            }
        } else {
            // p.vis = {'x': 0, 'y': 0};
        }

        nodeMap.set(p.id, p);

        NODES.push(p);
    });

    setRange(NODES, CurrentYear);
    initIDX(NODES);
    LINKS = [];

    // list dependencies
    //--------------------------------------------------------------------
    let _linkDistance = parms.GET("LINK_DISTANCE");
    gedcom.families.forEach(f =>
    {
        let _swife = f.wife;
        let _shusband = f.husband;

        if (_swife == undefined)
            // ("Source " + link.source + " is undefined!");
            console.log(i18n("LS_i_u", { pls: _swife } ));
        if (_shusband == undefined)
            // ("Target " + link.target + " is undefined!");
            console.log(i18n("LT_i_u", { plt: _shusband } ));

        if ( _swife && _shusband ) {
            let _link = {"source": _swife, "target": _shusband, "directed": false, "distance": _linkDistance, "relation": "spouse", color: "#CC0", type: "dashed" };
            LINKS.push(_link);
        }

        f.children.forEach(c => 
        {
            let _child = c;
            if ( _swife ) {
                let _link = {"source": _swife, "target": _child, "directed": true, "distance": _linkDistance, "relation": "mother", color: "#F39", type: "stroke" };
                LINKS.push(_link);
            }
            if ( _shusband ) {
                let _link = {"source": _shusband, "target": _child, "directed": true, "distance": _linkDistance, "relation": "father", color: "#39F", type: "stroke" };
                LINKS.push(_link);
            }
        });
    });

    // ("Created Graph with " + this.NODES.length + " nodes and " + this.LINKS.length + " links.");
    console.log(i18n("C_Gw_Xn_Xl", { pNl: NODES.length, pLl: LINKS.length } ));

    parms.oSET("OnodeMap", nodeMap);
    parms.oSET("Onodes", NODES);
    parms.oSET("Olinks", LINKS);
}


function initLINEAGE() {
    // let LINEAGE = new LINEAGErenderer();
    parms.oSET("LINEAGE", null);
    parms.oSET("RENDERER", null);
}

function renderAction(renderMode) {
    let renderer = parms.oGET("RENDERER");
    if (renderer) {
        toggleSVG(renderer);
        let linObj = renderer.instance;
        linObj.interval.stop();
        linObj.SVG_DRAGABLE_NODES
            .on("mouseover", null)
            .on("mouseenter", null)
            .on("mousemove", null)
            .on("mouseout", null)
            ;
        if ( linObj.SVG_DRAGABLE_OTHERS ) {
            linObj.SVG_DRAGABLE_OTHERS
                .on("mouseover", null)
                .on("mouseenter", null)
                .on("mousemove", null)
                .on("mouseout", null)
                ;
        }
        }

    switch (renderMode)
    {
        case "TREE":
            renderer = null;
            let Lrenderer = parms.oGET("LINEAGE");
            renderer = new LINEAGErenderer(Lrenderer);
            // toggleSVG(renderer);
            parms.oSET("RENDERER", renderer);
            renderer.tickCounterTotal = 0;
            renderer.tickCounterCycles = 5;
            renderer.createForceGraph("TREE");
            break;
    }

    let _aYear = parms.GET("actYear");
    if ( _aYear != 0 ) { 
        let _Year = renderer.DATAman.sliderTL.sSYear.value();
        if ( _aYear != _Year )
            renderer.DATAman.sliderTL.updateSlider_rel(_aYear);
        parms.SET("actYear", 0);
    }

}

function checkFileExistence(url)
{
    try {
        console.log(i18n("Ttl"), url);                           // Trying to load

        let req = new XMLHttpRequest();
        req.open("HEAD", url, false);
        req.send();

        return req.status != 404;
    } catch (error) {
        return false;
    }
}

export function closeModal()
{
    document.querySelector("#overlay").style.display = "none";
}


// Loads the GEDCOM file and creates the graph
export function processModalFileUpload()
{
    let file = document.querySelector('#modal-file-upload').files[0];
    if (file) {
        closeModal();

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            loadGedcom(reader.result, function (gedcom, text) {
                estimateMissingDates(gedcom, parms.GET("PROCREATION_AGE"));

                parms.SET("SOURCE_FILE", file.name);

                let renderer = parms.oGET("RENDERER");
                renderer.load_GRAPH_DATA(text);
                // use previously stored node positions (if available)
                if (tfmNodePositions)
                    renderer.createFamilyForceGraph(gedcom, tfmNodePositions);
                else
                    renderer.createFamilyForceGraph(gedcom);
            });
        };
    }
}

// Open special view - 
export function openNewTab(pageName) {
    let _baseUrl = getBaseREF();
    let _isDev = parms.GET("DEVMODE");
    let _pName = pageName;
    if ( _isDev ) { _pName += '-dev'; }
    _pName += ".html";
    let _Url = _baseUrl + "/" + _pName;
    window.open(_Url, "_blank");
}
