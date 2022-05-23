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
        // jQuery.fn.extend({
        //     disable: function(state) {
        //         return this.each(function() {
        //             var $this = $(this);
        //             if($this.is('input, button'))
        //                 this.disabled = state;
        //             else
        //                 $this.toggleClass('cce_disabled', state);
        //         });
        //     }
        // });
        
        // $('a').disable(true);
        
        $('body').on('click', 'a.cce_disabled', function(event) {
            event.preventDefault();
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
            let names = response.names;
            let names_list = response.names_list;
            let names_lidx = response.names_lidx;
            let names_sSTD = response.names_sSTD;
            let names_sDM = response.names_sDM;
            let dataset = {
                "gedData":  [{
                    "storeID": "download",
                    "nodeData": gedcom,
                    "nameData": names
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
            // $('.cce_disabled').click = null;
            // $('a').disable(false);
            // hrefID.classList.toggle("xyz_disabled");
        },
        complete: function () {
        },
        timeout: function () {
        }
      });
}
