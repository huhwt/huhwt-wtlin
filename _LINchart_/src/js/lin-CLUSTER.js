/* jshint -W083 */

///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// CLUSTER Renderer
//
///////////////////////////////////////////////////////////////////////////////

import * as parms from "./parms.js";
import * as uti from "./utils.js";
import { initInteractions, initTooltip, tooltipON, tooltipOFF, initZoom, rerunSIM, set_tickCounter, makeTickCountInfo, updatencounter } from "./interaction.js";
import { TopoMap, NormalField, GradientField } from "./scalarfield.js";
import { initIDX, getColor} from "./indexman.js";
import { RENDERhelper, reset, setArrow } from "./RENDERhelpers.js";

var PARM_GROUP_NODE_BORDER_COLOR = "#f88";
var PARM_GROUP_NODE_BORDER_WIDTH = 10;
var PARM_GROUP_FONT_SIZE = 16;
var PARM_GROUP_NODE_OPACITY = 0.7;

export function CLUSTERexec(linObj, dmanObj) {
    let r_s = parms.GET("REPULSION_STRENGTH_x");
    parms.SET("REPULSION_STRENGTH", r_s);

    parms.SET("PERSON_LABELS_BELOW_DIST", 24);

    linObj.REPULSION_FORCE = d3.forceManyBody().strength(-parms.GET("REPULSION_STRENGTH"));
    linObj.LINK_FORCE = d3.forceLink([]).strength(-1);

    linObj.CLUSTERtcount = 0;
    linObj.CLUSTERtcount_OLD = 0;
    linObj.CLUSTERrmul = 1.0;
    linObj.names_lidx = parms.oGETmap("names_lidx");

    dmanObj.packOdata(linObj, dmanObj);
    var nodeMap = parms.oGET("OnodeMap");

    linObj.packCdata(linObj, linObj.yNODES, dmanObj);

    CLUSTERexec_DO(linObj, dmanObj);
}
export function CLUSTERexec_DO(linObj, dmanObj) {

    // ------------------------------------------------------------------------------------------------------------------------

    CLUSTERsim(linObj, dmanObj);

    // ("Force Graph Initialized.");
    console.log(i18n("F_G_I"), "pNODESc ", linObj.pNODESc.length);

    linObj.RENDERhelper.set_xNODES(linObj.pNODESc);
    linObj.RENDERhelper.set_gNODES(linObj.gNODESc);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///  CREATE SVG ELEMENTS
    dmanObj.initSVGLayers(linObj);
    dmanObj.setColorMap(linObj);
    CLUSTERdraw(linObj, dmanObj);

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

function CLUSTERsim(linObj, dmanObj) {
    let suff = dmanObj.cAtag;
    let _dataKenn = "cdata" + suff;
    let _names_s = "names_s" + suff.toUpperCase();

    let _cDATA = parms.oGET(_dataKenn);
    var _names_sXX = parms.oGETmap(_names_s);
    linObj.gNODESc = [];
    linObj.pNODESc = [];
    linObj.chShowCntc = 0;

    _cDATA.children.forEach( function(c, i) {
        let _group = c.data.group;
        let _names = _names_sXX.get(_group);
        if (_names) {
            _names = _names.slice(1);               // |........ -> .......
            _names = "~ " + _names.replace("|", " | ") + " ~";
            c.data.names = _names;
        } else {
            let _names = c.data.names.slice(1);          // |........ -> .......
            _names = "~ " + _names + " ~";
            c.data.names = _names;
        }
        let cxy = linObj.CLUSTERs.get(_group);
        let _x0 = c.x;
        let _y0 = c.y;
        if ( cxy ) {
            _x0 = cxy.x;
            _y0 = cxy.y;
        }
        c.chShow = false;
        c.chShowCnt = null;
        c.data.vis = { 'x': _x0, 'y': _y0 };
        c.vis = c.data.vis;
        c.data.vis0 = { 'x': _x0, 'y': _y0};
        c.vis0 = c.data.vis0;
        linObj.gNODESc.push(c);
    });
    // Cluster-Ansicht fallweise neu aufbauen ...
    let _gNchk = (linObj.CLUSTERmapG.size > 0);     // ... gibt es expandierte Gruppen ?
    linObj.gNODESc.forEach( function (g, i) {
        g.type = "GNODE";
        g.sortname = g.children[0].ynode.sortname;
        g.chShow = false;
        g.fx = null;
        g.fy = null;
        if (linObj.CLUSTERmapG.has(g.nodeID)) {     // diese Gruppe war bereits expandiert
            _gNchk = false;                             // ... wir expandieren, Nachbearbeitung nicht nötig
            g.chShow = true;
            g.chShowCnt = 100;
            linObj.chShowCntc += 1;
            if (linObj.Cview == "HV") {
                // g.fx = g.x;
                // g.fy = g.y;
            } else {
                g.fx = g.vis.x;
                g.fy = g.vis.y;
            }
            g.children.forEach( function (n,i) {        // Personen zu Gruppe
                n.nodeID = n.ynode.id;
                n.x = g.x;
                n.y = g.y;
                if (linObj.Cview == "HV")
                    n.vis = { 'x': n.x, 'y': n.y };
                else {
                    n.vis = { 'x': g.data.x, 'y': g.data.y };
                    n.x = n.vis.x;
                    n.y = n.vis.y;
                }
                n.fx = null;
                n.fy = null;
                n.vis0 = g.data.vis0;
                n.r = n.ynode.r;
                n.sr = n.ynode.sr;
                n.Yvalue = n.ynode.Yvalue;
                n.type = "PNODE";
                n.cnShow = true;
                n.parent = g;
                linObj.pNODESc.push(n);
            });
        }
    });
    // es gab expandierte Gruppen, in der aktuellen Ansicht wurden sie aber nicht angezogen ...
    // -> Grund: Wechsel soundEX
    if (_gNchk) {
        let _cAind = linObj.DATAman.cAind;
        if (linObj.CLUSTERmapP.size > 0) {                  // Verzeichnis der angezeigten Personen durchlaufen
            let _surn = "_";
            linObj.CLUSTERmapP.forEach( function (n,v) {
                let pn = n;
                let _psn = pn.surname;                          // Person Nachname prüfen
                if ( _psn != _surn) {
                    _surn = _psn;
                    let _group = _surn;
                    let n_lidx = linObj.names_lidx.get(_surn);      // soundEX zu Person
                    if (_cAind > 0) {
                        _group = n_lidx[linObj.DATAman.cAind];      // als neue Gruppe übernehmen
                    }
                    if (!linObj.CLUSTERmapG.has(_group)) {
                        let p_pos = {
                            'x': 0, 'y': 0,
                            'vis': {'x': 0, 'y': 0},
                            'visP': null,
                            'lidx': n_lidx
                       };
                       linObj.CLUSTERmapG.set(_group, p_pos);
                    }
                }
            });
        }
        _gNchk = false;
        linObj.gNODESc.forEach( function (g, i) {
            if (linObj.CLUSTERmapG.has(g.nodeID)) {
                g.chShow = true;
                g.chShowCnt = 100;
                linObj.chShowCntc += 1;
                if (linObj.Cview == "HV") {
                    // g.fx = g.x;
                    // g.fy = g.y;
                } else {
                    g.fx = g.vis.x;
                    g.fy = g.vis.y;
                }
                g.children.forEach( function (n,i) {
                    n.nodeID = n.ynode.id;
                    n.x = g.x;
                    n.y = g.y;
                    if (linObj.Cview == "HV")
                        n.vis = { 'x': n.x, 'y': n.y };
                    else {
                        n.vis = { 'x': g.data.x, 'y': g.data.y };
                        n.x = n.vis.x;
                        n.y = n.vis.y;
                    }
                    n.fx = null;
                    n.fy = null;
                    n.vis0 = g.data.vis0;
                    n.r = n.ynode.r;
                    n.sr = n.ynode.sr;
                    n.Yvalue = n.ynode.Yvalue;
                    n.type = "PNODE";
                    n.cnShow = true;
                    n.parent = g;
                    linObj.pNODESc.push(n);
                });
            }
        });
    }

    console.log("CLUSTERsim", "gNODESc", linObj.gNODESc, "CLUSTERmapG", linObj.CLUSTERmapG, "pNODESc", linObj.pNODESc, "CLUSTERmapP", linObj.CLUSTERmapP);

    linObj.sNODES = linObj.gNODESc.slice(0);
    linObj.pNODESc.forEach(p => linObj.sNODES.push(p));

    linObj.tickCallback = CLUSTERtick;

    if (linObj.Cview == "HV") {
        linObj.CLUSTERrmul = 1.25;
        let _alpha = parms.GET("ALPHA_T"); 
        linObj.FORCE_SIMULATION = CLUSTERsimHV(linObj);
    } else {
        linObj.CLUSTERrmul = 1.2;
        linObj.FORCE_SIMULATION = CLUSTERsimGV(linObj);
    }
}

export function CLUSTERsimHV(linObj) {
    // let _alpha = parms.GET("ALPHA_T"); 
    let _gravX = parms.GET("GRAVITY_X_x");
    let _gravY = parms.GET("GRAVITY_Y_x");

    let _SIMULATION = d3.forceSimulation(linObj.sNODES)
        .force("charge", linObj.REPULSION_FORCE)
        // .force("similarity", function(alpha){ dmanObj.similarityForceY(linObj.pNODESc, _alpha); })
        .force("collideG", forceCollideG(linObj, linObj.gNODESc))
        .force("collideP", forceCollideP(linObj)) // , linObj.pNODESc))
        .force("clusterP", forceClusterPhv(linObj, linObj.pNODESc))
            // .force("link", d3.forceLink([]))
            // .alpha(parms.GET("ALPHA_x"))
            // .alphaDecay(0.02)
            // .alphaTarget(0.021)
            // .velocityDecay(0.6)
        .on("tick", function tick() { linObj.tickCallback(linObj); })
        ;
    _SIMULATION
        // .force("x", d3.forceX(0).strength(0.25))
        // .force("y", d3.forceY(0).strength(0.25))
        .force("x", d3.forceX( function (n) {
            let _nx = 0;
            if (n.type === "PNODE" )
                if (n.parent)
                    _nx = n.parent.x;
            return _nx;
        }).strength( function(n) {
            let _g = _gravX;
            if (n.type === "GNODE")
                _g = _SIMULATION.alpha() * 0.2;
            return _g;
        }
        )) 
        .force("y", d3.forceY( function (n) { 
            let _ny = 0;
            if (n.type === "PNODE" )
                if (n.parent)
                    _ny = n.parent.y;
            return _ny;
        }).strength( function(n) {
            let _g = _gravY;
            if (n.type === "GNODE")
                _g = _SIMULATION.alpha() * 0.2;
            return _g;
        }
        )) 
        // .force("center", d3.forceCenter(0.0, 0.0).initialize(linObj.gNODESc))
        ;
    return _SIMULATION;
}
export function CLUSTERsimGV(linObj) {
    let _gravX = parms.GET("GRAVITY_X_x");
    let _gravY = parms.GET("GRAVITY_Y_x");

    let _SIMULATION = d3.forceSimulation(linObj.sNODES)
    .force("x", d3.forceX( function (n) {
        let _nx = 0;
        let sc = n.nodeID;
        if (n.type === "PNODE" )
            sc = n.group;
        let cxy = linObj.CLUSTERs.get(sc);
        if ( cxy )
            _nx = cxy.x; // - n.r;
        return _nx;
    }).strength(_gravX)) 
    .force("y", d3.forceY( function (n) { 
        let _ny = 0;
        let sc = n.nodeID;
        if (n.type === "PNODE" )
            sc = n.group;
        let cxy = linObj.CLUSTERs.get(sc);
        if ( cxy )
            _ny = cxy.y; // - n.r;
        return _ny;
    }).strength(_gravY)) 
            // .force("center", d3.forceCenter(0, 0))
    .force("charge", linObj.REPULSION_FORCE)
    // .force("clusterG", forceCluster(linObj, linObj.gNODESc))
    .force("clusterP", forceClusterPhv(linObj, linObj.pNODESc))
    .force("collideP", forceCollideP(linObj)) // , linObj.pNODESc))
        // .force("link", d3.forceLink([]))
        // .alpha(parms.GET("ALPHA_x"))
        // .alphaDecay(0.02)
        // .alphaTarget(0.021)
        // .velocityDecay(0.6)
    .on("tick", function tick() { linObj.tickCallback(linObj); })
    // .stop()
    ;
    return _SIMULATION;
}

export function CLUSTERdraw(linObj, dmanObj)
{
    const ctr = linObj.CANVAS.transition()
        .duration(150);

    // uti.logCLUSTER("CLUSTERdraw", linObj.sNODES);

    linObj.SVG_DRAGABLE_OTHERS = null;
    if (linObj.Cview == "GV") {
        linObj.SVG_GROUP_CIRCLES = linObj.GRAPH_LAYER.selectAll(".gnode")
            .data(linObj.gNODESc).join(
                enter => enter.append("circle")
                    .attr("class", "gnode")
                    .style("fill", "gnodecolor")
                    .style("stroke", PARM_GROUP_NODE_BORDER_COLOR)
                    // .style("stroke", PARM_GROUP_NODE_BORDER_COLOR)
                    .style("stroke", function(g) { return g.chShow ? dmanObj.PARM_NODE_BORDER_COLOR_FIXED : getColor(g.sortname); })
                    .style("stroke-width", PARM_GROUP_NODE_BORDER_WIDTH)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", PARM_GROUP_NODE_OPACITY)
                    // .attr("vx", function (g) { return g.vx; })
                    // .attr("vy", function (g) { return g.vy; })
                    .attr("r", function(g) { return g.r * linObj.CLUSTERrmul; })
                    .attr("cx", function (g) { return g.vis.x; })
                    .attr("cy", function (g) { return g.vis.y; }),
                update => update
                    .attr("class", "gnode")
                    .style("fill", "gnodecolor")
                    // .style("stroke", PARM_GROUP_NODE_BORDER_COLOR)
                    .style("stroke", function(g) { return g.chShow ? dmanObj.PARM_NODE_BORDER_COLOR_FIXED : getColor(g.sortname); })
                    .style("stroke-width", PARM_GROUP_NODE_BORDER_WIDTH)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", PARM_GROUP_NODE_OPACITY)
                    .attr("r", function(g) { return g.r * linObj.CLUSTERrmul; })
                    .attr("cx", function (g) { return g.vis.x; })
                    .attr("cy", function (g) { return g.vis.y; }),
                exit => exit
                    .remove()
            );
        linObj.SVG_DRAGABLE_OTHERS = linObj.GRAPH_LAYER.selectAll(".gnode");
    } else {
        linObj.SVG_GROUP_CIRCLES = linObj.GRAPH_LAYER.selectAll(".gnode")
            .data(linObj.gNODESc).join(
                enter => enter.append("circle")
                    .attr("class", "gnode")
                    .style("fill", "gnodecolor")
                    // .style("stroke", PARM_GROUP_NODE_BORDER_COLOR)
                    .style("stroke", function(g) { return g.chShow ? dmanObj.PARM_NODE_BORDER_COLOR_FIXED : getColor(g.sortname); })
                    .style("stroke-width", PARM_GROUP_NODE_BORDER_WIDTH)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", PARM_GROUP_NODE_OPACITY)
                    // .attr("vx", function (n) { return n.vx; })
                    // .attr("vy", function (n) { return n.vy; })
                    .attr("r", function(g) { return g.r * linObj.CLUSTERrmul; })
                    .attr("cx", function (g) { return g.x; })
                    .attr("cy", function (g) { return g.y; }),
                update => update
                    .attr("class", "gnode")
                    .style("fill", "gnodecolor")
                    // .style("stroke", PARM_GROUP_NODE_BORDER_COLOR)
                    .style("stroke", function(g) { return g.chShow ? dmanObj.PARM_NODE_BORDER_COLOR_FIXED : getColor(g.sortname); })
                    .style("stroke-width", PARM_GROUP_NODE_BORDER_WIDTH)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", PARM_GROUP_NODE_OPACITY)
                    .attr("r", function(g) { return g.r * linObj.CLUSTERrmul; })
                    .attr("cx", function (g) { return g.x; })
                    .attr("cy", function (g) { return g.y; }),
                exit => exit
                    .remove()
            );
        linObj.SVG_DRAGABLE_OTHERS = linObj.GRAPH_LAYER.selectAll(".gnode");

    }

    // let _nodeRadius = parms.GET("NODE_RADIUS") / 4;
    linObj.SVG_NODES = CLUSTERdrawPN(linObj);
    // logSVG(i18n("F_G_I"), "SVG_NODES ", linObj.SVG_NODES);
    console.log(i18n("F_G_I"), linObj.SVG_NODES);

    linObj.SVG_DRAGABLE_NODES = linObj.GRAPH_LAYER.selectAll(".cnode");
    setDragactions(linObj);
    initZoom(linObj);
    initTooltip(linObj);
    dmanObj.makeGuideLines(linObj);

    parms.dataMod(false);

    // set labels
    if (linObj.isInitialized) {
        if (parms.GET("SHOW_NAMES")) {
            linObj.RENDERhelper.showNamesPL(linObj);
            if (linObj.SVG_DRAGABLE_OTHERS)
                linObj.RENDERhelper.showNamesGL(linObj);
        }
    }

}

function CLUSTERdrawPN(linObj) {
    let _nodeRadius = parms.GET("NODE_RADIUS") / 4;
    let _SVG_NODES = linObj.GRAPH_LAYER.selectAll(".cnode")
        .data(linObj.pNODESc).join(
            enter => enter.append("rect")
                .attr("class", "cnode")
                .style("display", function(n) { return n.cnShow ? "visible" : "none"; })
                .style("fill", function(node) { return getColor(node.ynode.sortname); })
                .style("stroke", function(node) { return node.fx == null ? "#222" : dmanObj.PARM_NODE_BORDER_COLOR_FIXED; })
                .attr("stroke-width", _nodeRadius + "px")
                .attr("width", function (n) { return 2 * n.ynode.r; })
                .attr("height", function (n) { return 2 * n.ynode.r; })
                .attr("rx", function (n) { return 2 * n.ynode.cr; })
                .attr("ry", function (n) { return 2 * n.ynode.cr; })
                .attr("vx", function (n) { return n.vx; })
                .attr("vy", function (n) { return n.vy; })
                // .attr("x", function (n) { return n.x; })
                .attr("x", function (n) {
                    // if (n.ynode.id == "@I31058@")
                    //     console.log("CLUSTERdraw->e", "data.group", n.data.group, "id", n.ynode.id, "x", n.x, "y", n.y);
                    return n.x; })
                .attr("y", function (n) { return n.y; }),
            update => update
                .attr("class", "cnode")
                .style("display", function(n) { return n.cnShow ? "visible" : "none"; })
                .style("fill", function(node) { return getColor(node.ynode.sortname); })
                .style("stroke", function(node) { return node.fx == null ? "#222" : dmanObj.PARM_NODE_BORDER_COLOR_FIXED; })
                .attr("stroke-width", _nodeRadius + "px")
                .attr("width", function (n) { return 2 * n.ynode.r; })
                .attr("height", function (n) { return 2 * n.ynode.r; })
                .attr("rx", function (n) { return 2 * n.ynode.cr; })
                .attr("ry", function (n) { return 2 * n.ynode.cr; })
                .attr("vx", function (n) { return n.vx; })
                .attr("vy", function (n) { return n.vy; })
                // .attr("x", function (n) { return n.x; })
                .attr("x", function (n) {
                    // if (n.ynode.id == "@I31058@")
                    //     console.log("CLUSTERdraw->u", "data.group", n.data.group, "id", n.ynode.id, "x", n.x, "y", n.y);
                    return n.x; })
                .attr("y", function (n) { return n.y; }),
            exit => exit
                .remove()
    );
    return _SVG_NODES;
}

export function CLUSTERtest(linObj) {
    let _actAlpha = linObj.FORCE_SIMULATION.alpha();
    if (_actAlpha < 0.0012) {
        if (linObj.CLUSTERtcount > linObj.CLUSTERtcount_OLD) {
            uti.logCLUSTER_a("CLUSTERtest-alpha->pre ", _actAlpha, linObj);
            CLUSTERtest_DO(linObj, 999);
            uti.logCLUSTER_a("CLUSTERtest-alpha->post ", _actAlpha, linObj);
            linObj.CLUSTERtcount_OLD = linObj.CLUSTERtcount;
        }
    }
}

function CLUSTERtest_DO(linObj, _cntT = 1) {
    if (linObj.chShowCntc > 0) {
        linObj.gNODESc.forEach( function(g, i) {
            if (g.chShow && g.chShowCnt ) {
                g.chShowCnt -= 1;
                if (g.chShowCnt < _cntT) {
                    uti.logCLUSTER_ag("CLUSTERtest_DO->pre", linObj.FORCE_SIMULATION.alpha(), linObj, g);
                    g.chShowCnt = null;
                    g.fx = g.x;
                    g.fy = g.y;
                    if (linObj.chShowCntc > 0)
                        linObj.chShowCntc -= 1;
                    linObj.pNODESc.forEach( function (n,i) {
                        if (n.group == g.nodeID) {
                            let _pd = uti.posDiff(g, n);
                            n.x += _pd.x;
                            n.y += _pd.y;
                            n.vx = 0;
                            n.vy = 0;
                        }
                    });
                    uti.logCLUSTER_ag("CLUSTERtest_DO->post", linObj.FORCE_SIMULATION.alpha(), linObj, g);
                }
            }
        });
    }
}

function CLUSTERtick(linObj)
{
    if (linObj.SVG_NODES == null) return;

    // only update visualization each N iterations for performance
    let dmanObj = linObj.DATAman;
    linObj.CLUSTERtcount++;
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
        linObj.pNODESc = [];
        if (linObj.SVG_NODES) linObj.SVG_NODES.remove();
        if (linObj.SVG_NODE_LABELS) linObj.SVG_NODE_LABELS.remove();
        if (linObj.SVG_GROUP_LABELS) linObj.SVG_GROUP_LABELS.remove();
        if (linObj.SVG_DRAGABLE_NODES)  linObj.SVG_DRAGABLE_NODES.remove();
        if (linObj.SVG_DRAGABLE_OTHERS)  linObj.SVG_DRAGABLE_OTHERS.remove();
        parms.dataMod(false);

        reset(linObj);
        linObj.packCdata(linObj, linObj.yNODES, dmanObj);
        CLUSTERexec_DO(linObj, dmanObj);
        return;
    }

    let _actAlpha = linObj.FORCE_SIMULATION.alpha();
    if (_actAlpha < 0.001025)
            uti.logCLUSTER_a("CLUSTERtest-tick ", _actAlpha, linObj);
    CLUSTERtest_DO(linObj);

    // move node circles to defined position (d.x,d.y)
    linObj.SVG_NODES
        .style("display", function(n) { return n.cnShow ? "visible" : "none"; })
        .style("stroke", function(n) { return n.fx == null ? "#222" : dmanObj.PARM_NODE_BORDER_COLOR_FIXED; })
        .style("fill", function(node) { return getColor(node.ynode.sortname); })
        .attr("width", function (n) { return 2 * n.ynode.r * n.sr; })
        .attr("height", function (n) { return 2 * n.ynode.r * n.sr; })
        .attr("rx", function (n) { return 2 * n.ynode.cr * n.sr; })
        .attr("ry", function (n) { return 2 * n.ynode.cr * n.sr; })
        // .attr("vx", function (n) { return n.vx; })
        // .attr("vy", function (n) { return n.vy; })
        ;

    if (linObj.Cview == "GV") {
        linObj.SVG_NODES.each(n => {
            n.vis.x = n.x; 
            n.vis.y = n.y;
        });
        linObj.SVG_GROUP_CIRCLES
            .style("stroke", function(g) { 
                let _st = dmanObj.PARM_NODE_BORDER_COLOR_FIXED;
                if (g.fx == null)
                    _st = g.chShow ? PARM_GROUP_NODE_BORDER_COLOR : getColor(g.sortname);
                return  _st;})
            .style("stroke-width", function(g) { return g.fx == null ? PARM_GROUP_NODE_BORDER_WIDTH : PARM_GROUP_NODE_BORDER_WIDTH * 2; })
            .attr("cx", function(g) { return g.vis.x; })
            .attr("cy", function(g) { return g.vis.y; })
            .attr("r", function(g) {    let _r = g.r; 
                                        // if (g.chShow) 
                                        //     _r = Math.max(2 * g.r, g.r);
                                        return _r * linObj.CLUSTERrmul; })
            ;
        linObj.SVG_NODES
            .attr("x", function (n) { return n.vis.x; })
            .attr("y", function (n) { return n.vis.y; })
            ;
    } else {
        linObj.SVG_GROUP_CIRCLES.each(n => {
            n.vis.x = n.x; // - n.r; 
            n.vis.y = n.y; // - n.r;
        });
        linObj.SVG_GROUP_CIRCLES
            .style("stroke", function(g) { 
                let _st = dmanObj.PARM_NODE_BORDER_COLOR_FIXED;
                if (g.fx == null)
                    _st = g.chShow ? PARM_GROUP_NODE_BORDER_COLOR : getColor(g.sortname);
                return  _st;})
            .style("stroke-width", function(g) { return g.fx == null ? PARM_GROUP_NODE_BORDER_WIDTH : PARM_GROUP_NODE_BORDER_WIDTH * 2; })
            .attr("cx", function(g) { return g.x; })
            .attr("cy", function(g) { return g.y; })
            .attr("r", function(g) {    let _r = g.r; 
                // if (g.chShow) 
                //     _r = Math.max(2 * g.r, g.r);
                return _r * linObj.CLUSTERrmul; })
            ;
        linObj.SVG_NODES
            .attr("x", function (n) { return n.x; })
            .attr("y", function (n) { return n.y; })
            ;
    }

    if (parms.GET("SHOW_NAMES")) {
        if (linObj.SVG_NODE_LABELS === null) 
            linObj.RENDERhelper.showNamesPL(linObj);
            if (linObj.SVG_DRAGABLE_OTHERS)
                linObj.RENDERhelper.showNamesGL(linObj);
        linObj.SVG_NODE_LABELS.attr("transform", linObj.RENDERhelper.placeLabel);
        if (linObj.SVG_DRAGABLE_OTHERS)
            linObj.SVG_GROUP_LABELS.attr("transform", linObj.RENDERhelper.placeLabelGL);
    }

    linObj.showALPHA(linObj);

}

function forceCluster(linObj, _nodes) {
    const strength = 0.8;
    uti.logCLUSTER("forceCluster->pre-G", linObj.gNODESc);
    uti.logCLUSTER("forceCluster->pre-P", linObj.pNODESc);

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

    uti.logCLUSTER("forceCluster->post-G", linObj.gNODESc);
    uti.logCLUSTER("forceCluster->post-P", linObj.pNODESc);
    return force;
}
function forceClusterPhv(linObj, _nodes) {
    const strength = 1; // 0.8;
    uti.logCLUSTER("forceClusterPhv->pre", linObj.pNODESc);

    let nodes;

    function force(alpha) {
        const centroids = d3.rollup(nodes, centroid, d => d.group);
        const l = alpha; //  * strength;
        let _group = "~";
        let _cx = 0.0;
        let _cy = 0.0;
        let _px = 0.0;
        let _py = 0.0;
        let _cl = 1;
        for (const d of nodes) {
            if (d.group != _group) {
                _group = d.group;
                const {x: cx, y: cy, cl: cl} = centroids.get(_group);
                _px = d.parent.x; // - d.parent.vx;
                _py = d.parent.y; // - d.parent.vy;
                _cl = cl;
                // if (cx === cx) {
                //     _cx = cx;
                //     _cy = cy;
                // } else {
                //     _cx = 0.0;
                //     _cy = 0.0;
                //     _px = 0.0;
                //     _py = 0.0;
                // }
            }
            d.vx -= (d.x - _px) * l * (1 + 1/_cl);
            d.vy -= (d.y - _py) * l * (1 + 1/_cl);
        }
    }
  
    if (_nodes)
        force.initialize = _ => nodes = _nodes;
    else
        force.initialize = _ => nodes = _;

    uti.logCLUSTER("forceClusterPhv->post", linObj.pNODESc);
    return force;
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

    return forceCollide(linObj, linObj.pNODESc, alpha, padding1, padding2);
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
  
    // uti.logCLUSTER("forceCollide->post", linObj.pNODESc);
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
        d.sr = 2;
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
    d.fx = event.x;
    d.fy = event.y;
    if (d.type == "GNODE") {
        let renderer = parms.oGET("RENDERER");
        if (renderer.Cview == "GV") {
            d.x = event.x;
            d.y = event.y;
            d.vis.x = d.vis.x + event.dx;
            d.vis.y = d.vis.y + event.dy;
            d.fx = d.vis.x;
            d.fy = d.vis.y;
            let sc = d.data.group;
            let cxy = renderer.CLUSTERs.get(sc);
            if (cxy) {
                cxy.x = d.vis.x;
                cxy.y = d.vis.y;
                renderer.CLUSTERs.set(sc, cxy);
                forceFORCE_XYga(renderer);
            }
        } else {
            forceFORCE_XYha(renderer.FORCE_SIMULATION);
        }
        // console.log(event, event.active, d);
    }

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

    // rerunSIM(parms.oGET("RENDERER"));
}
//---------------------------------------------------------------------------
function noEvent(event, d)
{
    if (d.type == "GNODE") {
        onMouseClick(event, d);
        event.preventDefault();
    } else
        event.preventDefault();
}
//---------------------------------------------------------------------------
function onMouseClick(event, d)
{
    if (event.button == 0) {
        if (event.ctrlKey) {
            if (d.type == "PNODE") {
                d.fx = d.fy = null;
                d.sr = 1;
                return;
            }
            d.chShow = !d.chShow;
            switchVis(d);
            return;
        }
        d.fx = d.fy = null;
        d.sr = 1;
        if (d.type == "GNODE") {
            if (d.chShow) {
                d.chShowCnt = 300;
                var linObj = parms.oGET("RENDERER").instance;
                linObj.chShowCntc += 1;
            }
        }
        return;
    }
    // if (event.button == 2) {
    //     if (d.type == "PNODE") {
    //         d.fx = d.fy = null;
    //         d.sr = 1;
    //         return;
    //     }
    //     d.chShow = !d.chShow;
    //     switchVis(d);
    // }
}
function switchVis(g) {
    var linObj = parms.oGET("RENDERER").instance;
    let _chShow = g.chShow;
    if (_chShow) {
        if (!linObj.CLUSTERmapG.has(g.nodeID)) {
            let p_pos = {
                'x': g.x, 'y': g.y,
                'vis': g.vis,
                'visP': null
           };
           linObj.CLUSTERmapG.set(g.nodeID, p_pos);
        }
        nodesAdd(linObj, g);
    } else {
        if (linObj.CLUSTERmapG.has(g.nodeID)) {
            let lidx = linObj.CLUSTERmapG.get(g.nodeID);
            linObj.CLUSTERmapG.delete(g.nodeID);
        }
        nodesSub(linObj, g);
    }
    // if (linObj.Cview == "HV") {
        g.fx = g.x;
        g.fy = g.y;
    // }
    updatencounter(linObj);
    linObj.FORCE_SIMULATION.stop();
    if (linObj.Cview == "HV") {
        linObj.FORCE_SIMULATION = CLUSTERsimHV(linObj);
    } else {
        linObj.FORCE_SIMULATION = CLUSTERsimGV(linObj);
    }
    linObj.SVG_NODES = CLUSTERdrawPN(linObj);
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
function nodesAdd(linObj, g) {
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
        if (!linObj.CLUSTERmapP.has(p.nodeID)) {
            let p_pos = {
                'x': p.x, 'y': p.y,
                'vis': p.vis,
                'visP': p.parent.vis,
                'surname': p.ynode.surname
           };
           linObj.CLUSTERmapP.set(p.nodeID, p_pos);
        }
        p.fx = null;
        p.fy = null;
    });
    _nodes.forEach(n => linObj.sNODES.push(n));
    _nodes.forEach(n => linObj.pNODESc.push(n));
}
function nodesSub(linObj, d) {
    let _group = d.data.group;
    for (let i = linObj.pNODESc.length - 1; i >= 0; --i) {
        let cNode = linObj.pNODESc[i];
        if (cNode.group == _group) {
            // remove node
            if (linObj.CLUSTERmapP.has(cNode.nodeID))
                linObj.CLUSTERmapP.delete(cNode.nodeID);
            linObj.pNODESc.splice(i, 1);
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
        d.sr = 2;
        d.fx = d.x;
        d.fy = d.y;
    } else {
        let renderer = parms.oGET("RENDERER");
        d.fx = null;
        d.fy = null;
        if (renderer.Cview == "GV") {
            d.vis.x = d.vis0.x;
            d.vis.y = d.vis0.y;
            let sc = d.data.group;
            let cxy = renderer.CLUSTERs.get(sc);
            cxy.x = d.vis.x;
            cxy.y = d.vis.y;
            renderer.CLUSTERs.set(sc, cxy);
            forceFORCE_XYga(renderer);
        } else {
            d.vis.x = d.x; //  + 2 * d.r;
            d.vis.y = d.y; // + d.r;
            forceFORCE_XYha(renderer.FORCE_SIMULATION);
        }
        if (renderer.SVG_GROUP_LABELS)  renderer.SVG_GROUP_LABELS.remove();
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
        let cxy = linObj.CLUSTERs.get(sc);
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
        let cxy = linObj.CLUSTERs.get(sc);
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
            let _nx = 0;
            if (n.type === "PNODE" )
                _nx = n.parent.x;
            return _nx;
        }).strength( function(n) {
            let _g = _gravX;
            if (n.type === "GNODE")
                _g = 0.25; // _SIMULATION.alpha() * 0.25;
            return _g;
        }
        )) 
        .force("y", d3.forceY( function (n) { 
            let _ny = 0;
            if (n.type === "PNODE" )
                _ny = n.parent.y;
            return _ny;
        }).strength( function(n) {
            let _g = _gravY;
            if (n.type === "GNODE")
            _g = 0.25; // _SIMULATION.alpha() * 0.25;
            return _g;
        }
        )) 
        // .force("center", d3.forceCenter(0.0, 0.0).initialize(linObj.gNODESc))
    ;
}
