///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Basic Renderer
//
///////////////////////////////////////////////////////////////////////////////

import { createDownloadFromBlob, removeInternalValuesFromJSON, getParameters, getMetadata } from "./export.js";
import * as parms from "./parms.js";
import * as uti from "./utils.js";
import { DATAman } from "./DATAman.js";
import { RENDERhelper, reset } from "./RENDERhelpers.js";
import { TREEexec } from "./lin-TREE.js";
// import { TLINEexec } from "./lin-TL-OLD.js";
import { TLINEexec } from "./lin-TLINE.js";
import { CLUSTERexec, CLUSTERtest } from "./lin-CLUSTER.js";
import { initInteractions, setDragactions, set_tickCounter, makeTickCountInfo, updatencounter, toggleSVG, toggleLINmenu, toggleTLslider, togglePERSinfo } from "./interaction.js";
import { TopoMap, NormalField, GradientField } from "./scalarfield.js";
import { initCLUSTERs, makeCLUSTERs } from "./clusters.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var LOOP_COUNT = 'Loop-1';
var LOOP_Counter = 1;
var loop_counter = 0;

export class LINEAGErenderer
{
    constructor()
    {
        this.instance = this;
        let dataman = new DATAman(this.instance);
        this.DATAman = dataman;

        // Graphic Layers
        this.SVG = null;
        this.CANVAS = null;
        this.TOPO_LAYER = null;
        this.SHADING_LAYER = null;
        this.GRAPH_LAYER = null;
        this.GUIDE_LAYER = null;
        this.BULLS_EYE = null;

        // SVG Elements
        this.SVG_NODES = null;
        this.SVG_GROUP_CIRCLES = null;
        this.SVG_LINKS = null;
        this.SVG_NODE_LABELS = null;
        this.SVG_GROUP_LABELS = null;
        this.SVG_CONTOURS = null;
        this.SVG_SHADING_CONTOURS = null;
        this.SVG_INDICATOR_LABELS = null;
        this.SVG_LINKS_STREETS = null;
        this.SVG_LINKS_TUNNELS = null;
        this.SVG_TUNNEL_ENTRIES_1 = null;
        this.SVG_TUNNEL_ENTRIES_2 = null;

        this.SVG_DRAGABLE_NODES = null;
        this.SVG_DRAGABLE_OTHERS = null;
        this.SVG_COLORMAP = null;
        this.NODES_COLORMAP = null;
        
        let helperRenderer = new RENDERhelper(this.instance);
        this.RENDERhelper = helperRenderer;

        this.svgKENN = 'TREE';
        this.SIMmode = '';
        this.SIMmode_old = '';

        this.isInitialized = false;
        this.forceRefresh = true;
        this.interval = null;
        this.loopspeed = parms.lGET("oploopspeed");
        let _sb_active = document.getElementsByClassName("sbutton__" + String(this.loopspeed+1))[0];
        _sb_active.classList.toggle('sb_active');

        this.viewboxdim = parms.lGET("viewboxdim");

        this.verbose = false;
        this.RENDERhelper.TooltipMaker = helperRenderer.getNodeAttributesAsString;
        this.checkElements = false;

        this.yNODES = [];
        this.yLINKS = [];

        this.FilteredData = this.DATAman.makeFilteredData();
        this.YearedData = null;

        this.aNODES = [];
        this.aLINKS = [];

        this.sNODES = null;

        this.CLUSTERs = null;
        this.CLUSTERtick = null;
        this.CLUSTERmapG = new Map();
        this.CLUSTERmapP = new Map();
        this.names_lidx = new Map();
        this.gNODESc = null;
        this.pNODESc = null;

        this.TLINEmapG = new Map();
        this.TLINEmapP = new Map();
        this.TLINEmapPI = new Map();
        this.gNODESt = null;
        this.pNODESt = null;
        this.s_transform = {k: 1, x: 0, y:0};
        this.pInfoCnt = 0;

        dataman.initSVGLayers(this.instance);

        this.Cview = "HV";

        console.log("new RENDERER");

        this.tickCallback = null;
    }

    get_sKENN() {
        return this.svgKENN;
    }
    test_SIMmode() {
        let sKENN = "#s" + this.SIMmode_old;
        if (this.SIMmode_old) {
            let linObj = this.instance;
            reset(linObj);
            let _svg = d3.select(sKENN);
            let _isVisible = _svg.style("display");
            switch (_isVisible) {
                case "none":
                    // _svg.style("display", "inline");
                    break;
                default:
                    _svg.style("display", "none");
                }
            this.isInitialized = false;
        }
        sKENN = "#s" + this.SIMmode;
        let _svg = d3.select(sKENN);
        let _isVisible = _svg.style("display");
        switch (_isVisible) {
            case "none":
                _svg.style("display", "inline");
                break;
            default:
                // _svg.style("display", "none");
            }
        this.SIMmode_old = this.SIMmode;

        sKENN = sKENN.slice(1);
        let _elem = document.getElementById(sKENN);
        let _vbdimD = _elem.attributes.vbdim.nodeValue;

        let _vbdim = this.viewboxdim;
        if (_vbdimD !== _vbdim) {
            let _vbval = parms.VIEW_PORT_DIMS[_vbdim];
            this.setvbDim_Do(_vbdim, _vbval);
        }

        return (this.SIMmode === this.SIMmode_old);
    }

    // }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    packCdata(linObj, nodes, dmanObj, kPref = "c") {

        let _nodeRadius = parms.GET("NODE_RADIUS");
        _nodeRadius += _nodeRadius;
        let Ynodes = nodes;
    
        function Cpack(data_xx, width, height) {
            let _root = d3.hierarchy(data_xx)
                          .sum(d => d.pvalue);
            let pack_XX = () => d3.pack()
                .size([width, height])
                .padding(6)
                (_root)
                // (d3.hierarchy(data_xx)
                //     .sum(d => d.pvalue)
                //     )
            ;
            let nodes_xx = pack_XX().leaves();
            return nodes_xx;
        }
    
        function Dradius(data_xx) {
            for (let d of data_xx.children) 
            {
                let _cnt = d.children.length;
                let _group = d.children[0].group;
                d.r = Math.max(1.25 * _nodeRadius, Math.sqrt(_cnt) * _nodeRadius);
                d.nodeID = _group;
                d.data = {
                    "group" : _group,
                    "pvalue" : _cnt,
                    "names" : "|" + d.children[0].ynode.surname,
                };
                let cxy = linObj.CLUSTERs.get(_group);
                if (cxy) {
                    d.x = cxy.x;
                    d.y = cxy.y;
                    d.cgInd = cxy.cgInd;
                } else {
                    d.x = 0;
                    d.y = 0;
                    d.cgInd = 0;
                }
            }
            return data_xx;
        }
    
        let data_DM = ({
            children: Array.from(
                d3.group(
                    Array.from(Ynodes, (n, i) => ({
                        group: n.sn_scDM,
                        pvalue: 1,
                        ynode: n
                    })),
                    d => d.group
                ),
                ([, children]) => ({children})
        )});
        let nodes_DM = Cpack(data_DM, dmanObj.width, dmanObj.height);
        data_DM = Dradius(data_DM);
    
        let data_Std = ({
            children: Array.from(
                d3.group(
                    Array.from(Ynodes, (n, i) => ({
                        group: n.sn_scR,
                        pvalue: 1,
                        ynode: n
                    })),
                    d => d.group
                ),
                ([, children]) => ({children})
        )});
        let nodes_Std = Cpack(data_Std, dmanObj.width, dmanObj.height);
        data_Std = Dradius(data_Std);
    
        let data_surn = ({
            children: Array.from(
                d3.group(
                    Array.from(Ynodes, (n, i) => ({
                        group: n.surname,
                        pvalue: 1,
                        ynode: n
                    })),
                    d => d.group
                ),
                ([, children]) => ({children})
        )});
        let nodes_surn = Cpack(data_surn, dmanObj.width, dmanObj.height);
        data_surn = Dradius(data_surn);
    
        console.log(kPref + "nodesDm", nodes_DM);
        console.log(kPref + "dataDm", data_DM);
        parms.oSET(kPref + "nodesDm", nodes_DM);
        parms.oSET(kPref + "dataDm", data_DM);
    
        // console.log("cnodesStd", nodes_Std);
        parms.oSET(kPref + "nodesStd", nodes_Std);
        parms.oSET(kPref + "dataStd", data_Std);
    
        // console.log("cnodesSn", nodes_surn);
        parms.oSET(kPref + "nodesSn", nodes_surn);
        parms.oSET(kPref + "dataSn", data_surn);

        return true;
    }
    
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    makeNodePositions()
    {
        // store person/family node positions with their id
        let nodePositions = {};
        this.yNODES.forEach(n => { nodePositions[n.id] = {"x": n.x, "y": n.y, "fixed": n.fx != null}; });

        return nodePositions;

    }
    saveDataF()
    {

        let nodePositions = this.makeNodePositions();

        // temporarily store actual year
        let _TL = this.instance.DATAman.sliderTL;
        let actYear = _TL.Year;
        parms.SET("actYear", actYear);

        let names_list = parms.oGET("names_list");
        let names_lidx = parms.oGET("names_lidx");
        let names_sSTD = parms.oGET("names_sSTD");
        let names_sDM = parms.oGET("names_sDM");
        let names_filterA = parms.oGET("names_filterA");
        let Ofilterdata = {
            "names_list": names_list,
            "names_lidx": names_lidx,
            "names_sSTD": names_sSTD,
            "names_sDM": names_sDM,
            "names_filterA": names_filterA
        };
        let ds_nodes = parms.oGET("Otext");
        let ds_namesJ = parms.oGET("OnamesJ");

        let ds_names = JSON.stringify(ds_namesJ);
        let content = [JSON.stringify(
            {
                "metadata": getMetadata(),
                "parameters": getParameters(),
                "nodePositions": nodePositions,
                "nodeData": ds_nodes,
                "names": ds_names,
                "fOBJ": Ofilterdata,
            },
            removeInternalValuesFromJSON, 2)];
        let blob = new Blob(content, { type: "text/json" });
        let _fileName = parms.GET("FILENAME");
        if (_fileName == "") {
            let _fPerson = this.RENDERhelper.xNODES[0];
            _fileName = _fPerson.id;
        }
        let filenameWithoutSuffix = _fileName;
        if (_fileName.includes('.')) {
            filenameWithoutSuffix = _fileName.slice(0, _fileName.lastIndexOf('.'));
        }


        createDownloadFromBlob(blob, filenameWithoutSuffix + ".tlin");
        // remove temporarily stored actual year
        parms.delPARMS("PARMS", "actYEAR");
    }

    saveData()
    {
        return;
    }

    showALPHA(linObj) {
        d3.select('#alpha_value').text(linObj.FORCE_SIMULATION.alpha()*100);
        d3.select('#alpha_value_bar').style('flex-basis', (linObj.FORCE_SIMULATION.alpha()*100) + '%');
    }

    createForceGraph(SIMmode, _objRef)
    {
        console.log('go', SIMmode);
        if (this.interval != null) {
            uti.timeEnd(LOOP_COUNT, this.verbose);
            this.interval.stop();
            LOOP_Counter += 1;
            LOOP_COUNT = 'Loop-' + String(LOOP_Counter);
        }
        uti.timeStart(LOOP_COUNT, this.verbose);

        let linObj = _objRef;
        let dmanObj = this.DATAman;
        let DOrestart = true;
        if (linObj == null) {
            linObj = this;
            linObj.YearedData = dmanObj.makeYearedData(linObj);
            DOrestart = false;
        } else {
            cleanSVG(linObj);
        }

        this.SIMmode = SIMmode;
        linObj.test_SIMmode(); // toggleSVG(linObj, SIMmode);
        this.svgKENN = SIMmode;

        linObj.yNODES = linObj.YearedData.nodes;
        linObj.yLINKS = linObj.YearedData.links;
    
        // ("Read Graph with " + this.NODES.length + " nodes and " + this.LINKS.length + " links.");
        console.log(i18n("R_Gw_Xn_Xl", { pNl: linObj.yNODES.length, pLl: linObj.yLINKS.length } ));
        console.log("yNODES", linObj.yNODES, "yLINKS", linObj.yLINKS);

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        initCLUSTERs(dmanObj);
        let clusters = makeCLUSTERs(dmanObj.ONODES, dmanObj);
        linObj.CLUSTERs = clusters;
        console.log("CLUSTERs", linObj.CLUSTERs, dmanObj.clust_grid);
    
        // Set tick-frequency depending on NODES.length
        set_tickCounter(linObj, linObj.yNODES);

        // if (!parms.GET("ENERGIZE")) // this parameter may be loaded from an exported save file
        //     linObj.FORCE_SIMULATION.alpha(0); // stop simulation

        dmanObj.toggleYearScale(false);
        toggleLINmenu(true);
        toggleTLslider(true);
        togglePERSinfo(false);
        // if (DOrestart) reset(linObj);

        switch (SIMmode)
        {
            case "TREE":
                TREEexec(linObj, dmanObj);
                break;
            case "TLINE":
                TLINEexec(linObj, dmanObj);
                break;
            case "CLUSTER":
                CLUSTERexec(linObj, dmanObj);
                break;
        }

        // linObj.SIMmode_old = linObj.SIMmode;
        dmanObj.sliderTL.updateYear(parms.GET("YEAR"));

        let _aT = linObj.FORCE_SIMULATION.alphaTarget();
        parms.SET("ALPHA_target", _aT);
        let _oploopspeed = parms.lGET("oploopspeed");
        let _lspeed = parms.LINloop_Speed[_oploopspeed];
        this.interval = d3.interval(LINloop, _lspeed, d3.now());
    }

    newInterval(linObj, _loopspeed)
    {
        if (linObj.interval != null) {
            uti.timeEnd(LOOP_COUNT, this.verbose);
            linObj.interval.stop();
            LOOP_Counter += 1;
            LOOP_COUNT = 'Loop-' + String(LOOP_Counter);
            uti.timeStart(LOOP_COUNT, linObj.verbose);
        }

        let _sb_active = document.getElementsByClassName("sbutton__" + String(linObj.loopspeed+1))[0];
        let _sb_act_cl = _sb_active.classList;
        if ( _sb_act_cl.contains('sb_active') )
            _sb_act_cl.toggle('sb_active');
        linObj.loopspeed = _loopspeed;
        _sb_active = document.getElementsByClassName("sbutton__" + String(linObj.loopspeed+1))[0];
        _sb_act_cl = _sb_active.classList;
        if ( !_sb_act_cl.contains('sb_active') )
            _sb_act_cl.toggle('sb_active');
        parms.lSET("oploopspeed", _loopspeed);
        let _lspeed = parms.LINloop_Speed[_loopspeed];
        linObj.interval = d3.interval(LINloop, _lspeed, d3.now());
    }

    setvbDim(_vbdim) {
        // viewbox-Einstellungen umsetzen
        let _vbd_old = parms.lGET("viewboxdim");                                    // aktive viewbox Kennung
        // abschalten
        let _vbval = parms.VIEW_PORT_DIMS[_vbd_old];                                // ... dazu Werte
        let _blfd = _vbval[0];                                                      //     ... zugeordneter Button
        let _vb_active = document.getElementsByClassName("vbutton__" + _blfd)[0];   //         ... auslesen
        let _vb_act_cl = _vb_active.classList;                                      //             Classlist ...
        if ( _vb_act_cl.contains('vb_active') )                                     //             auf aktiv prüfen
            _vb_act_cl.toggle('vb_active');                                         //             fallweise abschalten

        parms.lSET("viewboxdim", _vbdim);                                           // neue Kennung speichern
        this.viewboxdim = _vbdim;

        // anschalten
        _vbval = parms.VIEW_PORT_DIMS[_vbdim];                                      // ... dazu Werte
        _blfd = _vbval[0];                                                          //     ... zugeordneter Button
        _vb_active = document.getElementsByClassName("vbutton__" + _blfd)[0];       //         ... Button auslesen
        _vb_act_cl = _vb_active.classList;                                          //             Classlist ...
        if ( !_vb_act_cl.contains('vb_active') )                                    //             auf aktiv prüfen
            _vb_act_cl.toggle('vb_active');                                         //             fallweise anschalten

        this.setvbDim_Do(_vbdim, _vbval);
    }

    setvbDim_Do(_vbdim, _vbval) {
        let _vbX0 = _vbval[1];                                                          //      ... und sonstige Angaben
        let _vbY0 = _vbval[2];
        let _vbWidth = _vbval[3];
        let _vbHeight = _vbval[4];
        let viewBoxValue = _vbX0 + " " + _vbY0 + " " + _vbWidth + " " + _vbHeight;

        // viewbox-Einstellungen ins DOM einspielen
        let sKENN = "s" + this.SIMmode;
        let _theSVG = document.getElementById(sKENN);
        _theSVG.setAttribute('viewBox', viewBoxValue);
        _theSVG.setAttribute('vbdim', _vbdim);
    }

}


function LINloop()
{
    let renderer = parms.oGET("RENDERER");
    let linObj = renderer.instance;
    let dmanObj = linObj.DATAman;
    let _TL = dmanObj.sliderTL;
    let oldYear = _TL.Year;
    let year = _TL.advanceYear(oldYear);
    _TL.updateSlider(year);

    if (parms.filterMod()) {
        dmanObj.updateFilter();
        cleanSVG(linObj);
        linObj.FilteredData = dmanObj.makeFilteredData();
        linObj.createForceGraph(linObj.SIMmode);
    } else {
        let doLink = false;
        let yearMod = parms.yearMod();
        if (year != oldYear || yearMod) {                      // Jahr geändert, ...
            linObj.YearedData = dmanObj.makeYearedData(linObj);
            if (linObj.YearedData.nodes.length != linObj.yNODES.length) {
                linObj.yNODES = linObj.YearedData.nodes;
                linObj.yLINKS = linObj.YearedData.links;
                linObj.forceRefresh = true;                        // ev. weitere nodes relevant -> neu aufbauen
                console.log('loop-forceRefresh true');
                // if (linObj.SIMmode == 'TREE') doLink = true;
                parms.dataMod(true);
                updatencounter(linObj);
            }
        }
        if (yearMod) parms.yearMod(false);

        // if ( linObj.forceRefresh ) {
        //     linObj.yNODES.forEach( function(n) {
        //         if(n.Yvalue) {
        //             if ( linObj.yNODES.indexOf(n) == -1 ) {
        //                 if (n.Yvalue >= _TL.YearS && n.Yvalue <= _TL.Year) {
        //                     linObj.yNODES.push(n);
        //                 }
        //             } else {
        //                 if (n.Yvalue < _TL.YearS || n.Yvalue > _TL.Year) {
        //                     linObj.yNODES.splice(linObj.yNODES.indexOf(n), 1);
        //                 }
        //             }
        //         }
        //     });
        // }

        if (doLink) {
            linObj.yLINKS.forEach( function(l) {
                if (linObj.yLINKS.indexOf(l) < 0) {
                    if (linObj.yNODES.indexOf(l.source) > -1 && linObj.yNODES.indexOf(l.target) > -1) {
                        linObj.yLINKS.push(l);
                    }
                } else if (linObj.yLINKS.indexOf(l) > -1) {
                    if (linObj.yNODES.indexOf(l.source) == -1 || linObj.yNODES.indexOf(l.target) == -1) {
                        linObj.yLINKS.splice(linObj.yLINKS.indexOf(l), 1);
                    }
                }
            });
        }
        LINrestart(linObj, linObj.forceRefresh);
        // uti.timeEnd("loop", config);
        linObj.forceRefresh = false;
        loop_counter += 1;
        if ( loop_counter > 100 ) {
            if ( linObj.verbose ) {
                switch (linObj.SIMmode)
                {
                    case "TREE":
                        console.log("linObj.yNODES", linObj.yNODES);
                        break;
                    case "TLINE":
                        console.log("linObj.gNODESt", linObj.gNODESt, "linObj.pNODESt", linObj.pNODESt);
                        break;
                    case "CLUSTER":
                        console.log("linObj.gNODESc", linObj.gNODESc, "linObj.pNODESc", linObj.pNODESc);
                        break;
                }
            }
            uti.timeEnd(LOOP_COUNT, linObj.verbose);
            uti.timeStart(LOOP_COUNT, linObj.verbose);
            loop_counter = 0;
        // } else if (loop_counter % 5 == 0) {
        //     uti.logElemRect(linObj.GRAPH_LAYERid);
        }
    }
}

function cleanSVG(linObj) {
    if (linObj.SVG_NODES) linObj.SVG_NODES.remove();
    if (linObj.SVG_GROUP_CIRCLES)  linObj.SVG_GROUP_CIRCLES.remove();
    if (linObj.SVG_LINKS)  linObj.SVG_LINKS.remove();
    if (linObj.SVG_NODE_LABELS)  linObj.SVG_NODE_LABELS.remove();
    if (linObj.SVG_GROUP_LABELS)  linObj.SVG_GROUP_LABELS.remove();
    if (linObj.SVG_NODES) linObj.SVG_NODES = null;
    if (linObj.SVG_GROUP_CIRCLES)  linObj.SVG_GROUP_CIRCLES = null;
    if (linObj.SVG_LINKS)  linObj.SVG_LINKS = null;
    if (linObj.SVG_NODE_LABELS)  linObj.SVG_NODE_LABELS = null;
    if (linObj.SVG_GROUP_LABELS)  linObj.SVG_GROUP_LABELS = null;
}

function LINrestart(linObj, doSIM=true) {
    let _TL = linObj.DATAman.sliderTL;
    // _TL.updateYear(_TL.Year);
    // linObj.aNODES = d3.group(linObj.yNODES, n => n.id);
    if (linObj.checkElements)
        if (linObj.SIMmode !== "TLINE")
            checkElementsRemove();
    if ( doSIM ) {
        if (linObj.SIMmode == 'TREE') {
            linObj.RENDERhelper.set_xNODES(linObj.yNODES);
            linObj.FORCE_SIMULATION
                .nodes(linObj.yNODES)
                .force("link", linObj.LINK_FORCE)
                // .force('link', d3.forceLink(linObj.yLINKS).distance(function(d){ return d.distance; }).strength(parms.GET("LINK_STRENGTH")))
                .alpha(parms.GET("ALPHA_T"))
                .restart()
                ;
        } else if (linObj.SIMmode == 'TLINE') {
            linObj.RENDERhelper.set_xNODES(linObj.pNODESt);
            linObj.RENDERhelper.set_gNODES(linObj.gNODESt);
            linObj.FORCE_SIMULATION
                .nodes(linObj.sNODES)
                .force("link", linObj.LINK_FORCE)
                .alpha(parms.GET("ALPHA_x"))
                .restart()
                ;
        } else if (linObj.SIMmode == 'CLUSTER') {
            linObj.RENDERhelper.set_xNODES(linObj.pNODESc);
            linObj.RENDERhelper.set_gNODES(linObj.gNODESc);
            linObj.FORCE_SIMULATION
                .nodes(linObj.sNODES)
                .alpha(parms.GET("ALPHA_x"))
                .restart()
                ;
            }

    } else {
        if (linObj.SIMmode == "CLUSTER")
            CLUSTERtest(linObj);
    }
}

function checkElementsRemove() {
    let elBody = d3.select("#mainContent");
    if (elBody) {
        elBody.on("click", null);
    }
    linObj.checkElements = false;
}