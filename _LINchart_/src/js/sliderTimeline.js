///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
//
///////////////////////////////////////////////////////////////////////////////

import * as parms from "./parms.js";

export function TLslider_html() {
	let html_tl = `
    <div class="column" >
        <div class="sliderTimelineB row">
            <input id="slideButtonB" class="slideButton slideButton-L center hasTitle" type="button" title="${i18n('slideButtonB')}" value="&#x23f4;"/>
            <input id="slideButtonH" class="slideButton-lg center hasTitle" type="button" title="${i18n('slideButtonH')}" value="&#x23f8;" disabled/>
            <input id="slideButtonF" class="slideButton slideButton-R left hasTitle" type="button" title="${i18n('slideButtonF')}" value="&#x23f5;"/>
        </div>
        <div class="sliderTimelineB row">
            <div>
                <input id="slideButtonYM" class="slideButton-sm slideButton-2 center hasTitle" type="button" title="${i18n('slideButtonYM')}" value="<"/>
            </div>
            <div id="slideSpeed" class="hasTitle" title="${i18n('slideSpeed')}">
    			<button class="sbutton sbutton__1" data-speed="1" value=0>&nbsp;</button>
    			<button class="sbutton sbutton__2" data-speed="2" value=1>&nbsp;</button>
    			<button class="sbutton sbutton__3" data-speed="3" value=2>&nbsp;</button>
    			<button class="sbutton sbutton__4" data-speed="4" value=3>&nbsp;</button>
    			<button class="sbutton sbutton__5" data-speed="5" value=4>&nbsp;</button>
            </div>
            <input id="slideButtonYP" class="slideButton-sm slideButton-2 center hasTitle" type="button" title="${i18n('slideButtonYP')}" value=">"/>
        </div>
    </div>
    <div class="column align-top">
        <div id="yearSlider" class="hasTitle" title="${i18n('yearSlider')}"></div>
		<!-- content generated in constructor -->
        <div id="yearRange" class="hasTitle" title="${i18n('yearRange')}"></div>
		<!-- content generated in constructor -->
    </div>`;

    return html_tl;
}

export class TLslider
{
    constructor(rendRef) 
    {
        this.rendRef = rendRef;
        this.instance = this;
        this.tstamp = new Date();
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        let width = window.innerWidth - margin.left - margin.right - 490;

        this.YearS = parms.GET("YEARs");
        this.YearE = parms.GET("YEARe");
        this.Rmin = parms.GET("RANGE_MIN");
        this.Rmax = parms.GET("RANGE_MAX");
        this.Year = this.YearE;
        this.YearSo = this.YearS;
        this.YearIncrement = 0;

        this.gSYear = null;

        d3.select('#sliderTimeline').style('width', width + 'px');

        let yCount = this.Rmax - this.Rmin + 1;
        let _yearS = this.Rmin;
        const tRange = d3.range(0, yCount, 10)
                    .map(function(d) { return _yearS + d; });
        let yCountL = yCount * 2.4;
        const scale = d3.scaleLinear()
                    .domain(tRange)
                    .range([0, width])
                    .clamp(true);
  
        /** 
         * construct yearSlider -> set start- / end- year
         */ 
        // ... d3-specific description
        this.sRYear = d3.sliderBottom()
                    .min(d3.min(tRange))
                    .max(d3.max(tRange))
                    .step(10)
                    .width(yCountL)
                    .tickFormat(d3.format("40"))
                    .tickValues(tRange)
                    .default([this.Rmin, this.Rmax])
                    .displayValue(true)
                    .fill('#84a4c0')
                    .on('onchange', val => {
                        this.setYearSE(val);
                        document.activeElement.blur();
                        this.rendRef.forceRefresh = true;
                        console.log('slider sRYear');
                        });
        this.sRYear_cntxt = this.sRYear.sContext();

        // ... connect to DOM
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

        /** 
         * construct yearSlider -> set reference year
         */ 
        // ... d3-specific description
        var cSYear = d3.sliderTop(scale)
                    .min(d3.min(tRange))
                    .max(d3.max(tRange))
                    .step(10)
                    .width(yCountL)
                    .tickFormat(d3.format("40"))
                    .tickValues(tRange)
                    .default(this.Year)
                    .displayValue(true)
                    .fill('#84a4c0')
                    .handle(d3
                            .symbol()
                            .type(d3.symbolDiamond)
                            .size(64)()
                        )
                    .on('onchange', val => {
                        let _val = this.setYear(val);
                        document.activeElement.blur();
                        if ( _val == val ) {
                            this.rendRef.forceRefresh = true;
                            console.log('slider sSYear', val);
                        }
                    });
        this.sSYear_cntxt = cSYear.sContext();
        this.sSYear = cSYear;

        // ... connect to DOM
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
        let _TL = this.instance;        // parms.oGET('TLslider');

        d3.select('#slideButtonF').on('click', function() {
            _TL.togglePlayer(1);
        });
        d3.select('#slideButtonB').on('click', function() {
            _TL.togglePlayer(-1);
        });
        d3.select('#slideButtonH').on('click', function() {
            _TL.togglePlayer(0);
        });
        d3.select('#slideButtonYM')
            .on('click', function() {
                    _TL.moveYear(-1);
                })
            .on('mousedown', function() {
                    _TL.moveYearloop(-1);
            })                            
            .on('mouseup', function() {
                    _TL.moveYearstop();
            })
            ;
        d3.select('#slideButtonYP')
            .on('click', function() {
                    _TL.moveYear(1);
            })
            .on('mousedown', function() {
                    _TL.moveYearloop(1);
            })                            
            .on('mouseup', function() {
                    _TL.moveYearstop();
            })
            ;
    }

    resetHandlers() {
        this.sRYear.on('onchange', null);
        this.sSYear.on('onchange', null);
        d3.select('#slideButtonF').on('click', null);
        d3.select('#slideButtonB').on('click', null);
        d3.select('#slideButtonH').on('click', null);
        d3.select('#slideButtonYM')
            .on('click', null)
            .on('mousedown', null)
            .on('mouseup', null);
        d3.select('#slideButtonYP')
            .on('click', null)
            .on('mousedown', null)
            .on('mouseup', null);
    // loopspeed
        d3.selectAll("[data-speed]").on("click", null);
    }

    // called by slideButton_
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
        let _slideButtonH = document.getElementById("slideButtonH");
        if (sYearIncrement == 0) {
            _slideButtonH.disabled = true;
        } else {
            _slideButtonH.disabled = false;
        }
    }

    // called by '#menu'|[yearbuttons]
    // zwischen Bezugsjahren wechseln ... 1500, 1600, usw.
    setYear(value) {
        let _TL = this.instance;        // parms.oGET('TLslider');
        // let _Year = parms.GET("YEAR");
        let _Year = _TL.Year;
        let _YearS = parms.GET("YEARs");
        let _YearE = parms.GET("YEARe");
        let syear = parseInt(value);
        let doSet = false;
        if ( syear < _YearS ) {
            doSet = true;
            syear = _YearS;
        }
        if ( syear > _YearE ) {
            doSet = true;
            syear = _YearE;
        }
        if ( syear != _Year ) {
            parms.SET("YEAR", syear);
            _TL.Year = syear;
            this.Year = syear;
            _TL.sSYear.silentValue(syear, _TL.sSYear_cntxt);
            _TL.rendRef.forceRefresh = true;
            _TL.rendRef.setYear(syear);
            // if ( this.gSYear ) this.gSYear.call(this.sSYear);
            this.updateYear(syear);
            // console.log('setYear ', _TL.Year);
            parms.yearMod(true);
        }
        if ( doSet ) {
            _TL.sSYear.silentValue(syear, _TL.sSYear_cntxt);
            _TL.rendRef.setYear(syear);
        }
        return syear;
    }
    getYear() {
        // let _TL = this.instance;
        return this.Year;
    }
    getYearS() {
        return this.YearS;
    }

    // called by sliderBottom
    // Anfangs- und Endjahr verändert -> Aktuelles Jahr prüfen/anpassen
    setYearSE(value) {
        let _TL = this.instance;        // parms.oGET('TLslider');
        let _Year = parms.GET("YEAR");
        let _YearS = Number(value[0]);
        let _YearE = Number(value[1]);
        parms.SET("YEARs", _YearS);
        parms.SET("YEARe", _YearE);
        _TL.YearS = _YearS;
        _TL.YearE = _YearE;
        if ( _Year <  _YearS) {
            _Year =  _YearS;
            parms.SET("YEAR", _Year);
            _TL.Year =  _Year;
            _TL.sSYear.silentValue(_Year, _TL.sSYear_cntxt);
            this.updateYear(_Year);
            _TL.rendRef.forceRefresh = true;
            _TL.rendRef.Year = _Year;
            parms.yearMod(true);
        } else if ( _Year >  _YearE) {
            _Year =  _YearE;
            parms.SET("YEAR", _Year);
            _TL.Year =  _Year;
            _TL.sSYear.silentValue(_Year, _TL.sSYear_cntxt);
            this.updateYear(_Year);
            _TL.rendRef.forceRefresh = true;
            _TL.rendRef.Year = _Year;
            parms.yearMod(true);
        }
        if ( _YearS != this.YearSo ) {
            this.YearSo = _YearS;
            parms.yearMod(true);
        }
        console.log('setYearSE', value);
    }

    // called by slideButtonY_
    // Aktuelles Jahr -1 bzw. +1
    moveYearloop(val) {
        if (this.mLoop) 
            return;
        
        let _this = this.instance;
        function cTimer() {
            _this.moveYear(val);
        }
        this.mLoop = setInterval(cTimer, 250);
    }
    moveYearstop() {
        clearInterval(this.mLoop);
        this.mLoop = null;
    }
    moveYear(value) {
        let _val = Number(value);
        let _TL = this.instance;        // parms.oGET('TLslider');
        let syear = parseInt(parms.GET("YEAR"));
        syear += _val;
        if ( syear < parms.GET("YEARs") ) {
            syear = 0;
        }
        if ( syear > parms.GET("YEARe") ) {
            syear = 0;
        }
        if (syear > 0) {
            parms.SET("YEAR", syear);
            _TL.Year = syear;
            this.updateYear(syear);
            this.updateSlider(syear);
            _TL.rendRef.forceRefresh = true;
            _TL.rendRef.Year = syear;
            parms.yearMod(true);
        }
    }

    // called by LIN_MAIN.LINloop
    // called by this.moveYear
    // sliderTop in 10-er Schritten anpassen
    updateSlider(year) {
        // _Year = parms.GET("YEAR");
        let _YearS = parms.GET("YEARs");
        // _YearE = parms.GET("YEARe");
        let _TL = this.instance;        // parms.oGET('TLslider');
        let _TLssy = _TL.sSYear;
        let _yearTL = _TLssy.value();
        if ( _yearTL != year ) {
            let yStep = (year - _YearS) % 10;
            if ( yStep == 0) {
                _TLssy.silentValue(year, _TL.sSYear_cntxt);
            }
        }
    }

    // called by this.moveYear
    // sliderTop nach Reload aktualisieren
    updateSlider_rel(year) {
        // _Year = parms.GET("YEAR");
        let _YearS = parms.GET("YEARs");
        // _YearE = parms.GET("YEARe");
        let _year = year;
        let yStep = (year - _YearS) % 10;
        if ( yStep != 0) {
            _year = year - yStep + 10;
        }
        let _TL = this.instance;        // parms.oGET('TLslider');
        let _TLssy = _TL.sSYear;
        _TLssy.silentValue(_year, _TL.sSYear_cntxt);
    }

    // called by ...
    // Aktuelles Jahr ausgeben
    updateYear(year) {
        d3.select('#year').text(year);
    }

    setYearIncrement(value) {
        let _TL = this.instance;
        _TL.YearIncrement = value;
        _TL.rendRef.forceRefresh = true;
        console.log('setYearIncrement');
    }

    advanceYear(Iyear) {
        let year = Number(Iyear);
        let _TL = this.instance;
        if ( _TL.YearIncrement == 0 ) {
            return year;
        }
        year += _TL.YearIncrement;
        let _YearS = parms.GET("YEARs");
        let _YearE = parms.GET("YEARe");
        if (year >=  _YearE) {
            year =  _YearE;
            this.YearIncrement = 0;
        } else if (year <=  _YearS) {
            year =  _YearS;
            _TL.YearIncrement = 0;
        }
        parms.SET("YEAR", year);
        _TL.updateYear(year);
        _TL.Year = year;
        _TL.rendRef.Year = _TL.Year;
        return year;
    }

}
