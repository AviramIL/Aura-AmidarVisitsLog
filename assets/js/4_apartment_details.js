// screen is available only when there's a visitsLog PARAM AT THE URL
function appendPageTitle(navBarTitleParam) {
    global.currentVisitsLog = getUrlParameter('visitsLog');
    if (
        global.currentVisitsLog === ''
        ||
        typeof(global.currentVisitsLog) === 'undefined'
    ) {
        $('.main-content-inner').html('<div class="jumbotron"><h2 class="text-center">יש להגיע מ<a href="https://webops.co.il/amidar/visits-log.html">מסך יומן ביקורים </a> על מנת לבצע פעולות במסך זה</h2></div>')
    } else {
        navBarTitleParam.html('<span class="glyphicon glyphicon-info-sign"></span>פרטי דירה, <small>ביקור מספר<strong> ' + global.currentVisitsLog + '</strong></small>')
    }
}

$(document).ready(function () {
    var
        $idInForm, $idInStreet, $idInApartmentNumber, $idInConfirm,
        $idInUpdate, $idInMsg, idInValidationText,

        $btnApartmentDetailsActions, $divApartmentDetailsActions, $panelCollapseDefault;

    // idInForm
    $idInForm = $('#idInForm');
    $idInStreet = $('#idInStreet');
    $idInApartmentNumber = $('#idInApartmentNumber');
    $idInConfirm = $('#idInConfirm');
    $idInUpdate = $('#idInUpdate');
    $idInMsg = $('#idInMsg');
    idInValidationText = 'ודא כי הרחוב ומספר הדירה מכילים ערכים תקינים, וכן כי בדקת את הדירה ואישרת את הנתונים';

    $idInUpdate.click(function (e) {
        if (
            $idInStreet.val().length > 2 &&
            $idInApartmentNumber.val().length !== '' &&
            $idInConfirm.is(':checked')
        ) {
            $idInMsg.text('');
            ajaxReq('undefined.json', 'POST', false, $idInForm.serialize());
            $idInConfirm.prop('checked', false);
        } else {
            $idInMsg.text(idInValidationText);
            e.preventDefault();
        }

    });


    $divApartmentDetailsActions = $('#divApartmentDetailsActions').html('<h4>לחץ על אחד מהכפתורים מעלה לפעולה המבוקשת</h4>');
    $panelCollapseDefault = $('.panelCollapseDefault');

    $btnApartmentDetailsActions = $('.btnApartmentDetailsActions').click(function () {
        var $this, apartmentDetailsActions;

        $panelCollapseDefault.collapse('hide');
        $this = $(this);
        $btnApartmentDetailsActions.attr("disabled", false);
        $this.attr("disabled", true);
        apartmentDetailsActions = $this.data('action');
        // todo: remove time param on prod- NOW IT'S ONLY FOR CACHING PURPOSES
        var currentTime = new Date().getTime();
        $divApartmentDetailsActions.load("templates/apartment-details/tmp_" + apartmentDetailsActions + ".html?time=" + currentTime, function () {

            //todo ASAP!!!!! CALL THE FUNCTION JUST FROM THE DATA ATTRIBUTE INSTEAD OF THIS....
            switch (apartmentDetailsActions) {
                case 'maintenance':
                    maintenance();
                    break;
                case 'populating':
                    populating();
                    break;
                case 'liveAlone':
                    liveAlone();
                    break;
                case 'prefabricatedBuilding':
                    prefabricatedBuilding();
                    break;
                case 'pictures':
                    pictures();
                    break;
                case 'leave':
                    leave();
                    break;
                case 'invade':
                    invade();
                    break;
                case 'endOfVisit':
                    endOfVisit();
                    break;
            }

            var $btnApartmentDetailsActionsCancel;
            $btnApartmentDetailsActionsCancel = $('.btnApartmentDetailsActionsCancel').click(function () {
                $btnApartmentDetailsActions.attr("disabled", false);
                $divApartmentDetailsActions.html('<h4>לחץ על אחד מהכפתורים מעלה לפעולה המבוקשת</h4>');
            });

            $('.datepick').each(function () {
                $(this).datepicker();
            });

        });
    });

    /* ***********************************************************************************************************************
     maintenance
     *********************************************************************************************************************** */
    function maintenance() {
        var $gradeSelect, mandatoryText, $maintenanceAction, $maintenanceActionBox;

        // IF GRADE <= 5 DESC IS MANDATORY
        mandatoryText = '<span class="glyphicon glyphicon-exclamation-sign"></span> ' + 'במקרים בהם הציון נמוך או שווה ל-5, שדה זה הינו שדה חובה';
        $gradeSelect = $('.grade-select').change(function () {
            var $this;
            $this = $(this);
            if ($this.val() <= 5) {
                $('#' + $this.attr('id') + 'DescriptionHelp').html(mandatoryText);
            } else {
                $('#' + $this.attr('id') + 'DescriptionHelp').html('');
            }
        });

        // MAINTENANCE ACTIONS
        $maintenanceActionBox = $('#maintenanceActionBox');
        $maintenanceAction = $('.maintenanceAction').click(function () {
            var $this, maintenanceActionType;
            $this = $(this);
            $maintenanceAction.attr("disabled", false);
            $this.attr("disabled", true);
            maintenanceActionType = $this.data('action');
            $maintenanceActionBox.load("templates/apartment-details/maintenance_actions/" + maintenanceActionType + ".html", function () {
                console.log(maintenanceActionType + 'loaded');
            });
        });

    }

    /* ***********************************************************************************************************************
     populating
     *********************************************************************************************************************** */
    function populating() {

        /* ***************************
         Primary Tenant
         */
        var appendPopulatingTenant = function appendPopulatingTenant(data) {
            var
                i, r, j, resultsArray, resultsLength,
                $tbodyPopulatingTenant,
                $populatingTenantCount,
                $btnUpadteCustomerDetails;

            r = new Array();
            j = -1;

            resultsArray = data.Response.avr_getAllPrimaryTenantsTableArray.avr_getAllPrimaryTenantsArrayItem;
            resultsLength = resultsArray.length;

            $populatingTenantCount = $('#populatingTenantCount').html(resultsLength + ' משתכנים ראשיים נמצאו');

            for (i = 0; i < resultsLength; i++) {
                r[++j] = '<tr class="tenantrow" data-tenantrow="' + resultsArray[i].S_TENANT_ID_0 + '">';
                r[++j] = '<td>';
                r[++j] = '<button class="btn btn-xs btn-primary" data-toggle="modal" data-target="#amidarModal" data-modalcontent="populatingTenantUpdate" data-extraparam="' + resultsArray[i].S_TENANT_ID_0 + '">';
                r[++j] = '<span class="glyphicon glyphicon-check"></span> עדכון';
                r[++j] = '</button>';
                r[++j] = '</td>';
                r[++j] = '<td>';
                r[++j] = resultsArray[i].S_TENANT_ID_0;
                r[++j] = '</td>';
                r[++j] = '<td>';
                r[++j] = resultsArray[i].S_TENANT_NAME_0;
                r[++j] = '</td>';
                r[++j] = '<td>';
                r[++j] = resultsArray[i].S_TENANT_GENDER_0;
                r[++j] = '</td>';
                r[++j] = '<td>';
                r[++j] = resultsArray[i].S_TENANT_DOB_0;
                r[++j] = '</td>';
                r[++j] = '<td>';
                r[++j] = resultsArray[i].S_TENANT_MARITAL_STATUS_0;
                r[++j] = '</td>';
                r[++j] = '<td>';
                r[++j] = resultsArray[i].S_TENANT_WORK_0;
                r[++j] = '</td>';
                r[++j] = '</tr>';
            }
            $tbodyPopulatingTenant = $('#tbodyPopulatingTenant').html(r.join(''));
        };
        ajaxReq('apartment-details-populating-main-tenant.json', 'GET', appendPopulatingTenant, '');


        /* ***************************
        Rely On
         */
        var appendPopulatingTenantRelyOn = function appendPopulatingTenantRelyOn(data) {
            var
                i, r, j, resultsArray, resultsLength,
                $tbodyPopulatingTenantRely,
                $populatingTenantRelyCount;

            r = new Array();
            j = -1;

            resultsArray = data.Response.avr_getAllPrimaryTenantsRelyTableArray.avr_getAllPrimaryTenantsRelyArrayItem;
            resultsLength = resultsArray.length;

            $populatingTenantRelyCount = $('#populatingTenantRelyCount').html(resultsLength + ' נסמכים נמצאו');

            for (i = 0; i < resultsLength; i++) {
                r[++j] = '<tr class="tenantrow" data-tenantrow="' + resultsArray[i].S_TENANT_RELY_ID_0 + '">';
                r[++j] = '<td>';
                r[++j] = '<button class="btn btn-xs btn-primary" data-toggle="modal" data-target="#amidarModal" data-modalcontent="populatingTenantChildUpdate" data-extraparam="' + resultsArray[i].S_TENANT_RELY_ID_0 + '">';
                r[++j] = '<span class="glyphicon glyphicon-check"></span> עדכון';
                r[++j] = '</button>';
                r[++j] = '</td>';
                r[++j] = '<td>';
                r[++j] = resultsArray[i].S_TENANT_RELY_ID_0;
                r[++j] = '</td>';
                r[++j] = '<td>';
                r[++j] = resultsArray[i].S_TENANT_NAME_RELY_0;
                r[++j] = '</td>';
                r[++j] = '<td>';
                r[++j] = resultsArray[i].S_TENANT_RELATION_RELY_0;
                r[++j] = '</td>';
                r[++j] = '<td>';
                r[++j] = resultsArray[i].S_TENANT_MARITAL_STATUS_RELY_0;
                r[++j] = '</td>';
                r[++j] = '<td>';
                r[++j] = resultsArray[i].S_TENANT_DOB_RELY_0;
                r[++j] = '</td>';
                r[++j] = '<td>';
                r[++j] = resultsArray[i].S_TENANT_WORK_RELY_0;
                r[++j] = '</td>';
                r[++j] = '</tr>';
            }
            $tbodyPopulatingTenantRely = $('#tbodyPopulatingTenantRely').html(r.join(''));
        };
        ajaxReq('apartment-details-populating-main-tenant-rely-on.json', 'GET', appendPopulatingTenantRelyOn, '');
    }

    /* ***********************************************************************************************************************
     liveAlone
     *********************************************************************************************************************** */
    function liveAlone() {
        $("#liveAloneConfirmDate").datepicker().datepicker("setDate", new Date());
    }

    /* ***********************************************************************************************************************
     prefabricatedBuilding
     *********************************************************************************************************************** */
    function prefabricatedBuilding() {
        $("#preBulManagerDate").datepicker().datepicker("setDate", new Date());
        $("#preBulTenantDate").datepicker().datepicker("setDate", new Date());
        $("#preBulRefDate").datepicker().datepicker("setDate", new Date());

        var wrapper = document.getElementById("signature-pad");
        var clearButton = wrapper.querySelector("[data-action=clear]");
        var savePNGButton = wrapper.querySelector("[data-action=save-png]");
        var saveSVGButton = wrapper.querySelector("[data-action=save-svg]");
        var canvas = wrapper.querySelector("canvas");
        var signaturePad = new SignaturePad(canvas);

        function resizeCanvas() {
            var ratio = Math.max(window.devicePixelRatio || 1, 1);

            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);

            signaturePad.clear();
        }

        window.onresize = resizeCanvas;
        resizeCanvas();

        function download(dataURL, filename) {
            var blob = dataURLToBlob(dataURL);
            var url = window.URL.createObjectURL(blob);

            var a = document.createElement("a");
            a.style = "display: none";
            a.href = url;
            a.download = filename;

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
        }

        function dataURLToBlob(dataURL) {
            var parts = dataURL.split(';base64,');
            var contentType = parts[0].split(":")[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;
            var uInt8Array = new Uint8Array(rawLength);

            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }

            return new Blob([uInt8Array], {type: contentType});
        }

        clearButton.addEventListener("click", function (event) {
            signaturePad.clear();
        });

        savePNGButton.addEventListener("click", function (event) {
            if (signaturePad.isEmpty()) {
                alert("Please provide a signature first.");
            } else {
                var dataURL = signaturePad.toDataURL();
                download(dataURL, "signature.png");
            }
        });

        saveSVGButton.addEventListener("click", function (event) {
            if (signaturePad.isEmpty()) {
                alert("Please provide a signature first.");
            } else {
                var dataURL = signaturePad.toDataURL('image/svg+xml');
                download(dataURL, "signature.svg");
            }
        });


    }

    /* ***********************************************************************************************************************
     pictures
     *********************************************************************************************************************** */
    function pictures() {

        $(function () {
            'use strict';

            // Initialize the jQuery File Upload widget:
            $('#fileupload').fileupload({
                // Uncomment the following to send cross-domain cookies:
                //xhrFields: {withCredentials: true},
                url: 'server/php/'
            });

            // Enable iframe cross-domain access via redirect option:
            $('#fileupload').fileupload(
                'option',
                'redirect',
                window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                )
            );

            if (window.location.hostname === 'blueimp.github.io') {
                // Demo settings:
                $('#fileupload').fileupload('option', {
                    url: '//jquery-file-upload.appspot.com/',
                    // Enable image resizing, except for Android and Opera,
                    // which actually support image resizing, but fail to
                    // send Blob objects via XHR requests:
                    disableImageResize: /Android(?!.*Chrome)|Opera/
                        .test(window.navigator.userAgent),
                    maxFileSize: 999000,
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
                });
                // Upload server status check for browsers with CORS support:
                if ($.support.cors) {
                    $.ajax({
                        url: '//jquery-file-upload.appspot.com/',
                        type: 'HEAD'
                    }).fail(function () {
                        $('<div class="alert alert-danger"/>')
                            .text('Upload server currently unavailable - ' +
                                new Date())
                            .appendTo('#fileupload');
                    });
                }
            } else {
                // Load existing files:
                $('#fileupload').addClass('fileupload-processing');
                $.ajax({
                    // Uncomment the following to send cross-domain cookies:
                    //xhrFields: {withCredentials: true},
                    url: $('#fileupload').fileupload('option', 'url'),
                    dataType: 'json',
                    context: $('#fileupload')[0]
                }).always(function () {
                    $(this).removeClass('fileupload-processing');
                }).done(function (result) {
                    $(this).fileupload('option', 'done')
                        .call(this, $.Event('done'), {result: result});
                });
            }

        });


    }

    /* ***********************************************************************************************************************
     leave
     *********************************************************************************************************************** */
    function leave() {


    }

    /* ***********************************************************************************************************************
     invade
     *********************************************************************************************************************** */
    function invade() {

    }

    /* ***********************************************************************************************************************
     endOfVisit
     *********************************************************************************************************************** */
    function endOfVisit() {

    }

});

