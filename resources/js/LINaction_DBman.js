///////////////////////////////////////////////////////////////////////////////
//
// huhwt - LINEAGE connector
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// IndexedDB Management
//
///////////////////////////////////////////////////////////////////////////////

function putDB(dbName, storeName, data) {
    let idb = writeToDB(dbName, storeName, data);
    return idb;
}

function writeToDB(dname, sname, arr) {
    return new Promise(function(resolve) {
        var DBOpenRequest = window.indexedDB.open(dname);
        var db;
        DBOpenRequest.onupgradeneeded = function() {
            var db = DBOpenRequest.result;
            db.onerror = function(ee) {
                alert("IndexedDB - onupgradeneeded - " + ee.target.errorCode);
            };
            var store = db.createObjectStore(sname, {keyPath: "storeID"});
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

function testDBstore(DBname, snames) {
    const doShow = showSnames(DBname, snames[0]);
    var db;
    doShow.then( value => {
        let _version = value.version;
        let _osnames = value.osnames;
        if (_version == (snames.lenght-1)) { return true; }
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
        if (snames.length > 1) {
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
        if (snames.length > 2) {
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
        if (snames.length > 3) {
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
        if (snames.length > 4) {
            if (!_osnames.contains(snames[4])) {
                let _sname5 = snames[4];
                let DBreq5 = window.indexedDB.open(DBname, 5);
                DBreq5.onupgradeneeded = function() {
                    db = DBreq5.result;
                    db.onerror = function(ee) {
                        alert("IndexedDB - onupgradeneeded - " + ee.target.errorCode);
                    };
                    db.createObjectStore(_sname5, {keyPath: "storeID"});
                };
                DBreq5.onsuccess = function() {
                    db = DBreq5.result;
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
