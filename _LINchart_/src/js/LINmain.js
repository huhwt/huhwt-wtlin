///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Main script
//
///////////////////////////////////////////////////////////////////////////////

import * as gui from "./guiparts.js";
import { TICKCOUNTER_html } from "./tickcounter.js";
import { loadFileFromDisk, loadDataFromIDB } from "./interfaces.js";
import * as parms from "./parms.js";
import { testDBstore } from "./dbman.js";

export function mainFile(folder, filename) {
    // For to be sure that all IDB-stores are ready for action ...
    testDBstore("wtLIN", ["TREEdata", "TIMEdata", "NAMEdata", "Gedcom"]);

    parms.SET("FILENAME", filename);
    parms.SET("SOURCE_FILE", filename); // original data source (e.g. ".ged" file), which will be referenced in ".tfm" files
    parms.SET("FOLDER", folder);

    prep_action();

    // Load data and create force graph (see interfaces.js).
    // Uses folder and parms.FILENAME from above.
    loadFileFromDisk(folder);
}

export function mainDB(stName) {
    prep_action();

    let idbKey = "";
    switch (stName)
    {
        default:
        case "Gedcom":
            idbKey = localStorage.getItem("loadLINEAGE");
            // localStorage.removeItem("loadLINEAGE");
            loadDataFromIDB("Gedcom", idbKey);
            break;
            }
}

function prep_action() {
    testDBstore("wtLIN", ["TREEdata", "TIMEdata", "NAMEdata", "Gedcom"]);
    testDBstore("wtLINparm", ["CLUSTERs", "FILTERs"]);

    parms.SET("PROCREATION_AGE", 20);
    parms.SET("STATE", "INIT");

    parms.oSET("RENDERER", null);

    let mbHTML = gui.linMENUBAR_html();
    let MBelmnt = document.getElementById("menubar");
    MBelmnt.innerHTML = mbHTML;
    let fmHTML = gui.FILE_MODAL();
    let FMelmnt = document.getElementById("overlay");
    FMelmnt.innerHTML = fmHTML;
    let tcHTML = TICKCOUNTER_html();
    let TCelmnt = document.getElementById("tickcountInfo");
    TCelmnt.innerHTML = tcHTML;
}

//# sourceMappingURL=/dist/tamv6.js.map