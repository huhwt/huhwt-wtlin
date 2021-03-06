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

import * as gui from "./guiparts.js";
import { TICKCOUNTER_html } from "./tickcounter.js";
// import { default as i18n } from "./i18n.js";
import { switch_locale } from "./translations.js";
import * as parms from "./parms.js";
import * as DBman from "./dbman.js";
import { onChangeFile, openNewTab, loadDataFromIDB } from "./interfaces.js";
import { createDownloadSVG, dump_Htree } from "./export.js";
import * as Tline from "./sliderTimeline.js";
import { showNameList, close_namelist } from "./filters.js";
import * as Rhelper from "./RENDERhelpers.js";
import { CLUSTERsAt } from "./clusters.js";

export function initInteractions(linObj) 
{
    // Add pattern for single heightfield selection and highlighting

    // let renderer = parms.oGET("RENDERER");
    let sSuff = linObj.get_sKENN();
    let sKENN = "#s" + sSuff;

    let the_SVG = d3.select(sKENN);
    linObj.SVG = the_SVG;
    let the_def = the_SVG.select("defs");
    let the_defs = the_def._groups[0][0];
    let makePattern = (the_defs.childElementCount == 3 ? true : false);
    if (makePattern) {
        let pKENN = "pattern" + sSuff;
        the_def.append("pattern")
            .attr("id",pKENN)
            .attr("width", 40)
            .attr("height", 40)
            .attr("patternUnits","userSpaceOnUse")
            .append("path")
            .attr("fill","none")
            .attr("stroke","#111")
            .attr("stroke-width","2") 
            //.attr("d","M-1,1 l2,-2 M0,20 l20,-20 M19,21 l2,-2");
            .attr("d","M0,40 l40,-40 M0,0 l40,40")
            ;
    }

    // initialize Menubar
    if (makePattern) {
        initMenubar();
    }

    // initialize zoom and pan capabilities
    let the_CANVAS = linObj.CANVAS;
    var the_zoom = d3.zoom()
                .scaleExtent([0.01, 100])
                .on("zoom", function({transform}) { the_CANVAS.attr("transform", transform); });
    linObj.zoomO = the_zoom;
    the_SVG
        .call(the_zoom)
        .on('dblclick.zoom', null)
        ;

    // initialize tooltips for hovering over nodes
    initTooltip(linObj);

    // initialize tooltips for hovering over contours
    inittooltipYV(linObj);

    // define interaction possibilities for graph svg
    setTAMInteractions(linObj);

    // define interaction possibilities for menu bar
    set_linMENUBAR_actions(linObj);
    set_tamMENUBAR_actions(linObj);

    // reset tickCounterInfo
    initTickCountInfo();

}

export function initTickCountInfo() {
    putTickCountInfo("#tcinfo_cnts", "_");
    putTickCountInfo("#tClevel", "_");
    putTickCountInfo("#tcinfo_ncount", "_");
    putTickCountInfo("#tcinfo_level", "_");
    putTickCountInfo("#tcinfo_check", "_");
    putTickCountInfo("#tcinfo_cycles", "_");
    putTickCountInfo("#tcinfo_modvalue", "_");
}

export function toggleSVG(renderer, _SIMmode=null) {
    let sSuff = renderer.get_sKENN();
    let sKENN = "#s" + sSuff;
    let _svg = d3.select(sKENN);
    let _isVisible = _svg.style("display");
    switch (_isVisible) {
        case "none":
            _svg.style("display", "inline");
            break;
        default:
            _svg.style("display", "none");
        }

}
/////////////////////////////////////////////////////////////////////////////
///  SVG INTERACTIONS

function setTAMInteractions()
{
    // events
    d3.select("body")
        .on("keydown", function(event) {
            if (event.srcElement.className != "filelabel") {
                if (event.key == "S".charCodeAt(0)) {
                    toggleShading();
                    d3.select("#settings_shading").property('checked', parms.GET("SHADING"));
                }
                else if (event.keyCode == "R".charCodeAt(0)) {
                    toggleReverseColormap();
                    d3.select("#settings_reversecolor").property('checked', parms.GET("REVERSE_COLORMAP"));
                }
                else if (event.keyCode == "H".charCodeAt(0)) {
                    toggleSelectTime();
                    d3.select("#settings_select_time").property('checked', parms.GET("USE_MOUSEOVER"));
                }
                else if (event.keyCode == i18n("kc_Y").charCodeAt(0)) {
                    toggleShowYearValues();
                    d3.select("#settings_show_yearvalues").property('checked', parms.GET("SHOW_YEARVALUES"));
                }
                else if (event.keyCode == "I".charCodeAt(0)) {
                    toggleShowTooltips();
                    d3.select("#settings_show_tooltips").property('checked', parms.GET("SHOW_TOOLTIPS"));
                }
                else if (event.keyCode == "C".charCodeAt(0)) {
                    toggleShowTickcount();
                    d3.select("#settings_show_tickcount").property('checked', parms.GET("SHOW_TICKCOUNT"));
                }
                else if (event.keyCode == "F".charCodeAt(0)) {
                    toggleEnergizeSimulation("ALPHA_T");
                    d3.select("#settings_freeze").property('checked', !parms.GET("ENERGIZE"));
                }
                else if (event.keyCode == "N".charCodeAt(0)) {
                    toggleNames();
                    d3.select("#settings_show_names").property('checked', parms.GET("SHOW_NAMES"));
                }
                else if(event.keyCode == "G".charCodeAt(0)) {
                    toggleShowGraph();
                    d3.select("#settings_show_graph").property('checked', parms.GET("SHOW_GRAPH"));
                }
                else if (event.keyCode == i18n("kc_M").charCodeAt(0)) {
                    toggleShowContours();
                    d3.select("#settings_show_contours").property('checked', parms.GET("SHOW_CONTOURS"));
                }
                else if (event.keyCode == "L".charCodeAt(0)) {
                    toggleLinks();
                    d3.select("#settings_show_links").property('checked', parms.GET("SHOW_LINKS"));
                }
                else if (event.keyCode == "T".charCodeAt(0)) {
                    toggleShowTunnels();
                    d3.select("#settings_show_tunnels").property('checked', parms.GET("SHOW_TUNNELS"));
                }
                else if (event.keyCode == "E".charCodeAt(0)) {
                    document.getElementById("btnSvgExport").click();
                }
            }
        });
}


export function setDragactions(linObj) 
{
    // make nodes draggable
    linObj.SVG_DRAGABLE_ELEMENTS.call(d3.drag()
        .on("start", dragStartNode)
        .on("drag", dragNode)
        .on("end", dragEndNode)
    );

    linObj.SVG_DRAGABLE_ELEMENTS
        .on("click", onMouseClick)
        .on("dblclick", onDblClick);
}
//---------------------------------------------------------------------------
function onMouseClick(event, d)
{
    d.fx = d.fy = null;
    if (d.type == "FAMILY")
        return;
    if (d.sr == 2)
        d.sr = 1;
}
//---------------------------------------------------------------------------
function onDblClick(event, d)
{
    if (d.type == "FAMILY") {
        d.fx = d.x;
        d.fy = d.y;
    } else if (d.type == "PERSON") {
        d.sr = 2;
        d.fx = d.x;
        d.fy = d.y;
    }
}
//---------------------------------------------------------------------------
function mouseoverContour(event, c)
{
    let renderer = parms.oGET("RENDERER");
    if (parms.GET("USE_MOUSEOVER")) {
        renderer.SVG_CONTOURS
            .attr("fill",
                function(d)
                {
                    // Currently selected one will be always at 0.5
                    if (c.value === d.Yvalue)
                    {
                        return "url(#myPattern) #000";//chromadepth(0.5);
                    }
                    return renderer.SVG_COLORMAP(d.Yvalue);
                }
            );
    }
}
//---------------------------------------------------------------------------
function dragStartNode(event, d)
{
    event.sourceEvent.stopPropagation();
    let renderer = parms.oGET("RENDERER");
    if (!event.active)
    {
        renderer.RENDERhelper.resetScalarField(renderer.instance);

        if (!parms.GET("ENERGIZE"))
            renderer.FORCE_SIMULATION.velocityDecay(1);    // don't move anything than the selected node!

        renderer.FORCE_SIMULATION.alpha(0.1).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
    d.sr = 2;

    if (parms.GET("SHOW_TOOLTIPS"))
        d3.select("#tooltip").style("opacity", parms.GET("TOOLTIP_DRAG_OPACITY"));
}
//---------------------------------------------------------------------------
function dragNode(event, d)
{
    d.fx = event.x;
    d.fy = event.y;

    if (parms.GET("SHOW_TOOLTIPS"))
        d3.select("#tooltip")
            .style("top", (event.sourceEvent.pageY - 10) + "px")
            .style("left", (event.sourceEvent.pageX + 15) + "px");
}
//---------------------------------------------------------------------------
function dragEndNode(event, d)
{
    if (!event.active && !parms.GET("ENERGIZE"))
        parms.oGET("RENDERER").FORCE_SIMULATION.velocityDecay(parms.GET("FRICTION")).alpha(0);    // reset friction

    //d.fx = d.fy = null;

    if (parms.GET("SHOW_TOOLTIPS"))
        d3.select("#tooltip").style("opacity", 1.0);
}
//---------------------------------------------------------------------------
function toggleEnergizeSimulation(pALPHA)
{
    parms.TOGGLE("ENERGIZE");
    let renderer = parms.oGET("RENDERER");
    let _go = parms.GET("ENERGIZE");
    if (_go)
    {
        let _alpha = parms.GET(pALPHA);
        renderer.RENDERhelper.resetScalarField(renderer.instance);
        let _aT = parms.GET("ALPHA_target");
        if (renderer.SIMmode == "TREE") {
            let _aF = parms.GET("ALPHA_force");
            renderer.FORCE_SIMULATION
                .alpha(_aF)
                .alphaTarget(_aT)
                .restart()
                ;
        } else {
            renderer.FORCE_SIMULATION
                .alpha(_alpha)
                .restart();
        }
    } else {
        let _aF = renderer.FORCE_SIMULATION.alpha();
        parms.SET("ALPHA_force", _aF);

        renderer.FORCE_SIMULATION.alpha(0);
        if (renderer.SIMmode == "TREE")
            renderer.FORCE_SIMULATION.alphaTarget(null);
    }
}
//---------------------------------------------------------------------------
function toggleShading()
{
    parms.TOGGLE("SHADING");
    let renderer = parms.oGET("RENDERER");
    renderer.SHADING_LAYER.attr("visibility", parms.GET("SHOW_CONTOURS") && parms.GET("SHADING") ? "visible" : "hidden");
}
//---------------------------------------------------------------------------
function toggleLinks()
{
    parms.TOGGLE("SHOW_LINKS");
    Rhelper.toggleLinks(parms.GET("SHOW_LINKS"));
}
//---------------------------------------------------------------------------
function toggleShowGraph()
{
    parms.TOGGLE("SHOW_GRAPH");
    parms.oGET("RENDERER").GRAPH_LAYER.attr("visibility", parms.GET("SHOW_GRAPH") ? "visible" : "hidden");
}
//---------------------------------------------------------------------------
function toggleShowContours()
{
    parms.TOGGLE("SHOW_CONTOURS");
    let renderer = parms.oGET("RENDERER");
    let _showContours = parms.GET("SHOW_CONTOURS");
    renderer.TOPO_LAYER.attr("visibility", _showContours || parms.GET("SHOW_YEARVALUES") ? "visible" : "hidden");
    renderer.SHADING_LAYER.attr("visibility", _showContours && parms.GET("SHADING") ? "visible" : "hidden");
}
//---------------------------------------------------------------------------
function toggleShowYearValues()
{
    parms.TOGGLE("SHOW_YEARVALUES");
    let renderer = parms.oGET("RENDERER");
    registertooltipYVeventhandler(renderer);
    // parms.oGET("RENDERER").TOPO_LAYER.attr("visibility", parms.GET("SHOW_CONTOURS") || parms.GET("SHOW_YEARVALUES") ? "visible" : "hidden");
    // parms.oGET("RENDERER").TOPO_LAYER.attr("visibility", parms.GET("SHOW_CONTOURS") ? "visible" : "hidden");
}
//---------------------------------------------------------------------------
function toggleNames()
{
    parms.TOGGLE("SHOW_NAMES");
    let _renderer = parms.oGET("RENDERER");
    if (parms.GET("SHOW_NAMES")) {
        _renderer.RENDERhelper.showNames(_renderer.instance);
    } else {
        _renderer.RENDERhelper.hideNames(_renderer.instance);
    }
}
//---------------------------------------------------------------------------
function toggleShowTunnels()
{
    parms.TOGGLE("SHOW_TUNNELS");
    if (!parms.GET("ENERGIZE")) {
        let _renderer = parms.oGET("RENDERER");
        _renderer.RENDERhelper.updateScalarField(_renderer.instance);
    }
}
//---------------------------------------------------------------------------
function toggleReverseColormap() 
{
    parms.TOGGLE("REVERSE_COLORMAP");
    if (!parms.GET("ENERGIZE")) {
        let _renderer = parms.oGET("RENDERER");
        _renderer.setColorMap(_renderer.instance);
        _renderer.RENDERhelper.updateScalarField(_renderer.instance);
    }
}
//---------------------------------------------------------------------------
function toggleSelectTime()
{
    parms.TOGGLE("USE_MOUSEOVER");
    let renderer = parms.oGET("RENDERER");
    if (parms.GET("USE_MOUSEOVER") || parms.GET("SHOW_YEARVALUES")) {
        renderer.TOPO_LAYER.selectAll("path.contours").on("mouseover", mouseoverContour);
    } else {
        renderer.RENDERhelper.resetColormap(renderer.instance);
        renderer.TOPO_LAYER.selectAll("path.contours").on("mouseover", null);
    }
}
//---------------------------------------------------------------------------
function toggleShowTooltips()
{
    parms.TOGGLE("SHOW_TOOLTIPS");
    registerTooltipEventhandler();
}
//---------------------------------------------------------------------------
export function toggleLINmenu(_doShow=null)
{
    let _shLM = _doShow;
    if (_doShow === null) {
        parms.TOGGLE("SHOW_LINmenu");
        _shLM = parms.GET("SHOW_LINmenu");
    } else {
        parms.SET("SHOW_LINmenu", _shLM);
    }
    let _mbar = d3.select('#menubar');
    let _left = _shLM ? '0px' : '-341px';
    _mbar.transition().duration(200).style('left', _left);
    let _main = d3.select('#main');
    _left = _shLM ? '341px' : '0px';
    _main.transition().duration(200).style('left', _left);
}
//---------------------------------------------------------------------------
function toggleShowTickcount()
{
    parms.TOGGLE("SHOW_TICKCOUNT");
    let _shTC = parms.GET("SHOW_TICKCOUNT");
    let _tcelem = d3.select("#tickcountInfo");
    if (_shTC) {
        _tcelem.style("display", "inline");
    } else {
        _tcelem.style("display", "none");
    }
}
//---------------------------------------------------------------------------
export function toggleSLIDERtl(_doShow=null)
{
    let _shSLtl = _doShow;
    if (_doShow === null) {
        parms.TOGGLE("SHOW_SLIDERtl");
        _shSLtl = parms.GET("SHOW_SLIDERtl");
    } else {
        if (parms.GET("SHOW_SLIDERtl") == _doShow)
            return;
        parms.SET("SHOW_SLIDERtl", _shSLtl);
    }
    let _slelem = d3.select("#sliderTimeline");
    if (_shSLtl) {
        _slelem.style("display", null);
    } else {
        _slelem.style("display", "none");
    }
}
//---------------------------------------------------------------------------


/////////////////////////////////////////////////////////////////////////////
// This does *not* trigger any updates of the Vizualisation,
// only the parameter menu is updated.
export function set_linDefaultParameters()
{
    parms.lSET("doShow_cA", false);
    parms.lSET("doShow_nl", false);
    parms.lSET("fAind", 0);
    parms.lSET("cbfilterAny", false);
    parms.lSET("cbfilterSpouse", false);
}
//---------------------------------------------------------------------------
export function set_tamDefaultParameters()
{
    const SIMmode = parms.GET("SIMmode");

    const isTREErenderer = SIMmode == "TREE";
    // ("Loading default parameters for",
    console.log(i18n("L_dpf", "LINEAGErenderer") );

    // Menu "Interaction"
    parms.SET("ENERGIZE", true);
    parms.SET("USE_MOUSEOVER", false);
    parms.SET("SHOW_YEARVALUES", false);
    parms.SET("SHOW_TOOLTIPS", true);
    parms.SET("SHOW_TICKCOUNT", false);

    // Menu "Force Layout"
    parms.SET("GRAVITY_X", isTREErenderer ? 0.07 : 0.06);
    parms.SET("GRAVITY_Y", isTREErenderer ? 0.07 : 0.06);
    parms.SET("REPULSION_STRENGTH_T", 400);
    parms.SET("REPULSION_STRENGTH_x", 10);
    parms.SET("REPULSION_STRENGTH", 400);
    parms.SET("LINK_STRENGTH", isTREErenderer ? 1.2 : 0.3);
    parms.SET("SF_STRENGTH", 0);
    parms.SET("FRICTION", isTREErenderer ? 0.2 : 0.4);

    // Menu "Graph Appearance"
    parms.SET("SHOW_GRAPH", true);
    parms.SET("SHOW_LINKS", true);
    parms.SET("SHOW_NAMES", true);
    parms.SET("LINK_WIDTH", 2);
    parms.SET("NODE_RADIUS", 10);
    parms.SET("PERSON_LABEL_OPACITY", 0.7);

    // Menu "Map Appearance"
    parms.SET("SHOW_CONTOURS", true);
    parms.SET("REVERSE_COLORMAP", false);
    parms.SET("INTERPOLATE_NN", false);
    parms.SET("EMBED_LINKS", true);
    parms.SET("SHOW_TUNNELS", true);
    parms.SET("SHADING", true);

    parms.SET("SCALARFIELD_DILATION_ITERS", 2);
    parms.SET("RANGE_MIN", 0);
    parms.SET("RANGE_MAX", 10);
    parms.SET("CONTOUR_STEP", 10);
    parms.SET("CONTOUR_BIG_STEP", 50);
    parms.SET("INDICATOR_FONTSIZE", 15);
    parms.SET("HEIGHT_SCALE", 50);
    parms.SET("SCALARFIELD_RESOLUTION", 400);
    parms.SET("LINK_SAMPLE_STEPSIZE", 2);
    parms.SET("UNDERGROUND_THRESHOLD", 10);

    // Without menu entry
    parms.SET("ARROW_RADIUS", isTREErenderer ? 10 : 14);

    parms.SET("ACTIVE_LOCALE", "de");

    parms.SET("DO_FILTER_SHOW", false);

    initMenubar(); // update visuals based on parameter values
}

///  MENUBAR INTERACTIONS

export function Wswitch_locale(_locale) {
    let active_language = i18n("ZZZZ");
    if (active_language != _locale) {
        parms.SET("ACTIVE_LOCALE", _locale);
        initMenubar();
        set_tamMENUBAR_actions();
        set_linMENUBAR_actions();
    }
}

export function initMenubar()
{
    let active_language = i18n("ZZZZ");
    if (active_language != parms.GET("ACTIVE_LOCALE")) {
        switch_locale(parms.GET("ACTIVE_LOCALE"));
        let mbHTML = gui.linMENUBAR_html();
        let MBelmnt = document.getElementById("menubar");
        MBelmnt.innerHTML = mbHTML;
        let ovHTML = gui.FILE_MODAL();
        let OVelmnt = document.getElementById("overlay");
        OVelmnt.innerHTML = ovHTML;
        let tcHTML = TICKCOUNTER_html();
        let TCelmnt = document.getElementById("tickcountInfo");
        TCelmnt.innerHTML = tcHTML;
        let ctHTML = gui.CONTROLS_html();
        let FIelmnt = document.getElementById("forceInfo");
        FIelmnt.innerHTML = ctHTML;
        let tlHTML = Tline.TIMELINE_html();
        let TLelmnt = document.getElementById("sliderTimeline");
        TLelmnt.innerHTML = tlHTML;
    }

    DSprep();
    YBprep();

    d3.select("#settings_dataset").property("value", parms.GET("FILENAME"));

    // Load File
    // Save
    // Interaction
    d3.select("#settings_freeze").property('checked', !parms.GET("ENERGIZE"));
    d3.select("#settings_select_time").property('checked', parms.GET("USE_MOUSEOVER"));
    d3.select("#settings_show_yearvalues").property('checked', parms.GET("SHOW_YEARVALUES"));
    d3.select("#settings_show_tooltips").property('checked', parms.GET("SHOW_TOOLTIPS"));
    d3.select("#settings_show_tickcount").property('checked', parms.GET("SHOW_TICKCOUNT"));
    
    // Force Simulation
    d3.select("#settings_gravity_x").property('value', parms.GET("GRAVITY_X"));
    d3.select("#settings_gravity_y").property('value', parms.GET("GRAVITY_Y"));
    d3.select("#settings_repulsion_strength").property("value", parms.GET("REPULSION_STRENGTH"));
    d3.select("#settings_link_strength").property("value", parms.GET("LINK_STRENGTH"));    
    d3.select("#settings_simforce_strength").property("value", parms.GET("SF_STRENGTH"));    
    d3.select("#settings_friction").property("value", parms.GET("FRICTION"));

    // Graph Appearance
    d3.select("#settings_show_graph").property("checked", parms.GET("SHOW_GRAPH"));    
    d3.select("#settings_show_links").property("checked", parms.GET("SHOW_LINKS"));    
    d3.select("#settings_show_names").property("checked", parms.GET("SHOW_NAMES"));    
    d3.select("#settings_linkwidth").property("value", parms.GET("LINK_WIDTH"));
    d3.select("#settings_noderadius").property("value", parms.GET("NODE_RADIUS"));
    d3.select("#settings_pnodeopacity").property("value", parms.GET("PERSON_LABEL_OPACITY"));

    // Map Appearance
    d3.select("#settings_show_contours").property("checked", parms.GET("SHOW_CONTOURS"));    
    d3.select("#settings_reversecolor").property('checked', parms.GET("REVERSE_COLORMAP"));
    d3.select("#settings_interpolation_type").property("checked", parms.GET("INTERPOLATE_NN"));
    d3.select("#settings_embed_links").property("checked", parms.GET("EMBED_LINKS"));
    d3.select("#settings_show_tunnels").property("checked", parms.GET("SHOW_TUNNELS"));    
    d3.select("#settings_shading").property('checked', parms.GET("SHADING"));
    d3.select("#settings_dilation_degree").property("value", parms.GET("SCALARFIELD_DILATION_ITERS"));
    d3.select("#settings_range_min").property("value", parms.GET("RANGE_MIN"));    
    d3.select("#settings_range_max").property("value", parms.GET("RANGE_MAX"));    
    d3.select("#settings_contour_step").property("value", parms.GET("CONTOUR_STEP"));
    d3.select("#settings_contour_big_step").property("value", parms.GET("CONTOUR_BIG_STEP"));    
    d3.select("#settings_indicator_size").property("value", parms.GET("INDICATOR_FONTSIZE"));    
    d3.select("#settings_height_scale").property("value", parms.GET("HEIGHT_SCALE"));        
    d3.select("#settings_resolution").property("value", parms.GET("SCALARFIELD_RESOLUTION"));    
    d3.select("#settings_link_sample_step").property("value", parms.GET("LINK_SAMPLE_STEPSIZE"));    
    d3.select("#settings_underground_threshold").property("value", parms.GET("UNDERGROUND_THRESHOLD"));

}
//---------------------------------------------------------------------------

/**
 * Init events for LINEAGE specific actions
 * - toggle names_list -> value is hosted in 'data-filter'
 * - suppress onkey for input field 'menu_names' -> if not, keys pressed would trigger TAM-specific actions
 * - toggle filter any_names
 * - toggle filter with_spouses
 */
function set_linMENUBAR_actions()
{
    let renderer = parms.oGET("RENDERER");

    //  switch simulation-mode
    d3.selectAll("button[data-view]").on("click", function(e) {
        let _this = this;
        DVclicked(e, _this);
    });

    //  switch soundex-mode
    d3.selectAll("button[data-sound]").on("click", function(e) {
        let _this = this;
        DSclicked(e, _this);
    });

    //  toggle show names_list
    d3.select("a[data-filter]").on("click", function(e) {
        let _this = this;
        let renderer = parms.oGET("RENDERER");
        DFclicked(e, _this, renderer);
    });

    // suppress onkey for menu_names
    // -> if not, keys pressed would trigger TAM-specific actions -> setTAMinteractions()
    d3.select("#menu_names").on("keydown", function(e) {
        e.stopPropagation();
    });

    // toggle filter action 'any_names' -> even parts of name strings will act as filter
    d3.select("#cbfilterAny").on("change", function(e) {
        let renderer = parms.oGET("RENDERER");
        toggleFilterToggle(renderer);
    });

    // toggle filter action 'with_spouses'
    // -> when active, spouses of individuals filtered by 'names_list' will be displayed too
    d3.select("#cbfilterSpouse").on("change", function(e) {
        let renderer = parms.oGET("RENDERER");
        toggleFilterSpouse(renderer);
    });

    // time
    d3.selectAll("button[data-year]").on("click", function (e) {
        let _TL = parms.oGET('TIMEline');
        let valueYear = this.getAttribute("data-year");
        e.stopPropagation();
        _TL.setYear(valueYear);
    });

    // set position for year indicator
    let yE = d3.select('#year');
    let _yl = renderer.DATAman.width/2 - 60;
    let _yt = renderer.DATAman.height - 110;
    yE.style('left', _yl  + "px")
      .style('top', _yt  + "px");

}
function toggleFilterToggle(renderer)
{
    parms.TOGGLE("cbfilterAny");
    renderer.DATAman.cbfilterAny = parms.lGET("cbfilterAny");
}
function toggleFilterSpouse(renderer)
{
    parms.TOGGLE("cbfilterSpouse");
    renderer.DATAman.cbfilterSpouse = parms.lGET("cbfilterSpouse");
    parms.filterMod(true);
}
//---------------------------------------------------------------------------
function toggleShowCa()
{
    parms.TOGGLE("doShow_cA");
    let _shTC = parms.lGET("doShow_cA");
    let _tcelem = d3.select("#clustersAsel");
    if (_shTC) {
        _tcelem.style("display", "inline");
    } else {
        _tcelem.style("display", "none");
    }
}
//---------------------------------------------------------------------------

function DSprep() {
    let cA_elmnt = document.getElementById("clustersA");
    cA_elmnt.title = i18n('Filtermodus') + ": " + i18n(CLUSTERsAt.soundDM);
    d3.select("#clustersA").on("click", null);
    d3.select("#clustersA").on("click", function (e) {
        toggleShowCa();
    });

    let cAselmnt = document.getElementById("clustersAsel");
    cAselmnt.innerHTML = '';
    for (const key in CLUSTERsAt) {
        let _text = CLUSTERsAt[key];
        let cAsd = document.createElement("div");
        let cAsb = document.createElement('button');
        cAsb.classList = "btn btn_sm button__60";
        cAsb.innerHTML = key;
        cAsb.value = key;
        cAsb.title = i18n(_text);
        // here we are setting a data attribute on our button to say what type of sorting we want done if it is clicked!
        cAsb.setAttribute('data-sound', key);
        cAsd.appendChild(cAsb);
        cAselmnt.appendChild(cAsd);
    }
    cAselmnt.style.display = "none";
}

/**
 * Toggle show names_list -> value is hosted in 'data-filter'
 */
 function DFclicked(event, _this, renderer) {
    let valueDO = _this.getAttribute("data-filter");
    let doFilterSHOW = parms.GET("DO_FILTER_SHOW");
    if (valueDO == "menu_names") {
        doFilterSHOW = !doFilterSHOW;
        parms.SET("DO_FILTER_SHOW", doFilterSHOW);
        if ( doFilterSHOW ) {
            showNameList(event, renderer);
        } else {
            close_namelist();
        }
    }

}

/**
 * Switch simulation mode -> value is hosted in 'data-view'
 */
function DVclicked(event, _this) {
    let renderer = parms.oGET("RENDERER");
    let valueDO = _this.getAttribute("data-view");
    if (valueDO == renderer.SIMmode) return;

    parms.SET("SIMmode", valueDO);
    renderer.createForceGraph(valueDO, renderer);
}

/**
 * Switch soundex mode -> value is hosted in 'data-sound'
 */
function DSclicked(event, _this) {
    let renderer = parms.oGET("RENDERER");
    let valueDO = _this.getAttribute("data-sound");
    if (valueDO == renderer.DATAman.clusters_aktiv) return;

    let _bs = document.getElementById("clustersA");
    _bs.innerHTML = valueDO;
    _bs.title = i18n('Filtermodus') + ": " + i18n(CLUSTERsAt[valueDO]);
    document.querySelector("#clustersAsel").style.display = "none";

    renderer.DATAman.clusters_aktiv = valueDO;

    let _smode = renderer.SIMmode;
    renderer.createForceGraph(_smode, renderer);
}
//---------------------------------------------------------------------------

function YBprep()
{
    let YBelmnt = document.getElementById("yearBoxes");
    YBelmnt.innerHTML = '';
    let _YearS = parms.GET("RANGE_MIN");
    let _YearE = parms.GET("RANGE_MAX");
    if (_YearS > 1500) {
        _YearS = 1500;
    } else {
        _YearS -= (_YearS % 100);
    }
    let _bcnt = 0;
    let YBeld = document.createElement('div');
    YBelmnt.appendChild(YBeld);
    for (let y=_YearS; y<_YearE; y+=100) {
        _bcnt++;
        if (_bcnt > 3) {
            YBeld = document.createElement('div');
            YBelmnt.appendChild(YBeld);
            _bcnt = 0;
        }
        let YBbtn = document.createElement('button');
        YBbtn.classList = "btn btn_sm button__60";
        YBbtn.innerHTML = y;
        YBbtn.value = y;
        YBbtn.title = i18n("Aktuelles Jahr einstellen");
        // here we are setting a data attribute on our button to say what type of sorting we want done if it is clicked!
        YBbtn.setAttribute('data-year', y);
        YBeld.appendChild(YBbtn);
    }
    YBeld = document.createElement('div');
    YBelmnt.appendChild(YBeld);
    let YBbtn = document.createElement('button');
    YBbtn.classList = "btn btn_sm button__60";
    YBbtn.innerHTML = _YearE;
    YBbtn.value = _YearE;
    YBbtn.title = i18n("Aktuelles Jahr einstellen");
    // here we are setting a data attribute on our button to say what type of sorting we want done if it is clicked!
    YBbtn.setAttribute('data-year', _YearE);
    YBeld.appendChild(YBbtn);
}

//---------------------------------------------------------------------------
function set_tamMENUBAR_actions()
{
    let renderer = parms.oGET("RENDERER");

    //  Load From IDB
    d3.select("#btnLoad").on("click", function(event) {
        showIDBstate(event);
    });
    //  Load File
    d3.select("#browse").on("change", function(event) {
        onChangeFile(event);
    });
    d3.select("#fakeBrowse").on("click", function(event) {
        document.getElementById('browse').click();
    });
    //  Save
    d3.select("#btnSave").on("click", function (e) {
        renderer.saveData();
    });        
    d3.select("#btnSaveF").on("click", function (e) {
        renderer.saveDataF();
    });        
    d3.select("#btnSvgExport").on("click", function (e) {
        let _rkenn = renderer.svgKENN;
        let _elem = 's' + _rkenn;
        let _fnSVG = _rkenn + '.svg';
        createDownloadSVG(document.getElementById(_elem).outerHTML, _fnSVG);
    });        
    //  Interaction
    d3.select("#bt_toggleMenu").on("click", function (e) {
        toggleLINmenu();
    });

    d3.select("#settings_freeze").on("click", function (e) {
        toggleEnergizeSimulation("ALPHA_T");
    });        
    d3.select("#settings_select_time").on("click", function(e){
        toggleSelectTime();
    });    
    d3.select("#settings_show_yearvalues").on("click", function(e){
        toggleShowYearValues();
    });    
    d3.select("#settings_show_tooltips").on("click", function (e) {
        toggleShowTooltips();
    });
    d3.select("#settings_show_tickcount").on("click", function (e) {
        toggleShowTickcount();
    });
    //  Force Simulation
    d3.select("#settings_gravity_x").on("input", function() {
        let _tv = parseFloat(this.value);
        parms.SET("GRAVITY_X", _tv);
        renderer.FORCE_SIMULATION.force("x", d3.forceX(0).strength(_tv));
    });
    d3.select("#settings_gravity_y").on("input", function() {
        let _tv = parseFloat(this.value);
        parms.SET("GRAVITY_Y", _tv);
        renderer.FORCE_SIMULATION.force("y", d3.forceY(0).strength(_tv));
    });
    d3.select("#settings_repulsion_strength").on("input", function() {
        let _tv = this.value;    
        parms.SET("REPULSION_STRENGTH", _tv);    
        renderer.REPULSION_FORCE.strength(-_tv);
    });
    d3.select("#settings_link_strength").on("input", function() {
        let _tv = this.value;    
        parms.SET("LINK_STRENGTH", _tv);    
        renderer.LINK_FORCE.strength(parms.GET("LINK_STRENGTH"));
    });
    d3.select("#settings_simforce_strength").on("input", function() {
        let _tv = parseFloat(this.value);
        parms.SET("SF_STRENGTH", _tv);    
    });
    d3.select("#settings_friction").on("input", function() {
        let _tv = parseFloat(this.value);
        parms.SET("FRICTION", _tv);
        renderer.FORCE_SIMULATION.velocityDecay(_tv);
    });
    //  Graph Appearance
    d3.select("#settings_show_graph").on("input", function() {
        toggleShowGraph();
    });
    d3.select("#settings_show_links").on("input", function() {
        toggleLinks();
    });
    d3.select("#settings_show_names").on("input", function() {
        toggleNames();
    });
    d3.select("#settings_linkwidth").on("input", function() {
        let _tv = parseInt(this.value);
        parms.SET("LINK_WIDTH", _tv);
        if (renderer.SVG_LINKS)    renderer.SVG_LINKS.attr("stroke-width", _tv + "px");
        if (renderer.SVG_LINKS_STREETS) renderer.SVG_LINKS_STREETS.attr("stroke-width", _tv + "px");
        if (renderer.SVG_LINKS_TUNNELS) renderer.SVG_LINKS_TUNNELS.attr("stroke-width", _tv + "px");
        if (renderer.SVG_TUNNEL_ENTRIES_1) renderer.SVG_TUNNEL_ENTRIES_1.attr("stroke-width", _tv + "px");
        if (renderer.SVG_TUNNEL_ENTRIES_2) renderer.SVG_TUNNEL_ENTRIES_2.attr("stroke-width", _tv + "px");
    });
    d3.select("#settings_noderadius").on("input", function() {
        let _tv = parseInt(this.value);
        parms.SET("NODE_RADIUS", _tv);
        if (renderer.SVG_NODE_CIRCLES) renderer.SVG_NODE_CIRCLES.attr("r", _tv);
    });
    d3.select("#settings_pnodeopacity").on("input", function() {
        let _tv = parseFloat(this.value);
        parms.SET("PERSON_LABEL_OPACITY",_tv);
        if (renderer.SVG_NODE_LABELS) renderer.SVG_NODE_LABELS.style("opacity", _tv);
    });
    //  Map Appearance
    d3.select("#settings_show_contours").on("input", function() {
        toggleShowContours();
    });
    d3.select("#settings_reversecolor").on("click", function(e){
        toggleReverseColormap();
    });    
    d3.select("#settings_interpolation_type").on("input", function() {
        parms.SET("INTERPOLATE_NN", this.checked);
        if (!parms.GET("ENERGIZE")) renderer.RENDERhelper.updateScalarField(renderer.instance);
    });
    d3.select("#settings_embed_links").on("input", function() {
        parms.TOGGLE("EMBED_LINKS");
        if (!parms.GET("ENERGIZE")) {
            renderer.RENDERhelper.updateScalarField(renderer.instance);
        }
    });
    d3.select("#settings_show_tunnels").on("input", function () {
        toggleShowTunnels();
    });
    d3.select("#settings_shading").on("click", function(e){
        toggleShading();
    });        
    d3.select("#settings_dilation_degree").on("input", function() {
        let _tv = parseFloat(this.value);
        parms.SET("SCALARFIELD_DILATION_ITERS", _tv);
        if (!parms.GET("ENERGIZE")) {
            renderer.RENDERhelper.updateScalarField(renderer.instance);
        }
    });
    d3.select("#settings_range_min").on("input", function() {
        let _tv = parseFloat(this.value);
        setRANGE(renderer, "RANGE_MIN", _tv);
    });
    d3.select("#settings_range_max").on("input", function() {
        let _tv = parseFloat(this.value);
        setRANGE(renderer, "RANGE_MAX", _tv);
    });
    d3.select("#settings_contour_step").property("value", parms.GET("CONTOUR_STEP")).on("input", function() {
        parms.SET("CONTOUR_STEP", parseFloat(this.value));
        if (!parms.GET("ENERGIZE")) renderer.RENDERhelper.updateScalarField(renderer.instance);
    });
    d3.select("#settings_contour_big_step").on("input", function() {
        parms.SET("CONTOUR_BIG_STEP", parseFloat(this.value));
        if (!parms.GET("ENERGIZE")) renderer.RENDERhelper.updateScalarField(renderer.instance);
    });
    d3.select("#settings_indicator_size").on("input", function() {
        let _tv = this.value;    
        parms.SET("INDICATOR_FONTSIZE", _tv);
        if (renderer.SVG_INDICATOR_LABELS) renderer.SVG_INDICATOR_LABELS.style("font-size", _tv);
    });
    d3.select("#settings_height_scale").on("input", function() {
        let _tv = parseFloat(this.value);
        parms.SET("HEIGHT_SCALE", _tv);
        if (!parms.GET("ENERGIZE")) renderer.RENDERhelper.updateScalarField(renderer.instance);
    });
    d3.select("#settings_resolution").on("input", function() {
        let _tv = parseInt(this.value);
        parms.SET("SCALARFIELD_RESOLUTION", _tv);
        if (!parms.GET("ENERGIZE")) renderer.RENDERhelper.updateScalarField(renderer.instance);
    });
    d3.select("#settings_link_sample_step").on("input", function() {
        let _tv = parseInt(this.value);
        parms.SET("LINK_SAMPLE_STEPSIZE", _tv);
        if (!parms.GET("ENERGIZE")) renderer.RENDERhelper.updateScalarField(renderer.instance);
    });
    d3.select("#settings_underground_threshold").on("input", function() {
        let _tv = parseFloat(this.value);
        parms.SET("UNDERGROUND_THRESHOLD", _tv);
        if (!parms.GET("ENERGIZE")) renderer.RENDERhelper.updateScalarField(renderer.instance);
    });
    // Language
    d3.select("#btn_l_de").on("click", function (e) {
        Wswitch_locale('de');
    });
    d3.select("#btn_l_en").on("click", function (e) {
        Wswitch_locale('en');
    });
    d3.select("#btn_l_nl").on("click", function (e) {
        Wswitch_locale('nl');
    });

    d3.select("#settings_linkdist").on("input", function() {
        parms.SET("LINK_DISTANCE", parseInt(this.value));
    });

    // tickcount-Info
    d3.select("#btn_tcIreset").on("click", function (e) {
        setTickCountInfo(renderer.instance, 'min');
    });

    // Force Info
    d3.selectAll("a[data-info]").on("click", function (e) {
        let valueInfo = this.getAttribute("data-info");
        e.stopPropagation();
        if(valueInfo == "print") {
            console.log(renderer.FORCE_SIMULATION);
            console.log(renderer.NODES);
            console.log(renderer.LINKS);
        } else if(valueInfo == "stop") {
            let _siMODE = parms.GET("SIMmode");
            if (_siMODE == "TREE") {
                toggleEnergizeSimulation("ALPHA_T");
                // parms.SET("ENERGIZE", false);
                // renderer.forceRefresh = false;
                // renderer.simLoop = 90;
                // renderer.FORCE_SIMULATION.alpha(0);
                // parms.SET("SHOW_YEARVALUES", true);
                registertooltipYVeventhandler();
            } else {
                toggleEnergizeSimulation("ALPHA_x");
            }
        } else if(valueInfo == "rerun") {
            parms.SET("ENERGIZE", true);
            let _aF = renderer.FORCE_SIMULATION.alpha();
            _aF += 0.1;
            let _aFm = 1;
            let _aT = parms.GET("ALPHA_target");
            if (renderer.SIMmode == "TREE") {
                renderer.RENDERhelper.resetScalarField(renderer.instance);
                renderer.forceRefresh = true;
                parms.SET("SHOW_YEARVALUES", false);
                registertooltipYVeventhandler();
                _aFm = parms.GET("ALPHA_T");
                if (_aF > _aFm) { _aF = _aFm; }
                renderer.FORCE_SIMULATION
                    .alpha(_aF)
                    .alphaTarget(_aT)
                    .restart()
                    ;
            } else {
                _aFm = parms.GET("ALPHA_x");
                if (_aF > 1) { _aF = 1; }
                renderer.FORCE_SIMULATION
                    .alpha(_aF)
                    .restart()
                    ;
            }
        }
    });
    d3.select('#alpha_value').on("click", function(e) {
        e.stopPropagation();
        parms.SET("ENERGIZE", true);
        renderer.RENDERhelper.resetScalarField(renderer.instance);
        renderer.forceRefresh = true;
        renderer.simLoop = 90;
        renderer.FORCE_SIMULATION.alpha(1).restart();
    });

}

function setRANGE(renderer, _RANGE, _tv) {
    parms.SET(_RANGE, _tv);
    renderer.setColorMap(renderer.instance);
    renderer.updateRange(renderer.instance);
    if (!parms.GET("ENERGIZE")) renderer.RENDERhelper.updateScalarField(renderer.instance);
}
//---------------------------------------------------------------------------

export function set_tickCounter(linObj, NODES) {
    let dmanObj = linObj.DATAman;
    let tickParms = parms.testTickLevel(NODES.length);
    dmanObj.tickCounterLevel = tickParms.tLevelP;                    // startlevel -> 'XXL','XL' ...
    dmanObj.tickCounterLevelV = tickParms.tLevelV;                   // dazu Wert
    dmanObj.tickCounterControlValue = tickParms.tCount;              // corresponding value for modulo-ops
    dmanObj.tickCounterCycles = tickParms.tCycles;                   // multiplyer for calculating threshold value
    let _tCT = tickParms.tCycles * tickParms.tLevelV;
    dmanObj.tickCounterThreshold = _tCT;
    // "Tci_Xn_tCp": "TickCounter initialized: %{pNl} nodes  -> Level:%{pLl}, ControlValue:%{pCnt}, Cycles:%{pCyc}, Threshold:%{pTh}.",
    console.log(i18n("Tci_Xn_tCp", { pNl: NODES.length, pLl: tickParms.tLevelP, pCnt: tickParms.tCount, pCyc: tickParms.tCycles, pTh: _tCT } ));

    makeTickCountInfo(linObj, true, dmanObj.tickCounterLevel, NODES.length);
}

export function makeTickCountInfo(linObj, update=null, tciLevel=null, _nLength=null) {

    let dmanObj = linObj.DATAman;
    putTickCountInfo("#tcinfo_cnts", dmanObj.tickCounterTotal);

    if ( tciLevel ) {
        putTickCountInfo("#tClevel", tciLevel);
    }
    if ( _nLength ) {
        putTickCountInfo("#tcinfo_ncount", _nLength);
    }
    if ( update ) {
        putTickCountInfo("#tcinfo_level", dmanObj.tickCounterLevel);
        putTickCountInfo("#tcinfo_check", dmanObj.tickCounterLevelV);
        putTickCountInfo("#tcinfo_cycles", dmanObj.tickCounterCycles);
        putTickCountInfo("#tcinfo_modvalue", dmanObj.tickCounterControlValue);
    }

    let _theCanvas = linObj.CANVAS;
    if ( _theCanvas ) {
        _theCanvas = _theCanvas._groups[0][0];
        let _theTransform = _theCanvas.viewportElement.__zoom;
        let _k = 1.0;
        if ( _theTransform ) {
            putTickCountInfo("#trfinfo_x", _theTransform.x);
            putTickCountInfo("#trfinfo_y", _theTransform.y);
            _k = _theTransform.k;
            putTickCountInfo("#trfinfo_scale", _k);
        }
        let _tcBox = _theCanvas.getBBox();
        putTickCountInfo("#trfinfo_cw", ( _tcBox.width * _k ));
        putTickCountInfo("#trfinfo_ch", ( _tcBox.height * _k ));
    }
}

export function putTickCountInfo(_id, value) {
    let _theElem = d3.select(_id)._groups[0][0];
    _theElem.innerHTML = value;
}

function setTickCountInfo(linObj, _tLevel) {
    let dmanObj = linObj.DATAman;
    let _tCount = parms.getTickCount(_tLevel);
    dmanObj.tickCounterControlValue = _tCount.check;                       // set new value for modulo-ops
    dmanObj.tickCounterLevel = _tLevel;                                    // set new level
    dmanObj.tickCounterCycles = _tCount.cyc;                               // set new multiplyer
    dmanObj.tickCounterThreshold = _tCount.val * dmanObj.tickCounterCycles;   // set new threshold
    parms.SET("RENDERER_UPDATE_LEVEL", _tLevel);
    parms.SET("RENDER_UPDATE_INTERVAL", parms.getTickCount(_tCount.check));
}

//---------------------------------------------------------------------------

export function initZOOM(linObj) {
    // initialize zoom and pan capabilities
    let the_CANVAS = linObj.CANVAS;
    var the_zoom = d3.zoom()
                .scaleExtent([0.01, 100])
                .on("zoom", function({transform}) { the_CANVAS.attr("transform", transform); });
    linObj.zoomO = the_zoom;
    linObj.SVG
        .call(the_zoom)
        .on('dblclick.zoom', null)
        ;
}

export function initTooltip(linObj)
{
    if (parms.GET("SHOW_TOOLTIPS")) {
        if (!linObj.SVG_DRAGABLE_ELEMENTS ) {
            return;
        }
        linObj.SVG_DRAGABLE_ELEMENTS
            .on("mouseover", null)
            .on("mouseenter", null)
            .on("mousemove", null)
            .on("mouseout", null);
    }
    d3.select("#tooltip").remove(); // remove any previous elements
    d3.select("#main").append("div").attr("id", "tooltip");
    registerTooltipEventhandler(linObj);
}

function registerTooltipEventhandler(linObj)
{
    if ( linObj == undefined) {
        let renderer = parms.oGET("RENDERER");
        linObj = renderer.instance;
        }
    if (parms.GET("SHOW_TOOLTIPS")) {
        let tooltip = d3.select("#tooltip");
        linObj.SVG_DRAGABLE_ELEMENTS
            .on("mouseover", function (node) {
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function (event) { // adjust tooltip position
                return tooltip
                    .style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 15) + "px");
            })
            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            })
        ;
        if (linObj.SIMmode !== "TREE") {
            linObj.SVG_DRAGABLE_ELEMENTS
                .on("mouseenter", function (event, node) { // insert tooltip content
                    let tooltipString = linObj.RENDERhelper.getNodeAttributesAsString(node.data.ynode);
                    return tooltip.text(tooltipString);
                })
            ;
        } else {
            linObj.SVG_DRAGABLE_ELEMENTS
                .on("mouseenter", function (event, node) { // insert tooltip content
                    let tooltipString = linObj.RENDERhelper.getNodeAttributesAsString(node);
                    return tooltip.text(tooltipString);
                })
            ;
        }
    } else {
        linObj.SVG_DRAGABLE_ELEMENTS
            .on("mouseover", null)
            .on("mouseenter", null)
            .on("mousemove", null)
            .on("mouseout", null)
            ;
        d3.select("#tooltip").style("visibility", "hidden");
    }
}

function inittooltipYV(linObj)
{
    if (parms.GET("SHOW_YEARVALUES")) {
        if (linObj.SVG_CONTOURS) {
            linObj.SVG_CONTOURS
            .on("mouseover", null)
            .on("mouseenter", null)
            .on("mousemove", null)
            .on("mouseout", null)
            ;
        }
    }
    d3.select("#tooltipYV").remove(); // remove any previous elements
    d3.select("#main").append("div").attr("id", "tooltipYV");
    registertooltipYVeventhandler(linObj);
}

function registertooltipYVeventhandler(linObj)
{
    if ( linObj == undefined) {
        let renderer = parms.oGET("RENDERER");
        linObj = renderer.instance;
        }
    if (parms.GET("SHOW_YEARVALUES")) {
        let tooltip = d3.select("#tooltipYV");
        tooltip.style("visibility", "visible");
        if (linObj.SVG_CONTOURS) {
            linObj.SVG_CONTOURS
                .on("mouseover", function (event, c) {
                    // return tooltip.style("visibility", "visible");
                })
                .on("mouseenter", function (event, c) { // insert tooltip content
                    let tooltipString = c.value;
                    return tooltip.text(tooltipString);
                })
                .on("mousemove", function (event) { // adjust tooltip position
                    return tooltip
                        .style("top", (event.pageY - 10) + "px")
                        .style("left", (event.pageX + 15) + "px");
                })
                .on("mouseout", function () {
                    // return tooltip.style("visibility", "hidden");
                })
                ;
        }
    } else {
        if (linObj.SVG_CONTOURS) {
            linObj.SVG_CONTOURS
                .on("mouseover", null)
                .on("mouseenter", null)
                .on("mousemove", null)
                .on("mouseout", null)
                ;
        }
        d3.select("#tooltipYV").style("visibility", "hidden");
    }
}

export function closeModalIDB()
{
    document.querySelector("#overlay").style.display = "none";
    let ovHTML = gui.FILE_MODAL();
    let OVelmnt = document.getElementById("overlay");
    OVelmnt.innerHTML = ovHTML;
}

export function showIDBstate() {
    let ovHTML = gui.IDB_INDEX();
    let OVelmnt = document.getElementById("overlay");
    OVelmnt.innerHTML = ovHTML;
    d3.select("#overlay").on("click", function(event) {
        closeModalIDB(event);
    });

    const _liHead = document.getElementById("idbstores");
    _liHead.innerHTML = "";
    let db;
    const mkeyList = new Map();
    const DB = new Promise((resolve, reject) => {
        const request = indexedDB.open("wtTAM");
        request.onsuccess = () => resolve(request.result);
    });
    const idbSlist = new Promise((resolve, reject) => {
        DB.then(idb => {
            db = idb;
            let dbos = idb.objectStoreNames;
            let _dbos = Array.from(dbos);
            resolve(_dbos);
        });
    });
    idbSlist.then(snames => {
            let _snames = snames;
                snames.forEach(sname => {
                    const liItem = document.createElement("li");
                    liItem.classList = 'ulli';
                    _liHead.appendChild(liItem);
                    const param = document.createElement("p");
                    param.innerHTML = sname;
                    liItem.appendChild(param);
                    const showButton = document.createElement('button');
                    liItem.appendChild(showButton);
                    showButton.innerHTML = '>';
                    showButton.title = 'Click to Show Items';
                    // here we are setting a data attribute on our show button to say what task we want shown if it is clicked!
                    showButton.setAttribute('key-task', sname);
                    showButton.onclick = function(event) {
                      showIDBkeys(event);
                    };
                    // liItem itself will do nothing
                    liItem.onclick = function(event) {
                        event.stopPropagation();
                    };
                });
                document.querySelector("#overlay").style.display = "inline";
        });
}

function showFromIDB(event) {
    let actNodeE = event.target;
    let dstring = event.target.getAttribute("show-task");
    event.stopPropagation();
    closeModalIDB();
    let dstrings = dstring.split("|");
    let dbName = "wtLIN";
    let dbStore = dstrings[0];
    let dbKey = dstrings[1];
    loadDataFromIDB(dbName, dbStore, dbKey);
}

export function showIDBkeys(event) {
    let actNodeE = event.target;
    let actNode = actNodeE.parentNode;
    let sname = event.target.getAttribute("key-task");
    event.stopPropagation();
    let db;
    const DB = new Promise((resolve, reject) => {
        const request = indexedDB.open("wtLIN");
        request.onsuccess = () => {
            db = request.result;
            showIDBkeysL(actNode, db, sname, actNodeE);
            resolve(db);
        };
    });
}

function showIDBkeysL(actNode, db, sname, actNodeE) {
    const DBtactn = new Promise((res, rej) => {
        let taction = db.transaction(sname, "readonly");
        let ostore = taction.objectStore(sname);
        let req = ostore.openCursor();

        let _keyList = [];
        req.onsuccess = function(e) {
            let curs = e.target.result;
            if (curs) {
                let _key = curs.primaryKey;
                _keyList.push(_key);
                curs.continue();
            } else {
                showIDBkeysLdo(actNode, sname, _keyList, actNodeE);
            }
        };
        req.oncomplete = (ev) => {
            res(_keyList);
        };
        req.onerror = (ev) => {
            rej(ev);
        };
    });
}

function showIDBkeysLdo(actNode, sname, keyList, actNodeE) {
    const oliHead = document.createElement("ol");
    if (keyList.length > 0) {
        keyList.forEach( idbKey => {
            const oliItem = document.createElement("li");
            // oliItem.innerHTML = ':';
            oliItem.classList = 'olli';
            oliHead.appendChild(oliItem);
            oliItem.title = 'Load from Store';
            const param = document.createElement("p");
            param.innerHTML = idbKey;
            oliItem.appendChild(param);
            // here we are setting a data attribute on our param to say what task we want done if it is clicked!
            param.setAttribute('show-task', sname+'|'+idbKey);
            param.onclick = function(event) {
                showFromIDB(event);
            };
            const delButton = document.createElement('button');
            oliItem.appendChild(delButton);
            delButton.innerHTML = 'E';
            delButton.title = 'Erase from Store';
            // here we are setting a data attribute on our del button to say what task we want done if it is clicked!
            delButton.setAttribute('del-task', sname+'|'+idbKey);
            delButton.onclick = function(event) {
                delIDBkey(event);
            };
        });
    } else {
        const param = document.createElement("p");
        // oliItem.innerHTML = ':';
        oliHead.appendChild(param);
        param.innerHTML = 'Number of entries in this Store: 0';
    }
    actNode.appendChild(oliHead);
    actNodeE.innerHTML = '';       // show button will be set inactiv
    actNodeE.onclick = function(event) {
        event.stopPropagation();
    };
}

export function updatencounter(linObj) {
    let osn = linObj.yNODES;
    let nc = osn.length;
    let oon = linObj.DATAman.originalData.nodes;
    let ncn = oon.length;
    ncn = ncn - nc;
    let snodes = "Anzahl Knoten " + nc + " (" + ncn + " ausgeblendet)";
    let ncE = d3.select('#ncounter');
    let _ncl = linObj.DATAman.width/2 - 200;
    let _nct = linObj.DATAman.height - 40;
    ncE.text(snodes)
       .style('left', _ncl  + "px")
       .style('top', _nct  + "px");
}
