///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Gedcom Interpreter
//
///////////////////////////////////////////////////////////////////////////////

// import { default as i18n } from "./i18n.js";
import * as parms from "./parms.js";


class Person
{
    constructor(id, givenname, surname, bdate, motherId, fatherId)
    {
        this.id = id;
        this.sex = parms.Sex.FEMALE;
        this.givenname = givenname;
        this.surname = surname;
        this.showname = null;
        this.bdate = bdate;
        this.bplace = null;
        this.ddate = null;
        this.sn_scR = 0;     // surname -> soundex code - Russell
        this.sn_scDM = 0;    // surname -> soundex code - daitchMokotoff
        
        this.families = [];     // list of families this person belongs to
    }

    getFullName()
    {
        if (this.givenname || this.surname)
            return this.givenname + " " + this.surname;
        return null;
    }

    getMother()
    {
        for (var f of this.families)
            if (f.children.includes(this))
                return f.wife;
        return null;
    }

    getFather()
    {
        for (var f of this.families)
            if (f.children.includes(this))
                return f.husband;
        return null;
    }

    getChildren()
    {
        var ch = [];
        for (var f of this.families)
            if (this == f.husband || this == f.wife)
                ch = ch.concat(f.children);
        return ch;
    }

    getSpouses()
    {
        var sp = [];
        for (var f of this.families)
            if (this == f.husband && f.wife)
                sp = sp.concat(f.wife);
            else if (this == f.wife && f.husband)
                sp = sp.concat(f.husband);
        return sp;
    }
}


export function loadTREE(TFM_data, callback)
{
    var gedcom = {
        "persons" : new Map(),
        "families" : new Map()
    };
    let lines = TFM_data.split("\n");

    gedcom = build_gedcam(lines);
        
    // ("Loaded " + gedcom.persons.size + " persons in " + gedcom.families.size + " families");
    console.log(i18n("L_Xp_Xf", { nP: gedcom.persons.size, nF: gedcom.families.size } ));
    callback(gedcom, text);
}

export function loadGedcom(url, callback)
{
    d3.text(url).then(function(text) 
    { 
        console.log(url, 'geladen');
        processGedcom(text, callback);
    });
}


export function processGedcom(text, callback)
{
    var gedcom = {
        "persons" : new Map(),
        "families" : new Map()
    };

    let lines = text.split("\n");

    gedcom = build_gedcom(lines);
        
    // ("Loaded " + gedcom.persons.size + " persons in " + gedcom.families.size + " families");
    console.log(i18n("L_Xp_Xf", { nP: gedcom.persons.size, nF: gedcom.families.size } ));
    callback(gedcom, text);
}


export function processGedcomN(text, names, callback)
{
    var gedcom = {
        "persons" : new Map(),
        "families" : new Map()
    };

    // text -> pure Gedcom
    let lines = text.split("\n");

    gedcom = build_gedcom(lines);

    // names -> key: id, value: surname|soundex-Russell|soundex-daitchMotokoff
    let namesJ = JSON.parse(names);

    // update persons with soundex
    for (const [xref, names] of Object.entries(namesJ))
    {
        let _xref = '@' + xref + '@';
        var person = gedcom.persons.get(_xref);
        if (person == undefined) {
            // ("Person " + xref + " is undefined!");
            console.log(i18n("PS_i_u", { pls: _xref } ));
        } else {
            var nvars = names.split("|");
            let surname = nvars[0];
            let sn_scR = nvars[1];
            let sn_scDM = nvars[2];
            person.sn_scR = sn_scR;     // surname -> soundex code - Russell
            person.sn_scDM = sn_scDM;    // surname -> soundex code - daitchMokotoff
        }
    }

// ("Loaded " + gedcom.persons.size + " persons in " + gedcom.families.size + " families");
    console.log(i18n("L_Xp_Xf", { nP: gedcom.persons.size, nF: gedcom.families.size } ));
    console.log(gedcom);

    parms.oSET("Otext", text);
    parms.oSET("OnamesJ", namesJ);
    callback(gedcom);
}


function build_gedcom(lines)
{
    var gedcom = {
        "persons" : new Map(),
        "families" : new Map()
    };
    var current_pers = null;
    var current_fam = null;
    var current_parentType = null;

    var nodeType = "";

    for (let i = 0; i < lines.length; i++)
    {
        var tokens = lines[i].split(" ");
        if (tokens[0] == "0" && tokens.length > 2)
        {
            nodeType = tokens[2].trim();
            if (nodeType == "INDI")
            {
                let id = tokens[1].toString();
                current_pers = new Person(id, null, null, null, 0, 0);
                gedcom.persons.set(id, current_pers);
            }
            else if (nodeType == "FAM")
            {
                let id = tokens[1];
                current_fam = {
                    husband : null,
                    wife : null,
                    mdate : null,
                    children : []
                };
                gedcom.families.set(id, current_fam);
            }
            else
            {
                current_pers = null;
                current_fam = null;
            }
        }
        //-------------------------------------------------------------
        else if (tokens[0] == 1)
        {
            nodeType = tokens[1].trim();
            current_parentType = nodeType;

            //-------------------------- encounterd while parsing PERSONS
            if (current_parentType == "NAME" && current_pers && current_pers.getFullName() == null)
            {
                for (let j = 2; j < tokens.length; j++)
                {
                    if (current_pers.surname == null && tokens[j].startsWith("/")) {     // extract surname
                        current_pers.surname = tokens[j].replace(/\//g, " ").trim();        // remove '/'s
                    } else {
                        if (current_pers.givenname == null) {                          // given name
                            current_pers.givenname = tokens[j].trim();
                        } else {
                            current_pers.givenname = current_pers.givenname + ' ' + tokens[j].trim();
                        }
                    }
                    if (current_pers.givenname == null) {
                        current_pers.givenname = i18n("unknown");
                    }

                    // if (current_pers.surname == null) {
                    //     current_pers.surname = i18n("unknown").toUpperCase();
                    // }
                }
                current_pers.showname = current_pers.surname + ", " + current_pers.givenname;
            }
            else if (nodeType == "SEX" && current_pers)
            {
                let sex = tokens[2].trim();
                current_pers.sex = sex == "M" ? parms.Sex.MALE : parms.Sex.FEMALE;
            }
            //-------------------------- encounterd while parsing FAMILIES
            else if (nodeType == "HUSB")
            {
                // important to trim trailing \r from id token!!
                let person = gedcom.persons.get(tokens[2].trim());
                if (person) {
                    // create bidirectional link between family and person
                    person.families.push(current_fam);
                    current_fam.husband = person;
                }
            }
            else if (nodeType == "WIFE")
            {
                let person = gedcom.persons.get(tokens[2].trim());
                if (person) {
                    // create bidirectional link between family and person
                    person.families.push(current_fam);
                    current_fam.wife = person;
                }
            }
            else if (nodeType == "CHIL")
            {
                let id = tokens[2].trim();
                if (!gedcom.persons.get(id))
                    gedcom.persons.set(id, new Person(id, null, null, null, 0, 0));
                let person = gedcom.persons.get(id);
                
                // create bidirectional link between family and person
                person.families.push(current_fam);
                current_fam.children.push(person);
            }
        }
        //-------------------------------------------------------------
        else if (tokens[0] == 2)
        {
            if (tokens[1] == "DATE" && tokens.length > 2)
            {
                let date = null;
                let datestr = tokens.slice(2).join(" ");

                let cleanstr = datestr
                    .toLowerCase()
                    // unwanted characters and words
                    .replace(/\./g, ' ').replace("?"," ").replace(","," ")
                    .replace("abt"," ").replace("before").replace("bef"," ")
                    .replace("undefined "," ").replace("undef "," ")
                    .replace("um "," ")
                    // common german wording replacements
                    .replace("jänner","jan").replace("januar ","jan ")
                    .replace("feber","feb").replace("februar ","feb ")
                    .replace("märz","mar").replace("mai","may")
                    .replace("juni","jun").replace("juli","jul")
                    .replace("okt","oct").replace("dez","dec")
                    .replace("ä","a")
                    .trim()
                    ;
               
                // add day number in case only month and year is given
                if (cleanstr.split(" ")
                    .filter(function(v,i,a){ return v != ""; }).length == 2 && /^[jfmasond]/.test(cleanstr)
                    )
                    cleanstr = "1 " + cleanstr;
                
                // convert to timestap in ms
                let datems = Date.parse(cleanstr);
                
                if (!isFinite(datems))
                {
                    // parsing error -> parse ourselves
                    let a = cleanstr.split(" ").filter(function(v,i,a){ return v != ""; });
                    if (a.length > 2)
                    {
                        let customstr = a[2].trim() + "-" + a[1].trim() + "-" + a[0].trim();
                        datems = Date.parse(customstr); 
                        if (isFinite(datems))
                            date = new Date(datems);
                        else
                            console.log("Can't parse custom date string '"+customstr+"' ("+cleanstr+")("+datestr+")");
                    }
                    else
                    {
                        console.log("Can't parse date string '"+datestr+"' ("+cleanstr+")");
                        date = null; // unknown date
                    }
                }
                else
                    date = new Date(datems);
                
                // set date to event
                if (current_parentType == "BIRT") current_pers.bdate = date;
                else if (current_parentType == "DEAT") current_pers.ddate = date;
                else if (current_parentType == "MARR") current_fam.mdate = date;
            }
        }
    }
    return gedcom;
}
export function estimateMissingDates(gedcom, procreationAge)
{
    let updated = true;
    while (updated)
    {
        // continue estimation until nothing was updated anymore
        updated = false;
        /*jshint -W083 */
        gedcom.persons.forEach( function(p){
            if (p.bdate == null)    // missing date of birth
            {
                let mother = p.getMother();
                let father = p.getFather();

                // birthday of youngest parent
                let pbdate = null;
                let mbdate = mother ? mother.bdate : null;
                let fbdate = father ? father.bdate : null;
                if (mbdate != null && fbdate == null) pbdate = mbdate;
                else if (mbdate == null && fbdate != null) pbdate = fbdate;
                else if (mbdate && fbdate) pbdate = (mbdate > fbdate) ? mbdate : fbdate;
                
                // birthday of oldest child
                let cbdate = null;
                let children = p.getChildren();
                for (let c of children)
                    if (cbdate == null)
                        cbdate = c.bdate;
                    else if (c.bdate && c.bdate < cbdate)
                        cbdate = c.bdate;

                // birthday of oldest spouse
                let spbdate = null;
                let spouses = p.getSpouses();
                for (let sp of spouses)
                    if (spbdate == null)
                        spbdate = sp.bdate;
                    else if (sp.bdate && sp.bdate < spbdate)
                        spbdate = sp.bdate;


                // estimate based on parent or child birthdates
                if (pbdate != null || cbdate != null)
                {
                    if (pbdate != null && cbdate == null)  
                    {
                        p.bdate = new Date(pbdate.getTime());
                        p.bdate.setFullYear(p.bdate.getFullYear() + procreationAge);
                    }
                    else if (pbdate == null && cbdate != null)  
                    {
                        p.bdate = new Date(cbdate.getTime());
                        p.bdate.setFullYear(p.bdate.getFullYear() - procreationAge);
                    }
                    else if (pbdate != null && cbdate != null)
                    {
                        p.bdate = new Date((pbdate.getTime() + cbdate.getTime())/2);
                    }
                
                    // ("Missing birth date of " + p.getFullName() + " was estimated " + p.bdate);
                    console.log(i18n("M_bdo_we", { pFN: p.getFullName(), pbd: p.bdate } ));
                    updated = true;
                }
                // neither parents nor childs are known - estimate based on spouse's bdate
                else if (spbdate != null)
                {
                    p.bdate = new Date(spbdate.getTime());  // assume person is of the same age as his oldest spouse
                    updated = true;
                }
            }
        });
    }

    // check who's left
    gedcom.persons.forEach( function(p){
        if (p.bdate == null)    // missing date of birth
        {
            // ("Still missing birth date of " + p.getFullName());
            console.log(i18n("S_mbd_o", { pFN: p.getFullName() } ));
        }
    });
}
