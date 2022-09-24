/* jshint -W014 */

///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
//
///////////////////////////////////////////////////////////////////////////////

import * as parms from "./parms.js";

export class YEARSCALE
{
    constructor(rendRef) 
    {
        this.rendRef = rendRef;
        this.instance = this;
        this.tstep = 0;

        this.YearS = parms.GET("YEARs");
        this.YearE = parms.GET("YEARe");
        this.Year = this.YearE;
        this.YearIncrement = 0;

        this.gNODES = [];
        this.gNfirst = 0;
        this.gNleft = 0;
        this.gNright = 0;
        this.gNlast = 0;
        this.gNact = null;

        this.gSYear = null;

        this.firstTick = 0;
        this.lastTick = 0;
        this.offset = 40;
        this.widthS = this.rendRef.width - 2 * this.rendRef.YEARscale_offset;

        let yearCount = this.YearE - this.YearS + 1;
        const yearRange = d3.range(0, yearCount, 5);

        const sYearScale = d3.ticks(this.YearS, this.YearE, yearRange.length);
        // console.log(sYearScale);
        this.tickLength = sYearScale.length;
        this.tickWidth = this.widthS / this.tickLength;
    
        const cYearScale = d3.select('#yearScale')
                            .attr('top', this.rendRef.height2 + 300)
                            .attr('height', 100)
                            .attr('class', 'yearScale')
                            ;
    
        let ysWidth = this.widthS;
        let ysCenter = 21.5 + ysWidth / 2;
        this.ysCenter = ysCenter;

        let dYearScaleD = cYearScale
                            .append('div')
                            .attr('id', 'yearScaleD')
                            .attr('height', 100)
                            ;
        const YearScale = dYearScaleD
                            .append('svg')
                            .attr('top', 0)
                            .attr('width', ysWidth+40)
                            .append('g')
                            .attr('id', 'yearScaleS')
                            ;

        drawYearScale(this.instance,YearScale,sYearScale, ysWidth, this.offset);

        const YearScaleSL = YearScale
                            .append('g')
                            .attr('class', 'YCline')
                            ;
        const YearScaleSLX = YearScaleSL
                            .append('line')
                            .attr('id', 'YCcrosshairX')
                            .attr('class', 'YCcrosshair')
                            .attr('x1', ysCenter) // this.rendRef.width2)
                            .attr('y1', 50)
                            .attr('x2', ysCenter) // this.rendRef.width2)
                            .attr('y2', -10)
                            ;

        let trileft = "M6.9 2.03 L6.9 8.4 C6.9 9 6.3 9.38 5.77 9.08 L0.45 5.93 C0 5.63 0 4.95 0.45 4.65 L5.77 1.5 "
                    + "C6.3 1.05 6.9 1.43 6.9 2.03 Z";
        let triright = "M0 8.66 C0 9.26 0.6 9.63 1.13 9.18 L6.45 6.03 C6.9 5.73 6.9 5.06 6.45 4.76 L1.13 1.61 "
                    + "C0.6 1.31 0 1.68 0 2.28 L0 8.66 Z";

        let trileftmost = "M-0 9.28 L1.13 9.28 L1.13 1.54 L-0 1.54 L-0 9.28 Z"
                        + "M7.94 2.22 C7.94 1.62 7.34 1.25 6.81 1.7 L1.49 4.85 C1.04 5.15 1.04 5.82 1.49 6.12 L6.81 9.27 "
                        + "C7.34 9.57 7.94 9.2 7.94 8.6 L7.94 2.22 Z";
        let trirightmost = "M7.94 1.6 L6.8 1.6 L6.8 9.34 L7.94 9.34 L7.94 1.6 Z"
                        + "M0 8.66 C0 9.26 0.6 9.63 1.13 9.18 L6.45 6.03 C6.9 5.73 6.9 5.06 6.45 4.76 L1.13 1.61 "
                        + "C0.6 1.31 0 1.68 0 2.28 L0 8.66 Z";

        let dYearScaleC = cYearScale
                            .append('div')
                            .attr('id', 'yearScaleC')
                            .attr('top', -80)
                            .attr('height', 90)
                            .attr('left', ysWidth / 2 - 50)
                            ;
        const YearScaleActs = dYearScaleC
                            .append('svg')
                            .attr('top', 0)
                            .attr('width', ysWidth+40)
                            ;
        const YearScaleActLM = YearScaleActs
                            .append('g')
                                .append('path')
                                .attr('id', 'YCactLeftmost')
                                .attr('class', 'YChandle hasTitle')
                                .attr('transform', 'translate(' + (ysCenter-56) + ', 2.5) scale(2.2)')
                                .attr('d', trileftmost)
                                .on('click', val => {
                                    document.activeElement.blur();
                                    event.stopPropagation();
                                    // console.log('YCactLeft', val);
                                    let linObj = this.rendRef.linObj;
                                    this.gNact = 0;
                                    this.transformSVG_gNact(0, linObj, linObj.s_transform);
                                    setCrosshairX(this.instance, 0);
                                })                            
                            ;
            YearScaleActLM.append('title')
                    .text(i18n('YCactLeftmost'))
                    ;
        const YearScaleActL = YearScaleActs
                    .append('g')
                        .append('path')
                        .attr('id', 'YCactLeft')
                        .attr('class', 'YChandle hasTitle')
                        .attr('transform', 'translate(' + (ysCenter-36) + ',0) scale(2.75)')
                        .attr('d', trileft)
                        .on('click', val => {
                            document.activeElement.blur();
                            event.stopPropagation();
                            // console.log('YCactLeft', val);
                            this.transformSVG(-1);
                        })                            
                        .on('mousedown', val => {
                            document.activeElement.blur();
                            // console.log('YCactLeft', val);
                            this.transformSVGloop(-1);
                        })                            
                        .on('mouseup', val => {
                            document.activeElement.blur();
                            this.transformSVGstop();
                        })
                    ;
            YearScaleActL.append('title')
                    .text(i18n('YCactLeft'))
                    ;

        const YearScaleActR = YearScaleActs
                            .append('g')
                                .append('path')
                                .attr('id', 'YCactRight')
                                .attr('class', 'YChandle hasTitle')
                                .attr('transform', 'translate(' + (ysCenter+17) + ', -1) scale(2.75)')
                                .attr('d', triright)
                                .on('click', val => {
                                    document.activeElement.blur();
                                    // console.log('YCactRight', val);
                                    this.transformSVG(1);
                                })                            
                                .on('mousedown', val => {
                                    document.activeElement.blur();
                                    // console.log('YCactRight', val);
                                    this.transformSVGloop(1);
                                })                            
                                .on('mouseup', val => {
                                    document.activeElement.blur();
                                    this.transformSVGstop();
                                })
                            ;
            YearScaleActR.append('title')
                    .text(i18n('YCactRight'))
                    ;
        const YearScaleActRM = YearScaleActs
                    .append('g')
                        .append('path')
                        .attr('id', 'YCactRightmost')
                        .attr('class', 'YChandle hasTitle')
                        .attr('transform', 'translate(' + (ysCenter+39) + ', 2.5) scale(2.2)')
                        .attr('d', trirightmost)
                        .on('click', val => {
                            document.activeElement.blur();
                            event.stopPropagation();
                            // console.log('YCactLeft', val);
                            let linObj = this.rendRef.linObj;
                            this.gNact = this.gNODES.length-1;
                            this.transformSVG_gNact(this.gNact, linObj, linObj.s_transform);
                            setCrosshairX(this.instance, this.gNact);
                        })                            
                    ;
            YearScaleActRM.append('title')
                    .text(i18n('YCactRightmost'))
                    ;
    const YearScaleCenter = YearScaleActs
                            .append('circle')
                            .attr('id', 'YCactCenter')
                            .attr('class', 'YChandle hasTitle')
                            .attr('transform', 'translate(' + (ysCenter) + ', -10)')
                            .attr('r',12)
                            .attr('cx',0)
                            .attr('cy',24)
                            .on('click', val => {
                                document.activeElement.blur();
                                // console.log('YCactCenter', val);
                                this.transformSVG(0);
                            })
                        ;
        YearScaleCenter.append('title')
                        .text(i18n('YCactCenter'))
                        ;

        this.YEARscale = cYearScale;
        this.YEARscale.attr('display', 'visible');

        // Triangle Left
        // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        //  <g fill='#FFFFFF'>
        //      <path d="M17 7.8v8.5c0 .8-.8 1.3-1.5.9L8.4 13c-.6-.4-.6-1.3 0-1.7l7.1-4.2c.7-.6 1.5-.1 1.5.7z"></path>
        //  </g>
        // </svg>

        // Triangle Right
        // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        //  <g fill='#FFFFFF'>
        //      <path d="M7 16.2V7.8c0-.8.8-1.3 1.5-.9l7.1 4.2c.6.4.6 1.3 0 1.7L8.5 17c-.7.5-1.5 0-1.5-.8z"></path>
        //  </g>
        // </svg>

    }

    setTstep(_ts) {
        this.tstep = _ts;
    }

    setNODES(_nodes) {
        this.gNODES = [];
        this.gNODES = _nodes.slice(0);

        this.gNleft = 0;
        this.gNright = 0;
        this.gNlast = this.gNODES.length - 1;
        for (let i = 0; i < this.gNODES.length; ++i) {
            let g = this.gNODES[i];
            if (g.x > 0) {
                this.gNleft = i - 1;
                this.gNright = i;
                break;
            }
        }
    }

    initYearScale()
    {
        let ysObj = this.instance;

        document.querySelector("#yearScaleD").addEventListener("click", function(event) {
            clickYear(event, ysObj);
        });
    }

    hideYearScale()
    {
        this.YEARscale.attr('display', 'none');
    }

    showYearScale()
    {
        this.YEARscale.attr('display', 'block');
    }

    transformSVGloop(val) {
        if (this.cLoop) 
            return;
        
        let _this = this.instance;
        function cTimer() {
            _this.transformSVG(val);
        }
        this.cLoop = setInterval(cTimer, 250);
    }
    transformSVGstop() {
        clearInterval(this.cLoop);
        this.cLoop = null;
    }
    transformSVG(val) {
        let linObj = this.rendRef.linObj;
        if (val !== 0) {
            if (this.gNact == null) {
                if (val < 0)
                    this.gNact = this.gNleft;
                else
                    this.gNact = this.gNright;
            } else {
                let gNo = linObj.gNODESt[this.gNact];
                gNo.fx = gNo.fy = null;
                this.gNact += val;
                if (this.gNact < this.gNfirst)
                    this.gNact = this.gNfirst;
                if (this.gNact > this.gNlast)
                    this.gNact = this.gNlast;
            }
            this.transformSVG_gNact(this.gNact, linObj, linObj.s_transform);
            setCrosshairX(this.instance, this.gNact);
        } else {
            this.transformSVG_0(this.instance, linObj, linObj.s_transform);
            setCrosshairX(this.instance, null);
        }
    }
    transformSVG_gNact(gNact, linObj, _s_transform) {
        let gN = linObj.gNODESt[gNact];
        gN.fx = gN.vis.x; gN.fy = gN.vis.y;
        let _xpos = gN.vis.x;
        let _gw = gN.width/2;
        _s_transform.x = -_xpos * _s_transform.k;
        _xpos = _xpos + _gw;
        this.transformSVG_DO(linObj, _s_transform, _xpos);
    }
    transformSVG_0(ysObj, linObj, _s_transform) {
        if (ysObj.gNact !== null) {
            let gN = linObj.gNODESt[ysObj.gNact];
            gN.fx = gN.fy = null;
        }
        this.transformSVGstop();
        _s_transform.x = 0;
        ysObj.gNact = null;
        this.transformSVG_DO(linObj, _s_transform, 0);
    }
    transformSVG_DO(linObj, _s_transform, _xpos) {
        var _SVG = linObj.SVG;
        let _t = d3.zoomIdentity.translate(_s_transform.x, _s_transform.y).scale(_s_transform.k);
        _SVG.call(linObj.zoomO.transform, _t);
        if (_xpos !== 0 && _s_transform.k !== 1)
            _xpos = d3.zoomIdentity.applyX(_xpos);
        shiftRuler(_xpos);
        // linObj.s_transform = _s_transform;
        // console.log("zoomIdentity", _s_transform);
    }
}

function clickYear(event, ysObj) {
    let _x = event.clientX;
    let _xS = _x - ysObj.firstTick;
    let _xSr = ysObj.lastTick - ysObj.firstTick;
    let _cY = Math.round((ysObj.YearE - ysObj.YearS) * (_xS / _xSr)) + ysObj.YearS - 10;
    if (_cY<ysObj.YearS)
        _cY = ysObj.YearS;
    if (_cY > ysObj.YearE)
        _cY = ysObj.YearE;
    console.log("clickYear", event.clientX, _xS, _xSr, _cY);
    let _gNact = ysObj.gNlast + 1;
    let linObj = ysObj.rendRef.linObj;
    for (let i = 0; i < ysObj.gNODES.length; ++i) {
        let gN = ysObj.gNODES[i];
        if (gN.nodeID > _cY) {
            _gNact = i - 1;
            break;
        }
    }
    if (_gNact < ysObj.gNfirst)
        _gNact = ysObj.gNfirst;
    if (_gNact > ysObj.gNlast)
        _gNact = ysObj.gNlast;

    if (ysObj.gNact) {
        let gNo = linObj.gNODESt[ysObj.gNact];
        gNo.fx = gNo.fy = null;
    }
    ysObj.gNact = _gNact;

    ysObj.transformSVG_gNact(ysObj.gNact, linObj, linObj.s_transform);
    setCrosshairX(ysObj, ysObj.gNact);

}

function setCrosshairX(ysObj, gNact) {
    if (gNact == null) {
        d3.select('#YCcrosshairX')
            .attr('x1', String(ysObj.ysCenter))
            .attr('x2', String(ysObj.ysCenter))
            .attr('class', null);
        d3.select('#YCcrosshairTxt').remove();
    } else {
        let gN = ysObj.gNODES[gNact];
        let _cY = gN.nodeID;
        let _YCx = (_cY - ysObj.YearS) * ysObj.tickWidth / 5 + ysObj.offset;
        d3.select('#YCcrosshairX')
            .attr('class', 'shifted')
            .attr('x1', String(_YCx))
            .attr('x2', String(_YCx))
            ;
        let _YCxt = _YCx; // + ysObj.rendRef.YEARscale_offset - ysObj.offset;
        d3.select('#YCcrosshairTxt').remove();
        d3.select('#yearScaleD')
            .append('div')
                .attr('id','YCcrosshairTxt')
                    .style('left', String(_YCxt- 22)+'px')
                    .text(String(_cY))
            ;
    }
}

export function shiftRuler(val) {
    let elem = document.getElementById('gl_ruler');
    if (!elem)
        return;
    let _d = elem.getAttribute('d');
    let _dt = _d.slice(1);
    let _dts = _dt.split(",");
    let _dtx = val;
    _dts[0] = _dtx;
    _dts[2] = _dtx;
    let _dtsn = "M" + _dts.join(",");
    _d = _dtsn;
    elem.setAttribute('d', _dtsn);
}

    /**
    * Quelle: https://observablehq.com/@d3/d3-ticks
    */
function drawYearScale(_this, container, ticks, width, left) {
    let cticks = ticks.length;
    let tw = width / cticks;
    let ly0 = 0;
    let lx = 0;
    _this.firstTick = left;
    ticks.forEach( function(Year, iY) {
        let ly = Year % 10 == 0 ? 10 : 6;
        lx = iY * tw + left;
        container.append('line')
                .attr('x1', lx).attr('y1', ly0)
                .attr('x2', lx).attr('y2', ly0 + ly);
    });
    _this.lastTick = lx;
    ticks.forEach( function(Year, iy) {
        if ( Year % 10 == 0) {
            let lx = iy * tw + left;
            let ly = 28;
            container.append('text')
                .attr('x', lx)
                .attr('y', ly0 + ly)
                .text(Year);
        }
    });
}
