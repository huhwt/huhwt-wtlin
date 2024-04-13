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
import * as uti from "./utils.js";
import { initInteractions, initTooltip, setDragactions, set_tickCounter, makeTickCountInfo, updatencounter } from "./interaction.js";
import { TopoMap, NormalField, GradientField } from "./scalarfield.js";
import { initIDX, getColor} from "./indexman.js";
import { RENDERhelper, reset, setArrow } from "./RENDERhelpers.js";


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


    linObj.REPULSION_FORCE = d3.forceManyBody()
        .strength(-parms.GET("REPULSION_STRENGTH"));

    linObj.LINK_FORCE = d3.forceLink()
        .links(linObj.yLINKS)
        .distance(function(d){ return d.distance; })
        .strength(parms.GET("LINK_STRENGTH"))
        ;

    let _alpha = parms.GET("ALPHA_T"); 

    linObj.tickCallback = TREEtick;

    linObj.FORCE_SIMULATION = d3.forceSimulation()
        .nodes(linObj.yNODES)
        .force("charge", linObj.REPULSION_FORCE)
        .force("x", d3.forceX(0).strength(parms.GET("GRAVITY_X"))) 
        .force("y", d3.forceY(0).strength(parms.GET("GRAVITY_Y"))) 
        .force("link", linObj.LINK_FORCE)
        .force("similarity", function(alpha){ dmanObj.similarityForceY(linObj.yNODES, _alpha); })
        .force("collide", d3.forceCollide().radius(function(d){ return 2 * d.r; }))
        .alpha(_alpha)
        // .alphaDecay(0.228)
        .alphaTarget(0.05)
        .velocityDecay(parms.GET("FRICTION"))
        .on("tick", function tick() { linObj.tickCallback(linObj); })
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
    const ctr = linObj.CANVAS.transition()
        .duration(150);

    let _linkwidth = parms.GET("LINK_WIDTH");
    let _linkshow = parms.GET("SHOW_LINKS");
    let _linkopacity = parms.GET("LINK_OPACITY");
    if (!_linkshow) _linkopacity = 0;
    linObj.SVG_LINKS = linObj.GRAPH_LAYER.selectAll(".link")
        .data(linObj.yLINKS).join(
            enter => enter.append("line")
                .attr("stroke", function(link) { return link.color; })
                .attr("stroke-width", function(link) { return setLinkWidth(link, _linkwidth); })
                .attr("stroke-dasharray", function(link) { return link.directed ? setDash_d(link) : setDash_w(link); })
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
                .style("stroke", function(node) { return node.fx == null ? setBorderColor(node) : dmanObj.PARM_NODE_BORDER_COLOR_FIXED; })
                .style("fill", function(node) { return getColor(node.sortname); })
                .attr("stroke-width", _nodeRadius + "px")
                .attr("width", function (n) { return 2 * n.r; })
                .attr("height", function (n) { return 2 * n.r; })
                .attr("rx", function (n) { return n.crx; })
                .attr("ry", function (n) { return n.cry; })
                .attr("x", function (n) { return n.x; })
                .attr("y", function (n) { return n.y; }),
            exit => exit
                .remove()
          );

    uti.logSVG(i18n("F_G_I"), "SVG_NODES ", linObj.SVG_NODES);
    uti.logSVG(i18n("F_G_I"), "SVG_LINKS ", linObj.SVG_LINKS);
    // console.log(linObj.SVG_NODES);
    linObj.SVG_DRAGABLE_NODES = linObj.SVG_NODES;
    setDragactions(linObj);
    if (linObj.isInitialized) initTooltip(linObj);
    dmanObj.makeGuideLines(linObj);

    parms.dataMod(false);

    if (linObj.isInitialized) {
        linObj.RENDERhelper.hideNames(linObj);
        if (parms.GET("SHOW_NAMES")) {
            linObj.RENDERhelper.showNames(linObj);
        }
    }

}

function setBorderColor(node) {
    let _bcolor = parms.Scolor[node.sex];
    return _bcolor;
}

function setLinkWidth(link, _linkwidth) {
    let _lwidth  = _linkwidth;
    if (!link.directed) { 
        _lwidth = _linkwidth * link.width;
    }
    return _lwidth + "px";
}

function setDash_d(link) {
    let _dasharray = "";
    if (link.type == "dashed")
        _dasharray = "2,4";
    return _dasharray;
}
function setDash_w(link) {
    let _dasharray = "3,9";
    if (link.width < 2)
        _dasharray = "6,4";
    return _dasharray;
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
        return;
    }

    if (parms.dataMod()) { 
        if (linObj.SVG_NODES) linObj.SVG_NODES.remove();
        if (linObj.SVG_LINKS) linObj.SVG_LINKS.remove();
        if (linObj.SVG_NODE_LABELS) linObj.SVG_NODE_LABELS.remove();
        if (linObj.SVG_DRAGABLE_NODES)  linObj.SVG_DRAGABLE_NODES.remove();
        TREEdraw(linObj, dmanObj);
        parms.dataMod(false);
        return;
    } else {

        // move node circles to defined position (d.x,d.y)
        linObj.SVG_NODES
            .attr("width", function (n) { return 2 * n.r * n.sr; })
            .attr("height", function (n) { return 2 * n.r * n.sr; })
            .attr("rx", function (n) { return n.crx * n.sr; })
            .attr("ry", function (n) { return n.cry * n.sr; })
            .attr("x", function (n) { return n.x - n.r; })
            .attr("y", function (n) { return n.y - n.r; })
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
                    return d.source.x; 
                var ld = uti.distance(d.source, d.target), t = (ld - d.source.r - _arrowDfactor * _arrowRadius) / ld;
                var x = d.source.x * t + d.target.x * (1-t);
                return isNaN(x) ? d.source.x : x;
            })
            .attr("y1", function(d) { 
                if (!d.directed)
                    return d.source.y; 
                var ld = uti.distance(d.source, d.target), t = (ld - d.source.r - _arrowDfactor * _arrowRadius) / ld;
                var y = d.source.y * t + d.target.y * (1-t);
                return isNaN(y) ? d.source.y : y;
            })
            .attr("x2", function(d) { 
                if (!d.directed)
                    return d.target.x;
                var ld = uti.distance(d.source, d.target), t = (ld - d.target.r - _arrowDfactor * _arrowRadius) / ld;
                var x = d.source.x * (1-t) + d.target.x * t;
                return isNaN(x) ? d.target.x : x;
            })
            .attr("y2", function(d) { 
                if (!d.directed)
                    return d.target.y;
                var ld = uti.distance(d.source, d.target), t = (ld - d.target.r - _arrowDfactor * _arrowRadius) / ld;  
                var y = d.source.y * (1-t) + d.target.y * t;
                return isNaN(y) ? d.target.y : y;
            })
            .attr("stroke-width", function(link) { return setLinkWidth(link, _linkwidth); })
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
