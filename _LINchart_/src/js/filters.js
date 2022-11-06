///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Parameters Management
//
///////////////////////////////////////////////////////////////////////////////

import { getMetadata } from "./export.js";
import { getColor, getNames0, swapIDX } from "./indexman.js";
import * as parms from "./parms.js";

var fAind = 0;
var nlShow = new Map();
var nlNames = "";            // target HTML-element

function html_names_list() {
    let html_nl = `
    <div class="modal-nlc">
        <form action="/">
            <div class="form-h" >
                <i class="fa fa-check fa-lg fh-ok" title="${i18n('nl_wb')}"></i>
                <h1>${i18n('nl_title')}</h1>
                <i class="fa fa-times fa-lg fh-close" title="${i18n('nl_close')}"></i>
            </div>
            <div id="afilter_list">
                <span>${i18n('nl_cf')}</span>
                <ul id="filter_list">
                    <!-- content generated by filters.js|showFILTERs_A -->
                </ul>
            </div>
            <h2>${i18n('nl_ns')}</h2>
            <div id="names_sel" class="form-h">
                <textarea rows="3"></textarea>
                <div id="names_sel_edit">
                    <i id="names_edit" class="fa fa-edit fa-lg fh-ok" title="${i18n('nl_edit')}"></i>
                </div>
            </div>
            <div id="names_list">
                <div id="names_liHead">
                    <!-- content generated by filters.js|showFILTERs_nl -->
                </div>
                <ul id="names_liLines">
                    <!-- content generated by filters.js|showFILTERs_nl -->
                </ul>
            </div>
        </form>
    </div>`;

    return html_nl;
}

export function close_namelist()
{
    document.querySelector("#namelist").style.display = "none";
    let OVelmnt = document.getElementById("namelist");
    OVelmnt.innerHTML = '';
}

export function showNameList(event) {
    showFILTERs();
}

/**
 * Generate widget to show actual defined filters:
 * - actual defined list of names -> may be changed by manual input
 * - list of defined filters -> have been set in former sessions
 * - list of names in data -> check/uncheck to put in/remove from filter_list
 */
function showFILTERs() {
    // set html for filter-management
    let ovHTML = html_names_list();
    let OVelmnt = document.getElementById("namelist");
    OVelmnt.innerHTML = ovHTML;
    // get the actual defined list of names
    const menu_names = document.getElementById("menu_names");

    // initialize parms for controlling menu_names and filterA
    parms.lSET("fAind",0);
    parms.lSET("doShow_nl", false);

    // define events on action-elements in widget
    // -Schliessen-
    d3.select(".fh-close").on("click", function(event) {
        parms.lSET("loop_filter", false);
        close_namelist(event);
    });
    // -Speichern-
    d3.select(".fh-ok").on("click", function(event) {
        save_namefilter();
        close_namelist(event);
        parms.lSET("loop_filter", false);
    });
    // -Bearbeiten-
    d3.select("#names_edit").on("click", function(event) {
        parms.lSET("doShow_nl", true);
        let menu_names = document.getElementById("menu_names");
        showFILTERs_nl(menu_names);
    });

    showFILTERs_do(menu_names);

}
function showFILTERs_do(menu_names) {
    // hide list of already defined filters
    document.querySelector("#afilter_list").style.display = "none";
    document.querySelector("#filter_list").innerHTML = "";

    // prepare list of already defined filters
    let names_filterA = parms.oGETmap("names_filterA");
    document.querySelector("#names_sel_edit").style.display = "none";

    // Es gibt Filter-Definition(en)
    // -> zeige Übersicht Filter-Definitionen
    if ( names_filterA.size > 1) {
        document.querySelector("#names_sel_edit").style.display = "block";
        showFILTERs_A(names_filterA, menu_names);
    } else {
        // bisher noch kein Filter definiert
        // -> sofort Namens-Liste zeigen
        parms.lSET("doShow_nl", true);
        showFILTERs_nl(menu_names);
    }
}

/**
 * Liste bereits definierter Filter
 * -> leerer Eintrag - immer vorhanden
 *      -> Auswahl
 * -> Eintrag mit Inhalt
 *      -> Auswahl oder Löschen
 */
function showFILTERs_A(names_filterA, menu_names) {

    const _fiLines = document.getElementById("filter_list");   // reset filter_list
    _fiLines.innerHTML = "";

    names_filterA.forEach(function(value, key) {
        // console.log(key + ' = ' + value);
        // make a HTML-'li'
        let liItem = document.createElement("li");
        liItem.classList = 'nlulli';

        // Auswahl-Element erzeugen
        let cbs = document.createElement( "input" );
        cbs.type = "checkbox";
        cbs.value = key;                         // put the name in 'li'
        cbs.checked = false;                     // <checked> if name is already set in active_names
        cbs.setAttribute('fa-select', key);      // prep event-handler
        cbs.onchange = function(event) {
            fA_select(event,names_filterA);
        };
        //Append the checkbox to the li
        liItem.appendChild(cbs);

        // Filter-Definition übernehmen
        let spX = document.createElement( "div" );
        //Create the text node for key after the the checkbox
        let spL = document.createElement( "span" );
        let textL = document.createTextNode(value);
        //Append the text node to the <li>
        spL.appendChild(textL);
        spX.appendChild(spL);
        liItem.appendChild(spX);

        // Lösch-Element erzeugen 
        if ( key>"0" ) {
            let cbt = document.createElement( "i" );
            cbt.type = "img";
            cbt.value = key;                                                         // put the name in 'li'
            cbt.setAttribute('fa-erase', key);                                       // prep event-handler
            cbt.classList = "fa fa-trash fa-lg fh-erase hasTitle";
            cbt.title = i18n('nl_remove');
            cbt.onclick = function(event) {
                fA_erase(event,names_filterA);
            };
            //Append the checkbox to the li
            liItem.appendChild(cbt);
        }

        //Append the <li> to the <ul>
        _fiLines.appendChild(liItem);
    });
    // make list visible
    document.querySelector("#afilter_list").style.display = "inline";
    document.querySelector("#namelist").style.display = "block";
}

/**
 * Filter-Element in Text-Area übernehmen
 * -> mehrzeilig, bessere Übersicht
 */
function fA_select(event,names_filterA) {
    let actN = event.target;                                            // get the active line
    let key = actN.getAttribute("fa-select");                             // get the key
    fAind = 0;
    event.stopPropagation();
    let _names = document.getElementById("names_sel").children[0];      // get the active_names ...
    let _nv = _names.value;
    let doShow_nl = parms.lGET("doShow_nl");
    if (actN.checked) {                                                 // active line is checked ...
        if (!doShow_nl) { _nv = names_filterA.get(key); }               // ... and name_list is not shown -> put value to active_names
        fAind = key;
    } else {
        fAind = key;
    }
    _names.value = _nv.trim();                                          // update active_names
    let menu_names = document.getElementById("menu_names");
    menu_names.value = _names.value;                                    // update menu_names
}
/**
 * Filter-Element löschen
 * -> Text-Area zurücksetzen
 * -> Filter-Eintrag aus Liste entfernen
 */
function fA_erase(event,names_filterA) {
    let actN = event.target;                                            // get the active line
    let key = actN.getAttribute("fa-erase");                            // get the key
    fAind = 0;
    event.stopPropagation();
    let _names = document.getElementById("names_sel").children[0];      // get the active_names ...
    _names.value = "";
    parms.lSET("doShow_nl", false);
    names_filterA.delete(key);
    let names_filterClone = names_filterA;
    names_filterA = fA_rebuild(names_filterClone);
    parms.oSET("names_filterA", names_filterA);

    _names.value = "";                                                  // update active_names
    let menu_names = document.getElementById("menu_names");
    menu_names.value = _names.value;                                    // update menu_names

    actN.parentElement.remove();

    showFILTERs_do(menu_names);

}
/**
 * Filter-Übersicht nach Löschen eines Eintrags neu aufbauen
 */
function fA_rebuild(names_filterClone) {
    let names_filterNew = new Map();
    let _key = 0;
    names_filterClone.forEach( function(value,key) {
        if (key == "0") {
            names_filterNew.set(key, value);
            _key++;
        } else {
            if ( value ) {
                names_filterNew.set( _key.toString(), value);
                _key++;
            }
        }
    });
    return names_filterNew;
}

/**
 * Namens-Filter Änderung speichern
 * -> andere Elemente aktualisieren
 * -> Filter in parms zurückschreiben
 * -> Ansicht aktualisieren
 */
function save_namefilter() {
    let _names = document.getElementById("names_sel").children[0];
    let _nv = _names.value;
    let _wmn = document.getElementById("menu_names");
    _wmn.value = _nv;
    let names_filterA = parms.oGETmap("names_filterA");
    let nf_len = names_filterA.size;
    if (fAind > 0) {
        names_filterA.set(fAind.toString(), _nv);
    } else {
        if (_nv) { names_filterA.set(nf_len.toString(), _nv); }
    }
    parms.oSET("names_filterA", names_filterA);
    let linObj = parms.oGET("RENDERER");
    linObj.FilteredData = linObj.DATAman.makeFilteredData();
    parms.yearMod(true);
    parms.dataMod(true);
    parms.filterMod(true);
}

/**
 * Namens-Liste zu gewähltem Filter anzeigen
 * 'names_list' -> Liste als Map - sortiert nach Anzahl
 * '_liHead'    -> Listenkopf
 *                 - wird nur gezeigt, wenn mehr als 30 Namen in Liste
 * '_liLines'   -> Listen-Einträge
 *                  Checkbox
 *                  Namen
 *                  Anzahl
 */
function showFILTERs_nl(menu_names) {
    nlShow = parms.oGETmap("names_list");                                  // get the list of names in data
    parms.lSET("nlSort", "count");                          // default: sort by count
    parms.lSET("nlFill", i18n('nl_all'));                     // default: full namelist

    const _names = document.getElementById("names_sel").children[0];            // target HTML-element
    if (menu_names.value) _names.value = menu_names.value;                      // show already selected names
    nlNames = _names.value;

    const _liHead = document.getElementById("names_liHead");                      // reset names_list
    _liHead.innerHTML = "";

    const _liLines = document.getElementById("names_liLines");                    // reset names_list
    _liLines.innerHTML = "";

    if (nlShow.size > 30) {
        make_liHead(_liHead);
    }

    make_liLines(_liLines);

    // make list visible
    document.querySelector("#namelist").style.display = "block";
}

function make_liHead(_liHead) {
    //Options names_complete | names_yeared
    let soNLo = document.createElement("div");
    soNLo.classList = "nlheadR";
    soNLo.textContent = i18n('nl_contains');
    let _rb_label = i18n('nl_rbl_alln');
    make_liHead_rb(_rb_label, "NLc", soNLo, true, "nlcontent", nl_content);
    _rb_label = i18n('nl_rbl_actn');
    make_liHead_rb(_rb_label, "NLy", soNLo, false, "nlcontent", nl_content);
    _liHead.appendChild(soNLo);

    //select Names ...
    let soD = document.createElement("div");
    soD.classList = "nlhead";

    function make_liHead_rb(_text, _value, _pel, _checked=false, _name="sortby", _callback=nl_rebuild) {
        let rbl = document.createElement("label");
        rbl.textContent = i18n(_text) + ":";
        let rbc = document.createElement("input");
        rbc.type = "radio";
        rbc.value = _value;
        rbc.name = _name;
        rbc.checked = _checked;
        rbc.onclick = function(event) {
            _callback(event);
        };
        rbl.appendChild(rbc);
        _pel.appendChild(rbl);
    }
    //select A-Z
    let selAZ = document.createElement("div");
    soD.textContent = i18n('nl_snfc');
    make_liHead_sB(selAZ);
    soD.appendChild(selAZ);
    //Header
    let soH = document.createElement("div");
    soH.textContent = i18n('nl_snlb');
    soD.appendChild(soH);

    let soR = document.createElement("div");
    soR.classList = "nlheadR";
    //Create radiobuttons dynamically
    _rb_label = i18n('checked');
    make_liHead_rb(_rb_label, "CB", soR);
    _rb_label = i18n('nl_names');
    make_liHead_rb(_rb_label, "name", soR);
    _rb_label = i18n('nl_count');
    make_liHead_rb(_rb_label, "count", soR, true);
    soD.appendChild(soR);

    _liHead.appendChild(soD);
}
function make_liLines(_liLines) {
    nlShow.forEach(function(value, key) {
        if (key > "") {
            // console.log(key + ' = ' + value);
            // make a HTML-'li'
            let liItem = document.createElement("li");
            liItem.classList = 'nlulli';

            //Create checkbox dynamically       
            let cb = document.createElement( "input" );
            cb.type = "checkbox";
            cb.value = key;                                                         // put the name in 'li'
            cb.checked = nlNames.indexOf(key) >= 0 ? true : false;          // <checked> if name is already set in active_names
            cb.setAttribute('nl-task', key);                                        // prep event-handler
            cb.classList = "nl_cb";                                                 // css target
            cb.onchange = function(event) {
                nl_toggle(event);
            };
            //Append the checkbox to the li
            liItem.appendChild(cb);
            //Create the text node for key after the the checkbox
            let spX = document.createElement( "div" );
            //Create the text node for key after the the checkbox
            let spL = document.createElement( "span" );
            let textL = document.createTextNode(key);
            //Append the text node to the <li>
            spL.appendChild(textL);
            spX.appendChild(spL);
            //Create the text node for value after the the checkbox
            let spR = document.createElement( "span" );
            let textR = document.createTextNode(value);
            //Append the text node to the <li>
            spR.appendChild(textR);
            spX.appendChild(spR);
            liItem.appendChild(spX);

            //Append the <li> to the <ul>
            _liLines.appendChild(liItem);
        }
    });
}

/**
 * Auswahl Alle / A-Z generieren
 */
function make_liHead_sB(selPar) {
    selPar.classList = "nlheadR";
    let selBall = document.createElement("div");
    selPar.appendChild(selBall);
    let selB = document.createElement("input");
    selB.type = "button";
    selB.value = i18n('nl_all');
    selB.onclick = function(event) {
        nl_fill(event);
    };
    selBall.appendChild(selB);
    let selPaz = document.createElement("div");
    selPaz.classList = "nlhead";
    selPar.appendChild(selPaz);
    let selP_l1 = document.createElement("div");
    selP_l1.classList = "nlheadB";
    selPaz.appendChild(selP_l1);
    let selP_l2 = document.createElement("div");
    selP_l2.classList = "nlheadB";
    selPaz.appendChild(selP_l2);

    function selP_lx(selPlx, _chxx) {
        _chxx.forEach(function(_ch) {
            let selB = document.createElement("input");
            selB.type = "button";
            selB.value = _ch;
            selPlx.appendChild(selB);
            if (!idxN0.has(_ch)) {
                selB.disabled = true;
            } else {
                selB.style.color = getColor(_ch);
                selB.onclick = function(event) {
                    nl_fill(event);
                };
            }
        });
    }
    let idxN0 = parms.oGETmap("idxNames0");                                  // get the list of names in data
    let _cham = 'abcdefghijklm'.toUpperCase().split('');
    let _chnz = 'nopqrstuvwxyz'.toUpperCase().split('');
    selP_lx(selP_l1, _cham);
    selP_lx(selP_l2, _chnz);
}

function nl_toggle(event) {
    let actN = event.target;                                            // get the active line
    let name = actN.getAttribute("nl-task");                            // get the name
    let tname = name + ";";
    event.stopPropagation();
    // let _names = document.getElementById("names_sel").children[0];      // get the active_names ...
    // let _nv = _names.value;                                             // ... and its content
    let _nv = nlNames;
    let _in = _nv.indexOf(tname);                                       // test wether name is already set
    if (actN.checked) {                                                 // active line is checked ...
        if (_in < 0) {                                                  // ... but name is unknown ...
            _nv += " " + tname + " ";                                   // ... concat name to active_names
        }
    } else {                                                            // active line is unchecked ...
        if (_in >= 0) {                                                 // and name has been known in active_names
            let _nvs = _nv.split(";");
            let _i = 0;
            _nvs.every( _sn => {
                if(_sn.trim() == name) {
                    _nvs[_i] = "";                                      // remove it
                    return false;
                }
                _i++;
                return true;
            });
            _nv = "";
            _nvs.every( _sn => {                                        // rebuild active_names
                if(_sn ) _nv += _sn.trim() + "; ";
                return true;
            });
        }
    }
    let _names = document.getElementById("names_sel").children[0];      // get the active_names ...
    _names.value = _nv.trim();                                          // update active_names
    nlNames = _names.value;
}

function nl_content(event) {
    let actC = event.target.value;
    let nlMap = "names_list";
    if (actC == "NLy") {
        swapIDX(actC);
        nlMap = "idyNames";
    }
    let _fmode = parms.lGET("nlFill");
    nl_fill_do(_fmode, nlMap);

    return true;
}

function nl_fill(event) {
    let actE = event.target;
    let _fmode = parms.lGET("nlFill");
    if (actE.value == _fmode) {
        return false;
    }
    _fmode = actE.value;
    parms.lSET("nlFill", _fmode);
    nl_fill_do(_fmode, "names_list");
}

function nl_fill_do(_fmode, _nlMap) {
    nlShow = parms.oGETmap(_nlMap);                                  // get the list of names in data
    if (_fmode != i18n('nl_all')) {
        let _n0 = getNames0(_fmode);
        let _n0s = _n0.split(";");
        let _nlShow = new Map();
        _n0s.forEach( _sn => {
            _nlShow.set(_sn, nlShow.get(_sn));
        });
        nlShow = _nlShow;
    }
    let _smode = parms.lGET("nlSort");
    nl_build(_smode);
}

function nl_rebuild(event) {
    let actE = event.target;
    let _smode = parms.lGET("nlSort");
    if (actE.value == _smode) {
        return false;
    }
    _smode = actE.value;
    nl_build(_smode);
    return true;
}

function nl_build(_smode) {
    parms.lSET("nlSort", _smode);
    switch (_smode) {
        case "CB":
            if (nlNames > "") {
                let _nlShowT = new Map();
                let _nlShowF = new Map();
                nlShow.forEach(function(value, key) {
                    if (key > "") {
                        let _key = key + ";";
                        let _checked = nlNames.indexOf(_key) >= 0 ? true : false;          // <checked> if name is already set in active_names
                        if (_checked) {
                            _nlShowT.set(key, value);
                        } else {
                            _nlShowF.set(key, value);
                        }
                    }
                });
                nlShow = new Map([..._nlShowT, ..._nlShowF]);
            }
            break;
        case "name":
            let _nlShowE = new Map([...nlShow.entries()].sort());
            nlShow = _nlShowE;
            break;
        default:
            let _nlShowV = new Map([...nlShow.entries()].sort((a, b) => b[1] - a[1]));
            nlShow = _nlShowV;
            break;
        }
    const _liLines = document.getElementById("names_liLines");                    // reset names_list
    _liLines.innerHTML = "";
    make_liLines(_liLines);
}
