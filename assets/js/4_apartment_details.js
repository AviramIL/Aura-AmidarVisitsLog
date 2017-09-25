// screen is available only when there's a visitsLog PARAM AT THE URL
function appendPageTitle(navBarTitleParam) {
    var shikun, mivne, knisa, dira, apartmentDetailsParams;

    function appendApartmentDetailsOn(data) {
        $('#spinner').addClass('appHide');
        resultsArray = data.Response.app_getAppartmentFullDetailsElements;

        // Pirtey Zihuy
        $('#apName').val(resultsArray.CICL_SHEM_0);
        $('#apDira').val(resultsArray.DIRAT_AMID_DIRA_0);
        $('#apKnisa').val(resultsArray.DIRAT_AMID_KNISA_0);
        $('#apMivne').val(resultsArray.DIRAT_AMID_MIVNE_0);
        $('#apShikun').val(resultsArray.DIRAT_AMID_SHIKUN_0);
        $('#apSnif').val(resultsArray.DIRAT_AMID_MERCHAV_0);
        $('#apMahoz').val(resultsArray.DIRAT_AMID_MACHOZ_0);
        $('#apYeshuv').val(resultsArray.DIRAT_AMID_DSP_SHEM_MERCHAV_0);
        $('#apStreet').val(resultsArray.CICL_SCR_RECHOV_0);
        $('#apBait').val(resultsArray.CICL_SCR_MIS_BAIT_0);
        $('#apMisparDira').val(resultsArray.DIRAT_AMID_DIRA_0);
        $('#apMikud').val(resultsArray.CICL_SCR_MIKUD_0);
        $('#apMazavIchlus').val(resultsArray.CICL_MATZAV_DIRA_0);
        $('#taarichIchlus').val(resultsArray.CICL_SCR_TAR_TCHILAT_MATZAV_0);
        $('#misparHadarim').val(resultsArray.CICL_SCR_MIS_CHADARIM_0);
        $('#apShetach').val(resultsArray.CICL_SCR_SHETACH_0);
        $('#misparNefashot').val(resultsArray.CICL1_SCR_MIS_NEFASHOT_0);
        $('#apMisparYeladim21').val(resultsArray.CICL1_SCR_MIS_YELADIM_AD21_0);

        // Mazav Cheshbon
        $('#apMisparCheshbon').val(resultsArray.CICL_SCR_MISPAR_CHESHBON_0);
        $('#apScharDiraNeto').val( '-' ); // todo
        $('#apBruto').val(resultsArray.SCHAD_BRUTO_SCHAD_BRUTO_0);
        $('#apSugHanachaRashi').val(resultsArray.SCHAD_BRUTO_SUG_HANACHA_RASHI_0);
        $('#apTaarichSiyum').val(resultsArray.SCHAD_BRUTO_TAARICH_TOKEF_0);
        $('#apEmzaiGvia').val(resultsArray.CICL1_SCR_KOD_EMTZAYI_GVIYA_0 + '-' + resultsArray.CICL1_SCR_TEUR_EMTZAYI_GVIYA_0);
        $('#apSachHov').val(resultsArray.SCHAD_BRUTO_SCR_TOTAL_HOV_MUKPE_0);
        $('#apItratHovBeesder').val(resultsArray.CHESHBONOT_SCR_CHOV_HESDER_0);
        $('#apSugScharDira').val( resultsArray.SCHAD_BRUTO_SUG_SCHAR_DIRA_0 + '-' + resultsArray.SCHAD_BRUTO_DSP_TEUR_SCHAR_DIRA_0 );
        $('#apHovBetvia').val('-'); // todo
    }

    shikun = getUrlParameter('CICL_SCR_SHIKUN_0');
    mivne = getUrlParameter('CICL_SCR_MIVNE_0');
    knisa = getUrlParameter('CICL_SCR_KNISA_0');
    dira = getUrlParameter('CICL_SCR_DIRA_0');

    apartmentDetailsParams = '?CICL_SCR_SHIKUN_0=' + shikun + '&CICL_SCR_MIVNE_0=' + mivne + '&CICL_SCR_KNISA_0=' + knisa + '&CICL_SCR_DIRA_0=' + dira;
    ajaxReq('app_getAppartmentFullDetails', 'GET', appendApartmentDetailsOn, apartmentDetailsParams);

    /*
    todo
	if (
        global.currentVisitsLog === ''
        ||
        typeof(global.currentVisitsLog) === 'undefined'
    ) {
        $('.main-content-inner').html('<div class="jumbotron"><h2 class="text-center">יש להגיע מ<a href="https://webops.co.il/amidar/visits-log.html">מסך יומן ביקורים </a> על מנת לבצע פעולות במסך זה</h2></div>')
    } else {
        navBarTitleParam.html('<span class="glyphicon glyphicon-info-sign"></span>פרטי דירה, <small>ביקור מספר<strong> ' + global.currentVisitsLog + '</strong></small>')
    }
    */

    $apPirteyZihuiForm = $('#apPirteyZihuiForm');
    $apStreet = $('#apStreet');
    $apMisparDira = $('#apMisparDira');
    $apRakazConfirm = $('#apRakazConfirm');
    $apUpdate = $('#apUpdate');
    $apMsg = $('#apMsg');
    apInValidationText = 'ודא כי הרחוב ומספר הדירה מכילים ערכים תקינים, וכן כי בדקת את הדירה ואישרת את הנתונים';

    $apUpdate.click(function (e) {
        if (
            $apStreet.val().length > 2 &&
            $apMisparDira.val().length !== '' &&
            $apRakazConfirm.is(':checked')
        ) {
            $apMsg.text('');
            ajaxReq('undefined.json', 'POST', false, $apPirteyZihuiForm.serialize());
            $apRakazConfirm.prop('checked', false);
        } else {
            $apMsg.text(apInValidationText);
            e.preventDefault();
        }
    });

    // collapse the above panels
    $panelCollapseDefault = $('.panelCollapseDefault');
    $btnCollapseApActions = $('.btnCollapseApActions').click(function () {
        $panelCollapseDefault.collapse('hide');
    });

    // hide the other sub panels
    var $apCollapseParts, $apCancelAction, $actionCollapse;
    $actionCollapse = $('.actionCollapse');
    $apCollapseParts = $('#apCollapseParts').on('show.bs.collapse', '.collapse', function () {

        $apCollapseParts.find('.collapse.in').collapse('hide');

        $apCancelAction = $('.apCancelAction').click(function(){
            // collapse the current panel when hitting cancel
            $actionCollapse.removeClass('in');
        });

    });

    $('#visitDate').datepicker().datepicker("setDate", new Date());

    var times = new Date();
    $('#visitHour').timepicker({
        defaultValue: times.getHours() + ':' + times.getMinutes(),
        controlType: 'select',
        afterInject: initTime()
    });

    function initTime() {
        $('#visitHour').val(times.getHours() + ':' + times.getMinutes());
    }


    $('#translator').change(function () {
        if ($("#translator option:selected").val() == 1) {
            $('.translator-data').attr('disabled', false);
        } else {
            $('.translator-data').val('').attr('disabled', true);
        }
    });

    /* ***********************************************************************************************************************
     apPartAchzaka
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

        $('#visitDate').datepicker().datepicker("setDate", new Date());

        var times = new Date();
        $('#visitHour').timepicker({
            defaultValue: times.getHours() + ':' + times.getMinutes(),
            controlType: 'select',
            afterInject: initTime()
        });

        function initTime() {
            $('#visitHour').val(times.getHours() + ':' + times.getMinutes());
        };


        $('#translator').change(function () {
            if ($("#translator option:selected").val() == 1) {
                $('.translator-data').attr('disabled', false);
            } else {
                $('.translator-data').val('').attr('disabled', true);
            }
        });

        var xLoc;


        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                alert('דפדפן לא תומך בנתוני מיקום או שהמשתמש לא אפשר בדיקה זו')
            }
        }

        getLocation();

        var xLocLon, xLocLad;

        function showPosition(position) {
            xLocLon = position.coords.latitude;
            xLocLad = position.coords.longitude;
            getG();
        }

        function getG() {
            url = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDgjenjZ9IFQ4OWHtfKhSzR6yEm47EOvKg&latlng=' + xLocLon + ',' + xLocLad + '&sensor=true';
            e1 = $.getJSON(url, function () {
            }).done(function () {
                e2 = e1.responseJSON.results[0].formatted_address;
                $('#cuLoc').html('מיקום נוכחי: ' + e2);
            }).fail(function (jqxhr, textStatus, error) {
                alert('שגיאה: ' + error + '-' + textStatus + '-' + jqxhr)
            }).always(function () {
            });
        }

    }

};