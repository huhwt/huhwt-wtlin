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
