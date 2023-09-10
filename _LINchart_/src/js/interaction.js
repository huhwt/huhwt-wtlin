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
import { showIDBstate } from "./dbman.js";
import { TICKCOUNTER_html } from "./tickcounter.js";
import * as translate from "./translations.js";
import * as parms from "./parms.js";
import * as DBman from "./dbman.js";
import { onChangeFile, openNewTab, loadDataFromIDB } from "./interfaces.js";
import { createDownloadSVG, dump_Htree } from "./export.js";
import * as sliderTL from "./sliderTimeline.js";
import { showNameList, close_namelist } from "./filters.js";
import * as Rhelper from "./RENDERhelpers.js";
import { getCLUSTERsAt } from "./clusters.js";
import { CLUSTERexec, CLUSTERexec_DO } from "./lin-CLUSTER.js";
import { TREEexec } from "./lin-TREE.js";
import * as uti from "./utils.js";
import { shiftRuler } from "./yearScale.js";

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
    initZoom(linObj);

    // initialize tooltips for hovering over nodes
    initTooltip(linObj);

    // initialize tooltips for hovering over contours
    inittooltipYV(linObj);

    // define interaction possibilities for graph svg
    setTAMInteractions(linObj);

    // define interaction possibilities for menu bar
    set_linMENUBAR_actions();
    set_tamMENUBAR_actions();
    set_CONTROLS_actions();

    // reset tickCounterInfo
    initTickCountInfo();

}

export function initZoom(linObj) {
    // initialize zoom and pan capabilities
    let the_CANVAS = linObj.CANVAS;
    var the_zoom = d3.zoom()
                .on("zoom", function({transform}) {
                    linObj.s_transform.k = transform.k;
                    linObj.s_transform.x = transform.x;
                    linObj.s_transform.y = transform.y;
                    the_CANVAS.attr("transform", transform); 
                    d3.select('#zoom_value').text(transform.k*100);
                    d3.select('#x_value').text(transform.x);
                    d3.select('#y_value').text(transform.y);
                })
                .scaleExtent([0.01, 100])
                ;
    linObj.zoomO = the_zoom;
    linObj.SVG
        .call(the_zoom)
        .on('dblclick.zoom', null)
        ;
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
    function setDRAG(SVG_DRAGABLE) {
        SVG_DRAGABLE
            .call(d3.drag()
                .on("start", dragStartNode)
                .on("drag", dragNode)
                .on("end", dragEndNode)
            )
            .on("click", onMouseClick)
            .on("dblclick", onDblClick);
    }

    if (linObj.SVG_DRAGABLE_NODES)
        setDRAG(linObj.SVG_DRAGABLE_NODES);
}
//---------------------------------------------------------------------------
function dragStartNode(event, d)
{
    event.sourceEvent.stopPropagation();
    // console.log(event, event.active, d);
    let renderer = parms.oGET("RENDERER");

    renderer.RENDERhelper.resetScalarField(renderer.instance);
    if (!parms.GET("ENERGIZE"))
        renderer.FORCE_SIMULATION.velocityDecay(1);    // don't move anything than the selected node!
    renderer.FORCE_SIMULATION.alpha(0.1).restart();
    d.fx = d.x;
    d.fy = d.y;
    d.sr = 2;
    // console.log(event, event.active, d);

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
    // console.log(event, event.active, d);

    if (!parms.GET("ENERGIZE"))
        parms.oGET("RENDERER").FORCE_SIMULATION.velocityDecay(parms.GET("FRICTION")).alpha(0);    // reset friction

    if (parms.GET("SHOW_TOOLTIPS"))
        d3.select("#tooltip").style("opacity", 1.0);

    rerunSIM(parms.oGET("RENDERER"));
}
//---------------------------------------------------------------------------
function onMouseClick(event, d)
{
    d.fx = d.fy = null;
    if (d.sr == 2)
        d.sr = 1;
}
//---------------------------------------------------------------------------
function onDblClick(event, d)
{
    if (d.type == "PERSON" ) {
        d.sr = 2;
        d.fx = d.x;
        d.fy = d.y;
    } else {
        d.fx = d.x;
        d.fy = d.y;
   }
}
//---------------------------------------------------------------------------
function mouseoverContour(event, c)
{
    let renderer = parms.oGET("RENDERER");
    if (parms.GET("USE_MOUSEOVER")) {
        let sSuff = renderer.instance.get_sKENN();
        let pKENN = "#pattern" + sSuff;
        renderer.SVG_CONTOURS
            .attr("fill",
                function(d)
                {
                    // Currently selected one will be always at 0.5
                    if (c.value === d.value)
                    {
                        let _url = "url(" + pKENN + ") #000";
                        return _url;//chromadepth(0.5);
                    }
                    return renderer.SVG_COLORMAP(d.value);
                }
            );
    }
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
        if (_renderer.SIMmode == 'TLINE')
            _renderer.RENDERhelper.showNamesPL(_renderer.instance);
        else
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
        _renderer.DATAman.setColorMap(_renderer.instance);
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
export function toggleLINmenu(linObj, _doShow=null)
{
    let _shLM = _doShow;
    if (_doShow === null) {
        parms.TOGGLE("SHOW_LINmenu");
        _shLM = parms.GET("SHOW_LINmenu");
    } else {
        parms.SET("SHOW_LINmenu", _shLM);
    }
    let _mbar = d3.select('#menubar');
    let _left = _shLM ? '0px' : '-' + linObj.mb_width;
    _mbar.transition().duration(200).style('left', _left);
    let _main = d3.select('#main');
    _left = _shLM ? linObj.mb_width : '0px';
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
export function toggleTLslider(_doShow=null)
{
    let _shTLsl = _doShow;
    if (_doShow === null) {
        parms.TOGGLE("SHOW_TLslider");
        _shTLsl = parms.GET("SHOW_TLslider");
    } else {
        if (parms.GET("SHOW_TLslider") == _doShow)
            return;
        parms.SET("SHOW_TLslider", _shTLsl);
    }
    let _slelem = d3.select("#sliderTimeline");
    if (_shTLsl) {
        _slelem.style("display", null);
    } else {
        _slelem.style("display", "none");
    }
}
//---------------------------------------------------------------------------
export function togglePERSinfo(_doShow=false)
{
    let _shPinfo = _doShow;
    let _sPIelem = d3.select("#persinfo");
    if (_shPinfo) {
        _sPIelem.style("display", null);
    } else {
        _sPIelem.style("display", "none");
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
    parms.lSET("oploopspeed", 4);
    parms.lSET("viewboxdim", '6x6');
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
        console.log("Wswich_locale", _locale);
        parms.SET("ACTIVE_LOCALE", _locale);
        initMenubar();
        set_tamMENUBAR_actions();
        set_CONTROLS_actions();
        set_linMENUBAR_actions();
    }
}

export function initMenubar()
{
    let active_language = i18n("ZZZZ");
    if (active_language != parms.GET("ACTIVE_LOCALE")) {
        translate.switch_locale(parms.GET("ACTIVE_LOCALE"));
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
        let renderer = parms.oGET("RENDERER");
        if (renderer)
            updatencounter(renderer.instance);
    }

    YSprep();
    DSprep();
    YBprep();
    LBprep();

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
 * - toggle filter with_spouse
 */
function set_linMENUBAR_actions()
{
    let renderer = parms.oGET("RENDERER");
    if (!renderer)
        return;

    // // show active menu on top
    // d3.selectAll(".LINmenu").on("mouseenter", function(e) {
    //     let elem = e.target;
    //     elem.style.zIndex = 99;
    // });

    // set verbose 'ON' / 'OFF'
    d3.select("#version").on("click", function(e) {
        let renderer = parms.oGET("RENDERER");
        renderer.verbose = !renderer.verbose;
        if (renderer.verbose) {
            console.log("verbose -> ON");
            renderer.RENDERhelper.TooltipMaker = renderer.RENDERhelper.getNodeAttributesAsStringPos;
        } else {
            renderer.RENDERhelper.TooltipMaker = renderer.RENDERhelper.getNodeAttributesAsString;
            console.log("verbose -> OFF");
        }
    });

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

    // toggle filter action 'with_spouse'
    // -> when active, spouse of individuals filtered by 'names_list' will be displayed too
    d3.select("#cbfilterSpouse").on("change", function(e) {
        let renderer = parms.oGET("RENDERER");
        toggleFilterSpouse(renderer);
    });

    // time
    d3.selectAll("button[data-year]").on("click", function (e) {
        let renderer = parms.oGET("RENDERER");
        let _TL = renderer.DATAman.sliderTL; // parms.oGET('TLslider');
        let valueYear = this.getAttribute("data-year");
        e.stopPropagation();
        _TL.setYear(valueYear);
    });

    // loopspeed
    d3.selectAll("[data-speed]").on("click", function (e) {
        let vspeed = parseInt(this.value);
        document.activeElement.blur();
        let renderer = parms.oGET("RENDERER");
        let linObj = renderer.instance;
        renderer.newInterval(linObj, vspeed);
    });

    // viewboxdim
    d3.selectAll("[data-vbdim]").on("click", function (e) {
        let vbdim = this.value;
        let vbdact = parms.lGET("viewboxdim");
        if (vbdim !== vbdact) {
            document.activeElement.blur();
            renderer.setvbDim(vbdim);
        }
    });

    // CLUSTER view - GA -> Grid-View   HA -> Heap-View
    d3.select("#opCluster").on("change", function(e) {
        let renderer = parms.oGET("RENDERER");
        if (renderer.SVG_GROUP_LABELS) renderer.SVG_GROUP_LABELS.remove();
        renderer.instance.Cview = e.target.value;
        CLUSTERexec_DO(renderer.instance, renderer.DATAman);
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
    let renderer = parms.oGET("RENDERER");
    if (!renderer)
        return;

    let cA_elmnt = document.getElementById("clustersA");
    let cAtext = getCLUSTERsAt(renderer.DATAman.cAmode);
    cA_elmnt.title = i18n('Filtering mode') + ": " + cAtext;
    d3.select("#clustersA").on("click", null);
    d3.select("#clustersA").on("click", function (e) {
        toggleShowCa();
    });

    let cAselmnt = document.getElementById("clustersAsel");
    cAselmnt.innerHTML = '';
    let CsAt_i = 0;
    let CLUSTERsAt = getCLUSTERsAt();
    for (const key in CLUSTERsAt) {
        let _text = getCLUSTERsAt(key);
        let cAsd = document.createElement("div");
        let cAsb = document.createElement('button');
        cAsb.classList = "btn btn_sm button__50";
        cAsb.innerHTML = key;
        cAsb.value = key;
        cAsb.title = i18n(_text);
        // here we are setting a data attribute on our button to say what type of sorting we want done if it is clicked!
        cAsb.setAttribute('data-sound', key);
        cAsb.setAttribute('sound-index', CsAt_i);
        CsAt_i++;
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
    let linObj = renderer.instance;
    let _SIMmode = renderer.SIMmode;
    let valueDO = _this.getAttribute("data-view");
    if (valueDO == _SIMmode) return;                        // same Mode, nothing to do

    if (_SIMmode == "CLUSTER") {                            // old SIMmode is 'CLUSTER' ...
        let _actF = document.getElementById("opCluster");
        _actF.classList.toggle("off");                      // ... hide radio buttons
    }
    if (_SIMmode == "TLINE") {                              // old SIMmode is 'TLINE' ...
        linObj.test_persList();
    }

    let _actB = document.querySelector(".btn.active");
    if (_actB) _actB.classList.toggle("active");

    _this.classList.toggle("active");
    if (valueDO == "CLUSTER") {                             // new SIMmode is 'CLUSTER' ...
        let _actF = document.getElementById("opCluster");
        _actF.classList.toggle("off");                      // ... show radio buttons
    }

    parms.SET("SIMmode", valueDO);

    renderer.createForceGraph(valueDO, linObj);
    if (valueDO == "TLINE") {                               // new SIMmode is 'TLINE' ...
        linObj.test_persList("ON");
    }
}

/**
 * Switch soundex mode -> value is hosted in 'data-sound'
 */
function DSclicked(event, _this) {
    let renderer = parms.oGET("RENDERER");
    if (!renderer)
        return;

    let valueDO = _this.getAttribute("data-sound");
    if (valueDO == renderer.DATAman.cAmode) return;

    let _bs = document.getElementById("clustersA");
    _bs.innerHTML = valueDO;
    let _csAt = getCLUSTERsAt[valueDO];
    _bs.title = i18n('Filtering mode') + ": " + _csAt;
    document.querySelector("#clustersAsel").style.display = "none";

    let _csAt_i = parseInt(_this.getAttribute("sound-index"));
    renderer.DATAman.cAmode = valueDO;
    renderer.DATAman.cAtag = _csAt[1];
    renderer.DATAman.cAind = _csAt_i;

    let _smode = renderer.SIMmode;
    renderer.createForceGraph(_smode, renderer);
}
//---------------------------------------------------------------------------

/**
 * Set title for elements in '#yearSlider' and '#yearScale' 
 */
 function YSprep()
{
    function YSel(pelem) {
        let helem = pelem.querySelectorAll(".hasTitle");
        helem.forEach((celem) => {
            if ( celem.tagName == 'path' || celem.tagName == 'circle')  // svg-elements -> 'title' in separate subordered element
                celem.firstChild.textContent = i18n(celem.id);
            else
                celem.title = i18n(celem.id);                           // others -> set explicitly
        });
    }
    let TLelmnt = document.getElementById("sliderTimeline");            // titled elements are buttons
    if (TLelmnt.childElementCount < 1) {
        let tlHTML = sliderTL.TLslider_html();
        TLelmnt.innerHTML = tlHTML;
    } else {
        YSel(TLelmnt);
    }

    let YSelmnt = document.getElementById("yearScale");                 // titled elements are svg-elements
    if (YSelmnt.childElementCount < 1) {
    } else {
        YSel(YSelmnt);
    }
}
//---------------------------------------------------------------------------

function YBprep()
{
    let YBelmnt = document.getElementById("yearBoxes");
    YBelmnt.innerHTML = '';
    let _YearS = parseInt(parms.GET("RANGE_MIN"));
    let _YearE = parseInt(parms.GET("RANGE_MAX"));
    if (_YearS > 1500) {
        _YearS = 1500;
    } else {
        _YearS -= (_YearS % 100);
    }
    let _bcnt = 0;
    let YBeld = document.createElement('div');
    YBelmnt.appendChild(YBeld);
    for (let y=_YearS; y<_YearE; y+=50) {
        _bcnt++;
        if (_bcnt > 4) {
            YBeld = document.createElement('div');
            YBelmnt.appendChild(YBeld);
            _bcnt = 1;
        }
        let YBbtn = document.createElement('button');
        let _classb_xx = "button__40";
        let _yt = "" + y;
        if ( y % 100 != 0) {
            _classb_xx = "button__30";
            _yt = "+50";
        }
        YBbtn.classList = "btn btn_sm " + _classb_xx;
        YBbtn.innerHTML = _yt;
        YBbtn.value = y;
        YBbtn.title = i18n("Set active year");
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
    YBbtn.title = i18n("Set active year");
    // here we are setting a data attribute on our button to say what type of sorting we want done if it is clicked!
    YBbtn.setAttribute('data-year', _YearE);
    YBeld.appendChild(YBbtn);
}
//---------------------------------------------------------------------------

function LBprep()
{
    let active_language = i18n("ZZZZ");

    let cLselmnt = document.getElementById("LANGsel");
    cLselmnt.innerHTML = '';
    let LANGSsAt = translate.LANGsAt;
    for (const key in LANGSsAt) {
        let _vals = LANGSsAt[key];
        let cLsd = document.createElement("input");
        cLsd.classList = "btn btn-sm btn-smb button__lang";
        cLsd.type = "button";
        cLsd.value = _vals[1];
        if (active_language == _vals[1])
            cLsd.classList += " active";
        cLsd.title = i18n("lang_" + _vals[0]);
        // cLsd.setAttribute('style', "border:1px solid gray");
        let _id = "btn_l_" + _vals[1];
        cLsd.id = _id;
        cLselmnt.appendChild(cLsd);
    }
}

//---------------------------------------------------------------------------
function close_toggle(elemID) {
    let _mt = document.getElementById(elemID);
    _mt.checked = false;
}

function set_tamMENUBAR_actions()
{
    let renderer = parms.oGET("RENDERER");
    if (!renderer)
        return;
    //  Load From IDB
    d3.select("#btnLoad").on("click", function(event) {
        showIDBstate(event);
        close_toggle("toggle_os");
    });
    //  Load File
    d3.select("#browse").on("change", function(event) {
        onChangeFile(event);
        close_toggle("toggle_os");
    });
    d3.select("#fakeBrowse").on("click", function(event) {
        document.getElementById('browse').click();
        close_toggle("toggle_os");
    });
    //  Save
    d3.select("#btnSave").on("click", function (e) {
        renderer.saveData();
        close_toggle("toggle_os");
    });        
    d3.select("#btnSaveF").on("click", function (e) {
        renderer.saveDataF();
        close_toggle("toggle_os");
    });        
    d3.select("#btnSvgExport").on("click", function (e) {
        let _rkenn = renderer.svgKENN;
        let _elem = 's' + _rkenn;
        let _fnSVG = _rkenn + '.html';
        createDownloadSVG(document.getElementById(_elem).outerHTML, _fnSVG, _elem);
    });        
    //  Interaction
    d3.select("#bt_toggleMenu").on("click", function (e) {
        toggleLINmenu(renderer.instance);
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
        let _tv = parseFloat(this.value);
        parms.SET("LINK_STRENGTH", _tv);
        // renderer.LINK_FORCE.strength(parms.GET("LINK_STRENGTH"));
        TREEexec(renderer.instance, renderer.DATAman);
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
        if (renderer.SVG_LINKS) { 
            let _tv3 = _tv * 3;
            renderer.SVG_LINKS
                .attr("stroke-width", function(l) { return l.directed ? _tv + "px" : _tv3 + "px"; });
            }
        if (renderer.SVG_LINKS_STREETS) renderer.SVG_LINKS_STREETS.attr("stroke-width", _tv + "px");
        if (renderer.SVG_LINKS_TUNNELS) renderer.SVG_LINKS_TUNNELS.attr("stroke-width", _tv + "px");
        if (renderer.SVG_TUNNEL_ENTRIES_1) renderer.SVG_TUNNEL_ENTRIES_1.attr("stroke-width", _tv + "px");
        if (renderer.SVG_TUNNEL_ENTRIES_2) renderer.SVG_TUNNEL_ENTRIES_2.attr("stroke-width", _tv + "px");
    });
    d3.select("#settings_noderadius").on("input", function() {
        let _tv = parseInt(this.value);
        parms.SET("NODE_RADIUS", _tv);
        if (renderer.yNODES) {
            let _tw = 2 * _tv;
            renderer.yNODES.forEach(n => {n.r0 = _tv; n.r = _tv;});
            if (renderer.SVG_NODES) {
                renderer.SVG_NODES
                    .attr("width", function (p) { return _tw; })
                    .attr("height", function (p) { return _tw; })
                ;
            }
        }
    });
    d3.select("#settings_pnodeopacity").on("input", function() {
        let _tv = parseFloat(this.value);
        parms.SET("PERSON_LABEL_OPACITY",_tv);
        if (renderer.SVG_NODE_LABELS) renderer.SVG_NODE_LABELS.style("opacity", _tv);
        if (renderer.SVG_GROUP_LABELS) renderer.SVG_GROUP_LABELS.style("opacity", _tv);
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
    d3.select("#btn_l_ca").on("click", function (e) {
        Wswitch_locale('ca');
    });
    d3.select("#btn_l_es").on("click", function (e) {
        Wswitch_locale('es');
    });

    // tickcount-Info
    d3.select("#btn_tcIreset").on("click", function (e) {
        setTickCountInfo(renderer.instance, 'min');
    });

}

function set_CONTROLS_actions()
{
    let renderer = parms.oGET("RENDERER");
    if (!renderer)
        return;

    // Force Info
    d3.selectAll("a[data-info]").on("click", function (e) {
        let valueInfo = this.getAttribute("data-info");
        e.stopPropagation();
        check_CONTROLS(renderer, valueInfo);
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

function check_CONTROLS(renderer, valueInfo) {
    let rendObj = renderer.instance;
    if(valueInfo == "print") {
        console.log("print Simulation", renderer.FORCE_SIMULATION);
        console.log("print yNODES", renderer.yNODES);
        console.log("print yLINKS", renderer.yLINKS);
    } else if(valueInfo == "export") {
        let _rkenn = renderer.svgKENN;
        let _elem = 's' + _rkenn;
        let _fnSVG = _rkenn + '.html';
        createDownloadSVG(document.getElementById(_elem).outerHTML, _fnSVG, _elem);
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
        } else if (_siMODE == "TLINE") {
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
        rerunSIM(renderer);
    } else if(valueInfo == "center") { 
        var _SVG = rendObj.SVG;
        // let the_CANVAS = linObj.CANVAS._groups[0][0];
        // let _transform = the_CANVAS.getAttribute('transform');
        _SVG.call(
            rendObj.zoomO.transform,
            d3.zoomIdentity.translate(0, 0).scale(1)
        );
        rendObj.s_transform.x = 0;
        rendObj.s_transform.y = 0;
        rendObj.s_transform.k = 1;
        shiftRuler(0);
        // let the_CANVASu = linObj.CANVAS._groups[0][0];
        // let _transformu = the_CANVASu.getAttribute('transform');
        // console.log("center pre:", _transform,"post:", _transformu);
    } else if(valueInfo == "zoom-in") {
        let _transform = rendObj.s_transform;
        let _scale = _transform.k * parms.ZOOMfactor;
        _transform.k = _scale;
        rendObj.s_transform.k = _transform.k;
        rendObj.s_transform.x = _transform.x;
        rendObj.s_transform.y = _transform.y;
        let _SVG = rendObj.SVG;
        _SVG.call(
            rendObj.zoomO.transform,
            d3.zoomIdentity.translate(_transform.x, _transform.y).scale(_transform.k)
        );
        d3.select('#zoom_value').text(_transform.k*100);
        d3.select('#x_value').text(_transform.x);
        d3.select('#y_value').text(_transform.y);
    } else if(valueInfo == "zoom-out") {
        let _transform = rendObj.s_transform;
        let _scale = _transform.k / parms.ZOOMfactor;
        _transform.k = _scale;
        rendObj.s_transform.k = _transform.k;
        rendObj.s_transform.x = _transform.x;
        rendObj.s_transform.y = _transform.y;
        let _SVG = rendObj.SVG;
        _SVG.call(
            rendObj.zoomO.transform,
            d3.zoomIdentity.translate(_transform.x, _transform.y).scale(_transform.k)
        );
        d3.select('#zoom_value').text(_transform.k*100);
        d3.select('#x_value').text(_transform.x);
        d3.select('#y_value').text(_transform.y);
    }

}

export function rerunSIM(renderer) {
    parms.SET("ENERGIZE", true);
    let _aF = renderer.FORCE_SIMULATION.alpha();
    _aF += 0.2;
    let _aFm = 1;
    let _aT = parms.GET("ALPHA_target");
    if (renderer.SIMmode == "TREE") {
        renderer.RENDERhelper.resetScalarField(renderer.instance);
        // renderer.forceRefresh = true;
        parms.SET("SHOW_YEARVALUES", false);
        registertooltipYVeventhandler();
        _aFm = parms.GET("ALPHA_T");
        if (_aF > _aFm) { _aF = _aFm; }
        renderer.instance.FORCE_SIMULATION
            .alpha(_aF)
            .alphaTarget(_aT)
            .restart()
            ;
    } else {
        _aFm = parms.GET("ALPHA_x");
        if (_aF > 1) { _aF = 1; }
        renderer.instance.FORCE_SIMULATION
            .alpha(_aF)
            .restart()
            ;
    }
}

function setRANGE(renderer, _RANGE, _tv) {
    parms.SET(_RANGE, _tv);
    renderer.DATAman.setColorMap(renderer.instance);
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

// export function initZOOM(linObj) {
//     // initialize zoom and pan capabilities
//     let the_CANVAS = linObj.CANVAS;
//     var the_zoom = d3.zoom()
//                 .scaleExtent([0.01, 100])
//                 .on("zoom", function({transform}) { 
//                     the_CANVAS.attr("transform", transform);
//                     let k = transform.k; 
//                     d3.select('#zoom_value').text(t.k*100);
//                 });
//     linObj.zoomO = the_zoom;
//     linObj.SVG
//         .call(the_zoom)
//         .on('dblclick.zoom', null)
//         ;
// }

export function initTooltip(linObj)
{
    if (parms.GET("SHOW_TOOLTIPS")) {
        if (!linObj.SVG_DRAGABLE_NODES ) {
            return;
        }
        linObj.SVG_DRAGABLE_NODES
            .on("mouseover", null)
            .on("mouseenter", null)
            .on("mousemove", null)
            .on("mouseout", null);
        if (linObj.SVG_DRAGABLE_OTHERS) {
            linObj.SVG_DRAGABLE_OTHERS
                .on("mouseover", null)
                .on("mouseenter", null)
                .on("mousemove", null)
                .on("mouseout", null)
                ;
        }
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
        if (linObj.SVG_DRAGABLE_NODES)
            tooltipON(linObj, linObj.SVG_DRAGABLE_NODES, tooltip);
        if (linObj.SVG_DRAGABLE_OTHERS)
            tooltipON(linObj, linObj.SVG_DRAGABLE_OTHERS, tooltip);
    } else {
        if (linObj.SVG_DRAGABLE_NODES)
            tooltipOFF(linObj.SVG_DRAGABLE_NODES);
        if (linObj.SVG_DRAGABLE_OTHERS)
            tooltipOFF(linObj.SVG_DRAGABLE_OTHERS);
        d3.select("#tooltip").style("visibility", "hidden");
    }
}
export function tooltipOFF(SVG_ELEMENTS) {
    SVG_ELEMENTS
        .on("mouseover", null)
        .on("mouseenter", null)
        .on("mousemove", null)
        .on("mouseout", null)
        ;
}
export function tooltipON(linObj, SVG_ELEMENTS, tooltip) {
    SVG_ELEMENTS
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
    SVG_ELEMENTS
        .on("mouseenter", function (event, node) { // insert tooltip content
            // let tooltipString = linObj.RENDERhelper.getNodeAttributesAsString(node);
            let tooltipString = linObj.RENDERhelper.TooltipMaker(linObj, node);
            return tooltip.text(tooltipString);
        })
    ;
}
export function switchToolTip(SVG_ELEMENTS) {

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

export function updatencounter(linObj) {
    let oon = linObj.DATAman.originalData.nodes;
    let ncn = oon.length;

    let snodes = "show_nc_ncn";
    let _ncl = linObj.DATAman.width/2 - 200;
    let _nct = linObj.DATAman.height - 50;
    switch (linObj.SIMmode)
    {
        case "CLUSTER":
            let osg = parms.oGET("odataDm");
            let osc = osg.children.length;
            let gsg = linObj.gNODESc;
            let nsc = gsg.length;
            let ocn = osc - nsc;
            let opn = linObj.pNODESc;
            let opc = opn.length;
            ncn = ncn - opc;
            snodes = i18n('show_nc_ncnC', { pnc: nsc, pncn: ocn}) + ' |';
            let _ncEdimC = uti.textSize(snodes);
            _ncl = linObj.DATAman.width/2 - _ncEdimC.width + 5.5;
            snodes += i18n('show_nc_ncn', { pnc: opc, pncn: ncn});
            _nct = linObj.DATAman.height - 50;
            break;
        default:
            let osn = linObj.yNODES;
            let nc = osn.length;
            ncn = ncn - nc;
            snodes = i18n('show_nc_ncn', { pnc: nc, pncn: ncn});
            let _ncEdim = uti.textSize(snodes);
            _ncl = linObj.DATAman.width/2 - _ncEdim.width/2;
            break;
    }
    let ncE = d3.select('#ncounter');
    ncE.text(snodes)
       .style('left', _ncl  + "px")
       .style('top', _nct  + "px");
}
