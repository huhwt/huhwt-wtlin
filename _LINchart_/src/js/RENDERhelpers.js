/* jshint -W014 */

import { vec, brighten, darken, distance, jiggle, isNumber, timeStart, timeEnd, logSVG } from "./utils.js";
import * as parms from "./parms.js";
import { initInteractions, setDragactions, set_tickCounter, makeTickCountInfo, updatencounter } from "./interaction.js";
import { TopoMap, NormalField, GradientField } from "./scalarfield.js";

export class RENDERhelper
{
    constructor(_objRef)
    {
        this.linObj = _objRef;
        this.xNODES = Object;
    }

    set_xNODES(xNODES) {
        this.xNODES = xNODES;
    }

    updateScalarField(linObj)
    {
        if ( linObj.SIMmode != "TREE" ) return;

        // remove old paths        
        this.resetScalarField(linObj);
        
        //--- 1. List height field constraints
        var topopoints = [];

        // add constraints at person positions
        linObj.yNODES.forEach(p =>    {
            if (isNumber(p.Yvalue)) topopoints.push(p);
        });

        // Create Topopoints for links
        if (parms.GET("EMBED_LINKS"))
        {
            linObj.yLINKS.forEach(link => {
                if (link.source.Yvalue && link.target.Yvalue) {
                    let pv0 = new vec(link.source.x, link.source.y, link.source.Yvalue);
                    let pv1 = new vec(link.target.x, link.target.y, link.target.Yvalue);
                    let v = pv1.sub(pv0);
                    let nsteps = v.norm() / parms.GET("LINK_SAMPLE_STEPSIZE");
                    if (nsteps > 0) {
                        v = v.div(nsteps);
                        for (let i = 0, pv = pv0; i < nsteps; i++, pv = pv.add(v))
                            topopoints.push({ 'x' : pv.x, 'y': pv.y, 'value' : pv.z });
                    }
                }
            });
        }

        //--- 2. Create scalar field
        // (topopoints.length, " Topopoints");
        console.log(i18n("Top_l", { ptpl: topopoints.length } ));
        var SCALARFIELD = new TopoMap(topopoints, parms.GET("SF_INTERPOLATION_TYPE"), parms.GET("SCALARFIELD_RESOLUTION"), parms.GET("SCALARFIELD_DILATION_ITERS"));

        //--- 3. Create tunnels and overlays
        if (parms.GET("SHOW_TUNNELS"))
        {
            // ("Creating Tunnels");
            console.log(i18n("Cre_T"));
            linObj.SVG_LINKS.attr("opacity", 0);  // make the other links invisible

            let SEGMENTS = [];
            linObj.yLINKS.forEach(link =>
            {
                if (link.source.Yvalue && link.target.Yvalue)
                {
                    // determine 2D start and endpoint on map, respecting some offsets
                    let pv0 = new vec(link.source.x, link.source.y, link.source.Yvalue);
                    let pv1 = new vec(link.target.x, link.target.y, link.target.Yvalue);

                    SEGMENTS.push({ 'pv0': pv0, 'pv1': pv1, 'directed': link.directed, 'r1': link.target.r });
                }
            });

            // create tunnels
            createTunnels(linObj, SCALARFIELD, SEGMENTS);

            if (linObj.SVG_NODES) linObj.SVG_NODES.raise();
            if (linObj.SVG_NODE_LABELS) linObj.SVG_NODE_LABELS.raise();
        }
        else
        {
            linObj.SVG_LINKS_STREETS.attr("opacity", 0);
            linObj.SVG_LINKS_TUNNELS.attr("opacity", 0);
            linObj.SVG_TUNNEL_ENTRIES_1.attr("opacity", 0);
            linObj.SVG_TUNNEL_ENTRIES_2.attr("opacity", 0);
            linObj.SVG_LINKS.attr("opacity", parms.GET("SHOW_LINKS") ? parms.GET("LINK_OPACITY") : 0)
                        .attr("stroke-width", parms.GET("LINK_WIDTH") + "px")
                        ;
        }

        addHeightfieldOverlays(SCALARFIELD, linObj);
            
        // ("+++ Done Updating ScalarField");
        console.log(i18n("Done_uSF"));
    }

    adjustCanvas(linObj) {
        // let the_canvas = linObj.CANVAS;
        // let w = the_canvas._groups[0][0].lastChild.clientWidth;
        // let t = d3.zoomIdentity
        //         .translate(-2500, -1750)
        //         .scale(2, 2);
        // the_canvas            
        //     .transition()
        //     .call(linObj.zoomO.transform, t);
        // d3.zoomIdentity = t;
        return;
    }

    resetScalarField(linObj)
    {
        // remove old paths        
        if (linObj.SVG_CONTOURS) linObj.SVG_CONTOURS.remove();
        if (linObj.SVG_SHADING_CONTOURS) linObj.SVG_SHADING_CONTOURS.remove();
        if (linObj.SVG_LINKS_STREETS) linObj.SVG_LINKS_STREETS.remove();
        if (linObj.SVG_LINKS_TUNNELS) linObj.SVG_LINKS_TUNNELS.remove();
        if (linObj.SVG_TUNNEL_ENTRIES_1) linObj.SVG_TUNNEL_ENTRIES_1.remove();
        if (linObj.SVG_TUNNEL_ENTRIES_2) linObj.SVG_TUNNEL_ENTRIES_2.remove();
        if (linObj.SVG_INDICATOR_LABELS) linObj.SVG_INDICATOR_LABELS.remove();

        // make the original simple links visible again
        if (linObj.SVG_LINKS && parms.GET("SHOW_LINKS")) linObj.SVG_LINKS.attr("opacity", 1);  
    }

    resetColormap(linObj)
    {
        let renderer = parms.oGET("RENDERER");
        linObj.TOPO_LAYER.selectAll(".contours")
            .attr("fill", function(d) { return brighten(renderer.SVG_COLORMAP(d.value),0.05); })
            .attr("stroke", function(path) { return setContourColor(path, renderer.SVG_COLORMAP); })
            .attr("stroke-width", function(path) { return setContourWidth(path); })
            ;
    }

    showNames(linObj)
    {
        if (!this.xNODES)
            return false;

        if ( linObj.SIMmode !== "TREE" ) {
            linObj.SVG_NODE_LABELS = linObj.GRAPH_LAYER.selectAll(".labels")
                .data(this.xNODES).enter()
                .append("text")
                .text(function(node) { return node.data.ynode.showname; })
                .style("fill", parms.GET("LABEL_COLOR"))
                .style("stroke", "white")
                .style("stroke-width", parms.GET("NAME_SIZE") / 5)
                .style("paint-order", "stroke")
                .style("font-family", "Calibri")
                .style("font-size", parms.GET("NAME_SIZE"))
                .style("pointer-events", "none")  // to prevent mouseover/drag capture
                .style("opacity", parms.GET("PERSON_LABEL_OPACITY"))
                ;
        } else {
            linObj.SVG_NODE_LABELS = linObj.GRAPH_LAYER.selectAll(".labels")
                .data(this.xNODES).enter()
                .append("text")
                .text(function(node) { return node.showname; })
                .style("fill", parms.GET("LABEL_COLOR"))
                .style("stroke", "white")
                .style("stroke-width", parms.GET("NAME_SIZE") / 5)
                .style("paint-order", "stroke")
                .style("font-family", "Calibri")
                .style("font-size", parms.GET("NAME_SIZE"))
                .style("pointer-events", "none")  // to prevent mouseover/drag capture
                .style("opacity", parms.GET("PERSON_LABEL_OPACITY"))
                ;
        }
        // compute label lengths and store them
        linObj.SVG_NODE_LABELS.each(function(node) { node.labelwidth = this.getComputedTextLength(); });

        // now adjust label position based on label lengths
        linObj.SVG_NODE_LABELS.attr("transform", this.placeLabel);

        logSVG(i18n("F_G_I"), "SVG_NODE_LABELS ", linObj.SVG_NODE_LABELS);
    }
    nodeName(node) {
        return node.showname;
    }
    hideNames(linObj)
    {
        if (linObj.SVG_NODE_LABELS)  linObj.SVG_NODE_LABELS.remove();
    }

    placeLabel(node)
    {
        if (parms.GET("PERSON_LABELS_BELOW_NODE"))
        {
            // below the node
            let _dist = parms.GET("PERSON_LABELS_BELOW_DIST");
            let x = node.x - node.labelwidth * 0.5;
            let y = node.y + node.r + _dist; //  1.0 * parms.GET("FONT_SIZE");    // -> 20
            return "translate(" + x + ", " + y + ")";
        }
        else
        {
            // right beside the node
            let x = node.x + 1.5 * node.r;
            let y = node.y + parms.GET("FONT_SIZE")/4;
            return "translate(" + x + ", " + y + ")";
        }
    }

    // Returns a string representation of the node to be used in tooltips
    getNodeAttributesAsString(node)
    {
        let _unknown = i18n("unknown");
        if (node.type == "PERSON")
        {
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
        else if (node.type == "FAMILY")
        {
            const wife = node.wife;
            const husband = node.husband;
            const mdate = node.mdate;

            return node.familyname + (node.id ? " (" + node.id + ")" : "")
                    + "\n\n" + i18n("wife") + (wife ? wife.getFullName() + " (" + wife.id + ")" : _unknown)
                    + "\n" + i18n("husband") + (husband ? husband.getFullName() + " (" + husband.id + ")" : _unknown)
                    + "\n" + i18n("marriage") + (mdate ? node.mdate.toLocaleDateString() : _unknown)
                    + "\n" + i18n("children") + (node.children ? node.children.length : _unknown)
                    + "\n" + i18n("Fchild") + (node.Yvalue ? node.Yvalue : _unknown)
                    ;
        }
        else
        {
            return _unknown;
        }
    }

}

function setContourColor(path, colormap) 
{
    return darken( colormap(path.value) );
}

function setContourWidth(path) 
{
    return path.value % parms.GET("CONTOUR_BIG_STEP") ?  1 * parms.GET("CONTOUR_WIDTH")  :  4 * parms.GET("CONTOUR_WIDTH");
}

function createTunnels(linObj, SCALARFIELD, SEGMENTS)
{
    // let renderer = parms.oGET("RENDERER");
    let INTERVALS = {'streets': [], 'tunnels': [] };

    //--- 1. List all Tunnel and Street intervals -------------------
    SEGMENTS.forEach(segment => 
    {
        //--- determine 2D start and endpoint on map, respecting some offsets
        let pv0 = segment.pv0;
        let pv1 = segment.pv1;
        let v = pv1.sub(pv0);
        if (v.x == 0 && v.y == 0) {
            v.x = jiggle();
            v.y = jiggle();
        }
        let d = Math.sqrt(v.x*v.x + v.y*v.y);
        let offset = Math.min( d / 2, segment.r1 + parms.GET("ARROW_DISTANCE_FACTOR") * parms.GET("ARROW_RADIUS"));
        v = v.mul(offset/d);
        //pv0 = pv0.add(v);    // only offset target where arrow is (directional)
        pv1 = pv1.sub(v);

        //--- now sample tunnel/street line intervals
        v = pv1.sub(pv0);
        if (!v.zero())
        {
            let nsteps = v.norm() / parms.GET("LINK_SAMPLE_STEPSIZE");
            if (nsteps == 0) return;
            v = v.div(nsteps);

            let _underground_Threshold = parms.GET("UNDERGROUND_THRESHOLD");
            let wasUnderground = SCALARFIELD.sampleBilinear(pv0.x, pv0.y) - pv0.z > _underground_Threshold;
            let currentInterval = [pv0, pv0, false];
            if (wasUnderground) 
                INTERVALS.tunnels.push(currentInterval);
            else 
                INTERVALS.streets.push(currentInterval);

            for (let i = 0, pv = pv0; i < nsteps; i++, pv = pv.add(v))
            {
                let sfValue = SCALARFIELD.sampleBilinear(pv.x, pv.y);
                let isUnderground = sfValue - pv.z > _underground_Threshold;

                if (isUnderground && !wasUnderground)
                {
                    let pvOffset = pv;//.sub(v.mul(2));
                    INTERVALS.streets[INTERVALS.streets.length - 1][1] = pvOffset;
                    INTERVALS.tunnels.push(currentInterval = [pvOffset, pv, false]);
                }
                else if (!isUnderground && wasUnderground)
                {
                    let pvOffset = pv;//.add(v.mul(2));
                    INTERVALS.tunnels[INTERVALS.tunnels.length - 1][1] = pvOffset;
                    INTERVALS.streets.push(currentInterval = [pvOffset, pv, false]);
                }
                else
                    currentInterval[1] = pv;

                wasUnderground = isUnderground;
            }

            // if the link is directed, mark the last interval to be and "end"-interval
            let last = wasUnderground ? INTERVALS.tunnels[INTERVALS.tunnels.length - 1] : INTERVALS.streets[INTERVALS.streets.length - 1];
            last[2] = segment.directed;
        }

    });
        
    //--- 2. Create SVG Elements ---------------------------------------------------------
    let _linkColor = parms.GET("LINK_COLOR");
    let _linkOpacity = parms.GET("LINK_OPACITY");
    let _linkWidth = parms.GET("LINK_WIDTH");
    let _showLinks = parms.GET("SHOW_LINKS");

    linObj.SVG_LINKS_STREETS = linObj.GRAPH_LAYER.selectAll(".link_street")
        .data(INTERVALS.streets).enter()
        .append("line")
        .attr("stroke", _linkColor)
        .attr("stroke-width", _linkWidth + "px")
        .attr("opacity", _showLinks ? _linkOpacity : 0)
        .attr("marker-end", interval => { return interval[2] ? "url(#arrowTAM)" : "none"; })
        .attr("x1", interval => { return interval[0].x; })
        .attr("y1", interval => { return interval[0].y; })
        .attr("x2", interval => { return interval[1].x; })
        .attr("y2", interval => { return interval[1].y; })
        ;

    linObj.SVG_LINKS_TUNNELS = linObj.GRAPH_LAYER.selectAll(".link_tunnel")
        .data(INTERVALS.tunnels).enter()
        .append("line")
        .attr("stroke", _linkColor)
        .attr("stroke-width", _linkWidth + "px")
        .attr("opacity", _showLinks ? _linkOpacity : 0)
        .attr("stroke-dasharray", "0 5 5 0")
        .attr("marker-end", interval => { return interval[2] ? "url(#arrowTAM)" : "none"; })
        .attr("x1", interval => { return interval[0].x; })
        .attr("y1", interval => { return interval[0].y; })
        .attr("x2", interval => { return interval[1].x; })
        .attr("y2", interval => { return interval[1].y; })
        ;

    linObj.SVG_TUNNEL_ENTRIES_1 = linObj.GRAPH_LAYER.selectAll(".tunnel_entries1")
        .data(INTERVALS.tunnels).enter()
        .append("polyline")
        .attr("fill", "none")
        .attr("stroke", _linkColor)
        .attr("stroke-width", _linkWidth + "px")
        .attr("opacity", tunnel => { return _showLinks && !tunnel[2] ? _linkOpacity : 0; })    // dont show entry at end where the marker is
        .attr("points", tunnel => { return placeTunnelEntry(tunnel, false); })
        ;

    linObj.SVG_TUNNEL_ENTRIES_2 = linObj.GRAPH_LAYER.selectAll(".tunnel_entries2")
        .data(INTERVALS.tunnels).enter()
        .append("polyline")
        .attr("fill", "none")
        .attr("stroke", _linkColor)
        .attr("stroke-width", _linkWidth + "px")
        .attr("opacity", parms.GET("SHOW_LINKS") ? _linkOpacity : 0 )
        .attr("points", tunnel => { return placeTunnelEntry(tunnel, true); })
        ;
}

function placeTunnelEntry(tunnel, invert)
{
    let len = 6;
    let pv0 = tunnel[invert ? 0 : 1];
    let pv1 = tunnel[invert ? 1 : 0];

    let v = pv1.sub(pv0);
    v.z = 0;
    v = v.normalize();

    let w = v.mul(-len * 0.5);
    let n = new vec(v.y, -v.x).mul(len);

    let p0 = pv0.add(n);
    let p1 = p0.add(w).add(n);
    let q0 = pv0.sub(n);
    let q1 = q0.add(w).sub(n);
    
    return [ [p1.x, p1.y], [p0.x, p0.y], [q0.x, q0.y], [q1.x, q1.y] ];
}

function addHeightfieldOverlays(SCALARFIELD, linObj)
{
    let _rangeMax = parms.GET("RANGE_MAX");
    let _rangeMin = parms.GET("RANGE_MIN");
    var thresholds = d3.range(_rangeMin, _rangeMax, parms.GET("CONTOUR_STEP")); 

    // ("Extracting Contours");
    console.log(i18n("Ext_C"));
    var paths = SCALARFIELD.getContourPaths(thresholds);
    var scalarFieldTransformProjection = d3.geoPath().projection( 
        d3.geoTransform({
            point: function(x, y) {
                this.stream.point(x * SCALARFIELD.cellSize + SCALARFIELD.origin.x, y * SCALARFIELD.cellSize + SCALARFIELD.origin.y);
            }
        }) 
    );
        
    // add new paths
    // ("Adding Contours");
    console.log(i18n("Add_C"));

    linObj.SVG_CONTOURS = linObj.TOPO_LAYER.selectAll(".contours")
        .data(paths)
        .enter().append("path")
        .attr("class", "contours")
        .attr("stroke", function(path) { return setContourColor(path, linObj.SVG_COLORMAP); })
        .attr("stroke-width", function(path) { return setContourWidth(path); })
        .attr("fill", function(d) { return brighten(linObj.SVG_COLORMAP(d.value), 0.08); })
        .attr("d", scalarFieldTransformProjection )
        ;

    // add heightfield indicators
    // ("Adding Height Indicators");
    console.log(i18n("Add_HI"));
    computeHeightFieldIndicators(SCALARFIELD, paths, linObj.SVG_COLORMAP, linObj);

    // add shading
    if (parms.GET("SHADING")) {
        // ("Computing Normal Field");
        console.log(i18n("Comp_NF"));
        var normalField = new NormalField(SCALARFIELD, 100 * parms.GET("HEIGHT_SCALE") / (_rangeMax - _rangeMin) );
        // ("Extracting Shading Contour Paths");
        console.log(i18n("Ext_SCP"));
        var shadingPaths = normalField.getShadingContourPaths(new vec(-0.5,-0.5,1).normalize());
        // ("Adding Shading Layer");
        console.log(i18n("Add_SL"));
        linObj.SVG_SHADING_CONTOURS = linObj.SHADING_LAYER.selectAll(".shadingContours")
            .data(shadingPaths)
            .enter().append("path")
            .attr("class","shadingContours")
            .attr("d", scalarFieldTransformProjection )
            .attr("fill", "rgb(253,253,254)")
            .style("mix-blend-mode", "multiply")
            .style("pointer-events", "none")
            ; 
    }
}

function sampleIndicators(scalarfield, gradientField, p, dir, indicators) 
{
    const stepSize = 1;
    const minDist = parms.GET("INDICATOR_FONTSIZE");

    let last_indicator = null;
    let gradient = new vec(1, 0);
    for (var i = 0; i < 5000; i++)
    {
        var value = scalarfield.sampleBilinear(p.x, p.y);
        if (isNaN(value))
            continue;

        // inter-heightfield value (fractional part within a contour line)
        let _contourStep = parms.GET("CONTOUR_STEP");
        let closest_contour_value = Math.floor(value / _contourStep) * _contourStep;
        let frac = value - closest_contour_value;
        if (frac >= _contourStep / 2)
            closest_contour_value += _contourStep;

        let contour_dist = Math.abs(value - closest_contour_value);
        if (contour_dist < parms.GET("INDICATOR_EPSILON")  && gradient && (!last_indicator || (last_indicator.value != closest_contour_value && distance(p, last_indicator) > minDist)))
        {
            last_indicator = {'x': p.x, 'y': p.y, 'value': closest_contour_value, 'gradient': gradient};
            indicators.push(last_indicator);
        }

        // continue sampling along the gradient
        let cell = scalarfield.map(p.x, p.y);
        gradient = gradientField.sampleBilinear(cell.x, cell.y);
        if (!gradient) 
            continue;
        
        if (gradient.norm() < stepSize * 0.001)
            return;        
        
        p = p.add(gradient.normalize().mul(dir * stepSize));
    }     
}

function computeHeightFieldIndicators(scalarfield, paths, colormap, linObj)
{
    let uvSeeds;
    
    if (parms.GET("MANY_SEEDS")) {
        uvSeeds = [
            new vec(0.2, 0.1), new vec(0.9, 0.2), new vec(0.8, 0.9), new vec(0.1, 0.8), new vec(0.5, 0.5),
            new vec(0.5, 0.1), new vec(0.1, 0.5), new vec(0.9, 0.5), new vec(0.5, 0.9),
        ];
    }
    else {
        //uvSeeds = [new vec(0.3, 0.2), new vec(0.8, 0.6), new vec(0.4, 0.8)];
        uvSeeds = [new vec(0.3, 0.2), new vec(0.2, 0.8), new vec(0.8, 0.2), new vec(0.8, 0.8)];
    }
    
    let indicators = [];

    let gradientField = new GradientField(scalarfield);
    
    // starting point
    uvSeeds.forEach(seed =>
    {
        let anchor = new vec(
            scalarfield.origin.x + seed.x * scalarfield.width * scalarfield.cellSize,
            scalarfield.origin.y + seed.y * scalarfield.height * scalarfield.cellSize
        );
        
        sampleIndicators(scalarfield, gradientField, anchor, 1, indicators);
        sampleIndicators(scalarfield, gradientField, anchor, -1, indicators);
    });
    
    
    // create SVG labels
    //----------------------------------------------------

    if (linObj.SVG_INDICATOR_LABELS)
        linObj.SVG_INDICATOR_LABELS.remove();

        linObj.SVG_INDICATOR_LABELS = linObj.TOPO_LAYER.selectAll(".indicator_labels")
        .data(indicators).enter()
        .append("text")
        .text(d => { return d.value.toFixed(1) / 1; })
        .style("fill", d => { return darken(colormap(d.value)); } )
        .style("font-family", "Arial")
        .style("font-size", parms.GET("INDICATOR_FONTSIZE"))
        .style("pointer-events", "none")  // to prevent mouseover/drag capture
        .attr("transform", placeIndicator)
        ;
}

function placeIndicator(indicator) 
{
    let _labelHeight = parms.GET("INDICATOR_FONTSIZE");
    let _labelWidth = _labelHeight * 4.5;

    let pos = vec.copy(indicator);
    pos.y += _labelHeight * 0.0;

    let transform = "translate(" + pos.x + ", " + pos.y + ") ";

    let v = new vec(indicator.gradient.y, -indicator.gradient.x).normalize();
    if (!isNaN(v.x) && !isNaN(v.y))
    {
        //if (v.x < 0) v = v.negate();
        //pos = pos.add(v.mul(-labelwidth / 2));
        //transform += "scale(1,-1) "

        let angle = Math.atan2(v.y, v.x) * 180 / Math.PI;
        transform = "translate(" + pos.x + ", " + pos.y + ")  rotate(" + angle + ")";

        if (v.x < 0)
            transform += "scale(-1,-1)  translate(" + (-_labelWidth/2) + ", " + (+_labelHeight/2) + ")";
    }
    return transform;
}

export function reset(linObj) {

    if (linObj.FORCE_SIMULATION) {
        linObj.FORCE_SIMULATION
            .force("charge", null)
            .force("center", null)
            .force("link", null)
            .force("x", null)
            .force("y", null)
            .force("center", null)
            .force("cluster", null)
            .force("collide", null)
            .force("similarity", null)
            .alpha(null)
            .alphaDecay(null)
            .alphaTarget(null)
            .velocityDecay(null)
            .on("tick", null)
            .on("end", null)
        ;
        linObj.FORCE_SIMULATION = null;
    }

    if (linObj.SVG_NODES) linObj.SVG_NODES.remove();
    if (linObj.SVG_LINKS) linObj.SVG_LINKS.remove();
    if (linObj.SVG_NODE_LABELS) linObj.SVG_NODE_LABELS.remove();
    if (linObj.SVG_CONTOURS) linObj.SVG_CONTOURS.remove();
    if (linObj.SVG_SHADING_CONTOURS) linObj.SVG_SHADING_CONTOURS.remove();
    if (linObj.SVG_INDICATOR_LABELS) linObj.SVG_INDICATOR_LABELS.remove();
    if (linObj.SVG_LINKS_STREETS) linObj.SVG_LINKS_STREETS.remove();
    if (linObj.SVG_LINKS_TUNNELS) linObj.SVG_LINKS_TUNNELS.remove();
    if (linObj.SVG_TUNNEL_ENTRIES_1) linObj.SVG_TUNNEL_ENTRIES_1.remove();
    if (linObj.SVG_TUNNEL_ENTRIES_2) linObj.SVG_TUNNEL_ENTRIES_2.remove();

    linObj.SVG_NODES = null;
    linObj.SVG_LINKS = null;
    linObj.SVG_NODE_LABELS = null;
    linObj.SVG_CONTOURS = null;
    linObj.SVG_SHADING_CONTOURS = null;
    linObj.SVG_INDICATOR_LABELS = null;
    linObj.SVG_LINKS_STREETS = null;
    linObj.SVG_LINKS_TUNNELS = null;
    linObj.SVG_TUNNEL_ENTRIES_1 = null;
    linObj.SVG_TUNNEL_ENTRIES_2 = null;

    if (linObj.SVG_DRAGABLE_ELEMENTS) {
        linObj.SVG_DRAGABLE_ELEMENTS.call(d3.drag()
                                        .on("start", null)
                                        .on("drag", null)
                                        .on("end", null)
                                    )
                                    .on("click", null)
                                    .on("dblclick", null)
                                    .remove()
                                    ;
    }
    linObj.SVG_DRAGABLE_ELEMENTS = null;
    linObj.SVG_COLORMAP = null;
    linObj.NODES_COLORMAP = null;

    linObj.zoomO = null;
    if ( linObj.SVG ) {
        let the_zoom = d3.zoom()
                    // .scaleExtent(null)
                    .on("zoom", null);
        linObj.SVG
            .call(the_zoom)
            .on('dblclick.zoom', null)
            ;
    }
    linObj.CANVAS = null;
    linObj.SVG = null;
}

export function toggleLinks(showLinks)
{
    let renderer = parms.oGET("RENDERER");
    let linObj = renderer.instance;

    let _showTunnels = parms.GET("SHOW_TUNNELS");
    let _linkOpacity = parms.GET("LINK_OPACITY");
    let tunnelLinkOpacity = showLinks && _showTunnels ? _linkOpacity : 0;

    if (linObj.SVG_LINKS_STREETS) linObj.SVG_LINKS_STREETS.attr("opacity", tunnelLinkOpacity);
    if (linObj.SVG_LINKS_TUNNELS) linObj.SVG_LINKS_TUNNELS.attr("opacity", tunnelLinkOpacity);
    if (linObj.SVG_TUNNEL_ENTRIES_1) linObj.SVG_TUNNEL_ENTRIES_1.attr("opacity", tunnelLinkOpacity);
    if (linObj.SVG_TUNNEL_ENTRIES_2) linObj.SVG_TUNNEL_ENTRIES_2.attr("opacity", tunnelLinkOpacity);
    
    if (linObj.SVG_LINKS) linObj.SVG_LINKS.attr("opacity", showLinks && (parms.GET("ENERGIZE") || !_showTunnels) ? _linkOpacity : 0);
}
