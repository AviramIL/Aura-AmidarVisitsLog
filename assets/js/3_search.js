// todo
function appendPageTitle(param) {
    param.html('<span class="glyphicon glyphicon-search"></span> חיפוש');
};

$(document).ready(function () {
    var $formSearchScreen, $seBtnCancel, $V_YOMAN_BIKUR_MACHOZ_0, $V_YOMAN_BIKUR_MERCHAV_0, $seBtnSearch,
        $searchValidationMsg;

    $formSearchScreen = $('#formSearchScreen');
    $V_YOMAN_BIKUR_MACHOZ_0 = $('#V_YOMAN_BIKUR_MACHOZ_0');
    $V_YOMAN_BIKUR_MERCHAV_0 = $('#V_YOMAN_BIKUR_MERCHAV_0');
    $V_YOMAN_BIKUR_SHEM_RAKAZ_0 = $('#V_YOMAN_BIKUR_SHEM_RAKAZ_0');
    $searchValidationMsg = $('#searchValidationMsg');

    // append options- mahuz
    var mahuzArr = JSON.parse(localStorage.getItem("LC_MachozList_LOV_ARR"));
    var mahuzArrLen = mahuzArr.length;
    $V_YOMAN_BIKUR_MACHOZ_0.append('<option value="999" selected disabled>בחור מחוז מהרשימה</option>');
    for (i = 0; i < mahuzArrLen; i++) {
        $V_YOMAN_BIKUR_MACHOZ_0.append('<option value="' + mahuzArr[i][0] + '">' + mahuzArr[i][1] + '</option>');
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
    general
    ************************************************************************************ */
    // cancel search
    $seBtnCancel = $('.seBtnCancel').click(function () {
        window.location.replace("visits-log.html");
    });

    // search
    $seBtnSearch = $('#seBtnSearch').click(function (e) {
        if ($V_YOMAN_BIKUR_MACHOZ_0.val() != '999' && $V_YOMAN_BIKUR_MACHOZ_0.val() != null && $V_YOMAN_BIKUR_MERCHAV_0.val() != '999' && $V_YOMAN_BIKUR_MERCHAV_0.val() != null) {
            ajaxReq('app_getVisitorsLogNew_List', 'GET', appendResults, '?' + $formSearchScreen.serialize());
        } else {
            $searchValidationMsg.html('יש לבחור מחוז וסניף על מנת לבצע חיפוש');
            e.preventDefault();
        }
    });

    function appendResults(data) {
        var $tbodyse, $seRersultsVisit, i, r, j, resultsArray, resultsLength,
            $VisitsLogSE, sVisitID, $VisitsLogSECount;
        $tbodyse = $('#tbodyse');
        $VisitsLogSECount = $('#VisitsLogSECount');
        r = new Array();
        j = -1;
        resultsArray = data.Response.app_getVisitorsLogNew_ListTableArray.app_getVisitorsLogNew_ListArrayItem;
        resultsLength = resultsArray.length;
        $VisitsLogSECount.html(resultsLength + ' ביקורים נמצאו');

        for (i = 0; i < resultsLength; i++) {
            r[++j] = '<tr class="VisitsLogSE" data-shikun="' + resultsArray[i].V_YOMAN_BIKUR_SHIKUN_0 + '" data-mivne="' + resultsArray[i].V_YOMAN_BIKUR_MIVNE_0 + '" data-knisa="' + resultsArray[i].V_YOMAN_BIKUR_KNISA_0 + '" data-dira="' + resultsArray[i].V_YOMAN_BIKUR_DIRA_0 + '" title="צפיה בפרטי דירה">';
            r[++j] = '<td>';
            r[++j] = resultsArray[i].V_YOMAN_BIKUR_SHIKUN_0;
            r[++j] = '</td>';
            r[++j] = '<td>';
            r[++j] = resultsArray[i].V_YOMAN_BIKUR_MIVNE_0;
            r[++j] = '</td>';
            r[++j] = '<td>';
            r[++j] = resultsArray[i].V_YOMAN_BIKUR_KNISA_0;
            r[++j] = '</td>';
            r[++j] = '<td>';
            r[++j] = resultsArray[i].V_YOMAN_BIKUR_DIRA_0;
            r[++j] = '</td>';
            r[++j] = '<td>';
            r[++j] = resultsArray[i].V_YOMAN_BIKUR_SHEM_ISHUV_0;
            r[++j] = '</td>';
            r[++j] = '<td>';
            r[++j] = resultsArray[i].V_YOMAN_BIKUR_SHEM_RECHOV_0;
            r[++j] = '</td>';
            r[++j] = '<td>';
            r[++j] = resultsArray[i].V_YOMAN_BIKUR_MIS_BAIT_0;
            r[++j] = '</td>';
            r[++j] = '<td>';
            r[++j] = resultsArray[i].V_YOMAN_BIKUR_SHEM_0;
            r[++j] = '</td>';
            r[++j] = '<td>';
            r[++j] = resultsArray[i].V_YOMAN_BIKUR_SHAAT_BIKUR_0;
            r[++j] = '</td>';
            r[++j] = '<td>';
            //r[++j] = 'יש להוסיף לטופס';
            r[++j] = '';
            r[++j] = '</td>';
            r[++j] = '</tr>';
        }
        $tbodyse.html(r.join(''));

        // go to search screen, PARAMS: shikun mivne knisa dira
        $VisitsLogSE = $('.VisitsLogSE').click(function () {
            var $this,
                shikun, mivne, knisa, dira;

            $this = $(this);

            shikun = $this.data('shikun');
            mivne = $this.data('mivne');
            knisa = $this.data('knisa');
            dira = $this.data('dira');

            window.location.replace('apartment-details.html' + '?' + 'CICL_SCR_SHIKUN_0=' + shikun + '&' + 'CICL_SCR_MIVNE_0=' + mivne + '&' + 'CICL_SCR_KNISA_0=' + knisa + '&' + 'CICL_SCR_DIRA_0=' + dira);
        });
    }


});