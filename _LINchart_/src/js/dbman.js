///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
// indexedDB functionality added by huhwt
//
// IndexedDB Management
//
///////////////////////////////////////////////////////////////////////////////

import * as parms from "./parms.js";
import * as gui from "./guiparts.js";
import { loadDataFromIDB } from "./interfaces.js";

export function putDB(dbName, storeName, data) {
    let idb = writeToDB(dbName, storeName, data);
    return idb;
}

export function getDB(dbName, storeName, key) {
    const dbaction = readFromDB(dbName, storeName, key);
    dbaction.then( value => { return value; } )
            .catch(err => { console.log(err); } )
            ;
}

export function showDBholds(dbName) {
    var DBOpenRequest = indexedDB.open(dbName);
    DBOpenRequest.onerror = function(event) {
        console.log(event);
    };
    DBOpenRequest.onsuccess = function(event) {
        let db = DBOpenRequest.result;
        return db.objectStoreNames;
    };
}


function writeToDB(dname, sname, arr) {
    // let DBOpenRequest = parms.oGET("db_wtTAM");
    return new Promise(function(resolve) {
        var DBOpenRequest = window.indexedDB.open(dname);
        var db;
        DBOpenRequest.onupgradeneeded = function() {
            var db = DBOpenRequest.result;
            db.onerror = function(ee) {
                alert("IndexedDB - onupgradeneeded - " + ee.target.errorCode);
            };
            var store = db.createObjectStore(sname, {keyPath: "storeID"});
            // store.createIndex("primID", "primID", { unique: false} );
            // store.createIndex("timestamp", "timestamp", { unique: false} );
        };
        DBOpenRequest.onsuccess = function() {
            var db = DBOpenRequest.result;
            let tactn = db.transaction(sname, "readwrite");
            var store = tactn.objectStore(sname);
            for(var obj of arr) {
                store.put(obj);
            }
            resolve(db);
        };
        DBOpenRequest.onerror = function (ee) {
            alert("Enable to access IndexedDB, " + ee.target.errorCode);
        };
    });
}

export function displayIDB(dname, sname) {
    return new Promise(function(resolve) {
        var DBOpenRequest = window.indexedDB.open(dname);
        var db;
        DBOpenRequest.onsuccess = function(e) {
            let _keyList = [];
            var idb = DBOpenRequest.result;
            let tactn = idb.transaction(sname, "readonly");
            let osc = tactn.objectStore(sname).openCursor();
            osc.onsuccess = function(e) {
                let cursor = e.target.result;
                if (cursor) {
                    _keyList.push(cursor.primaryKey);
                    cursor.continue();
                }
                resolve(_keyList);
            };
            tactn.oncomplete = function() {
                idb.close();
            };
        };
    });
}

export function readFromDB(dname, sname, key) {
    return new Promise(function(resolve) {
        var DBOpenRequest = indexedDB.open(dname);
        DBOpenRequest.onsuccess = function(e) {
            var idb = DBOpenRequest.result;
            let tactn = idb.transaction(sname, "readonly");
            let store = tactn.objectStore(sname);
            let data = store.get(key);
            data.onsuccess = function() {
                resolve(data.result);
            };
            tactn.oncomplete = function() {
                idb.close();
            };
        };
    });
}

export function testDBstore(DBname, snames)
{
    let osAnz = snames.length;
    const doShow = showSnames(DBname, snames[0]);
    var db;
    doShow.then( value => {
        let _version = value.version;
        let _osnames = value.osnames;
        if (_version == (osAnz - 1)) { return true; }
        if (osAnz > 0) {
            if ( !_osnames.contains(snames[0])) {
                let _sname1 = snames[0];
                let DBreq1 = window.indexedDB.open(DBname, 1);
                DBreq1.onupgradeneeded = function() {
                    db = DBreq1.result;
                    db.onerror = function(ee) {
                        alert("IndexedDB - onupgradeneeded - " + ee.target.errorCode);
                    };
                    db.createObjectStore(_sname1, {keyPath: "storeID"});
                };
                DBreq1.onsuccess = function() {
                    db = DBreq1.result;
                    db.close();
                };
                _version++;
            }
        }
        if (osAnz > 1) {
            if (!_osnames.contains(snames[1])) {
            let _sname2 = snames[1];
            let DBreq2 = window.indexedDB.open(DBname, 2);
            DBreq2.onupgradeneeded = function() {
                db = DBreq2.result;
                db.onerror = function(ee) {
                    alert("IndexedDB - onupgradeneeded - " + ee.target.errorCode);
                };
                db.createObjectStore(_sname2, {keyPath: "storeID"});
            };
            DBreq2.onsuccess = function() {
                db = DBreq2.result;
                db.close();
            };
            _version++;
            }
        }
        if (osAnz > 2) {
            if (!_osnames.contains(snames[2])) {
                let _sname3 = snames[2];
                let DBreq3 = window.indexedDB.open(DBname, 3);
                DBreq3.onupgradeneeded = function() {
                    db = DBreq3.result;
                    db.onerror = function(ee) {
                        alert("IndexedDB - onupgradeneeded - " + ee.target.errorCode);
                    };
                    db.createObjectStore(_sname3, {keyPath: "storeID"});
                };
                DBreq3.onsuccess = function() {
                    db = DBreq3.result;
                    db.close();
                };
                _version++;
            }
        }
        if (osAnz > 3) {
            if (!_osnames.contains(snames[3])) {
                let _sname4 = snames[3];
                let DBreq4 = window.indexedDB.open(DBname, 4);
                DBreq4.onupgradeneeded = function() {
                    db = DBreq4.result;
                    db.onerror = function(ee) {
                        alert("IndexedDB - onupgradeneeded - " + ee.target.errorCode);
                    };
                    db.createObjectStore(_sname4, {keyPath: "storeID"});
                };
                DBreq4.onsuccess = function() {
                    db = DBreq4.result;
                    db.close();
                };
                _version++;
            }
        }
    });
}

function showSnames(DBname, sname) {
    return new Promise(function(resolve) {
        var req = indexedDB.open(DBname);
        var db;
        req.onupgradeneeded = function() {
            db = req.result;
            db.onerror = function(ee) {
                alert("IndexedDB - onupgradeneeded - " + ee.target.errorCode);
            };
            db.createObjectStore(sname, {keyPath: "storeID"});
        };
        req.onsuccess = function (e) {
                let db = e.target.result;
                let version = parseInt(db.version);
                let osnames = db.objectStoreNames;
                db.close();
                resolve({ "version": version, 
                        "osnames": osnames });
        };
    });
}

export function closeModalIDB()
{
    document.querySelector("#overlay").style.display = "none";
    let ovHTML = gui.FILE_MODAL();
    let OVelmnt = document.getElementById("overlay");
    OVelmnt.innerHTML = ovHTML;
}

export function showIDBstate() {
    let ovHTML = gui.IDB_INDEX();
    let OVelmnt = document.getElementById("overlay");
    OVelmnt.innerHTML = ovHTML;
    const _liHead = document.getElementById("idbstores");
    _liHead.innerHTML = "";

    d3.select("#overlay").on("click", function(event) {
        closeModalIDB(event);
    });

    // read IDB step by step -> because of promise/resolve it is not possible to display the whole stock in one go.
    let db;
    const mkeyList = new Map();
    const DB = new Promise((resolve, reject) => {
        const request = indexedDB.open("wtLIN");
        request.onsuccess = () => resolve(request.result);
    });
    const idbSlist = new Promise((resolve, reject) => {
        DB.then(idb => {
            db = idb;
            let dbos = idb.objectStoreNames;
            let _dbos = Array.from(dbos);
            resolve(_dbos);
        });
    });
    // display the stores - we need only "TREEdata"
    idbSlist.then(snames => {
        snames.forEach(sname => {
            if(sname == "TREEdata") {
                const liItem = document.createElement("li");
                liItem.classList = 'ulli';
                _liHead.appendChild(liItem);
                const param = document.createElement("p");
                param.innerHTML = i18n("idb_" + sname);
                liItem.appendChild(param);
                const showButton = document.createElement('button');
                liItem.appendChild(showButton);
                showButton.innerHTML = '>';
                showButton.title = i18n('idb_clickStore');
                // here we are setting a data attribute on our show button to say what task we want shown if it is clicked!
                showButton.setAttribute('key-task', sname);
                showButton.onclick = function(event) {
                    showIDBkeys(event);
                };
                // liItem itself will do nothing
                liItem.onclick = function(event) {
                    event.stopPropagation();
                };
            }
        });
        document.querySelector("#overlay").style.display = "inline";
    });
}

function showIDBkeys(event) {
    let actNodeE = event.target;
    let actNode = actNodeE.parentNode;
    let sname = event.target.getAttribute("key-task");
    event.stopPropagation();
    let db;
    const DB = new Promise((resolve, reject) => {
        const request = indexedDB.open("wtLIN");
        request.onsuccess = () => {
            db = request.result;
            parms.oSET("IDBdb", db);
            showIDBkeysL(actNode, db, sname, actNodeE);
            resolve(db);
        };
    });
}

function showIDBkeysL(actNode, db, sname, actNodeE) {
    const DBtactn = new Promise((res, rej) => {
        let taction = db.transaction(sname, "readonly");
        let ostore = taction.objectStore(sname);
        let req = ostore.openCursor();

        let _keyList = [];
        req.onsuccess = function(e) {
            let curs = e.target.result;
            if (curs) {
                let _key = curs.primaryKey;
                _keyList.push(_key);
                curs.continue();
            } else {
                showIDBkeysLdo(actNode, sname, _keyList, actNodeE);
            }
        };
        req.oncomplete = (ev) => {
            res(_keyList);
        };
        req.onerror = (ev) => {
            rej(ev);
        };
    });
}

function showIDBkeysLdo(actNode, sname, keyList, actNodeE) {
    const oliHead = document.createElement("ol");
    if (keyList.length > 0) {
        keyList.forEach( idbKey => {
            const oliItem = document.createElement("li");
            // oliItem.innerHTML = ':';
            oliItem.classList = 'olli';
            oliHead.appendChild(oliItem);
            oliItem.title = i18n('idb_clickItem');
            const param = document.createElement("p");
            param.innerHTML = idbKey;
            oliItem.appendChild(param);
            // here we are setting a data attribute on our param to say what task we want done if it is clicked!
            param.setAttribute('show-task', sname+'|'+idbKey);
            param.onclick = function(event) {
                loadIDBkey(event);
            };
            const delButton = document.createElement('button');
            oliItem.appendChild(delButton);
            delButton.innerHTML = i18n('idb_delFlag');
            delButton.title = i18n('idb_delItem');
            // here we are setting a data attribute on our del button to say what task we want done if it is clicked!
            delButton.setAttribute('del-task', sname+'|'+idbKey);
            delButton.onclick = function(event) {
                delIDBkey(event);
            };
        });
    } else {
        const param = document.createElement("p");
        // oliItem.innerHTML = ':';
        oliHead.appendChild(param);
        param.innerHTML = i18n('idb_noEntries');
    }
    actNode.appendChild(oliHead);
    actNodeE.innerHTML = '';       // show button will be set inactiv
    actNodeE.onclick = function(event) {
        event.stopPropagation();
    };
}

function loadIDBkey(event) {
    let actNodeE = event.target;
    let dstring = event.target.getAttribute("show-task");
    event.stopPropagation();
    closeModalIDB();
    let dstrings = dstring.split("|");
    let dbName = "wtLIN";
    let dbStore = dstrings[0];
    let dbKey = dstrings[1];
    loadDataFromIDB(dbStore, dbKey);
}

function delIDBkey(event) {
    let delem = event.target;                       // this element has been clicked
    let delemP = delem.parentNode;                  // this element will be removed on success
    let delemGP = delemP.parentNode;                      // ... and its parent will be checked if empty
    let dstring = delem.getAttribute("del-task");
    event.stopPropagation();
    let dstrings = dstring.split("|");
    let dbStore = dstrings[0];
    let dbKey = dstrings[1];
    let db = parms.oGET("IDBdb");
    const DBtactn = new Promise((res, rej) => {
        let taction = db.transaction(dbStore, "readwrite");
        let ostore = taction.objectStore(dbStore);
        let req = ostore.delete(dbKey);
        req.onsuccess = function(e) {
            delemP.remove();
            if (delemGP.children.length == 0) {
                delemGP.innerHTML = i18n('idb_noEntries');
            }
        };
        req.onerror = (ev) => {
            rej(ev);
        };
    });
}
