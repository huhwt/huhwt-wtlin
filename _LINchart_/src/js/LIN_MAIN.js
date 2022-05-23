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
import { vec, brighten, darken, distance, jiggle, isNumber, timeStart, timeEnd } from "./utils.js";
import * as parms from "./parms.js";
import { DATAman } from "./DATAman.js";
import { RENDERhelper, reset } from "./RENDERhelpers.js";
import { TREEexec } from "./lin-TREE.js";
import { TLINEexec } from "./lin-TLINE.js";
import { CLUSTERexec } from "./lin-CLUSTER.js";
import { initInteractions, setDragactions, set_tickCounter, makeTickCountInfo, updatencounter, toggleSVG, toggleLINmenu, toggleSLIDERtl } from "./interaction.js";
import { TopoMap, NormalField, GradientField } from "./scalarfield.js";
import { initCLUSTERs } from "./clusters.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var LOOP_COUNT = 'Loop-1';
var LOOP_Counter = 1;
var loop_counter = 0;

export class LINEAGErenderer
{
    constructor()
    {
        let dataman = new DATAman();
        this.DATAman = dataman;

        // Graphic Layers
        this.SVG = null;
        this.CANVAS = null;
        this.TOPO_LAYER = null;
        this.SHADING_LAYER = null;
        this.GRAPH_LAYER = null;
        this.BULLS_EYE = null;

        // SVG Elements
        this.SVG_NODES = null;
        this.SVG_LINKS = null;
        this.SVG_NODE_LABELS = null;
        this.SVG_CONTOURS = null;
        this.SVG_SHADING_CONTOURS = null;
        this.SVG_INDICATOR_LABELS = null;
        this.SVG_LINKS_STREETS = null;
        this.SVG_LINKS_TUNNELS = null;
        this.SVG_TUNNEL_ENTRIES_1 = null;
        this.SVG_TUNNEL_ENTRIES_2 = null;

        this.SVG_DRAGABLE_ELEMENTS = null;
        this.SVG_COLORMAP = null;
        this.NODES_COLORMAP = null;
        
        this.instance = this;
        let helperRenderer = new RENDERhelper(this.instance);
        this.RENDERhelper = helperRenderer;

        this.svgKENN = 'TREE';
        this.SIMmode = '';
        this.SIMmode_old = '';

        this.isInitialized = false;
        this.forceRefresh = true;
        this.interval = null;
        this.debug = true;

        this.yNODES = [];
        this.yLINKS = [];

        this.FilteredData = this.DATAman.makeFilteredData();
        this.YearedData = null;
        this.TIMEline = this.DATAman.TIMEline;

        this.aNODES = [];
        this.aLINKS = [];

        dataman.initSVGLayers(this.instance);

    }

    get_sKENN() {
        return this.svgKENN;
    }
    test_SIMmode() {
        let sKENN = "#s" + this.SIMmode_old;
        if (this.SIMmode_old) {
            reset(this.instance);
            let _svg = d3.select(sKENN);
            let _isVisible = _svg.style("display");
            switch (_isVisible) {
                case "none":
                    // _svg.style("display", "inline");
                    break;
                default:
                    _svg.style("display", "none");
                }
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
        return (this.SIMmode === this.SIMmode_old);
    }

    // }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    saveDataF()
    {
        let nodePositions = [];
        this.yNODES.forEach(node => {
            nodePositions.push({
                "id": node.id,
                "name": node.name,
                "value": node.Yvalue,
                "x": node.x,
                "y": node.y,
                "fixed": node.fx != null
            });
        });

        let content = [JSON.stringify(
            {
                "metadata": getMetadata(),
                "parameters": getParameters(),
                "nodes": nodePositions,
                "links": this.yLINKS
            },
            removeInternalValuesFromJSON, 2)];
        let blob = new Blob(content, { type: "text/json" });
        let _fileName = parms.GET("FILENAME");
        let filenameWithoutSuffix = _fileName.slice(0, _fileName.lastIndexOf('.'));

        createDownloadFromBlob(blob, filenameWithoutSuffix + ".tam");
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
            timeEnd(LOOP_COUNT, this.debug);
            this.interval.stop();
            LOOP_Counter += 1;
            LOOP_COUNT = 'Loop-' + String(LOOP_Counter);
        }
        timeStart(LOOP_COUNT, this.debug);

        var nodeMap = parms.oGET("OnodeMap");

        let linObj = _objRef;
        let dmanObj = this.DATAman;
        let DOrestart = true;
        if (linObj == null) {
            linObj = this;
            linObj.YearedData = dmanObj.makeYearedData(linObj);
            DOrestart = false;
        // } else {
            // linObj.yNODES.forEach( function(n, i) {
            //     n.x = 0;
            //     n.y = 0;
            //     n.vx = 0;
            //     n.vs = 0;
            // });
        
        }
        this.SIMmode = SIMmode;
        linObj.test_SIMmode(); // toggleSVG(linObj, SIMmode);
        this.svgKENN = SIMmode;

        linObj.yNODES = linObj.YearedData.nodes;
        linObj.yLINKS = linObj.YearedData.links;
    
        // ("Read Graph with " + this.NODES.length + " nodes and " + this.LINKS.length + " links.");
        console.log(i18n("R_Gw_Xn_Xl", { pNl: linObj.yNODES.length, pLl: linObj.yLINKS.length } ));

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        initCLUSTERs(dmanObj);

        // Set tick-frequency depending on NODES.length
        set_tickCounter(linObj, linObj.yNODES);

        // if (!parms.GET("ENERGIZE")) // this parameter may be loaded from an exported save file
        //     linObj.FORCE_SIMULATION.alpha(0); // stop simulation

        dmanObj.toggleYearScale(false);
        toggleLINmenu(true);
        toggleSLIDERtl(true);

        switch (SIMmode)
        {
            case "TREE":
                if (DOrestart) reset(linObj);
                TREEexec(linObj, dmanObj);
                break;
            case "TLINE":
                if (DOrestart) reset(linObj);
                TLINEexec(linObj, dmanObj);
                break;
            case "CLUSTER":
                if (DOrestart) reset(linObj);
                CLUSTERexec(linObj, dmanObj);
                break;
        }

        // linObj.SIMmode_old = linObj.SIMmode;

        let _aT = linObj.FORCE_SIMULATION.alphaTarget();
        parms.SET("ALPHA_target", _aT);
        this.interval = d3.interval(LINloop, 200, d3.now());
    }

}

function LINloop()
{
    let renderer = parms.oGET("RENDERER");
    let linObj = renderer.instance;
    let dmanObj = linObj.DATAman;
    let _TL = linObj.TIMEline;
    let oldYear = _TL.Year;
    let year = _TL.advanceYear(oldYear);
    _TL.updateSlider(year);
    // if ( loop_counter == 0 ) 
        // console.log("linObj.yNODES-0", linObj.yNODES);
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
                if (linObj.SIMmode == 'TREE') doLink = true;
                parms.dataMod(true);
                updatencounter(linObj);
            }
        }
        if (yearMod) parms.yearMod(false);

        if ( linObj.forceRefresh ) {
            linObj.yNODES.forEach( function(n) {
                if(n.Yvalue) {
                    if ( linObj.yNODES.indexOf(n) == -1 ) {
                        if (n.Yvalue >= linObj.TIMEline.YearS && n.Yvalue <= linObj.TIMEline.Year) {
                            linObj.yNODES.push(n);
                        }
                    } else {
                        if (n.Yvalue < linObj.TIMEline.YearS || n.Yvalue > linObj.TIMEline.Year) {
                            linObj.yNODES.splice(linObj.yNODES.indexOf(n), 1);
                        }
                    }
                }
            });
        }

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
        // timeEnd("loop", config);
        linObj.forceRefresh = false;
        loop_counter += 1;
        if ( loop_counter > 100 ) {
            console.log("linObj.yNODES", linObj.yNODES);
            timeEnd(LOOP_COUNT, linObj.debug);
            timeStart(LOOP_COUNT, linObj.debug);
            loop_counter = 0;
        }
    }
}

function cleanSVG(linObj) {
    linObj.SVG_NODES.remove();
    if (linObj.SVG_LINKS)  linObj.SVG_LINKS.remove();
    if (linObj.SVG_NODE_LABELS)  linObj.SVG_NODE_LABELS.remove();
    linObj.SVG_NODES = null;
    if (linObj.SVG_LINKS)  linObj.SVG_LINKS = null;
    if (linObj.SVG_NODE_LABELS)  linObj.SVG_NODE_LABELS = null;
}

function LINrestart(linObj, doSIM=true) {
    linObj.TIMEline.updateYear(linObj.TIMEline.Year);
    linObj.aNODES = d3.group(linObj.yNODES, n => n.id);
    if ( doSIM ) {
        if (linObj.SIMmode == 'TREE') {
            linObj.RENDERhelper.set_xNODES(linObj.yNODES);
            linObj.FORCE_SIMULATION
                .nodes(linObj.yNODES)
                .force('link', d3.forceLink(linObj.yLINKS).distance(function(d){ return d.distance; }).strength(parms.GET("LINK_STRENGTH")))
                .alpha(parms.GET("ALPHA_T"))
                .restart()
                ;
        } else if (linObj.SIMmode == 'TLINE') {
            linObj.RENDERhelper.set_xNODES(linObj.tNODES);
            linObj.FORCE_SIMULATION
                .nodes(linObj.tNODES)
                .alpha(parms.GET("ALPHA_x"))
                .restart()
                ;
        } else if (linObj.SIMmode == 'CLUSTER') {
            linObj.RENDERhelper.set_xNODES(linObj.cNODES);
            linObj.FORCE_SIMULATION
                .nodes(linObj.cNODES)
                .alpha(parms.GET("ALPHA_x"))
                .restart()
                ;
            }

    }
}
