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
import { vec, brighten, darken, distance, jiggle, isNumber, logSVG } from "./utils.js";
import { initInteractions, initZOOM, initTooltip, setDragactions, set_tickCounter, makeTickCountInfo, updatencounter, toggleLINmenu, toggleSLIDERtl} from "./interaction.js";
import { TopoMap, NormalField, GradientField } from "./scalarfield.js";
import { initIDX, getColor, setArrow} from "./indexman.js";
import { RENDERhelper, reset } from "./RENDERhelpers.js";


export function TLINEexec(linObj, dmanObj) {
    let r_s = parms.GET("REPULSION_STRENGTH_x");
    parms.SET("REPULSION_STRENGTH", r_s);

    parms.SET("PERSON_LABELS_BELOW_DIST", 12);

    makeYPOS(linObj.yNODES, dmanObj);
    let _nodesKenn = "cnodesYP";
    linObj.tNODES = parms.oGET(_nodesKenn);

    linObj.tNODESsort = [];
    linObj.tNODES.forEach( function(n, i) {
        n.sr = n.data.ynode.sr;
        n.Yvalue = n.data.ynode.Yvalue;
        linObj.tNODESsort.push(n);
    });
    linObj.tNODESsort.sort((a, b) => {
        return a.data.ynode.Yvalue - b.data.ynode.Yvalue;
    });

    toggleLINmenu(false);
    toggleSLIDERtl(true);


    // ------------------------------------------------------------------------------------------------------------------------

    linObj.RENDERhelper.set_xNODES(linObj.tNODES);
    ///  CREATE SVG ELEMENTS
    dmanObj.initSVGLayers(linObj);
    dmanObj.toggleYearScale(true);
    dmanObj.setColorMap(linObj);
    // linObj.DATAman.setNodeColors(linObj);
    TLINEdraw(linObj, dmanObj);

    // ("SVG Elements Initialized.");
    console.log(i18n("SVG_E_i"));

    // ------------------------------------------------------------------------------------------------------------------------

    linObj.REPULSION_FORCE = d3.forceManyBody().strength(parms.GET("REPULSION_STRENGTH"));
    // linObj.LINK_FORCE = d3.forceLink(linObj.yLINKS).distance(function(d){ return d.distance; }).strength(parms.GET("LINK_STRENGTH"));
    let _alpha = parms.GET("ALPHA_T");

    let ysWidth = dmanObj.width - 2 * dmanObj.YEARscale_offset;
    linObj.FORCE_SIMULATION = d3.forceSimulation(linObj.tNODES)
        .force("charge", linObj.REPULSION_FORCE)
        .force("x", d3.forceX( function (n) { 
            let px0 = (n.Yvalue - dmanObj.TIMEline.YearS) / (dmanObj.TIMEline.YearE - dmanObj.TIMEline.YearS);
            let px = px0 * ysWidth;
            return px;
        })) // .strength(parms.GET("GRAVITY_X_x"))) 
        // .force("y", d3.forceY(0).strength(parms.GET("GRAVITY_Y"))) 
        // .force("link", linObj.LINK_FORCE)
        // .force("similarity", function(alpha){ dmanObj.similarityForce(linObj.tNODES, alpha); })
        .force("collide", d3.forceCollide().radius(function(d){ return 4 * d.r; }))
        .alpha(_alpha)
        // .alphaDecay(0.228)
        .alphaTarget(0.01)
        .velocityDecay(parms.GET("FRICTION"))
        .on("tick", function tick() { TLINEtick(linObj); })
        .on("end", function update() { linObj.RENDERhelper.updateScalarField(linObj); })
        ;

    // ("Force Graph Initialized.");
    console.log(i18n("F_G_I"), "tNODES ", linObj.tNODES.length);

    // ------------------------------------------------------------------------------------------------------------------------

    if (!linObj.isInitialized) {
        initInteractions(linObj);
        linObj.isInitialized = true;
    }
    updatencounter(linObj);

    // ("Interactions Initialized.");
    console.log(i18n("Int_i"));
}

export function TLINEdraw(linObj, dmanObj)
{
    const t = linObj.CANVAS.transition()
        .duration(150);

    let _nodeRadius = parms.GET("NODE_RADIUS") / 4;
    linObj.SVG_NODES = linObj.GRAPH_LAYER.selectAll(".nodes")
        .data(linObj.tNODES).join(
            enter => enter.append("rect")
                .style("stroke", function(node) { return node.fx == null ? "#222" : dmanObj.PARM_NODE_BORDER_COLOR_FIXED; })
                .style("fill", function(node) { return getColor(node.data.ynode.sn_scDM); })
                .attr("stroke-width", _nodeRadius + "px")
                .attr("width", function (n) { return 2 * n.data.ynode.r; })
                .attr("height", function (n) { return 2 * n.data.ynode.r; })
                .attr("rx", function (n) { return 2 * n.data.ynode.cr; })
                .attr("ry", function (n) { return 2 * n.data.ynode.cr; })
                .attr("x", function (n) { return n.x; })
                .attr("y", function (n) { return n.y; }),
            exit => exit
                .remove()
          );

    logSVG(i18n("F_G_I"), "SVG_NODES ", linObj.SVG_NODES);
    // console.log(linObj.SVG_NODES);
    linObj.SVG_DRAGABLE_ELEMENTS = linObj.SVG_NODES;
    setDragactions(linObj);
    initZOOM(linObj);
    initTooltip(linObj);

    parms.dataMod(false);

    if (linObj.isInitialized) {
        if (parms.GET("SHOW_NAMES")) {
            linObj.RENDERhelper.showNames(linObj);
        }
    }
    
}

function TLINEtick(linObj)
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
        TLINEdraw(linObj, dmanObj);
        parms.dataMod(false);
    } else {

        // move node circles to defined position (d.x,d.y)
        linObj.SVG_NODES
            .style("fill", function(node) { return getColor(node.data.ynode.sn_scDM); })
            .attr("width", function (n) { return 2 * n.data.ynode.r * n.sr; })
            .attr("height", function (n) { return 2 * n.data.ynode.r * n.sr; })
            .attr("rx", function (n) { return 2 * n.data.ynode.cr * n.sr; })
            .attr("ry", function (n) { return 2 * n.data.ynode.cr * n.sr; })
            .attr("x", function (n) { return n.x - n.r; })
            .attr("y", function (n) { return n.y - n.r; })
            ;

        // set labels
        if (parms.GET("SHOW_NAMES")) {
            if (linObj.SVG_NODE_LABELS === null) 
                linObj.RENDERhelper.showNames(linObj, linObj.tNODES);
            linObj.SVG_NODE_LABELS.attr("transform", linObj.RENDERhelper.placeLabel);
        }
    }

    linObj.showALPHA(linObj);

}

function makeYPOS(Ynodes, dmanObj) {

    function Cpack(data_xx, width, height) {
        let pack_XX = () => d3.pack()
            .size([width, height])
            .padding(1)
            (d3.hierarchy(data_xx)
                .sum(d => d.pvalue)
        );
        let nodes_xx = pack_XX().leaves();
        return nodes_xx;
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
    )});
    let nodes_YP = Cpack(data_YP, dmanObj.width, dmanObj.height);

    console.log("cnodesYP", nodes_YP);
    parms.oSET("cnodesYP", nodes_YP);
    parms.oSET("cdataYP", data_YP);

}
