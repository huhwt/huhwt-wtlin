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

        this.YearS = parms.GET("RANGE_MIN");
        this.YearE = parms.GET("RANGE_MAX");
        this.Year = this.YearE;
        this.YearIncrement = 0;

        this.gSYear = null;

        let yearCount = this.YearE - this.YearS + 1;
        const yearRange = d3.range(0, yearCount, 5);

        const sYearScale = d3.ticks(this.YearS, this.YearE, yearRange.length);
        // console.log(sYearScale);
    
        const cYearScale = d3.select('#yearScale')
                            .attr('top', this.rendRef.height2 + 300)
                            .attr('left', 60)
                            .attr('height', 100)
                            .attr('class', 'yearScale')
                            ;
    
        let ysLeft = this.rendRef.YEARscale_offset;
        let ysWidth = this.rendRef.width - 2 * ysLeft;

        const YearScale = cYearScale
                            .append('svg')
                            .attr('top', 0)
                            .attr('width', ysWidth)
                            .append('g')
                            .attr('id', 'yearScaleS')
                            ;

        drawYearScale(YearScale,sYearScale, ysWidth, ysLeft);

        const YearScaleSL = YearScale
                            .append('g')
                            .attr('class', 'YCline')
                            ;
        const YearScaleSLX = YearScaleSL
                            .append('line')
                            .attr('id', 'YCcrosshairX')
                            .attr('class', 'YCcrosshair')
                            .attr('x1', this.rendRef.width2)
                            .attr('y1', 50)
                            .attr('x2', this.rendRef.width2)
                            .attr('y2', -10)
                            ;
        this.YEARscale = cYearScale;
        this.YEARscale.attr('display', 'none');
    }

    initYearScale()
    {
        let _TL = this.instance;
    }

    hideYearScale()
    {
        let _TL = this.instance;
        this.YEARscale.attr('display', 'none');
    }

    showYearScale()
    {
        this.YEARscale.attr('display', 'block');
    }
}

/**
 * Quelle: https://observablehq.com/@d3/d3-ticks
 */
    function drawYearScale(container, ticks, width, left) {
    let cticks = ticks.length;
    let tw = width / cticks;
    let ly0 = 0;
    ticks.forEach( function(year, iy) {
        let ly = year % 10 == 0 ? 10 : 6;
        let lx = iy * tw + left;
        container.append('line')
                .attr('x1', lx).attr('y1', ly0)
                .attr('x2', lx).attr('y2', ly0 + ly);
    });
    ticks.forEach( function(year, iy) {
        if ( year % 10 == 0) {
            let lx = iy * tw + left;
            let ly = 28;
            container.append('text')
                .attr('x', lx)
                .attr('y', ly0 + ly)
                .text(year);
        }
    });
}
