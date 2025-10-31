///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Manage Individuals as Maps
//
///////////////////////////////////////////////////////////////////////////////

import { getMetadata } from "./export.js";
import { fChar, getColor, getNames0, swapIDX } from "./indexman.js";
import * as parms from "./parms.js";

const YEARrangeMIN = parms.lGET("YEARrangeMIN");

const m_fChar = fChar();

export class NODESman
{
    constructor(linObj) {
        this.linObj = linObj;
        this.instance = this;

        this.Onlist = new Map();            // O-riginaldata n-amed l-ist       key = node.name + node.id
        this.Fnlist = new Map();            // F-iltereddata n-amed l-ist       key = node.name + node.id

        this.Ynlist = new Map();            // Y-eareddata n-amed l-ist         key = node.name + node.id
        this.Ynlist_Y = new Map();          // Y-eareddata n-amed l-ist yeared  key = node.birthdate%10 + | + node.name + node.id
        this.Ynlist_N0 = new Map();         // Y-eareddata n-amed l-ist named   key = node.name(_keyed)->1.char -> array[nodes.names(_keyed)]

        this.Focus_Node = Object;          // Active Center Node

        this.Ynarr = [];
    }

    set_Onlist(Onodes) {
        let _nlist = new Map();
        Onodes.forEach(function(node) {
            node.m_key = null;
            let _key = make_showname(node);
            if (_key) {
                node.m_key = _key;
                _nlist.set(_key, node);
            }
        });

        this.Onlist = _nlist;

        this.Focus_Node = null;             // Onodes[0];
    }
    get_Onlist() {
        return this.Onlist;
    }
    get_Onode(_key) {
        return this.Onlist.get(_key);
    }

    set_Fnlist(Fnodes) {
        let _nlist = new Map();
        Fnodes.forEach(function(node) {
            let _key = node.m_key;
            if (_key) _nlist.set(_key, node);
        });
        this.Fnlist = _nlist;
    }
    get_Fnlist() {
        return this.Fnlist;
    }

    set_Ynlist(Ynodes) {
        let _nlist = new Map();             // key -> name-ID           value -> node
        let _nlistY = new Map();            // key -> sdate-name-ID     value -> node
        let _nlistN0 = new Map();           // key -> 1.char(name)      value -> array of keys
        Ynodes.forEach(function(node) {
            let _key = node.m_key;
            let _sdate = make_sdate(node);
            let _skey = null;
            if (_key) {
                _nlist.set(_key, node);

                if (_sdate) 
                    _skey = _sdate + '|' + _key;
                if (_skey) _nlistY.set(_skey, node);

                let _n0 = _key[0].toUpperCase();
                _n0 = m_fChar.get(_n0);
                if ( !_nlistN0.has(_n0) ) {
                    _nlistN0.set(_n0, '');
                }
                let _nl0 = _nlistN0.get(_n0);
                let _sn = _key + ';';
                if (_nl0.indexOf(_sn) < 0) {
                    _nl0 += _sn;
                    _nlistN0.set(_n0, _nl0);
                }
            }
        });
        this.Ynlist = _nlist;                           console.log('Ynlist', this.Ynlist);
        this.Ynlist_Y = _nlistY;                        console.log('Ynlist_Y', this.Ynlist_Y);
        this.Ynlist_N0 = _nlistN0;                      console.log('Ynlist_N0', this.Ynlist_N0);

        this.Ynarr = Array.from(_nlist.keys());         console.log('Ynarr', this.Ynarr);
        this.Ynarr_Y = Array.from(_nlistY.keys());      console.log('Ynarr_Y', this.Ynarr_Y);
        this.Ynarr_N0 = Array.from(_nlistN0.keys());    console.log('Ynarr_N0', this.Ynarr_N0);

    }
    get_Ynlist() {
        return this.Ynlist;
    }
    get_Ynlist_Y() {
        return this.Ynlist_Y;
    }
    get_Ynlist_N0() {
        return this.Ynlist_N0;
    }

    get_Ynlist_type(_type) {
        if (_type == 'NLc') {
            return this.Ynlist;
        };
        return this.Ynlist_Y;
    }

    get_Ynarr() {
        return this.Ynarr;
    }
    get_YnarrY() {
        return this.Ynarr_Y;
    }
    get_YnarrN0() {
        return this.Ynarr_N0;
    }

    get_Ynarr_type(_type) {
        if (_type == 'NLc') {
            return this.Ynarr;
        };
        return this.Ynarr_Y;
    }

    get_Ynodes(_key) {
        return this.Ynlist.get(_key);
    }
    get_YnodesY(_key) {
        return this.Ynlist_Y.get(_key);
    }
    get_YnodesN0(_key) {
        return this.Ynlist_N0.get(_key);
    }
}

function make_showname(node) {
    let showname = '';
    showname = node.showname ? node.showname : 'null';
    if (showname.indexOf('(') < 0) {
        let _nid = node.id.replaceAll('@','');
        showname += ' - (' + _nid + ')';
    }
    return showname;
}

function make_sdate(node) {
    let sdate = '0___'; // YEARrangeMIN;
    let bdate = node.bdate;
    if (bdate) {
        sdate = bdate.getFullYear().toString();
        sdate = sdate.substring(0,3) + '0';
    }
    return sdate;
}

