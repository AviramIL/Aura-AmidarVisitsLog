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
    // APPLICATION UTILITIES VARIABLES
    applicationRootURL: 'http://localhost/amidar/',
    //applicationRootURL: 'https://webops.co.il/amidar/',
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
        url: global.applicationRootURL + 'assets/json/' + url + params,
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
 OTHER UTILITIES
 ********************************************************************************************************************** */

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
 LOCAL STORAGE MODULE
 ********************************************************************************************************************** */
/*
$(document).ready(function () {
    $("#modalWelcomeContainer").load("templates/tmp_modal_welcome.html", function () {
        var
            $amidarModalWelcome, $loginUnit, $loginBranch, $loginCoordinator, $loginBtn, $logout;

        $logout = $('#logout').click(function(){
            jQuery.storage.removeItem('_sLoginUnit','localStorage');
            jQuery.storage.removeItem('_sLoginBranch','localStorage');
            jQuery.storage.removeItem('_sLoginCoordinator','localStorage');
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

        if (
            jQuery.storage.getItem('_sLoginCoordinator', 'localStorage') == null
            ||
            jQuery.storage.getItem('_sLoginCoordinator', 'localStorage') == ''
        ) {
            $amidarModalWelcome.modal('show');
        } else {
            appendLoggedUserData();
        }

        function appendLoggedUserData(){
            $('#currentUnit').html(jQuery.storage.getItem('_sLoginUnit', 'localStorage'));
            $('#currentBranch').html(jQuery.storage.getItem('_sLoginBranch', 'localStorage'));
            $('#currentCoordinator').html(jQuery.storage.getItem('_sLoginCoordinator', 'localStorage'));
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

            jQuery.storage.setItem('_sLoginUnit', $loginUnit.val(), 'localStorage');
            jQuery.storage.setItem('_sLoginBranch', $loginBranch.val(), 'localStorage');
            jQuery.storage.setItem('_sLoginCoordinator', $loginCoordinator.val(), 'localStorage');

            $amidarModalWelcome.modal('hide');
            appendLoggedUserData();
        });

    });
});
*/

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
            $idNumUpdate = $idNumUpdate = $('#idNumUpdate').val(primaryTenant.S_TENANT_ID_0);
            $tenantNameUpdate = $tenantNameUpdate = $('#tenantNameUpdate').val(primaryTenant.S_TENANT_NAME_0);
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