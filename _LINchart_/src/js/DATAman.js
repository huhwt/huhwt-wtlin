///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Basic Data-Manager
//
///////////////////////////////////////////////////////////////////////////////

/**
 * Nodes und Links sind Objekte. javascript führt Zuweisung eines Objektes auf eine andere Variable
 * in der Form aus, dass die andere Variable einfach eine Referenz auf das ursprüngliche Objekt erhält.
 * Änderungen an der anderen Variablen wirken sich also auch im ursprünglichen Objekt aus.
 * Damit man Teilmengen von Nodes und Links aus der Gesamt-Menge abgreifen kann, müssen diese Teilmengen
 * neue unabhängige Objekte werden - die Funktionen hier führen das aus:
 * 
 *   Original-Daten
 *   |- Teilmenge gem. Namens-Listen
 *      |- Teilmenge gem. Jahres-Vorgaben
 *         |- Teilmenge für Cluster-Modus/Namens-Wolken
 */

import { createDownloadFromBlob, removeInternalValuesFromJSON, getParameters, getMetadata } from "./export.js";
// import { default as i18n } from "./i18n.js";
import { vec, brighten, darken, distance, jiggle, isNumber, logSVG } from "./utils.js";
import * as parms from "./parms.js";
import { initInteractions, setDragactions, set_tickCounter, makeTickCountInfo } from "./interaction.js";
import { TopoMap, NormalField, GradientField } from "./scalarfield.js";
import { initIDX, getColor, getNameDm, getNameStd} from "./indexman.js";
import { TLslider_html, TLslider } from "./sliderTimeline.js";
import { YEARSCALE } from "./yearScale.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class DATAman
{
    constructor(linObj)
    {
        // Data and Variables
        this.GRAPH_DATA = null;

        this.ONODES = parms.oGET("Onodes");
        this.OLINKS = parms.oGET("Olinks");
        this.originalData = {
            nodes: this.ONODES,
            links: this.OLINKS
        };
        this.mapONid = d3.group(this.originalData.nodes, n => n.id);
        this.tickCounter = 0;
        this.tickCounterTotal = 0;

        this.tickCounterLevel = 'min';
        this.tickCounterLevelV = 0;
        this.tickCounterCycles = 0;
        this.tickCounterControlValue = 0;
        this.tickCounterThreshold = 0;

        this.forceRefresh = true;
        this.simLoop = 0;

        this.CurrentYear = new Date().getFullYear();

        this.instance = this;
        this.linObj = linObj;
        this.tstamp = new Date();
        this.RENDERtype = 0;
        this.zoomO = null;

        this.svgKENN = 'LINEAGE';

        this.isInitialized = false;

        this.PARM_NODE_BORDER_COLOR_FIXED = "#ad0de2";
        this.PARM_GROUP_NODE_BORDER_COLOR = "#f88";

        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        const MARGIN_R = 20;
        const MARGIN_T = 20;
        const MARGIN_R2 = MARGIN_R / 2;
        const MARGIN_T2 = MARGIN_T / 2;
        const outerwidth = window.innerWidth - MARGIN_R;
        const outerheight = window.innerHeight - MARGIN_T;
    
        this.width = outerwidth - margin.left - margin.right;
        this.width2 = this.width / 2;
        this.height = outerheight - margin.top - margin.bottom;
        this.height2 = this.height / 2;

        this.Year = parms.GET("YEAR");

        this.sliderTL = new TLslider(this.instance);
        this.sliderTL.initSlider();
        parms.oSET('TLslider', this.sliderTL);

        this.YEARscale_offset = 60;
        this.YEARscale = new YEARSCALE(this.instance);
        this.YEARscale.initYearScale();
        parms.oSET('YEARSCALE', this.YEARscale);

        // Einstellungen Namens-Filter
        this.nameFilter = "";                   // entspricht Inhalt #menu_names
        this.nameFilter_aktiv = "";             // Ausprägungen nach Umsetzung [Klartext, soundDM, soundSTD]
        this.cAind = 1;
        this.cAmode = "soundDM";
        this.cAtag = "Dm";
        this.cbfilterSpouse = false;
        this.cbfilterAny = false;

        this.clust_grid = null;
    }

    /**
     * OriginalDaten gegen Namens-Filter prüfen
     */
    makeFilteredData() {
        let FilteredData = {
            nodes: [],
            links: []
        };
        FilteredData.nodes = this.filterNodes(this.originalData.nodes, this.originalData.links);

        FilteredData.links = this.filterLinks(this.originalData.links, FilteredData.nodes);

        parms.dataMod(true);
        parms.filterMod(false);
        return FilteredData;
    }
    filterNodes(Inodes, Ilinks) {
        let FNODES = []; // originalData.nodes;
        let _this = this;
        let filterItems = this.nameFilter_aktiv.split(';');
        filterItems = filterItems.filter( function(i) {
            return i.length > 0;
        });
        Inodes.forEach(function(node) {
            if (filterItems.length > 0) {
                if (_this.inFilter(node, filterItems)) {
                    FNODES.push(node);
                    }
            } else {
                FNODES.push(node);
            }
        });
        if ( !_this.cbfilterSpouse ) {
            console.log('prepareData', FNODES);
            return FNODES;
        }

        console.log('prepareData doFilterSPOUSE', _this.cbfilterSpouse, FNODES, Ilinks);
        let _noderadiusS = parms.GET("NODE_RADIUS") * 0.8;
        Ilinks.forEach( function(link, index) {
            let lsource = _this.getNodeById(FNODES, link.source);
            let ltarget = _this.getNodeById(FNODES, link.target);
            if ( lsource < 0 && ltarget < 0 ) {
                // both ends not known in tree
            } else {
                if ( link.relation == 'spouse' ) {
                    if ( lsource < 0 ) {
                        let nsource = _this.mapONid.get(link.source.id);
                        if ( nsource ) {
                            let _node = nsource[0];
                            _node.r = _noderadiusS;
                            FNODES.push(_node);
                        }
                    }
                    if ( ltarget < 0 ) {
                        let ntarget = _this.mapONid.get(link.target.id);
                        if ( ntarget ) {
                            let _node = ntarget[0];
                            _node.r = _noderadiusS;
                            FNODES.push(_node);
                        }
                    }
                }
            }
        });
        console.log('prepareData doFilterSPOUSE', FNODES);
        return FNODES;
    }
    filterLinks(Ilinks, Fnodes) {
        let _this = this;
        let Flinks = [];
        Ilinks.forEach(function(link, index) {
            let lsource = _this.getNodeById(Fnodes, link.source);
            let ltarget = _this.getNodeById(Fnodes, link.target);
            if ((lsource < 0) || (ltarget < 0)) {
            } else {
                Flinks.push(link);
            }
        });
        return Flinks;
    }

    /**
     * Test Nodes - Abgleich gegen Namens-Filter
     */
    inFilter(node, filterItems) {
        if(filterItems.length == 0) {
            return true;
        }
        // cbfilterAny - Jeder Namensbestandteil wirkt -> Abgleich über regex
        if( this.cbfilterAny ) {
            let regex = null;
            for (let i=0; i<filterItems.length; i++) {
                regex = new RegExp(filterItems[i], 'ig');
                if (node.surname.match(regex)) {
                    return true;
                }
            }
        } else {
            // Abgleich Nachname gegen Vergleichsmerkmal - soundex-Dm | soundex-R | Klarnamen
            for(let i=0; i<filterItems.length; i++) {
                switch (this.cAmode) {
                    case 'soundDM':
                        if (node.sn_scDM == filterItems[i]) {
                            return true;
                        }
                        break;
                    case 'soundSTD':
                        if (node.sn_scR == filterItems[i]) {
                            return true;
                        }
                        break;
                    default:
                        if (node.surname == filterItems[i]) {
                            return true;
                        }
                        break;
                }
            }
        }
        return false;
    }

    /**
     * aktuelles Jahr setzen
     */
    setYear(_year) {
        this.Year = _year;
    }

    /**
     * aktuelles Jahr abfragen
     */
    getYear() {
        let _year = this.Year;
        return _year;
    }

    /**
     * Gegen Namen gefilterte Daten gegen Jahres-Vorgaben prüfen
     */
     makeYearedData(linObj) {
        let YearedData = {
            nodes: [],
            links: []
        };
        let _TL = this.sliderTL;
        let _year = parms.GET("YEAR");
        let _yearDM = this.getYear();
        let _yearS = parms.GET("YEARs");
        YearedData.nodes = this.yearNodes(linObj.FilteredData.nodes, _year, _yearS);

        YearedData.links = this.yearLinks(linObj.FilteredData.links, YearedData.nodes);

        // console.log("YearedData ", _year, YearedData.nodes.length);
        return YearedData;
    }
    yearNodes(Inodes, year, YearS) {
        let Ynodes = [];
        Inodes.forEach(function(node) {
            let _value = node.Yvalue;
            if (_value !== null) {
                if (Ynodes.indexOf(node) == -1) {
                    if (_value >= YearS && _value <= year ) {
                        Ynodes.push(node);
                    }
                }
            }
        });
        Ynodes.sort((a, b) => {
            return a.Yvalue - b.Yvalue;
        });
        return Ynodes;
    }
    yearLinks(Ilinks, Ynodes) {
        let _this = this;
        let Ylinks = [];
        Ilinks.forEach(function(link, index) {
            let lsource = _this.getNodeById(Ynodes, link.source);
            let ltarget = _this.getNodeById(Ynodes, link.target);
            if ((lsource < 0) || (ltarget < 0)) {
            } else {
                Ylinks.push(link);
            }
        });
        return Ylinks;
    }

    /**
     * Duplizieren gegen Jahresvorgaben gefilterte Daten für Namenswolken/Cluster-Modus
     * -> Cluster-Modus hat andere innere Struktur
     */
    makeClusteredData(linObj) {
        let ClusteredData = {
            nodes: []
        };
        ClusteredData.nodes = this.clusterNodes(linObj.YearedData.nodes);

        // console.log("YearedData ", _year, YearedData.nodes.length);
        return ClusteredData.nodes;
    }
    clusterNodes(Ynodes) {
        let Cnodes = [];
        Ynodes.forEach(function(node) {
            let _value = node.Yvalue;
            if (_value !== null) {
                if (Cnodes.indexOf(node) == -1) {
                    if (_value >= YearS && _value <= year ) {
                        Cnodes.push(node);
                    }
                }
            }
        });
        return Cnodes;
    }

    getNodeById(nodes, _link) {
        for(let i=0; i<nodes.length; i++) {
            if (nodes[i].id === _link.id) {
                return nodes[i];
            }
        }
        return -1;
    }

    load_GRAPH_DATA(text)
    {
        this.GRAPH_DATA = text;
    }

    load_NAMES_DATA(names)
    {
        this.NAMES_DATA = names;
    }

    setColorMap(linObj) 
    {
        let _rangeMax = parms.GET("RANGE_MAX");
        let _rangeMin = parms.GET("RANGE_MIN");
        let _colormap = parms.oGET("COLORMAP");
        // var thresholds = d3.range(_rangeMin, _rangeMax, parms.GET("CONTOUR_STEP")); 
        if (parms.GET("REVERSE_COLORMAP")) {
            // linObj.SVG_COLORMAP = d3.scaleDiverging(parms.oGET("COLORMAP")).domain([_rangeMin, (_rangeMax + _rangeMin) * 0.5, _rangeMax]);
            linObj.SVG_COLORMAP = d3.scaleDiverging()
                .domain([_rangeMin, (_rangeMax + _rangeMin) * 0.5, _rangeMax])
                .interpolator(_colormap);
        } else {
            // linObj.SVG_COLORMAP = d3.scaleDiverging(parms.oGET("COLORMAP")).domain([_rangeMax, (_rangeMax + _rangeMin) * 0.5, _rangeMin]);
            linObj.SVG_COLORMAP = d3.scaleDiverging()
                .domain([_rangeMax, (_rangeMax + _rangeMin) * 0.5, _rangeMin])
                .interpolator(_colormap);
        }
    }

    makeGuideLines(linObj) {
        let guideLinesHTML = `
        <path id="midlines" class="separator guideline" stroke="orange" stroke-dasharray="2" d="M-400,0,-400,-600 M0,300,800,300"/>
        <path id="gl_center" class="guideline" stroke="blue" stroke-width="3" d="M0,-800,0,800 M-800,0,800,0"/>
        <path id="midmaxx" class="guideline" stroke="orange" stroke-dasharray="1" stroke-width="2" d="M400,0,400,800 M960,0,960,800"/>
        <path id="miny" class="guideline" stroke="#9b59b6" stroke-width="5" d="M0,0,960,0"/>
        <path id="midmaxy" class="guideline" stroke="#9b59b6" stroke-dasharray="1" stroke-width="2" d="M0,400,960,400 M0,800,960,800"/>
    `;
    guideLinesHTML = `
    <path id="gl_center" class="guideline" stroke="darkgrey" stroke-dasharray="2" stroke-width="3" d="M0,-800,0,800 M-800,0,800,0"/>
`;

        let elem = document.getElementById(linObj.GUIDE_LAYERid);
        elem.innerHTML = guideLinesHTML;
    }
    
    
    initSVGLayers(linObj)
    {
        let sKENN = linObj.get_sKENN();
        let cKenn = "#s" + sKENN;
        let the_svg = d3.selectAll(cKenn);
        linObj.SVG = the_svg;
        let the_canvas = the_svg.select("g");
        let _has_g = the_canvas.node();
        if ( _has_g ) {
            linObj.CANVAS = the_canvas;
            this.resetSVGLayers(linObj);
        } else {
            linObj.CANVAS = d3.select("#s" + sKENN).append("g");
        }

        let _guidelayerID = "guidelayer" + sKENN;
        linObj.GUIDE_LAYER = linObj.CANVAS.append("g").attr("id", "guidelayer" + sKENN);
        linObj.GUIDE_LAYERid = _guidelayerID;

        linObj.TOPO_LAYER = linObj.CANVAS.append("g").attr("id", "topolayer" + sKENN);
        linObj.SHADING_LAYER = linObj.CANVAS.append("g").attr("id", "shadinglayer" + sKENN);

        let _graphlayerID = "graphlayer" + sKENN;
        linObj.GRAPH_LAYER = linObj.CANVAS.append("g").attr("id", _graphlayerID);
        linObj.GRAPH_LAYERid = _graphlayerID;
    }
    

    resetSVGLayers(linObj)
    {
        let sKENN = linObj.get_sKENN();
    
        if (linObj.GUIDE_LAYER) d3.select("#guidelayer" + sKENN).remove();
        d3.select("#topolayer" + sKENN).remove();
        d3.select("#shadinglayer" + sKENN).remove();
        d3.select("#graphlayer" + sKENN).remove();

        this.toggleYearScale(false);

        try {
            d3.select("#bullseye").remove();
        } catch (error) {
    
        }
    }

    resetTslider()
    {
        this.sliderTL.resetHandlers();

        let TLelmnt = document.getElementById("sliderTimeline");
        let TLe_nl = TLelmnt.childNodes;
        for (let n = TLe_nl.length; n > 0; n-- ) {
            let TLe_chld = TLelmnt.childNodes[n-1];
            TLe_chld.remove();
        }
        // // TLelmnt.innerHTML = "";
        // let tlHTML = TLslider_html();
        // TLelmnt.innerHTML = tlHTML;

        // this.sliderTL = new TLslider(this.instance);
        // this.sliderTL.initSlider();
        // parms.oSET('TLslider', this.sliderTL);
        // return this.sliderTL;
    }
    
    similarityForceY(nodes, alpha) 
    { 
        let _sfStrength = parms.GET("SF_STRENGTH");
        if (_sfStrength == 0)
            return;

        var target_slope = 20;    // a value difference of 1 should map to a unit distance of 10

        const VIRTUAL_LINK_STRENGTH = _sfStrength / Math.max(nodes.length,1);

        for (var i = 0, n = nodes.length; i < n; i++) 
        {
            var p = nodes[i];
            if (p.Yvalue == null)
                continue;

            for (var j = i + 1; j < n; j++)
            {
                var q = nodes[j];
                if (q) {
                    if (q.Yvalue == null)
                        continue;

                    var v = new vec(q.x + q.vx - p.x - p.vx, q.y + q.vy - p.y - p.vy);    
                    var len = v.norm();

                    var dv = Math.abs(q.Yvalue - p.Yvalue);
                    var target_len = dv * target_slope;

                    var targetvec = v.mul( (len - target_len) / len );

                    var F = targetvec.mul(VIRTUAL_LINK_STRENGTH * alpha);

                    p.vx -= F.x;
                    p.vy -= F.y;
                    q.vx += F.x;
                    q.vy += F.y;
                } else {
                    continue;
                }
            }
        }
    }

    setNodeColors(linObj) 
    {
        if (linObj.SVG_NODES) {
            linObj.SVG_NODES.style("fill", function(node) { return getColor(node.sortname); });
        }
    }

    updateRange(linObj)
    {
        // in case color ramp range changes
        if (linObj.SVG_NODES) linObj.SVG_NODES.style("fill", function(node) { return typeof(node.Yvalue) == "number" ? linObj.SVG_COLORMAP(node.Yvalue) : "red"; });
    }

    updateFilter() {
        // let _fE = d3.select("#menu_names"); // .text();
        // let _filter = _fE._groups[0][0].value; // .text();
        let _fE = document.getElementById("menu_names"); // .text();
        let _filter = _fE.value; // .text();
        if (_filter != this.nameFilter) {
            this.nameFilter = _filter;
            this.nameFilter_aktiv = _filter;
            if ( !this.cbfilterAny ) {                          // we have to check if name-ref is in filter
                let filters_IN = _filter.split(";");
                switch (this.cAmode) {                      // type of check-criteria
                    case 'soundDM':                                     // soundex Daitch-Mokotoff
                        let filters_DM = [];
                        for(let i = 0; i < filters_IN.length; i++) {
                            let _nif = filters_IN[i].trim();                // actual criteria (might have leading space)
                            if (_nif) {
                                let _nifx = getNameDm(_nif);                    // test if is known in namesXX
                                if (_nifx) {                                        // yes!
                                    filters_DM.push(_nifx);                             // put it into active filter
                                }
                            }
                        }
                        this.nameFilter_aktiv = filters_DM.join(";");
                        break;
                    case 'soundSTD':                                    // soundex Standard (Russell)
                        let filters_STD = [];                               // same procedere as above
                        for(let i = 0; i < filters_IN.length; i++) {
                            let _nif = filters_IN[i].trim();
                            let _nifx = getNameStd(_nif);
                            if (_nifx) {
                                filters_STD.push(_nifx);
                            }
                        }
                        this.nameFilter_aktiv = filters_STD.join(";");
                        break;
                    }
            }
            return true;
        }
        return false;
    }

    toggleYearScale(_doShow)
    {
        let _ysShow = _doShow ? 'block' : 'none';
        let _YearScale = d3.select('#yearScale');
        _YearScale.style('display', _ysShow);
    }

    packOdata(linObj, dmanObj) {

        return linObj.packCdata(linObj, dmanObj.ONODES, dmanObj, "o");
    }

}