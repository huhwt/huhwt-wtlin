///////////////////////////////////////////////////////////////////////////////
//
// huhwt - LINEAGErenderer connector
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// IndexedDB Management
//
///////////////////////////////////////////////////////////////////////////////

function doAJAX(LINkey, btnID, getID, doneID, LINpath, textCompleted, nextText) {
    // $('.cce_disabled').click(function(e){
    //     e.preventDefault();
    // });
    $(function() {
        $('body').on('click', 'a.cce_disabled', function(event) {
            event.preventDefault();
        });

        $('#btn_DSname').on('click', function(event) {
            setOwnIdent();
        });
    });    
    var hrefID = document.getElementById(btnID);
    var ajaxElem = document.getElementById(getID);
    var ajaxElemd = ajaxElem.dataset;
    var ajaxGedcom = ajaxElemd.urlGedcom;
    var doneGedcom = document.getElementById(doneID);
    jQuery.ajax({
        url: ajaxGedcom,
        dataType: 'text',
        data: 'q=' + LINkey,
        success: function (ret) {
            let response = JSON.parse(ret);
            let gedcom = response.gedcom;
            let dsname = response.dsname;
            let names = response.names;
            let names_list = response.names_list;
            let names_lidx = response.names_lidx;
            let names_sSTD = response.names_sSTD;
            let names_sDM = response.names_sDM;
            let infodata = {};
            if (response.infodata)
                infodata = response.infodata;
            let dataset = {
                "gedData":  [{
                    "storeID": "download",
                    "nodeData": gedcom,
                    "nameData": names,
                    "dsname": dsname,
                    "infoData": infodata
                }],
                "gedFILTERs":  [{
                    "storeID": "download",
                    "names_list": names_list,
                    "names_lidx": names_lidx,
                    "names_sSTD": names_sSTD,
                    "names_sDM": names_sDM
                }],
                "gedCLUSTERs": [{
                    "storeID": "download",
                    "CLUSTERsA": ["surName", "soundDM", "soundSTD"]
                }]
            };
            putDB('wtLIN', 'Gedcom', dataset.gedData);
            putDB('wtLINparm', 'FILTERs', dataset.gedFILTERs);
            putDB('wtLINparm', 'CLUSTERs', dataset.gedCLUSTERs);
            localStorage.setItem("loadLINEAGE", "download");
            doneGedcom.innerText = textCompleted;
            hrefID.setAttribute("href", LINpath);
            hrefID.setAttribute("target", "_blank");
            hrefID.innerHTML = nextText;
            hrefID.classList.toggle("cce_disabled");
        },
        complete: function () {
        },
        timeout: function () {
        }
      });
}

function setOwnIdent() {
    var ownDSname = document.getElementById('vizDSname');
    if (ownDSname.value == '') { return; }
    const dbaction = readFromDB('wtLIN', 'Gedcom', 'download');
    dbaction.then( value => { 
                    console.log(value);
                    setOwnIdentDo(value, ownDSname);
                 } )
            .catch(err => { console.log(err); } )
            ;
}
function setOwnIdentDo(dbset, ownDSname) {
    let odsname = ownDSname.value;
    let dataset = {
        "gedData":  [{
          "storeID": dbset.storeID,
          "dsname": odsname,
          "nodeData": dbset.nodeData,
          "nameData": dbset.nameData
        }]};
    putDB('wtLIN', 'Gedcom', dataset.gedData);
    var defDSname = document.getElementById('LINdname');
    defDSname.textContent = odsname;
    ownDSname.value = '';
}
