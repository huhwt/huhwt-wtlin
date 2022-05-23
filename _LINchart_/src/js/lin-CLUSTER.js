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
import { vec, brighten, darken, distance, jiggle, isNumber, logSVG } from "./utils.js";
import { initInteractions, initZOOM, initTooltip, setDragactions, set_tickCounter, makeTickCountInfo, updatencounter } from "./interaction.js";
import { TopoMap, NormalField, GradientField } from "./scalarfield.js";
import { initIDX, getColor, setArrow} from "./indexman.js";
import { makeCLUSTERs } from "./clusters.js";
import { RENDERhelper, reset } from "./RENDERhelpers.js";

export function CLUSTERexec(linObj, dmanObj) {
    let r_s = parms.GET("REPULSION_STRENGTH_x");
    parms.SET("REPULSION_STRENGTH", r_s);

    parms.SET("PERSON_LABELS_BELOW_DIST", 24);

    linObj.CLUSTERs = makeCLUSTERs(linObj.yNODES, dmanObj);
    console.log("CLUSTERs", linObj.CLUSTERs, dmanObj.clust_grid);
    makeCENTROID(linObj.yNODES, dmanObj);
    // ------------------------------------------------------------------------------------------------------------------------

    linObj.REPULSION_FORCE = d3.forceManyBody().strength(-parms.GET("REPULSION_STRENGTH"));
    linObj.LINK_FORCE = d3.forceLink([]).strength(-1);

    // linObj.cNODES = null;
    switch (dmanObj.clusters_aktiv) {
        case 'soundDM':
            CLUSTERsim(linObj, dmanObj, "Dm");
            break;
        case 'soundSTD':
            CLUSTERsim(linObj, dmanObj, "R");
            break;
        default:
            CLUSTERsim(linObj, dmanObj, "Sn");
    }

    // ("Force Graph Initialized.");
    console.log(i18n("F_G_I"), "cNODES ", linObj.cNODES.length);

    linObj.RENDERhelper.set_xNODES(linObj.cNODES);
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

function CLUSTERsim(linObj, dmanObj, suff) {
    let _nodesKenn = "cnodes" + suff;
    let _dataKenn = "cdata" + suff;
    linObj.cNODES = parms.oGET(_nodesKenn);
    linObj.cDATA = parms.oGET(_dataKenn);

    linObj.cNODESsort = [];
    linObj.cNODESall = [];

    linObj.cNODES.forEach( function(n, i) {
        n.sr = n.data.ynode.sr;
        n.Yvalue = n.data.ynode.Yvalue;
        linObj.cNODESsort.push(n);
    });
    linObj.cNODESsort.sort((a, b) => {
        return a.data.ynode.Yvalue - b.data.ynode.Yvalue;
    });
    linObj.cNODES.forEach( function(n, i) {
        linObj.cNODESall.push(n);
    });

    linObj.FORCE_SIMULATION = d3.forceSimulation(linObj.cNODES)
        .force("x", d3.forceX(0).strength(0.01))
        .force("y", d3.forceY(0).strength(0.01))
        // .force("center", d3.forceCenter(0, 0))
        .force("charge", linObj.REPULSION_FORCE)
        .force("cluster", forceCluster(linObj))
        .force("collide", forceCollide(linObj))
        // .force("link", d3.forceLink([]))
        // .alpha(parms.GET("ALPHA_x"))
        // .alphaDecay(0.02)
        // .alphaTarget(0.021)
        // .velocityDecay(0.6)
        .on("tick", function tick() { CLUSTERtick(linObj); })
        ;

}
function forceFORCE_Dm(linObj) {
    linObj.FORCE_SIMULATION
        .force("x", d3.forceX( function (n) { 
            let sc = 'D' + n.data.ynode.sn_scDM;
            let cxy = linObj.CLUSTERs[sc];
            if (cxy) {
                n.x = cxy.x;
                return n.x - n.r;
            } else {
                return 0;
            }
        }).strength(parms.GET("GRAVITY_X_x"))) 
        .force("y", d3.forceY( function (n) { 
            let sc = 'D' + n.data.ynode.sn_scDM;
            let cxy = linObj.CLUSTERs[sc];
            if (cxy) {
                n.y = cxy.y;
                return n.y - n.r;
            } else {
                return 0;
            }
        }).strength(parms.GET("GRAVITY_Y_x"))) 
    ;
}
function forceFORCE_R(linObj) {
    linObj.FORCE_SIMULATION
        .force("x", d3.forceX( function (n) { 
            let sc = 'S' + n.data.ynode.sn_scR;
            let cxy = linObj.CLUSTERs[sc];
            if (cxy) {
                n.x = cxy.x;
                return n.x - n.r;
            } else {
                return 0;
            }
        }).strength(parms.GET("GRAVITY_X_x"))) 
        .force("y", d3.forceY( function (n) { 
            let sc = 'D' + n.data.ynode.sn_scR;
            let cxy = linObj.CLUSTERs[sc];
            if (cxy) {
                n.y = cxy.y;
                return n.y - n.r;
            } else {
                return 0;
            }
        }).strength(parms.GET("GRAVITY_Y_x"))) 
    ;

}
function forceFORCE_Sn(linObj) {
    linObj.FORCE_SIMULATION
        .force("x", d3.forceX( function (n) { 
            let sc = n.data.ynode.surname;
            let cxy = linObj.CLUSTERs[sc];
            if (cxy) {
                n.x = cxy.x;
                return n.x - n.r;
            } else {
                return 0;
            }
        }).strength(parms.GET("GRAVITY_X_x"))) 
        .force("y", d3.forceY( function (n) { 
            let sc = n.data.ynode.surname;
            let cxy = linObj.CLUSTERs[sc];
            if (cxy) {
                n.y = cxy.y;
                return n.y - n.r;
            } else {
                return 0;
            }
        }).strength(parms.GET("GRAVITY_Y_x"))) 
    ;
}

export function CLUSTERdraw(linObj, dmanObj)
{
    // for (let i = 0; i < linObj.cNODES.length; i++) {
    //     let _n = linObj.cNODES[i].data;
    //     console.log(_n);
    // }
    let _nodeRadius = parms.GET("NODE_RADIUS") / 4;
    linObj.SVG_NODES = linObj.GRAPH_LAYER.selectAll(".nodes")
        .data(linObj.cNODES).join(
            enter => enter.append("rect")
                .style("fill", function(node) { return getColor(node.data.ynode.sn_scDM); })
                .style("stroke", function(node) { return node.fx == null ? "#222" : dmanObj.PARM_NODE_BORDER_COLOR_FIXED; })
                .attr("stroke-width", _nodeRadius + "px")
                .attr("width", function (n) { return 2 * n.data.ynode.r; })
                .attr("height", function (n) { return 2 * n.data.ynode.r; })
                .attr("rx", function (n) { return 2 * n.data.ynode.cr; })
                .attr("ry", function (n) { return 2 * n.data.ynode.cr; })
                .attr("x", function (n) { return n.x; })
                .attr("y", function (n) { return n.y; }),
            update => update
                .style("fill", function(node) { return getColor(node.data.ynode.sn_scDM); })
                .style("stroke", function(node) { return node.fx == null ? "#222" : dmanObj.PARM_NODE_BORDER_COLOR_FIXED; })
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

    // set labels
    if (linObj.isInitialized) {
        if (parms.GET("SHOW_NAMES")) {
            linObj.RENDERhelper.showNames(linObj);
        }
    }

}

function CLUSTERtick(linObj)
{
    if (linObj.SVG_NODES == null) return;

    // only update visualization each N iterations for performance
    let dmanObj = linObj.DATAman;
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
        if (dmanObj.tickCounter == 5) {
            // this.adjustCanvas(linObj);
        }
        return;
    }
    if (parms.dataMod()) {
        if (linObj.SVG_NODES) linObj.SVG_NODES.remove();
        if (linObj.SVG_NODE_LABELS) linObj.SVG_NODE_LABELS.remove();
        if (linObj.SVG_DRAGABLE_ELEMENTS)  linObj.SVG_DRAGABLE_ELEMENTS.remove();
        parms.dataMod(false);
        if (nodesCheck(linObj, dmanObj)) {
            CLUSTERdraw(linObj, dmanObj);
        } else {
            reset(linObj);
            CLUSTERexec(linObj, dmanObj);
        }
    } else {

        // let _cn = linObj.SVG_NODES._groups[0];
        // for (let i = 0; i < _cn.length; i++) {
        //     let _n = _cn[i];
        //     let _hx = _n.hasAttribute("x");
        //     let _x = null;
        //     if (_hx) {
        //         _x = _n.getAttribute("x");
        //         if (_x == 'NaN')
        //             console.log(i, _x, linObj.cNODES[i]);
        //     } else {
        //         console.log(_n);
        //     }
        // }
        // move node circles to defined position (d.x,d.y)
        linObj.SVG_NODES
            .style("stroke", function(n) { return n.fx == null ? "#222" : dmanObj.PARM_NODE_BORDER_COLOR_FIXED; })
            .style("fill", function(node) { return getColor(node.data.ynode.sn_scDM); })
            .attr("width", function (n) { return 2 * n.data.ynode.r * n.sr; })
            .attr("height", function (n) { return 2 * n.data.ynode.r * n.sr; })
            .attr("rx", function (n) { return 2 * n.data.ynode.cr * n.sr; })
            .attr("ry", function (n) { return 2 * n.data.ynode.cr * n.sr; })
            .attr("x", function (n) { return n.x; })
            .attr("y", function (n) { return n.y; })
            ;

            if (parms.GET("SHOW_NAMES")) {
                if (linObj.SVG_NODE_LABELS === null) 
                    linObj.RENDERhelper.showNames(linObj, linObj.cNODES);
                linObj.SVG_NODE_LABELS.attr("transform", linObj.RENDERhelper.placeLabel);
            }

        linObj.showALPHA(linObj);
        }

}

function nodesCheck(linObj, dmanObj) {
    if (linObj.yNODES.length < linObj.cNODES.length) {
        let Ynodes = linObj.yNODES;
        let Cnodes = linObj.cNODES;
        let CnodesSort = linObj.cNODESsort;
        let CnodesAll = linObj.cNODESall;
        for (let i = Cnodes.length - 1; i >= 0; --i) {
            let cNode = Cnodes[i];
            let cNode_dy = cNode.data.ynode;
            let inYn = Ynodes.indexOf(cNode_dy);
            if (inYn < 0) {
                Cnodes.splice(i, 1);                // Remove the nodes out of year range
                let inCnS = CnodesSort.indexOf(cNode);
                CnodesSort[inCnS] = cNode;
            } else {
                if (Cnodes.length <= Ynodes.length) {
                    break;
                }
            }
        }
        return true;
    }
    return false;
    // if (linObj.yNODES.length > linObj.cNODES.length) {
    //     let _TL = dmanObj.TIMEline;
    //     let _year = _TL.Year;
    //     let _yearS = _TL.YearS;
    //     let Ynodes = linObj.yNODES;
    //     let Cnodes = linObj.cNODES;
    //     let CnodesSort = linObj.cNODESsort;
    //     let CnodesAll = linObj.cNODESall;
    //     for (let i = 0; i < CnodesSort.length; i++) {
    //         let cNodeS= CnodesSort[i];
    //         if (cNodeS.Yvalue > _year) {             // year value out of range
    //             break;
    //         } else {
    //             if (cNodeS.Yvalue >= _yearS) {               // year value in range
    //                 let cNodeAdy = cNodeS.data.ynode;
    //                 let inYnAdy = Ynodes.indexOf(cNodeAdy);
    //                 if (inYnAdy >= 0) {                       // node is active
    //                     let inC = Cnodes.indexOf(cNodeS);
    //                     if (inC < 0) {                            // ... and not in sight ...
    //                         let inCn = CnodesAll.indexOf(cNodeS);
    //                         let cNodeA = CnodesAll[inCn];
    //                         Cnodes.push(cNodeA);                        // ... set it active
    //                     }
    //                 } else {
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    //     return;
    // }
}

function forceCluster(linObj) {
    const strength = 0.8;
    let nodes = linObj.cNODES;
  
    function force(alpha) {
        const centroids = d3.rollup(nodes, centroid, d => d.data.group);
        const l = alpha * strength;
        for (const d of nodes) {
            const {x: cx, y: cy} = centroids.get(d.data.group);
            d.vx -= (d.x - cx) * l;
            d.vy -= (d.y - cy) * l;
        }
    }
  
    force.initialize = _ => nodes = _;
  
    return force;
}
function centroid(cNODES) {
    let x = 0;
    let y = 0;
    let z = 0;
    let icN = -1;
    for (const d of cNODES) {
        let k = Math.pow(d.r, 2);
        ++icN;
        x += d.x * k;
        y += d.y * k;
        z += k;
        if (x == 'NaN')
            console.log(icN, cNODES);
    }
    return {x: x / z, y: y / z};
}

function forceCollide(linObj) {
    const alpha = 0.6; // fixed for greater rigidity!
    const padding1 = 24; // separation between same-color nodes
    const padding2 = 6; // separation between different-color nodes
    let nodes = linObj.cNODES;
    let maxRadius = 0.0;
  
    function force() {
        let alpha = 1;
        const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
        for (const d of nodes) {
            if ( d.r !== d.r) 
                console.log("forceCollide r", d);
            const r = d.r + maxRadius;
            if ( d.x !== d.x) 
                console.log("forceCollide x", d);
            const nx1 = d.x - r;
            const ny1 = d.y - r;
            const nx2 = d.x + r;
            const ny2 = d.y + r;
            quadtree.visit( (q, x1, y1, x2, y2) => {
                if (!q.length) do {
                    if (q.data !== d) {
                        const r = d.r + q.data.r + (d.data.group === q.data.group ? padding1 : padding2);
                        let x = d.x - q.data.x;
                        let y = d.y - q.data.y;
                        let l = Math.hypot(x, y);
                        if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l; d.y -= y *= l;
                            q.data.x += x; q.data.y += y;
                        }
                    }
                } while (q == q.next);
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        }
    }
  
    force.initialize = _ => maxRadius = d3.max(nodes = _, d => d.r) + Math.max(padding1, padding2);
  
    return force;
}

function makeCENTROID(Ynodes, dmanObj) {

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

    let data_DM = ({
        children: Array.from(
            d3.group(
                Array.from(Ynodes, (n, i) => ({
                    group: n.sn_scDM,
                    pvalue: 1,
                    ynode: n
                })
            ),
            d => d.group
            ),
            ([, children]) => ({children})
    )});
    let nodes_DM = Cpack(data_DM, dmanObj.width, dmanObj.height);

    let data_R = ({
        children: Array.from(
            d3.group(
                Array.from(Ynodes, (n, i) => ({
                    group: n.sn_scR,
                    pvalue: 1,
                    ynode: n
                })
            ),
            d => d.group
            ),
            ([, children]) => ({children})
    )});
    let nodes_R = Cpack(data_R, dmanObj.width, dmanObj.height);

    let data_surn = ({
        children: Array.from(
            d3.group(
                Array.from(Ynodes, (n, i) => ({
                    group: n.surname,
                    pvalue: 1,
                    ynode: n
                })
            ),
            d => d.group
            ),
            ([, children]) => ({children})
    )});
    let nodes_surn = Cpack(data_surn, dmanObj.width, dmanObj.height);

    console.log("cnodesDm", nodes_DM);
    parms.oSET("cnodesDm", nodes_DM);
    parms.oSET("cdataDm", data_DM);

    // console.log("cnodesR", nodes_R);
    parms.oSET("cnodesR", nodes_R);
    parms.oSET("cdataR", data_R);

    // console.log("cnodesSn", nodes_surn);
    parms.oSET("cnodesSn", nodes_surn);
    parms.oSET("cdataSn", data_surn);
}