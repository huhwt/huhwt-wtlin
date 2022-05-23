///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
//
///////////////////////////////////////////////////////////////////////////////

import * as parms from "./parms.js";

export function TIMELINE_html() {
	let html_tl = `
    <div class="column" >
        <div class="sliderTimelineB row">
            <input id="slideButtonB" class="slideButton center" type="button" title="${i18n('Jahre zurückzählen')}" value="&#x23f4;"/>
            <input id="slideButtonH" class="slideButton-lg center" type="button" title="${i18n('Jahre zählen Stop')}" value="&#x23f8;"/>
            <input id="slideButtonF" class="slideButton left" type="button" title="${i18n('Jahre hochzählen')}" value="&#x23f5;"/>
        </div>
        <div class="sliderTimelineB row">
            <input id="slideButtonYM" class="slideButton-sm center" type="button" title="${i18n('-1 Jahr')}" value="<"/>
            <input id="slideButtonYP" class="slideButton-sm center" type="button" title="${i18n('+1 Jahr')}" value=">"/>
        </div>
    </div>
    <div class="column align-top">
        <div id="yearSlider" title="${i18n('Jahr einstellen (je 10)')}"></div>
        <div id="yearRange" title="${i18n('Anfangs-/Endjahr festlegen')}"></div>
    </div>`;

    return html_tl;
}

export class TIMELINE
{
    constructor(rendRef) 
    {
        this.rendRef = rendRef;
        this.instance = this;
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        let width = window.innerWidth - margin.left - margin.right - 500;

        this.YearS = parms.GET("RANGE_MIN");
        this.YearE = parms.GET("RANGE_MAX");
        this.Year = this.YearE;
        this.YearSo = this.YearS;
        this.YearIncrement = 0;

        this.gSYear = null;

        d3.select('#sliderTimeline').style('width', width + 'px');

        let yCount = this.YearE - this.YearS + 1;
        let _yearS = this.YearS;
        const tRange = d3.range(0, yCount, 10)
                    .map(function(d) { return _yearS + d; });
        let yCountL = yCount * 2.4;
        const scale = d3.scaleLinear()
                    .domain(tRange)
                    .range([0, width])
                    .clamp(true);
  
        this.sRYear = d3.sliderBottom()
                    .min(d3.min(tRange))
                    .max(d3.max(tRange))
                    .step(10)
                    .width(yCountL)
                    .tickFormat(d3.format("40"))
                    .tickValues(tRange)
                    .default([this.YearS, this.YearE])
                    .displayValue(true)
                    .fill('#84a4c0')
                    .on('onchange', val => {
                        this.setYearSE(val);
                        this.rendRef.forceRefresh = true;
                        console.log('slider sRYear');
                        });

        let _gRYiH = d3.select('div#yearRange');
        if ( _gRYiH._groups[0][0].childElementCount == 0) {
            var gRYear = d3.select('div#yearRange')
                    .append('svg')
                        .attr('top', 0)
                        .attr('left', 12)
                        .attr('width', yCountL+40)
                        .attr('height', 48)
                        .style('margin-left', 18)
                        .attr('class', 'yearRange')
                    .append('g')
                        .attr("transform", "translate(12, 10)")
                    ;
            gRYear.call(this.sRYear);
            }

        const cSYear = d3.sliderTop(scale)
                    .min(d3.min(tRange))
                    .max(d3.max(tRange))
                    .step(10)
                    .width(yCountL)
                    .tickFormat(d3.format("40"))
                    .tickValues(tRange)
                    .default(this.YearE)
                    .displayValue(true)
                    .fill('#84a4c0')
                    .handle(d3
                            .symbol()
                            .type(d3.symbolDiamond)
                            .size(64)()
                        )
                    .on('onchange', val => {
                        this.setYear(val);
                        this.rendRef.forceRefresh = true;
                        // console.log('slider sSYear');
                        });
        this.sSYear = cSYear;

        let _gSYiH = d3.select('div#yearSlider');
        if ( _gSYiH._groups[0][0].childElementCount == 0) {
            var gSYear = d3.select('div#yearSlider')
                    .append('svg')
                        .attr('top', 0)
                        .attr('left', 12)
                        .attr('width', yCountL+40)
                        .attr('height', 20)
                        .style('margin-left', 18)
                        .attr('class', 'yearSlider')
                    .append('g')
                        .attr("transform", "translate(12, 10)")
                    ;
             gSYear.call(this.sSYear);
            }

    }

    initSlider() {
        let _TL = this.instance;        // parms.oGET('TIMEline');

        d3.select('#yearSlider').on('change', function() {
            let position = d3.select("#yearSlider").val();
            _TL.Year = Math.round(((_TL.YearE - _TL.YearS) * (position/100)) + _TL.YearS);
        });
        d3.select('#slideButtonF').on('click', function() {
            _TL.togglePlayer(1);
        });
        d3.select('#slideButtonB').on('click', function() {
            _TL.togglePlayer(-1);
        });
        d3.select('#slideButtonH').on('click', function() {
            _TL.togglePlayer(0);
        });
        d3.select('#slideButtonYM').on('click', function() {
            _TL.moveYear(-1);
        });
        d3.select('#slideButtonYP').on('click', function() {
            _TL.moveYear(1);
        });
    }

    // called by slideButton.
    // Player-Modus - -1:Rücklauf / 0:Stop / +1:Vorlauf
    togglePlayer(YearIncrement) {
        let sYearIncrement = YearIncrement;
        switch ( YearIncrement ) {
            case -1:
                if (this.Year <= this.YearS) {
                    sYearIncrement = 0;
                }
                this.setYearIncrement(sYearIncrement);
                break;
            case 1:
                if (this.Year >= this.YearE) {
                    sYearIncrement = 0;
                }
                this.setYearIncrement(sYearIncrement);
                break;
            default:
                this.setYearIncrement(0);
        }
    }

    // called by '#menu'.[yearbuttons]
    // zwischen Bezugsjahren wechseln ... 1500, 1600, usw.
    setYear(value) {
        let _TL = this.instance;        // parms.oGET('TIMEline');
        let syear = value;
        if ( syear < _TL.YearS ) {
            syear = _TL.YearS;
        }
        if ( syear > _TL.YearE ) {
            syear = _TL.YearE;
        }
        if ( syear != _TL.Year ) {
            _TL.Year = syear;
            _TL.sSYear.silentValue(_TL.Year);
            _TL.rendRef.forceRefresh = true;
            _TL.rendRef.Year = _TL.Year;
            // if ( this.gSYear ) this.gSYear.call(this.sSYear);
            this.updateYear(syear);
            // console.log('setYear ', _TL.Year);
            parms.yearMod(true);
        }
    }

    // called by sliderBottom
    // Anfangs- und Endjahr verändert -> Aktuelles Jahr prüfen/anpassen
    setYearSE(value) {
        let _TL = this.instance;        // parms.oGET('TIMEline');
        _TL.YearS = Number(value[0]);
        _TL.YearE = Number(value[1]);
        if ( _TL.Year <  _TL.YearS) {
            _TL.Year =  _TL.YearS;
            _TL.sSYear.silentValue(_TL.Year);
            this.updateYear(_TL.Year);
            _TL.rendRef.forceRefresh = true;
            _TL.rendRef.Year = _TL.Year;
            parms.yearMod(true);
        } else if ( _TL.Year >  _TL.YearE) {
            _TL.Year =  _TL.YearE;
            _TL.sSYear.silentValue(_TL.Year);
            this.updateYear(_TL.Year);
            _TL.rendRef.forceRefresh = true;
            _TL.rendRef.Year = _TL.Year;
            parms.yearMod(true);
        }
        if ( this.YearS != this.YearSo ) {
            this.YearSo = this.YearS;
            parms.yearMod(true);
        }
        console.log('setYearSE', value);
    }

    // called by slideButtonY.
    // Aktuelles Jahr -1 bzw. +1
    moveYear(value) {
        let _val = Number(value);
        let _TL = this.instance;        // parms.oGET('TIMEline');
        let syear = _TL.Year;
        syear += _val;
        if ( syear < _TL.YearS ) {
            syear = 0;
        }
        if ( syear > _TL.YearE ) {
            syear = 0;
        }
        if (syear > 0) {
            _TL.Year = syear;
            this.updateYear(_TL.Year);
            this.updateSlider(syear);
            _TL.rendRef.forceRefresh = true;
            _TL.rendRef.Year = _TL.Year;
            parms.yearMod(true);
        }
    }

    // called by LINloop
    // sliderTop in 10-er Schritten anpassen
    updateSlider(year) {
        let _TL = this.instance;        // parms.oGET('TIMEline');
        let yStep = (year - _TL.YearS) % 10;
        if ( yStep == 0) {
            let _TLssy = _TL.sSYear;
            // position = ((this.Year - this.YearS) / (this.YearE - this.YearS)) * 100;
            _TLssy.silentValue(year);
            // _TL.sSYear.displayValue(_TL.Year);
        }
    }

    // called by ...
    // Aktuelles Jahr ausgeben
    updateYear(year) {
        d3.select('#year').text(year);
    }

    setYearIncrement(value) {
        let _TL = this.instance;        // parms.oGET('TIMEline');
        _TL.YearIncrement = value;
        _TL.rendRef.forceRefresh = true;
        console.log('setYearIncrement');
    }

    advanceYear(Iyear) {
        let year = Number(Iyear);
        let _TL = this.instance;        // parms.oGET('TIMEline');
        if ( _TL.YearIncrement == 0 ) {
            return year;
        }
        year += _TL.YearIncrement;
        if (year >=  _TL.YearE) {
            year =  _TL.YearE;
            this.YearIncrement = 0;
        } else if (year <=  _TL.YearS) {
            year =  _TL.YearS;
            _TL.YearIncrement = 0;
        }
        _TL.Year = year;
        _TL.rendRef.Year = _TL.Year;
        return year;
    }

}
