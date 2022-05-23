///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// TREE Renderer
//
///////////////////////////////////////////////////////////////////////////////

import * as parms from "./parms.js";
import { vec, brighten, darken, distance, jiggle, isNumber, logSVG } from "./utils.js";
import { initInteractions, initZOOM, initTooltip, setDragactions, set_tickCounter, makeTickCountInfo, updatencounter } from "./interaction.js";
import { TopoMap, NormalField, GradientField } from "./scalarfield.js";
import { initIDX, getColor, setArrow} from "./indexman.js";
import { RENDERhelper, reset } from "./RENDERhelpers.js";


export function TREEexec(linObj, dmanObj) {
    let r_s = parms.GET("REPULSION_STRENGTH_T");
    parms.SET("REPULSION_STRENGTH", r_s);

    parms.SET("PERSON_LABELS_BELOW_DIST", 12);

    // ------------------------------------------------------------------------------------------------------------------------

    linObj.RENDERhelper.set_xNODES(linObj.yNODES);
    ///  CREATE SVG ELEMENTS
    dmanObj.initSVGLayers(linObj);
    dmanObj.setColorMap(linObj);
    // linObj.DATAman.setNodeColors(linObj);
    TREEdraw(linObj, dmanObj);

    // ("SVG Elements Initialized.");
    console.log(i18n("SVG_E_i"));

    // ------------------------------------------------------------------------------------------------------------------------

    linObj.REPULSION_FORCE = d3.forceManyBody().strength(-parms.GET("REPULSION_STRENGTH"));
    linObj.LINK_FORCE = d3.forceLink(linObj.yLINKS).distance(function(d){ return d.distance; }).strength(parms.GET("LINK_STRENGTH"));
    let _alpha = parms.GET("ALPHA_T");

    linObj.FORCE_SIMULATION = d3.forceSimulation(linObj.yNODES)
        .force("charge", linObj.REPULSION_FORCE)
        .force("x", d3.forceX(0).strength(parms.GET("GRAVITY_X"))) 
        .force("y", d3.forceY(0).strength(parms.GET("GRAVITY_Y"))) 
        .force("link", linObj.LINK_FORCE)
        .force("similarity", function(alpha){ dmanObj.similarityForce(linObj.yNODES, alpha); })
        .force("collide", d3.forceCollide().radius(function(d){ return 2 * d.r; }))
        .alpha(_alpha)
        // .alphaDecay(0.228)
        .alphaTarget(0.05)
        .velocityDecay(parms.GET("FRICTION"))
        .on("tick", function tick() { TREEtick(linObj); })
        .on("end", function update() { linObj.RENDERhelper.updateScalarField(linObj); })
        ;

    // ("Force Graph Initialized.");
    console.log(i18n("F_G_I"), "yNODES ", linObj.yNODES.length);

    // ------------------------------------------------------------------------------------------------------------------------

    if (!linObj.isInitialized) {
        initInteractions(linObj);
        linObj.isInitialized = true;
    }
    updatencounter(linObj);

    // ("Interactions Initialized.");
    console.log(i18n("Int_i"));
}

export function TREEdraw(linObj, dmanObj)
{
    const t = linObj.CANVAS.transition()
        .duration(150);

    let _linkwidth = parms.GET("LINK_WIDTH");
    let _linkshow = parms.GET("SHOW_LINKS");
    let _linkopacity = parms.GET("LINK_OPACITY");
    if (!_linkshow) _linkopacity = 0;
    linObj.SVG_LINKS = linObj.GRAPH_LAYER.selectAll(".link")
        .data(linObj.yLINKS).join(
            enter => enter.append("line")
                .attr("stroke", function(link) { return link.color; })
                .attr("stroke-width", function(link) { return link.directed ? _linkwidth + "px" : _linkwidth * 3 + "px"; })
                .attr("stroke-dasharray", function(link) { return link.directed ? "" : "3,9"; })
                .attr("stroke-linecap", "round")
                .attr("opacity", _linkopacity)
                .attr("marker-end", function(link) { return setArrow(link); }),
            exit => exit
                .remove()
        );
    
    let _nodeRadius = parms.GET("NODE_RADIUS") / 4;
    linObj.SVG_NODES = linObj.GRAPH_LAYER.selectAll(".nodes")
        .data(linObj.yNODES).join(
            enter => enter.append("rect")
                .style("stroke", function(node) { return node.fx == null ? "#222" : dmanObj.PARM_NODE_BORDER_COLOR_FIXED; })
                .style("fill", function(node) { return getColor(node.sn_scDM); })
                .attr("stroke-width", _nodeRadius + "px")
                .attr("width", function (n) { return 2 * n.r; })
                .attr("height", function (n) { return 2 * n.r; })
                .attr("rx", function (n) { return n.cr; })
                .attr("ry", function (n) { return n.cr; })
                .attr("x", function (n) { return n.x; })
                .attr("y", function (n) { return n.y; }),
            exit => exit
                .remove()
          );

    logSVG(i18n("F_G_I"), "SVG_NODES ", linObj.SVG_NODES);
    logSVG(i18n("F_G_I"), "SVG_LINKS ", linObj.SVG_LINKS);
    // console.log(linObj.SVG_NODES);
    linObj.SVG_DRAGABLE_ELEMENTS = linObj.SVG_NODES;
    setDragactions(linObj);
    initZOOM(linObj);
    initTooltip(linObj);

    parms.dataMod(false);

    if (linObj.isInitialized) {
        linObj.RENDERhelper.hideNames(linObj);
        if (parms.GET("SHOW_NAMES")) {
            linObj.RENDERhelper.showNames(linObj);
        }
    }

}

function TREEtick(linObj)
{
    if (linObj.SVG_NODES == null) return;

    // only update visualization each N iterations for performance
    let dmanObj = linObj.DATAman;
    if ((dmanObj.tickCounter++) % dmanObj.tickCounterControlValue == 0) {
        if ( dmanObj.tickCounterLevel != 'min' ) {
            if (dmanObj.tickCounter > dmanObj.tickCounterThreshold) {               // check threshold
                let _tLevel = parms.TClevel_down(dmanObj.tickCounterLevel);            // get next level
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
        if (dmanObj.tickCounter == 5) {
            // this.adjustCanvas(linObj);
        }
        return;
    }
    if (parms.dataMod()) { 
        if (linObj.SVG_NODES) linObj.SVG_NODES.remove();
        if (linObj.SVG_LINKS) linObj.SVG_LINKS.remove();
        if (linObj.SVG_NODE_LABELS) linObj.SVG_NODE_LABELS.remove();
        if (linObj.SVG_DRAGABLE_ELEMENTS)  linObj.SVG_DRAGABLE_ELEMENTS.remove();
        TREEdraw(linObj, dmanObj);
        parms.dataMod(false);
    } else {

        // move node circles to defined position (d.x,d.y)
        linObj.SVG_NODES
            .attr("width", function (n) { return 2 * n.r * n.sr; })
            .attr("height", function (n) { return 2 * n.r * n.sr; })
            .attr("rx", function (n) { return n.cr * n.sr; })
            .attr("ry", function (n) { return n.cr * n.sr; })
            .attr("x", function (n) { return n.x - n.r; })
            .attr("y", function (n) { return n.y - n.r; })
            ;

        // set links
        let _arrowDfactor = parms.GET("ARROW_DISTANCE_FACTOR");
        let _arrowRadius = parms.GET("ARROW_RADIUS");
        linObj.SVG_LINKS
            .attr("x1", function(d) { 
                if (!d.directed)
                    return d.source.x; 
                var l = distance(d.source, d.target), t = (l - d.source.r - _arrowDfactor * _arrowRadius) / l;
                var x = d.source.x * t + d.target.x * (1-t);
                return isNaN(x) ? d.source.x : x;
            })
            .attr("y1", function(d) { 
                if (!d.directed)
                    return d.source.y; 
                var l = distance(d.source, d.target), t = (l - d.source.r - _arrowDfactor * _arrowRadius) / l;
                var y = d.source.y * t + d.target.y * (1-t);
                return isNaN(y) ? d.source.y : y;
            })
            .attr("x2", function(d) { 
                if (!d.directed)
                    return d.target.x;
                var l = distance(d.source, d.target), t = (l - d.target.r - _arrowDfactor * _arrowRadius) / l;
                var x = d.source.x * (1-t) + d.target.x * t;
                return isNaN(x) ? d.target.x : x;
            })
            .attr("y2", function(d) { 
                if (!d.directed)
                    return d.target.y;
                var l = distance(d.source, d.target), t = (l - d.target.r - _arrowDfactor * _arrowRadius) / l;  
                var y = d.source.y * (1-t) + d.target.y * t;
                return isNaN(y) ? d.target.y : y;
            })
            ;

        // set labels
        if (parms.GET("SHOW_NAMES")) {
            if (linObj.SVG_NODE_LABELS === null) 
                linObj.RENDERhelper.showNames(linObj, linObj.yNODES);
            linObj.SVG_NODE_LABELS.attr("transform", linObj.RENDERhelper.placeLabel);
        }
    }

    linObj.showALPHA(linObj);

}
