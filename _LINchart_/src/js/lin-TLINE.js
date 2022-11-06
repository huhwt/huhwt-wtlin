/* jshint -W014 */
/* jshint -W083 */

///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// TLINE Renderer
//
///////////////////////////////////////////////////////////////////////////////

import * as parms from "./parms.js";
import * as uti from "./utils.js";
import { initInteractions, initTooltip, tooltipON, tooltipOFF, initZoom, makeTickCountInfo, updatencounter } from "./interaction.js";
import { getColor} from "./indexman.js";
import { RENDERhelper, reset, setArrow } from "./RENDERhelpers.js";

var PARM_GROUP_NODE_BORDER_COLOR = "#f88";
var PARM_GROUP_NODE_BORDER_WIDTH = 1;
var PARM_GROUP_FONT_SIZE = 16;
var PARM_GROUP_NODE_OPACITY = 0.7;
var PARM_GROUP_BAR_WIDTH = 14;

export function TLINEexec(linObj, dmanObj) {
    let r_s = parms.GET("REPULSION_STRENGTH_x");
    parms.SET("REPULSION_STRENGTH", r_s);

    parms.SET("PERSON_LABELS_BELOW_DIST", 24);

    linObj.REPULSION_FORCE = d3.forceManyBody().strength(-parms.GET("REPULSION_STRENGTH"));
    linObj.LINK_FORCE = d3.forceLink([]).strength(-1);

    linObj.TLINEtcount = 0;
    linObj.TLINEtcount_OLD = 0;
    linObj.TLINErmul = 1.0;
    linObj.names_lidx = parms.oGETmap("names_lidx");

    makeYPOS(linObj.yNODES, dmanObj);
    var nodeMap = parms.oGET("OnodeMap");

    TLINEexec_DO(linObj, dmanObj);
}
export function TLINEexec_DO(linObj, dmanObj) {

    // ------------------------------------------------------------------------------------------------------------------------

    TLINEsim(linObj, dmanObj);

    // ("Force Graph Initialized.");
    console.log(i18n("F_G_I"), "pNODESt ", linObj.pNODESt.length);

    linObj.RENDERhelper.set_xNODES(linObj.pNODESt);
    linObj.RENDERhelper.set_gNODES(linObj.gNODESt);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///  CREATE SVG ELEMENTS
    dmanObj.initSVGLayers(linObj);
    dmanObj.toggleYearScale(true);
    dmanObj.setColorMap(linObj);
    TLINEdraw(linObj, dmanObj);

    // ("SVG Elements Initialized.");
    console.log(i18n("SVG_E_i"));

    // ------------------------------------------------------------------------------------------------------------------------

    if (!linObj.isInitialized) {
        initInteractions(linObj);
        linObj.isInitialized = true;
    }
    updatencounter(linObj);

    // ("Interactions Initialized.");
    console.log(i18n("Int_i"));
}

function TLINEsim(linObj, dmanObj) {
    let suff = "YP";
    let _dataKenn = "tdata" + suff;
    let _names_s = "names_sDM";

    let _TLrange = dmanObj.sliderTL.YearE - dmanObj.sliderTL.YearS;
    let _yearS = dmanObj.sliderTL.YearS;
    let _tdata = parms.oGET(_dataKenn);
    var _names_sXX = parms.oGETmap(_names_s);

    dmanObj.widthR = dmanObj.width * 4;
    let _xf = dmanObj.widthR / _TLrange;
    linObj.tstep = _xf;
    dmanObj.YEARscale.setTstep(_xf);
    linObj.gNODESt = [];
    linObj.pNODESt = [];
    linObj.pLINKSt = [];
    linObj.chShowCntc = 0;

    _tdata.children.forEach( function(c, i) {
        let _group = c.data.group;
        c.group = _group;
        c.data.names = null;
        c.x = (_group - _yearS) * _xf - dmanObj.widthR / 2;
        c.y = 0;
        let _x0 = c.x;
        let _y0 = c.y;
        c.chShow = false;
        c.chShowCnt = null;
        c.data.vis = { 'x': _x0, 'y': _y0 };
        c.vis = c.data.vis;
        c.data.vis0 = { 'x': _x0, 'y': _y0};
        c.vis0 = c.data.vis0;
        linObj.gNODESt.push(c);
    });

    linObj.TLINEmapG.clear();
    linObj.gNODESt.forEach( function (g, i) {
        let p_pos = {
            'x': g.x, 'y': g.y,
            'vis': g.vis,
            'visP': null
       };
       linObj.TLINEmapG.set(g.nodeID, p_pos);
    });
    // TLINE-Ansicht fallweise neu aufbauen ...
    let _gNchk = (linObj.TLINEmapG.size > 0);     // ... gibt es expandierte Gruppen ?
    linObj.gNODESt.forEach( function (g, i) {
        g.type = "GNODE";
        g.sortname = g.children[0].ynode.sortname;
        g.chShow = false;
        g.fx = null;
        g.fy = null;
        g.cr = 0;
        g.width = PARM_GROUP_BAR_WIDTH;
        g.height = g.children.length * 100;
        if (linObj.TLINEmapG.has(g.nodeID)) {     // diese Gruppe war bereits expandiert
            _gNchk = false;                             // ... wir expandieren, Nachbearbeitung nicht nötig
            g.chShow = true;
            g.chShowCnt = 100;
            linObj.chShowCntc += 1;
            let _cCnt = g.children.length;
            let _y0 = g.y - ( _cCnt/2 ) * 100;
            let _y = _y0 + 50;
            g.children.forEach( function (n,i) {        // Personen zu Gruppe
                n.nodeID = n.ynode.id;
                n.Clfd = i;
                n.y = g.y;
                _y += 100;
                n.vis = { 'x': g.x, 'y': g.y };
                n.x = n.vis.x;
                n.fx = null;
                n.fy = null;
                n.vis0 = g.data.vis0;
                n.r = n.ynode.r;
                n.sr = n.ynode.sr;
                n.Yvalue = n.ynode.Yvalue;
                n.type = "PNODE";
                n.cnShow = true;
                n.isDragged = null;
                n.isLinked = false;
                n.parent = g;
                linObj.pNODESt.push(n);
            });
            g.y = _y0;
            g.vis.y = _y0;
        }
    });

    linObj.TLINEmapP.clear();
    linObj.pNODESt.forEach( function (n, i) {
        linObj.TLINEmapP.set(n.nodeID, n);
    });

    /**
     * Links umkopieren -> Referenzen auf yNODES ersetzen gegen Referenzen auf pNODESt
     */
    linObj.pLINKStall = [];
    linObj.yLINKS.forEach( function(l) {
        let _idS = l.source.id;
        let _idT = l.target.id;
        let _ngS = linObj.TLINEmapP.get(_idS);
        let _ngT = linObj.TLINEmapP.get(_idT);
        if (_ngS && _ngT) {
            let _tLINK = {
                "color": l.color,
                "directed": l.directed,
                "distance": l.distance,
                "index": l.index,
                "relation": l.relation,
                "source": _ngS,
                "target": _ngT,
                "type": l.type
            };
            linObj.pLINKStall.push(_tLINK);
        }
    });
    /**
     * Verweise von Nodes(ID) auf Links(Source oder Target) erstellen
     */
    if (!linObj.TLINEmapPL)
        linObj.TLINEmapPL = new Map();
    linObj.TLINEmapPL.clear();

    linObj.pLINKStall.forEach( function(tl) {
        let _ngSid = tl.source.nodeID;
        let _ngTid = tl.target.nodeID;
        if (linObj.TLINEmapPL.has(_ngSid)) {
            let _data = linObj.TLINEmapPL.get(_ngSid);
            _data.push(tl);
            linObj.TLINEmapPL.set(_ngSid, _data);
        } else {
            let _data = [tl];
            linObj.TLINEmapPL.set(_ngSid, _data);
        }
        if (linObj.TLINEmapPL.has(_ngTid)) {
            let _data = linObj.TLINEmapPL.get(_ngTid);
            _data.push(tl);
            linObj.TLINEmapPL.set(_ngTid, _data);
        } else {
            let _data = [tl];
            linObj.TLINEmapPL.set(_ngTid, _data);
        }
    });

    console.log("TLINEsim", "gNODESt", linObj.gNODESt, "TLINEmapG", linObj.TLINEmapG);
    console.log("TLINEsim", "pNODESt", linObj.pNODESt, "TLINEmapP", linObj.TLINEmapP);
    console.log("TLINEsim", "pLINKStall", linObj.pLINKStall, "TLINEmapPL", linObj.TLINEmapPL);

    dmanObj.YEARscale.setNODES(linObj.gNODESt);

    linObj.sNODES = linObj.gNODESt.slice(0);
    linObj.pNODESt.forEach(p => linObj.sNODES.push(p));

    linObj.tickCallback = TLINEtick;

    linObj.TLINErmul = 1.0;
    linObj.FORCE_SIMULATION = TLINEsimGV(linObj, dmanObj);

    linObj.LINK_FORCE = d3.forceLink(linObj.pLINKSt).distance(function(d){ return d.distance; }).strength(parms.GET("LINK_STRENGTH_TL"));

}

export function TLINEsimGV(linObj, dmanObj) {
    let _gravX = parms.GET("GRAVITY_X_x");
    let _gravY = parms.GET("GRAVITY_Y_x");
    let ysWidth = dmanObj.width - 2 * dmanObj.YEARscale_offset;
    let _alpha = parms.GET("ALPHA_T");

    let _SIMULATION = d3.forceSimulation(linObj.sNODES)
        .force("x", d3.forceX( function (n) {
            let px0 = n.x;
            if (n.type == "PNODE") {
                if(!n.isDragged) {
                    px0 = n.parent.x;
                }
            }
            return px0;
        }).strength(_gravX)) 
        .force("y", d3.forceY( function (n) {
            let py0 = n.y;
            if (n.type == "PNODE")
                py0 = n.parent.y + n.Clfd * 100;
            return py0;
        }).strength(_gravY)) 
                // .force("center", d3.forceCenter(0, 0))
        .force("charge", linObj.REPULSION_FORCE)
        // .force("TLINEG", forceTLINE(linObj, linObj.gNODESt))
        // .force("collide", d3.forceCollide().radius(function(n){ 
        //                                 let _f = 0;
        //                                 if (n.type == "PNODE")
        //                                     _f = 4 * n.r;
        //                                 return _f; }))
        .force("link", linObj.LINK_FORCE)
        .alpha(_alpha)
        // .alphaDecay(0.228)
        .alphaTarget(0.01)
        .velocityDecay(parms.GET("FRICTION"))
        .on("tick", function tick() { linObj.tickCallback(linObj); })
        .on("end", function update() { linObj.RENDERhelper.updateScalarField(linObj); })
        // .stop()
        ;
    return _SIMULATION;
}

export function TLINEdraw(linObj, dmanObj)
{
    const ctr = linObj.CANVAS.transition()
        .duration(150);

    // uti.logTLINE("TLINEdraw", linObj.sNODES);

    TLINEdrawLinks(linObj);

    linObj.SVG_DRAGABLE_OTHERS = null;
    linObj.SVG_GROUP_CIRCLES = linObj.GRAPH_LAYER.selectAll(".gnode")
        .data(linObj.gNODESt).join(
            enter => enter.append("rect")
                .attr("class", "gnode")
                .style("fill", function(g) { let _fill = linObj.SVG_COLORMAP(g.group);
                                            // return linObj.SVG_COLORMAP(g.group); })
                                            return _fill; })
                // .style("stroke", PARM_GROUP_NODE_BORDER_COLOR)
                .style("stroke", function(g) { return g.chShow ? dmanObj.PARM_NODE_BORDER_COLOR_FIXED : linObj.SVG_COLORMAP(g.group); })
                .style("stroke-width", PARM_GROUP_NODE_BORDER_WIDTH)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", PARM_GROUP_NODE_OPACITY)
                // .attr("vx", function (g) { return g.vx; })
                // .attr("vy", function (g) { return g.vy; })
                .attr("width", function (g) { return g.width; })
                .attr("height", function (g) { return g.height; })
                .attr("rx", function (g) { return g.cr; })
                .attr("ry", function (g) { return g.cr; })
                .attr("y", function (g) { return g.y; }),
            update => update
                .attr("class", "gnode")
                .style("fill", function(g) { return linObj.SVG_COLORMAP(g.group); })
                // .style("stroke", PARM_GROUP_NODE_BORDER_COLOR)
                .style("stroke", function(g) { return g.chShow ? dmanObj.PARM_NODE_BORDER_COLOR_FIXED : linObj.SVG_COLORMAP(g.group); })
                .style("stroke-width", PARM_GROUP_NODE_BORDER_WIDTH)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", PARM_GROUP_NODE_OPACITY)
                .attr("width", function (g) { return g.width; })
                .attr("height", function (g) { return g.height; })
                .attr("rx", function (g) { return g.cr; })
                .attr("ry", function (g) { return g.cr; })
                .attr("y", function (g) { return g.y; }),
            exit => exit
                .remove()
        );
    linObj.SVG_DRAGABLE_OTHERS = linObj.GRAPH_LAYER.selectAll(".gnode");

    // let _nodeRadius = parms.GET("NODE_RADIUS") / 4;
    linObj.SVG_NODES = TLINEdrawPN(linObj);
    // logSVG(i18n("F_G_I"), "SVG_NODES ", linObj.SVG_NODES);
    console.log(i18n("F_G_I"), linObj.SVG_NODES);

    linObj.SVG_DRAGABLE_NODES = linObj.GRAPH_LAYER.selectAll(".cnode");
    setDragactions(linObj);
    initZoom(linObj);
    initTooltip(linObj);
    makeGuideLines(linObj);

    parms.dataMod(false);

    // set labels
    if (linObj.isInitialized) {
        if (parms.GET("SHOW_NAMES")) {
            linObj.RENDERhelper.showNamesPL(linObj);
            // if (linObj.SVG_DRAGABLE_OTHERS)
            //     linObj.RENDERhelper.showNamesGL(linObj);
        }
    }

}

function TLINEdrawPN(linObj) {
    let _nodeRadius = parms.GET("NODE_RADIUS") / 4;
    let _SVG_NODES = linObj.GRAPH_LAYER.selectAll(".cnode")
        .data(linObj.pNODESt).join(
            enter => enter.append("rect")
                .attr("class", "cnode")
                .style("display", function(n) { return n.cnShow ? "visible" : "none"; })
                .style("fill", function(node) { return getColor(node.ynode.sortname); })
                .style("stroke", function(node) { return node.fx == null ? "#222" : dmanObj.PARM_NODE_BORDER_COLOR_FIXED; })
                .attr("stroke-width", function(node) { return node.isLinked ? _nodeRadius * 2 + "px" : _nodeRadius + "px"; })
                .attr("width", function (n) { return 2 * n.ynode.r; })
                .attr("height", function (n) { return 2 * n.ynode.r; })
                .attr("rx", function (n) { return 2 * n.ynode.cr; })
                .attr("ry", function (n) { return 2 * n.ynode.cr; })
                .attr("vx", function (n) { return n.vx; })
                .attr("vy", function (n) { return n.vy; })
                // .attr("x", function (n) { return n.x; })
                .attr("x", function (n) {
                    // if (n.ynode.id == "@I31058@")
                    //     console.log("TLINEdraw->e", "data.group", n.data.group, "id", n.ynode.id, "x", n.x, "y", n.y);
                    let _nx = n.parent.x - 2 * n.ynode.r;
                    if (n.isDragged)
                        _nx = n.x;
                    return _nx; })
                .attr("y", function (n) { return n.y; }),
            update => update
                .attr("class", "cnode")
                .style("display", function(n) { return n.cnShow ? "visible" : "none"; })
                .style("fill", function(node) { return getColor(node.ynode.sortname); })
                .style("stroke", function(node) { return node.fx == null ? "#222" : dmanObj.PARM_NODE_BORDER_COLOR_FIXED; })
                .attr("stroke-width", function(node) { return node.isLinked ? _nodeRadius * 2 + "px" : _nodeRadius + "px"; })
                .attr("width", function (n) { return 2 * n.ynode.r; })
                .attr("height", function (n) { return 2 * n.ynode.r; })
                .attr("rx", function (n) { return 2 * n.ynode.cr; })
                .attr("ry", function (n) { return 2 * n.ynode.cr; })
                .attr("vx", function (n) { return n.vx; })
                .attr("vy", function (n) { return n.vy; })
                // .attr("x", function (n) { return n.x; })
                .attr("x", function (n) {
                    // if (n.ynode.id == "@I31058@")
                    //     console.log("TLINEdraw->u", "data.group", n.data.group, "id", n.ynode.id, "x", n.x, "y", n.y);
                    let _nx = n.parent.x - 2 * n.ynode.r;
                    if (n.isDragged)
                        _nx = n.x;
                    return _nx; })
                .attr("y", function (n) { return n.y; }),
            exit => exit
                .remove()
    );
    return _SVG_NODES;
}

function TLINEdrawLinks(linObj) {
    let _linkwidth = parms.GET("LINK_WIDTH");
    let _linkshow = parms.GET("SHOW_LINKS");
    let _linkopacity = parms.GET("LINK_OPACITY");
    if (!_linkshow) _linkopacity = 0;
    linObj.SVG_LINKS = linObj.GRAPH_LAYER.selectAll(".link")
        .data(linObj.pLINKSt).join(
            enter => enter.append("line")
                .attr("stroke", function(link) { return link.color; })
                .attr("stroke-width", function(link) { return link.directed ? _linkwidth + "px" : _linkwidth * 3 + "px"; })
                .attr("stroke-dasharray", function(link) { return link.directed ? "" : "3,9"; })
                .attr("stroke-linecap", "round")
                .attr("opacity", _linkopacity)
                .attr("marker-end", function(link) { return setArrow(link, "TLINE"); }),
            update => update
                .attr("stroke", function(link) { return link.color; })
                .attr("stroke-width", function(link) { return link.directed ? _linkwidth + "px" : _linkwidth * 3 + "px"; })
                .attr("stroke-dasharray", function(link) { return link.directed ? "" : "3,9"; })
                .attr("stroke-linecap", "round")
                .attr("opacity", _linkopacity)
                .attr("marker-end", function(link) { return setArrow(link, "TLINE"); }),
            exit => exit
                .remove()
        );
}

export function TLINEtest(linObj) {
    let _actAlpha = linObj.FORCE_SIMULATION.alpha();
    if (_actAlpha < 0.0012) {
        if (linObj.TLINEtcount > linObj.TLINEtcount_OLD) {
            uti.logTLINE_a("TLINEtest-alpha->pre ", _actAlpha, linObj);
            TLINEtest_DO(linObj, 999);
            uti.logTLINE_a("TLINEtest-alpha->post ", _actAlpha, linObj);
            linObj.TLINEtcount_OLD = linObj.TLINEtcount;
        }
    }
}

function TLINEtest_DO(linObj, _cntT = 1) {
    if (linObj.chShowCntc > 0) {
        linObj.gNODESt.forEach( function(g, i) {
            if (g.chShow && g.chShowCnt ) {
                g.chShowCnt -= 1;
                if (g.chShowCnt < _cntT) {
                    uti.logTLINE_ag("TLINEtest_DO->pre", linObj.FORCE_SIMULATION.alpha(), linObj, g);
                    g.chShowCnt = null;
                    g.fx = g.x;
                    g.fy = g.y;
                    if (linObj.chShowCntc > 0)
                        linObj.chShowCntc -= 1;
                    linObj.pNODESt.forEach( function (n,i) {
                        if (n.group == g.nodeID) {
                            let _pd = uti.posDiff(g, n);
                            n.x += _pd.x;
                            n.y += _pd.y;
                            n.vx = 0;
                            n.vy = 0;
                        }
                    });
                    uti.logTLINE_ag("TLINEtest_DO->post", linObj.FORCE_SIMULATION.alpha(), linObj, g);
                }
            }
        });
    }
}

function TLINEtick(linObj)
{
    if (linObj.SVG_NODES == null) return;

    // only update visualization each N iterations for performance
    let dmanObj = linObj.DATAman;
    linObj.TLINEtcount++;
    if ((dmanObj.tickCounter++) % dmanObj.tickCounterControlValue == 0) {
        if ( dmanObj.tickCounterLevel != 'min' ) {
            if (dmanObj.tickCounter > dmanObj.tickCounterThreshold) {                 // check threshold
                let _tLevel = parms.TClevel_down(dmanObj.tickCounterLevel);        // get next level
                let _tCount = parms.getTickCount(_tLevel);
                dmanObj.tickCounterControlValue = _tCount.check;                       // set new value for modulo-ops
                dmanObj.tickCounterLevel = _tLevel;                                    // set new level
                dmanObj.tickCounterCycles = _tCount.cyc;                               // set new multiplyer
                dmanObj.tickCounterThreshold = _tCount.val * dmanObj.tickCounterCycles;   // set new threshold
                parms.SET("RENDERER_UPDATE_LEVEL", _tLevel);
                parms.SET("RENDER_UPDATE_INTERVAL", parms.getTickCount(_tCount.check));
                dmanObj.tickCounterTotal += dmanObj.tickCounter;
                dmanObj.tickCounter = 0;
                makeTickCountInfo(linObj, true);
            }
        } else {
            dmanObj.tickCounterTotal += dmanObj.tickCounter;
            dmanObj.tickCounter = 0;
            makeTickCountInfo(linObj);
        }
    } else {
        return;
    }

    if (parms.dataMod()) {
        linObj.pNODESt = [];
        if (linObj.SVG_NODES) linObj.SVG_NODES.remove();
        if (linObj.SVG_LINKS) linObj.SVG_LINKS.remove();
        if (linObj.SVG_NODE_LABELS) linObj.SVG_NODE_LABELS.remove();
        if (linObj.SVG_GROUP_LABELS) linObj.SVG_GROUP_LABELS.remove();
        if (linObj.SVG_DRAGABLE_NODES)  linObj.SVG_DRAGABLE_NODES.remove();
        if (linObj.SVG_DRAGABLE_OTHERS)  linObj.SVG_DRAGABLE_OTHERS.remove();
        parms.dataMod(false);

        reset(linObj);
        // linObj.packtdata(linObj, linObj.yNODES, dmanObj);
        makeYPOS(linObj.yNODES, dmanObj);
        TLINEexec_DO(linObj, dmanObj);
        return;
    }

    // let _actAlpha = linObj.FORCE_SIMULATION.alpha();
    // if (_actAlpha < 0.001025)
    //         uti.logTLINE_a("TLINEtest-tick ", _actAlpha, linObj);
    // TLINEtest_DO(linObj);

    // move node circles to defined position (d.x,d.y)
    let _nodeRadius = parms.GET("NODE_RADIUS") / 4;
    linObj.SVG_NODES
        .style("display", function(n) { return n.cnShow ? "visible" : "none"; })
        .style("stroke", function(n) { return n.fx == null ? (n.isLinked ? "orange ": "#222") : dmanObj.PARM_NODE_BORDER_COLOR_FIXED; })
        .attr("stroke-width", function(n) { return n.isLinked ? _nodeRadius * 2 + "px" : _nodeRadius + "px"; })
        .style("fill", function(n) { return getColor(n.ynode.sortname); })
        .attr("width", function(n) { return n.isLinked ? 5 * n.ynode.r : 2 * n.ynode.r * n.sr; })
        .attr("height", function(n) { return n.isLinked ? 5 * n.ynode.r : 2 * n.ynode.r * n.sr; })
        .attr("rx", function (n) { return 2 * n.ynode.cr * n.sr; })
        .attr("ry", function (n) { return 2 * n.ynode.cr * n.sr; })
        // .attr("vx", function (n) { return n.vx; })
        // .attr("vy", function (n) { return n.vy; })
        ;

    linObj.SVG_NODES.each(n => {
        n.vis.x = n.parent.vis.x - n.ynode.r + PARM_GROUP_BAR_WIDTH/2;
        if (n.isDragged)
            n.vis.x = n.x;
        n.vis.y = n.y;
        if (n.isLinked && !n.isDragged)
            n.vis.y = n.parent.y - 100;
});
    linObj.SVG_GROUP_CIRCLES
        .style("stroke", function(g) { 
            let _st = dmanObj.PARM_NODE_BORDER_COLOR_FIXED;
            if (g.fx == null)
                // _st = g.chShow ? PARM_GROUP_NODE_BORDER_COLOR : linObj.SVG_COLORMAP(g.group);
                _st = linObj.SVG_COLORMAP(g.group);
            return  _st;})
        .style("stroke-width", function(g) { return g.fx == null ? PARM_GROUP_NODE_BORDER_WIDTH : PARM_GROUP_NODE_BORDER_WIDTH * 2; })
        .attr("x", function(g) { return g.vis.x; })
        .attr("y", function(g) { return g.vis.y; })
        ;
    linObj.SVG_NODES
        .attr("x", function (n) { return n.vis.x; })
        .attr("y", function (n) { return n.vis.y; })
        ;

    // set links
    let _arrowDfactor = parms.GET("ARROW_DISTANCE_FACTOR");
    let _arrowRadius = parms.GET("ARROW_RADIUS");
    let _linkwidth = parms.GET("LINK_WIDTH");
    let _linkdist = parms.GET("LINK_DISTANCE");
    let _lw3 = _linkwidth * 3;
    linObj.SVG_LINKS
        .attr("x1", function(d) { 
            if (!d.directed)
                return d.source.vis.x; 
            var ld = distance(d.source, d.target), t = (ld - d.source.r - _arrowDfactor * _arrowRadius) / ld;
            var x = d.source.vis.x * t + d.target.vis.x * (1-t);
            return isNaN(x) ? d.source.vis.x : x;
        })
        .attr("y1", function(d) { 
            if (!d.directed)
                return d.source.vis.y; 
            var ld = distance(d.source, d.target), t = (ld - d.source.r - _arrowDfactor * _arrowRadius) / ld;
            var y = d.source.vis.y * t + d.target.vis.y * (1-t);
            return isNaN(y) ? d.source.vis.y : y;
        })
        .attr("x2", function(d) { 
            if (!d.directed)
                return d.target.vis.x;
            var ld = distance(d.source, d.target), t = (ld - d.target.r - _arrowDfactor * _arrowRadius) / ld;
            var x = d.source.vis.x * (1-t) + d.target.vis.x * t;
            return isNaN(x) ? d.target.vis.x : x;
        })
        .attr("y2", function(d) { 
            if (!d.directed)
                return d.target.vis.y;
            var ld = distance(d.source, d.target), t = (ld - d.target.r - _arrowDfactor * _arrowRadius) / ld;  
            var y = d.source.vis.y * (1-t) + d.target.vis.y * t;
            return isNaN(y) ? d.target.vis.y : y;
        })
        .attr("stroke-width", function(d) { return d.directed ? _linkwidth + "px" : _lw3 + "px"; })
        ;

    if (parms.GET("SHOW_NAMES")) {
        if (linObj.SVG_NODE_LABELS === null) 
            linObj.RENDERhelper.showNamesPL(linObj);
            // if (linObj.SVG_DRAGABLE_OTHERS)
            //     linObj.RENDERhelper.showNamesGL(linObj);
        linObj.SVG_NODE_LABELS.attr("transform", linObj.RENDERhelper.placeLabel);
        // if (linObj.SVG_DRAGABLE_OTHERS)
        //     linObj.SVG_GROUP_LABELS.attr("transform", linObj.RENDERhelper.placeLabelGL);
    }

    linObj.showALPHA(linObj);

}
function distance(a, b){
    return Math.sqrt(Math.pow(a.vis.x - b.vis.x, 2) + Math.pow(a.vis.y - b.vis.y, 2));
}

function forceTLINE(linObj, _nodes) {
    const strength = 0.8;
    // uti.logTLINE_ag("forceTLINE->pre-G", linObj.gNODESt);
    uti.logTLINE_a("forceTLINE->pre-P", linObj.pNODESt);

    let nodes;

    function force(alpha) {
        const centroids = d3.rollup(nodes,
                            centroid,
                            d => d.data.group);
        const l = alpha * strength;
        let _group = "~";
        let _cx = 0.0;
        let _cy = 0.0;
        for (const d of nodes) {
            if (d.data.group != _group) {
                _group = d.data.group;
                const {x: cx, y: cy} = centroids.get(_group);
                if (cx === cx) {
                    _cx = cx;
                    _cy = cy;
                } else {
                    _cx = 0.0;
                    _cy = 0.0;
                }
            }
            d.vx -= (d.x - _cx) * l;
            d.vy -= (d.y - _cy) * l;
        }
    }
  
    if (_nodes)
        force.initialize = _ => nodes = _nodes;
    else
        force.initialize = _ => nodes = _;

    uti.logTLINE_ag("forceTLINE->post-G", linObj.gNODESt);
    uti.logTLINE_a("forceTLINE->post-P", linObj.pNODESt);
    return force;
}

function makeGuideLines(linObj) {
    let guideLinesHTML = `
<path id="gl_center" class="guideline" stroke="darkgrey" stroke-dasharray="2" stroke-width="3" d="M0,-800,0,800 M-800,0,800,0"/>
<path id="gl_ruler" class="guideline" stroke="blue" stroke-width="3" d="M0,-800,0,800"/>
`;

    let elem = document.getElementById(linObj.GUIDE_LAYERid);
    elem.innerHTML = guideLinesHTML;
}


function makeYPOS(Ynodes, dmanObj) {

    function Tpack(data_xx, width, height) {
        let pack_XX = () => d3.pack()
            .size([width, height])
            .padding(1)
            (d3.hierarchy(data_xx)
                .sum(d => d.pvalue)
        );
        let nodes_xx = pack_XX().leaves();
        return nodes_xx;
    }   

    function Tvalue(data_xx) {
        for (let d of data_xx.children) 
        {
            let _cnt = d.children.length;
            let _group = d.children[0].group;
            d.height = Math.max(1.25 * 50, Math.sqrt(_cnt) * 50);
            d.nodeID = _group;
            d.data = {
                "group" : _group,
                "pvalue" : _cnt,
                "names" : null,
            };
        }
        return data_xx;
    }

    function Tsortbd(data_xx) {
        for (let d of data_xx.children) 
        {
            d.children.sort((a, b) => {
                let a_bd = a.ynode.bdate;
                let b_bd = b.ynode.bdate;
                if(a_bd < b_bd)
                    return -1;
                if(a_bd > b_bd)
                    return 1;
                return 0;
            });
            }
        return data_xx;
    }

    let data_YP = ({
        children: Array.from(
            d3.group(
                Array.from(Ynodes, (n, i) => ({
                    group: n.Yvalue,
                    pvalue: 1,
                    ynode: n
                    })
                ),
                d => d.group
                ),
            ([, children]) => ({children})
        )
    });
    let nodes_YP = Tpack(data_YP, dmanObj.width, dmanObj.height);
    data_YP = Tvalue(data_YP);
    data_YP = Tsortbd(data_YP);

    console.log("tnodesYP", nodes_YP);
    parms.oSET("tnodesYP", nodes_YP);
    parms.oSET("tdataYP", data_YP);

}


function centroid(_NODES) {
    let x = 0;
    let y = 0;
    let z = 0;
    let icN = -1;
    for (const d of _NODES) {
        let k = Math.pow(d.r, 2);
        ++icN;
        x += d.x * k;
        y += d.y * k;
        z += k;
        // if (x !== x)
        //     console.log(icN, _NODES);
    }
    return {x: x / z, y: y / z, cl: _NODES.length};
}

function forceCollideG(linObj, _nodes) {
    const alpha = 0.6; // fixed for greater rigidity!
    let padding1 = 64; // separation between same-color nodes
    let padding2 = 144; // separation between different-color nodes

    return forceCollide(linObj, _nodes, alpha, padding1, padding2);
}
function forceCollideP(linObj) { // , _nodes) {
    const alpha = 0.8; // fixed for greater rigidity!
    let padding1 = 160; // separation between same-color nodes
    let padding2 = 16; // separation between different-color nodes

    return forceCollide(linObj, linObj.pNODESt, alpha, padding1, padding2);
}

function forceCollide(linObj, _nodes, alpha, padding1, padding2) {
    let nodes;
    let maxRadius;
  
    function force() {
        let alpha = 1;
        const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
        for (const d of nodes) {
            // if ( d.r !== d.r) 
            //     console.log("forceCollide r", d);
            const r = d.r + maxRadius;
            // if ( d.x !== d.x) 
            //     console.log("forceCollide x", d);
            const nx1 = d.x - r;
            const ny1 = d.y - r;
            const nx2 = d.x + r;
            const ny2 = d.y + r;
            quadtree.visit( (q, x1, y1, x2, y2) => {
                if (q && !q.length) do {
                    if (q.data !== d) {
                        const r = d.r + q.data.r + (d.group === q.group ? padding1 : padding2);
                        let x = d.x - q.data.x;
                        let y = d.y - q.data.y;
                        let l = Math.hypot(x, y);
                        if (l < r) {
                            if (l !== 0) {
                                l = (l - r) / l * alpha;
                                d.x -= x *= l; d.y -= y *= l;
                                q.data.x += x; q.data.y += y;
                            }
                        }
                    }
                } while (q == q.next);
                let _ret = x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                return _ret;
            });
        }
    }
  
    force.initialize = _ => maxRadius = d3.max(nodes = _nodes, d => d.r) + Math.max(padding1, padding2);
  
    // uti.logTLINE("forceCollide->post", linObj.pNODESt);
    return force;
}

function setDragactions(linObj) 
{
    // make nodes draggable
    function setB2(SVG_DRAGABLE) {
        SVG_DRAGABLE
            .on("mousedown", onMouseDown)
        ;
    }

    if (linObj.SVG_DRAGABLE_NODES)
        setDRAG(linObj.SVG_DRAGABLE_NODES);
    if (linObj.SVG_DRAGABLE_OTHERS)
        setDRAG(linObj.SVG_DRAGABLE_OTHERS);
}
//---------------------------------------------------------------------------
function setDRAG(SVG_DRAGABLE) {
    SVG_DRAGABLE
        .call(d3.drag()
            .on("start", dragStartNode)
            .on("drag", dragNode)
            .on("end", dragEndNode)
        )
        .on("contextmenu", noEvent)
        .on("click", onMouseClick)
        .on("dblclick", onDblClick);
}
function dragStartNode(event, d)
{
    event.sourceEvent.stopPropagation();
    // console.log(event, event.active, d);
    let renderer = parms.oGET("RENDERER");
    renderer.FORCE_SIMULATION.alpha(0.1).restart();
    if ( d.type != "GNODE" ) {
        d.fx = d.x;
        d.fy = d.y;
    } else {
        d.fx = d.vis.x;
        d.fy = d.vis.y;
        d.sr = 1;
    }
    // console.log(event, event.active, d);

    if (parms.GET("SHOW_TOOLTIPS"))
        d3.select("#tooltip").style("opacity", parms.GET("TOOLTIP_DRAG_OPACITY"));
}
//---------------------------------------------------------------------------
function dragNode(event, d)
{
    if (d.sr == 1)
        d.sr = 2;
    d.fx = event.x;
    d.fy = event.y;
    d.isDragged = true;
    // if (d.type == "GNODE") {
    //     let renderer = parms.oGET("RENDERER");
    //     if (renderer.Cview == "GV") {
    //         d.x = event.x;
    //         d.y = event.y;
    //         d.vis.x = d.vis.x + event.dx;
    //         d.vis.y = d.vis.y + event.dy;
    //         d.fx = d.vis.x;
    //         d.fy = d.vis.y;
    //         let sc = d.data.group;
    //         let cxy = renderer.TLINEs.get(sc);
    //         if (cxy) {
    //             cxy.x = d.vis.x;
    //             cxy.y = d.vis.y;
    //             renderer.TLINEs.set(sc, cxy);
    //             forceFORCE_XYga(renderer);
    //         }
    //     } else {
    //         forceFORCE_XYha(renderer.FORCE_SIMULATION);
    //     }
    //     // console.log(event, event.active, d);
    // }

    if (parms.GET("SHOW_TOOLTIPS"))
        d3.select("#tooltip")
            .style("top", (event.sourceEvent.pageY - 10) + "px")
            .style("left", (event.sourceEvent.pageX + 15) + "px");
}
//---------------------------------------------------------------------------
function dragEndNode(event, d)
{
    event.sourceEvent.stopPropagation();
    // console.log(event, event.active, d);
    if (!parms.GET("ENERGIZE"))
        parms.oGET("RENDERER").FORCE_SIMULATION.velocityDecay(parms.GET("FRICTION")).alpha(0);    // reset friction

    if (parms.GET("SHOW_TOOLTIPS"))
        d3.select("#tooltip").style("opacity", 1.0);

    // rerunSIM(parms.oGET("RENDERER"));
}
//---------------------------------------------------------------------------
function noEvent(event, d)
{
    if (d.type == "PNODE") {
        event.stopPropagation();
        event.preventDefault();
        onMouseClick(event, d);
    } else {
        event.preventDefault();
        event.stopPropagation();
    }
}
//---------------------------------------------------------------------------
function onMouseClick(event, d)
{
    if (event.button == 0) {                    // left mousebutton
        if (event.ctrlKey) {
            let linObj = parms.oGET("RENDERER").instance;
            if (d.type == "PNODE") {
                if ( d.sr !== 2) {
                    showPERSONs(linObj, d);
                } else {
                    d.fx = d.fy = null;
                    d.sr = 1;
                }
            } else if (d.type == "GNODE") {
                    let _gy = d.nodeID;
                    let ysObj = linObj.DATAman.YEARscale;
                    ysObj.clickedYear(linObj, _gy);
                    let ysCenter = ysObj.offset + ysObj.ysCenter;
                    listPERSONs(linObj, d, ysCenter);
            } else {
                d.fx = d.fy = null;
                d.sr = 1;
            }
            event.stopPropagation();
            return;
        }
    }
    d.fx = d.fy = null;
    d.sr = 1;
    return;
}
function _switchVis(g) {
    var linObj = parms.oGET("RENDERER").instance;
    let _chShow = g.chShow;
    if (_chShow) {
        if (!linObj.TLINEmapG.has(g.nodeID)) {
            let p_pos = {
                'x': g.x, 'y': g.y,
                'vis': g.vis,
                'visP': null
           };
           linObj.TLINEmapG.set(g.nodeID, p_pos);
        }
        _nodesAdd(linObj, g);
    } else {
        if (linObj.TLINEmapG.has(g.nodeID)) {
            let lidx = linObj.TLINEmapG.get(g.nodeID);
            linObj.TLINEmapG.delete(g.nodeID);
        }
        _nodesSub(linObj, g);
    }
    // if (linObj.Cview == "HV") {
        g.fx = g.x;
        g.fy = g.y;
    // }
    updatencounter(linObj);
    linObj.FORCE_SIMULATION.stop();
    if (linObj.Cview == "HV") {
        linObj.FORCE_SIMULATION = TLINEsimHV(linObj);
    } else {
        linObj.FORCE_SIMULATION = TLINEsimGV(linObj);
    }
    linObj.SVG_NODES = TLINEdrawPN(linObj);
    linObj.SVG_DRAGABLE_NODES = linObj.GRAPH_LAYER.selectAll(".cnode");
    setDRAG(linObj.SVG_DRAGABLE_NODES);
    if (parms.GET("SHOW_TOOLTIPS")) {
        tooltipOFF(linObj.SVG_DRAGABLE_NODES);
        let tooltip = d3.select("#tooltip");
        tooltipON(linObj, linObj.SVG_DRAGABLE_NODES, tooltip);
    }
    if (parms.GET("SHOW_NAMES")) {
        linObj.SVG_NODE_LABELS.remove();
        linObj.RENDERhelper.showNamesPL(linObj);
    }
}
function _nodesAdd(linObj, g) {
    let _nodes = [];
    g.children.forEach( function(n, i) {
        n.nodeID = n.ynode.id;
        n.x = g.x;
        n.y = g.y;
        n.vis = { 'x': n.x, 'y': n.y };
        n.vis0 = g.data.vis0;
        n.r = n.ynode.r;
        n.sr = n.ynode.sr;
        n.Yvalue = n.ynode.Yvalue;
        n.type = "PNODE";
        n.cnShow = true;
        n.parent = g;
        _nodes.push(n);
    });
    _nodes.forEach(p => {
        if (!linObj.TLINEmapP.has(p.nodeID)) {
            let p_pos = {
                'x': p.x, 'y': p.y,
                'vis': p.vis,
                'visP': p.parent.vis,
                'surname': p.ynode.surname
           };
           linObj.TLINEmapP.set(p.nodeID, p_pos);
        }
        p.fx = null;
        p.fy = null;
    });
    _nodes.forEach(n => linObj.sNODES.push(n));
    _nodes.forEach(n => linObj.pNODESt.push(n));
}
function _nodesSub(linObj, d) {
    let _group = d.data.group;
    for (let i = linObj.pNODESt.length - 1; i >= 0; --i) {
        let cNode = linObj.pNODESt[i];
        if (cNode.group == _group) {
            // remove node
            if (linObj.TLINEmapP.has(cNode.nodeID))
                linObj.TLINEmapP.delete(cNode.nodeID);
            linObj.pNODESt.splice(i, 1);
        }
    }
    for (let i = linObj.sNODES.length - 1; i >= 0; --i) {
        let cNode = linObj.sNODES[i];
        if (cNode.type == "PNODE") {
            if (cNode.group == _group) {
                linObj.sNODES.splice(i, 1);                // Remove the nodes out of year range
            }
        }
    }
}
//---------------------------------------------------------------------------
function onDblClick(event, d)
{
    if (d.type == "PNODE") {
        let linObj = parms.oGET("RENDERER").instance;
        showLINKS(linObj, d);
    } else {
        let renderer = parms.oGET("RENDERER");
        d.fx = null;
        d.fy = null;
        // if (renderer.Cview == "GV") {
        //     d.vis.x = d.vis0.x;
        //     d.vis.y = d.vis0.y;
        //     let sc = d.data.group;
        //     let cxy = renderer.TLINEs.get(sc);
        //     cxy.x = d.vis.x;
        //     cxy.y = d.vis.y;
        //     renderer.TLINEs.set(sc, cxy);
        //     forceFORCE_XYga(renderer);
        // } else {
        //     d.vis.x = d.x; //  + 2 * d.r;
        //     d.vis.y = d.y; // + d.r;
        //     forceFORCE_XYha(renderer.FORCE_SIMULATION);
        // }
        // if (renderer.SVG_GROUP_LABELS)  renderer.SVG_GROUP_LABELS.remove();
        console.log(event, event.active, d);
    }
}
function forceFORCE_XYga(linObj) {
    let _gravX = parms.GET("GRAVITY_X_x");
    let _gravY = parms.GET("GRAVITY_Y_x");
    linObj.FORCE_SIMULATION
    .force("x", d3.forceX( function (n) {
        let _nx = 0;
        let sc = n.nodeID;
        if (n.type == "PNODE")
            sc = n.group;
        let cxy = linObj.TLINEs.get(sc);
        if ( cxy ) {
            n.x = cxy.x;
            _nx = n.x; // - n.r;
        }
        return _nx;
    }).strength(_gravX)) 
    .force("y", d3.forceY( function (n) { 
        let _ny = 0;
        let sc = n.nodeID;
        if (n.type == "PNODE")
            sc = n.group;
        let cxy = linObj.TLINEs.get(sc);
        if ( cxy ) {
            n.y = cxy.y;
            _ny = n.y; // - n.r;
        }
        return _ny;
    }).strength(_gravY))
    ; 
}
function forceFORCE_XYha(_SIMULATION) {
    let _gravX = parms.GET("GRAVITY_X_x");
    let _gravY = parms.GET("GRAVITY_Y_x");
    // _SIMULATION
        // .force("x", d3.forceX( function (n) {
        //     let _nx = 0;
        //     if (n.type === "PNODE" )
        //         _nx = n.parent.x;
        //     return _nx;
        // }).strength(_gravX)) 
        // .force("y", d3.forceY( function (n) { 
        //     let _ny = 0;
        //     if (n.type === "PNODE" )
        //         _ny = n.parent.vis.y;
        //     return _ny;
        // }).strength(_gravY)) 
    // ; 
    _SIMULATION
        // .force("x", d3.forceX(0).strength(0.25))
        // .force("y", d3.forceY(0).strength(0.25))
        .force("x", d3.forceX( function (n) {
            let px0 = n.x;
            if (n.type == "PNODE")
                px0 = n.parent.x;
            return px0;
        }).strength(_gravX)) 
        .force("y", d3.forceY( function (n) {
            let py0 = n.y;
            if (n.type == "PNODE")
                py0 = n.parent.y + n.Clfd * 100;
            return py0;
        }).strength(_gravY)) 
        // .force("center", d3.forceCenter(0.0, 0.0).initialize(linObj.gNODESt))
    ;
}

function showLINKS(linObj, node) {
    let _id = node.nodeID;
    if (linObj.TLINEmapPL.has(_id)) {
        let nLINKS = linObj.TLINEmapPL.get(_id);
        if (!node.isLinked) {
            nLINKS.forEach( function(l) {
                if (linObj.pLINKSt.indexOf(l) < 0) {
                    if (linObj.pNODESt.indexOf(l.source) > -1 && linObj.pNODESt.indexOf(l.target) > -1) {
                        linObj.pLINKSt.push(l);
                    }
                } else if (linObj.pLINKSt.indexOf(l) > -1) {
                    if (linObj.pNODESt.indexOf(l.source) == -1 || linObj.pNODESt.indexOf(l.target) == -1) {
                        linObj.pLINKSt.splice(linObj.pLINKSt.indexOf(l), 1);
                    }
                }
            });
            node.isLinked = true;
        } else {
            nLINKS.forEach( function(l) {
                if (linObj.pLINKSt.indexOf(l) > -1) {
                    linObj.pLINKSt.splice(linObj.pLINKSt.indexOf(l), 1);
                }
            });
            node.isLinked = false;
        }
        linObj.SVG_LINKS.remove();
        TLINEdrawLinks(linObj);
    }
}

function listPERSONs(linObj, gnode, scY) {
    let listPERSONs = document.getElementById("perslist");
    let _ID = gnode.nodeID;
    listPERSONs.innerHTML = `
    <div id="persons_liHead">
        <!-- content generated  -->
    </div>
    <ul id="persons_liLines">
        <!-- content generated  -->
    </ul>
`;
    let _liLines = document.getElementById("persons_liLines");                    // reset persons_list
    _liLines.innerHTML = "";
    for (let gc of gnode.children) {
        let node = gc.ynode;
        let yfn = node.getFullName();
        // make a HTML-'li'
        let liItem = document.createElement("li");
        liItem.classList = 'nlulli';
        let spX = document.createElement( "div" );
        //Create the text node for key after the the checkbox
        let spL = document.createElement( "span" );
        let textL = document.createTextNode(yfn);
        //Append the text node to the <li>
        spL.appendChild(textL);
        spX.appendChild(spL);
        // //Create the text node for value after the the checkbox
        // let spR = document.createElement( "span" );
        // let textR = document.createTextNode(value);
        // //Append the text node to the <li>
        // spR.appendChild(textR);
        // spX.appendChild(spR);
        liItem.appendChild(spX);

        //Append the <li> to the <ul>
        _liLines.appendChild(liItem);
}

    listPERSONs = d3.select("#perslist");
    listPERSONs
        .style("left", scY + "px")
        .style("display", null);
    linObj.TLINElistP = true;

}

function showPERSONs(linObj, node) {
    let showPERSONs = d3.select("#persinfo");
    let _ID = node.nodeID;
    if (linObj.TLINEmapPI.has(_ID)) {
        let _piData = linObj.TLINEmapPI.get(_ID);
        node.fx = node.fy = null;
        node.sr = 1;
        linObj.TLINEmapPI.delete(_ID);
        let _piSlot = "persinfo" + _piData.piLfd;
        let showPERSON = document.getElementById(_piSlot);
        showPERSON.remove();
    } else {
        node.fx = node.x; node.fy = node.y;
        node.sr = 3;
        linObj.pInfoCnt += 1;
        let piSlot = "persinfo" + linObj.pInfoCnt;
        let showPERSON = document.getElementById(piSlot);
        if (!showPERSON) {
            showPERSONs.append('div').attr('id', piSlot).attr('class', 'persinfo-item').attr('name', _ID);
        }
        showPERSON = d3.select("#" + piSlot);
        showPERSON.text(nodePERSON(node.ynode));
        showPERSON.on("click", function(event) {
            let elem = event.target;
            removePERSON(elem);
        });
        let _pidata = {
            "piLfd": linObj.pInfoCnt,
            "piSlot": piSlot,
            "node": node
        };
        linObj.TLINEmapPI.set(_ID, _pidata);
    }
    checkElementsToggle(linObj);
}
function removePERSON(elem) {
    let linObj = parms.oGET("RENDERER").instance;
    let _ID = elem.getAttribute('name');
    if (linObj.TLINEmapPI.has(_ID)) {
        let _piData = linObj.TLINEmapPI.get(_ID);
        let node = _piData.node;
        node.fx = node.fy = null;
        node.sr = 1;
        linObj.TLINEmapPI.delete(_ID);
    }
    elem.remove();
    checkElementsToggle(linObj);
}
function nodePERSON(node) {
    let _unknown = i18n("unknown");

    const age = node.bdate && node.ddate
        ? Math.floor((node.ddate - node.bdate) / 31536000000) // 1000ms * 60s * 60min * 24h * 365d
        : _unknown;
    const mother = node.getMother();
    const father = node.getFather();

    return node.getFullName() + (node.id ? " (" + node.id + ")" : "")
            + "\n\n" + i18n("birth") + (node.bdate ? node.bdate.toLocaleDateString() : _unknown)
            + "\n" + i18n("death") + (node.ddate ? node.ddate.toLocaleDateString() : _unknown)
            + "\n" + i18n("age") + age
            + "\n" + i18n("mother") + (mother ? mother.getFullName() + " (" +  mother.id + ")" : _unknown)
            + "\n" + i18n("father") + (father ? father.getFullName() + " (" +  father.id + ")" : _unknown)
            ;
}
function checkElements(e) {
    let x = e.x;
    let y = e.y;
    let elements = document.elementsFromPoint(x, y);
    let _text = "";
    // for (let i = 0; i < elements.length; i++) {
    for (let i = elements.length - 1; i >= 0; i--) {
        let _el = elements[i];
        let _elKenn = _el.nodeName + ";" + _el.id + ';' + _el.className;
        if ( _el.className == "persinfo-item") {
            let _id = _el.id;
            let elem = document.getElementById(_id);
            removePERSON(elem);
        }
        _text += _elKenn;
        if (i < elements.length - 1) {
            _text += " < ";
        }
    }  
    console.log("x:", x, "y:", y, "on pos:", _text);
}
function checkElementsToggle(linObj) {
    let showPERSONs = d3.select("#persinfo");
    if (linObj.TLINEmapPI.size > 0) {
        showPERSONs.style("display", null);
        checkElementsON(linObj);
    } else {
        showPERSONs.style("display", "none");
        checkElementsOFF(linObj);
    }
}
function checkElementsON(linObj) {
    let elBody = d3.select("#mainContent");
    elBody.on("click", function(event) {
        checkElements(event);
    });
    linObj.checkElements = "#mainContent";
}
function checkElementsOFF(linObj) {
    let elBody = d3.select("#mainContent");
    if (elBody) {
        elBody.on("click", null);
    }
    linObj.checkElements = false;
}