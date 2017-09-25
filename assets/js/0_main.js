/* **********************************************************************************************************************
 GLOBAL PARAMS
 ********************************************************************************************************************** */
var global = {
    // BUSINESS RELATED VARIABLES
    currentUnit: '',
    currentBranch: '',
    currentCoordinator: '',
    currentDate: '',
    currentVisitsLog: '',
    _MachozList: [],

    //todo
    /*
    shikun: '',
    mivne: '',
    knisa: '',
    dira: '',
    */
    // APPLICATION UTILITIES VARIABLES
    APIRootURL: 'http://fr11dev:7001/ServiceManager/Macro/ExecMacro/',
    versionNumberClient: '0.01',
    versionNumberServer: '0.00',
    generalErrText: 'הבקשה התקבלה בהצלחה, אך מערכת ניהול ביקורים בפיתוח וטרם מחוברת לשרת',
    $amidarModal: ''
};

function setCurrentDateHE() {
    var dateObj;
    dateObj = new Date();
    month = dateObj.getUTCMonth() + 1;
    day = dateObj.getUTCDate();
    year = dateObj.getUTCFullYear();
    global.currentDate = day + '.' + month + '.' + year;
}

setCurrentDateHE();

/* **********************************************************************************************************************
 MAIN AVIRAM AJAX REQUEST: 1 place to execute ajax requests
 ********************************************************************************************************************** */
function ajaxReq(url, type, callBackFunction, params) {
    $.ajax({
        url: global.APIRootURL + url + params,
        type: type,
        success: function (data) {
            if (callBackFunction) {
                callBackFunction(data);
            }
        },
        error: function () {
            amidarAlerts(false, 'danger', params);
        }
    });
}

/* **********************************************************************************************************************
 LOCAL STORAGE TESTING
 ********************************************************************************************************************** */
// todo
var storage

function storageAvailable(type) {
    try {
        storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
                // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

if (storageAvailable('localStorage')) {
    console.log('storageAvailable')
}
else {
    console.log('storageAvailable not supported')
}

/* **********************************************************************************************************************
 OTHER UTILITIES
 ********************************************************************************************************************** */
/*
DEVELOPER INFO & SELF AGREEMENT...
SHORTCUTS:
LC - Local Storage
LOV - List Of Values
SV - Single Value
ARR - Array
OBJ - Object
 */

//storage.removeItem('LC_MachozList_LOV_ARR');

// GET LIST OF MECHOZOT AND SAVE IT IN LOCAL STOREAGE
if (!localStorage.getItem('LC_MachozList_LOV_ARR')) {
    console.log('FALSE: LC_MachozList_LOV_ARR');
    ajaxReq('app_getMachoz_List', 'GET', LCsaveMachozList, '');
} else {
    console.log('TRUE: LC_MachozList_LOV_ARR');
}

function LCsaveMachozList(data) {
    resultsArray = data.Response.app_getMachoz_ListTableArray.app_getMachoz_ListArrayItem;
    resultsLength = resultsArray.length;
    var resultsArrayTemp;

    var TO_LC_MachozList_LOV_ARR = [];

    for (i = 0; i < resultsLength; i++) {
        var LC_MachozList_SV_ARR = [];
        resultsArrayTemp = resultsArray[i].LOV_MECHOZOT.split(',');
        // single array of mahuz- code + name
        LC_MachozList_SV_ARR.push(resultsArrayTemp[0]);
        LC_MachozList_SV_ARR.push(resultsArrayTemp[1]);
        // array of arrays
        TO_LC_MachozList_LOV_ARR.push(LC_MachozList_SV_ARR);
    }
    //TO_LC_MachozList_LOV_ARR[2][1]);
    localStorage.setItem("LC_MachozList_LOV_ARR", JSON.stringify(TO_LC_MachozList_LOV_ARR));
}

console.log('LC_MachozList_LOV_ARR: ' + localStorage.getItem("LC_MachozList_LOV_ARR"));


// ALERT UTILITY: after success/failed actions
function amidarAlerts(progressBar, alertType, methodParams) {
    var notify;
    if (methodParams) {
        methodParams = '<br>הנתונים שנשלחו: ' + '-' + methodParams;
    } else {
        methodParams = '';
    }
    notify = $.notify('<strong>' + 'בביצוע, נא להמתין...' + '</strong>', {
        allow_dismiss: true,
        showProgressbar: progressBar
    });
    setTimeout(function () {
        notify.update({
            'type': alertType,
            placement: {
                from: "top",
                align: "right"
            },
            'message': '<strong>' + global.generalErrText + '</strong>' + methodParams
        });
    }, 1000);
}


// GENERAL FUNCTION TO EXTRACT PARAMS FROM THE URL
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

// SET VARIABLE TO CHECKBOX
function RadionButtonSelectedValueSet(name, SelectdValue) {
    $('input[name="' + name + '"][value="' + SelectdValue + '"]').prop('checked', true);
}

/* **********************************************************************************************************************
 LOCAL STORAGE MODAL
 ********************************************************************************************************************** */
/*
localStorage.getItem("LC_MachozList_LOV_ARR")
localStorage.setItem("LC_MachozList_LOV_ARR", JSON.stringify(TO_LC_MachozList_LOV_ARR));
localStorage.removeItem("LC_MachozList_LOV_ARR")
localStorage.clear()
 */

$(document).ready(function () {
    $("#modalWelcomeContainer").load("templates/tmp_modal_welcome.html", function () {
        var
            $amidarModalWelcome, $loginUnit, $loginBranch, $loginCoordinator, $loginBtn, $logout;

        $logout = $('#logout').click(function () {
            localStorage.removeItem("_sLoginUnit");
            localStorage.removeItem("_sLoginBranch");
            localStorage.removeItem("_sLoginCoordinator");
            location.reload();
            alert('את/ה עומד להיות מנותק/ת מהמערכת ולעבור לעמוד ההתחברות מחדש!');
        });

        $amidarModalWelcome = $('#amidarModalWelcome').modal({
            show: false,
            keyboard: false,
            backdrop: 'static'
        });

        $loginUnit = $('#loginUnit');
        $loginBranch = $('#loginBranch');
        $loginCoordinator = $('#loginCoordinator');
        $loginBtn = $('#loginBtn');

        // $loginUnit

        var mahuzArrLogIn = JSON.parse(localStorage.getItem("LC_MachozList_LOV_ARR"));
        var mahuzArrLenLogIn = mahuzArrLogIn.length;
        for (i = 0; i < mahuzArrLenLogIn; i++) {
            $loginUnit.append('<option value="' + mahuzArrLogIn[i][0] + '">' + mahuzArrLogIn[i][1] + '</option>');
        }


        /* ************************************************************************************
        pass mahuz val and append snif options
        ************************************************************************************ */
        $V_YOMAN_BIKUR_MACHOZ_0.change(function () {
            $V_YOMAN_BIKUR_MERCHAV_0.attr('disabled', false);
            $('.V_YOMAN_BIKUR_MERCHAV_0_HELP').html('');
            // todo
            $V_YOMAN_BIKUR_SHEM_RAKAZ_0.html('<option value="999" selected disabled>בחר רכז מהרשימה</option>');
            $V_YOMAN_BIKUR_SHEM_RAKAZ_0.attr('disabled', true);
            ajaxReq('app_getSnif_List', 'GET', appendSnifListSearch, '?CTRL_SCR_MACHOZ_0=' + $V_YOMAN_BIKUR_MACHOZ_0.val());
        });

        function appendSnifListSearch(data) {
            resultsArray = data.Response.app_getSnif_ListTableArray.app_getSnif_ListArrayItem;
            resultsLength = resultsArray.length;
            var tempSnif;
            $V_YOMAN_BIKUR_MERCHAV_0.html('');
            $V_YOMAN_BIKUR_MERCHAV_0.append('<option value="999" selected disabled>בחר סניף מהרשימה</option>');
            for (i = 0; i < resultsLength; i++) {
                tempSnif = resultsArray[i].LOV_MERCHAVIM.split(',');
                $V_YOMAN_BIKUR_MERCHAV_0.append('<option value="' + tempSnif[0] + '">' + tempSnif[1] + '</option>');
            }
        }

        /* ************************************************************************************
        pass mahuz and snif vals and append rakaz options
        ************************************************************************************ */
        $V_YOMAN_BIKUR_MERCHAV_0.change(function () {
            $V_YOMAN_BIKUR_SHEM_RAKAZ_0.attr('disabled', false);
            $('.V_YOMAN_BIKUR_SHEM_RAKAZ_0_HELP').html('');
            ajaxReq('app_getRakaz_List', 'GET', appendRakazListSearch, '?CTRL_SCR_MACHOZ_0=' + $V_YOMAN_BIKUR_MACHOZ_0.val() + '&CTRL_SCR_MERCHAV_0=' + $V_YOMAN_BIKUR_MERCHAV_0.val());
        });

        function appendRakazListSearch(data) {
            resultsArray = data.Response.app_getRakaz_ListTableArray.app_getRakaz_ListArrayItem;
            resultsLength = resultsArray.length;
            var tempRakaz;
            $V_YOMAN_BIKUR_SHEM_RAKAZ_0.html('');
            $V_YOMAN_BIKUR_SHEM_RAKAZ_0.append('<option value="999" selected disabled>בחר רכז מהרשימה</option>');
            for (i = 0; i < resultsLength; i++) {
                tempRakaz = resultsArray[i].LOV_RAKAZ.split(',');
                $V_YOMAN_BIKUR_SHEM_RAKAZ_0.append('<option value="' + tempRakaz[0] + '">' + tempRakaz[1] + '&nbsp;' + tempRakaz[2] + '</option>');
            }
        }

        /* ************************************************************************************
        pass mahuz and snif vals and append rakaz options
        ************************************************************************************ */
        $V_YOMAN_BIKUR_MERCHAV_0.change(function () {
            $V_YOMAN_BIKUR_SHEM_RAKAZ_0.attr('disabled', false);
            $('.V_YOMAN_BIKUR_SHEM_RAKAZ_0_HELP').html('');
            ajaxReq('app_getRakaz_List', 'GET', appendRakazListSearch, '?CTRL_SCR_MACHOZ_0=' + $V_YOMAN_BIKUR_MACHOZ_0.val() + '&CTRL_SCR_MERCHAV_0=' + $V_YOMAN_BIKUR_MERCHAV_0.val());
        });

        function appendRakazListSearch(data) {
            resultsArray = data.Response.app_getRakaz_ListTableArray.app_getRakaz_ListArrayItem;
            resultsLength = resultsArray.length;
            var tempRakaz;
            $V_YOMAN_BIKUR_SHEM_RAKAZ_0.html('');
            $V_YOMAN_BIKUR_SHEM_RAKAZ_0.append('<option value="999" selected disabled>בחר רכז מהרשימה</option>');
            for (i = 0; i < resultsLength; i++) {
                tempRakaz = resultsArray[i].LOV_RAKAZ.split(',');
                $V_YOMAN_BIKUR_SHEM_RAKAZ_0.append('<option value="' + tempRakaz[0] + '">' + tempRakaz[1] + '&nbsp;' + tempRakaz[2] + '</option>');
            }
        }


        if (
            localStorage.getItem("_sLoginCoordinator") == null
            ||
            localStorage.getItem("_sLoginCoordinator") == ''
        ) {
            $amidarModalWelcome.modal('show');
        } else {
            appendLoggedUserData();
        }

        function appendLoggedUserData() {
            $('#currentUnit').html(localStorage.getItem("_sLoginUnit"));
            $('#currentBranch').html(localStorage.getItem("_sLoginBranch"));
            $('#currentCoordinator').html(localStorage.getItem("_sLoginCoordinator"));
            $('#currentDate').html(global.currentDate);
        }

        $loginUnit.change(function () {
            $loginBranch.attr('disabled', false);
        });

        $loginBranch.change(function () {
            $loginCoordinator.attr('disabled', false);
        });

        $loginCoordinator.change(function () {
            $loginBtn.attr('disabled', false);
        });

        $loginBtn.click(function () {
            localStorage.setItem("_sLoginUnit", $loginUnit.val());
            localStorage.setItem("_sLoginBranch", $loginBranch.val());
            localStorage.setItem("_sLoginCoordinator", $loginCoordinator.val());
            $amidarModalWelcome.modal('hide');
            appendLoggedUserData();
        });

    });
});

/* **********************************************************************************************************************
 BEGIN GENERAL SITE ACTIONS ON EVERY PAGE LOAD
 ********************************************************************************************************************** */
$(document).ready(function () {

    // NAVBAR ANIMATIONS
    $("#applicationNavbar").load("templates/tmp_navbar.html", function () {
        var sideslider, sel, sel2, $navBarTitle;
        $navBarTitle = $('#navBarTitle');
        sideslider = $('[data-toggle=collapse-side]');
        sel = sideslider.attr('data-target');
        sel2 = sideslider.attr('data-target-2');
        sideslider.click(function () {
            $(this).toggleClass("active");
            $(sel).toggleClass('in');
            $(sel2).toggleClass('out');
        });
        var $spanVersionNumberClient;
        $spanVersionNumberClient = $('#spanVersionNumberClient').html(global.versionNumberClient);
        appendPageTitle($navBarTitle);
    });
    $('.disabled').click(function (e) {
        e.preventDefault();
    });


    /* **********************************************************************************************************************
     START- AVIRAM MODAL GET/UPDATE/POST AMIDAR WIZARD
     ********************************************************************************************************************** */
    // load AMIDAR MODAL into the dom and initializing call back functions
    $("#modalContainer").load("templates/tmp_modal.html", function () {
        // the modal was called
        global.$amidarModal = $('#amidarModal').on('show.bs.modal', function (event) {
            // amidarModalParams should be GLOBAL and therefore is not being declared! (though we can past it as a param...)
            amidarModalParams = [];
            // check what form[s] should be injected to the modal body + assign a title
            var button, requiredModule, extraParam;
            button = $(event.relatedTarget);
            requiredModule = button.data('modalcontent');
            extraParam = button.data('extraparam');
            switch (requiredModule) {
                case 'populatingTenantUpdate':
                    amidarModalParams[0] = 'עדכון פרטי משתכן מספר ' + extraParam; // WHAT SHOULD BE THE TITLE FOR THE MODAL
                    amidarModalParams[1] = 'modal_populating_tenant_update'; // TEMPLATES/MODAL_PARTS/(PARAM): WHICH HTML FILE TO LOAD
                    amidarModalParams[2] = 'UPDATE'; // METHOD: GET/POST/UPDATE --> WHEN HITTING THE 'SAVE/UPDATE' MODAL BUTTON
                    amidarModalParams[3] = 'dummyTenantUpdate'; // THE URL WE NEED TO SEND THE DATA TO (AFTER HITTING THE 'SAVE/UPDATE' MODAL BUTTON)
                    // OPTIONAL
                    //modal_populating_tenant_rely_on_update
                    amidarModalParams[4] = 'apartment-details-populating-main-tenant-single.json'; // THE URL TO FETCH DATA FROM
                    // todo: on production we can call to service that can acce
                    amidarModalParams[5] = '?tenantID=' + extraParam; // WE MAY NEED A SPECIFIC RECORD
                    //amidarModalParams[5] = ''; // now we'll use static dummy service that gives us a single record like we pass a parameter
                    // todo: call the function from a dynamic name based on one of the fields above
                    amidarModalParams[6] = 'primaryTenant';

                    break;
                //todo: merge to 1 part?
                case 'populatingTenantChildAdd':
                    amidarModalParams[0] = 'הוספת נסמך';
                    amidarModalParams[1] = "modal_populating_tenant_rely_on_add";
                    amidarModalParams[2] = 'POST';
                    amidarModalParams[3] = 'dummyTenantRelyOnAdd';
                    break;
                case 'populatingTenantChildUpdate':
                    amidarModalParams[0] = 'עדכון פרטי נסמכ/ת' + +' ' + extraParam;
                    amidarModalParams[1] = "modal_populating_tenant_rely_on_update";
                    amidarModalParams[2] = 'UPDATE';
                    amidarModalParams[3] = 'dummyTenantRelyOnUpdate';
                    amidarModalParams[4] = 'apartment-details-populating-main-tenant-rely-on-single.json';
                    amidarModalParams[5] = '?tenantRelyID=' + extraParam;
                    amidarModalParams[6] = 'primaryTenantRelyOn';
                    break;
            }
            // NEXT STEP: APPEND TITLE & FORMS TO THE MODAL BASED ON THE MODULE WE NEED
            modalContentLoad();
        });
    });

    // populate the modal with the relevant form[s] and add a title
    function modalContentLoad() {
        var $btnUpdateModal;
        // inject the modal title
        global.$amidarModal.find('.modal-title').text(amidarModalParams[0]);
        // load the relevant form[s] to the modal body
        $amidarModalBody = $('#amidarModalBody').load('templates/modal_parts/' + amidarModalParams[1] + '.html', function () {
            // append date pickers to all inputs
            $('.datepick').each(function () {
                $(this).datepicker();
            });
            // form[s] was loaded- NOW WE NEED TO POPULATE IT
            // if there's value - IT'S MEAN THAT WE SHOULD CALL A FUNCTION TO FETCH DATA AND POPULATE IT IN THE FORM:
            if (amidarModalParams[4]) {
                ajaxReq(
                    amidarModalParams[4], // url
                    'GET', // type
                    modalPopulate[amidarModalParams[6]], // callBackFunction
                    amidarModalParams[5] // params
                );
            }
            // IN CASE IT'S AN UPDATE - AT THIS POINT THE MODAL IS ALREADY POPULATED
            $btnUpdateModal = $('.btn-update-modal').click(function () {
                // UPDATE CLICK- DO SOMETHING
                dataModal = global.$amidarModal.find('form').serialize();

                ajaxReq(
                    amidarModalParams[3],
                    amidarModalParams[2],
                    false,
                    dataModal
                );

                global.$amidarModal.modal('hide');
            })
        });
    }

    // functions to fetch data on the modal forms
    var modalPopulate = {
        primaryTenant: function (data) {
            var primaryTenant, // in this case we'll have only 1 RECORD: THE PRIMARY TENANT
                // THE VARIABLES USED ONLY ONCE, APPEND IT TO A STATIC VARIABLE MAT SEEM REDUNDANT WITH WE DON'T WANT TO MESS THE GLOBAL SCOPE
                $idNumUpdate, $tenantNameUpdate, $tenantDOBUpdate, $tenantWorkUpdate;
            // in this case we'll have only 1 RECORD: THE PRIMARY TENANT- we should take the first item anyway
            primaryTenant = data.Response.avr_getAllPrimaryTenantsTableArray.avr_getAllPrimaryTenantsArrayItem[0];
            $idNumUpdate = $('#idNumUpdate').val(primaryTenant.S_TENANT_ID_0);
            $tenantNameUpdate = $('#tenantNameUpdate').val(primaryTenant.S_TENANT_NAME_0);
            RadionButtonSelectedValueSet('tenantGenderUpdate', primaryTenant.S_TENANT_GENDER_0);
            $tenantDOBUpdate = $('#tenantDOBUpdate').val(primaryTenant.S_TENANT_DOB_0);
            RadionButtonSelectedValueSet('tenantStateUpdate', primaryTenant.S_TENANT_MARITAL_STATUS_0);
            $tenantWorkUpdate = $('#tenantWorkUpdate').val(primaryTenant.S_TENANT_WORK_0);

        },
        primaryTenantRelyOn: function (data) {
            var primaryTenantRely;
            primaryTenantRely = data.Response.avr_getAllPrimaryTenantsRelyTableArray.avr_getAllPrimaryTenantsRelyArrayItem[0];
            $idNumRelyOn = $('#idNumRelyOn').val(primaryTenantRely.S_TENANT_RELY_ID_0);
            $tenantNameRelyOn = $('#tenantNameRelyOn').val(primaryTenantRely.S_TENANT_NAME_RELY_0);
            RadionButtonSelectedValueSet('tenantSingleRelyRelationType', primaryTenantRely.S_TENANT_RELATION_RELY_0);
            RadionButtonSelectedValueSet('tenantStateRelyOn', primaryTenantRely.S_TENANT_MARITAL_STATUS_RELY_0);
            $tenantDOBUpdateRelyOn = $('#tenantDOBRelyOn').val(primaryTenantRely.S_TENANT_DOB_RELY_0);
            $tenantWorkUpdateRelyOn = $('#tenantWorkRelyOn').val(primaryTenantRely.S_TENANT_WORK_RELY_0);

        }
    };
    /* **********************************************************************************************************************
     END- AVIRAM MODAL GET/UPDATE/POST AMIDAR WIZARD
     ********************************************************************************************************************** */


});