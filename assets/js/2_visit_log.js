/*
?B1_USER_SCR_0=1001&B1_ZEHUT_0=1001&B1_SVIVAT_AVODA_0=1&V_YOMAN_BIKUR_TARICH_BIKUR_0=10092017&V_YOMAN_BIKUR_MACHOZ_0=5&V_YOMAN_BIKUR_MERCHAV_0=64&V_YOMAN_BIKUR_KOD_RAKAZ_0=046
 */

// todo
function appendPageTitle(param) {
    param.html('<span class="glyphicon glyphicon-briefcase"></span> יומן ביקורים');
}

$(document).ready(function () {

        var $divVisitLogBox, $divMapBox, $btnToggleMap, $spanViewMapText;

        ajaxReq('visit-log.json', 'GET', appendAllCustomers, '');

        locations = [];

        function appendLocation(name, paramCity, paramStreet, taskId) {
            var geoLocation = [];

            geoLocation.push(name);
            geoLocation.push(paramCity);
            geoLocation.push(paramStreet);
            geoLocation.push(taskId);

            locations.push(geoLocation);
        }

        function initGoogleMaps(zoomNum, visitID, showHide) {
            var singleLat, singleLan;
            if (locations[0] != undefined) {

                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: zoomNum,
                    center: new google.maps.LatLng(32.0105367, 34.7629804),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                var infowindow = new google.maps.InfoWindow();
                var marker, i, markerImg;
                var mCountry, mCity, mStreet, mStreetNumber, newLat, newLng;
                mCountry = 'ישראל';
                mStreetNumber = 1;
                pointerTitle = 'מיקום המבנה';

                for (i = 0; i < locations.length; i++) {
                    mCity = locations[i][1];
                    mStreet = locations[i][2];
                    $.ajax({
                        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + mStreet + '+' + mStreetNumber + '+' + mCity + ',+' + mCountry + '&key=AIzaSyDgjenjZ9IFQ4OWHtfKhSzR6yEm47EOvKg',
                        type: 'GET',
                        async: true,
                        success: function (data) {
                            newLat = data.results[0].geometry.location.lat;
                            newLng = data.results[0].geometry.location.lng;
                            marker = new google.maps.Marker({
                                position: new google.maps.LatLng(newLat, newLng),
                                map: map,
                                icon: 'assets/img/map/' + 'mapRED' + '.png',
                                animation: google.maps.Animation.DROP,
                                title: pointerTitle
                            });
                            $divVisitLogBox = $('#divVisitLogBox');
                            $divMapBox = $('#divMapBox');
                            if (showHide == 'hide') {
                                $divVisitLogBox.removeClass('col-xs-9').addClass('col-xs-12');
                                $divMapBox.removeClass('col-xs-3').addClass('col-xs-0');
                            }
                        },
                        error: function () {
                            alert('error while getting lat lang from Google!');
                        }
                    });
                }
            } else {
                //todo
                //alert('undefined');
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: zoomNum,
                    center: new google.maps.LatLng(32.0888, 34.8863),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                var infowindow = new google.maps.InfoWindow();
            }
        }

        function appendAllCustomers(data) {
            var $tbodyVisitsLog, $visitsLogCount, i, r, j, resultsArray, resultsLength, $btnCustomerDetails,
                $VisitsLog, $visitsLogMapView, sVisitID;
            $tbodyVisitsLog = $('#tbodyVisitsLog');
            $visitsLogCount = $('#visitsLogCount');
            r = new Array();
            j = -1;
            resultsArray = data.Response.app_getVisitsLogTableArray.app_getVisitsLogArrayItem;
            resultsLength = resultsArray.length;
            $visitsLogCount.html(resultsLength + ' ביקורים נמצאו');

            for (i = 0; i < resultsLength; i++) {
                // todo: determine what's the right visit log
                sVisitID = resultsArray[i].V_YOMAN_BIKUR_SHIKUN_0 + '-' + resultsArray[i].V_YOMAN_BIKUR_MIVNE_0;
                r[++j] = '<tr class="visitsLog" data-visitslog="' + sVisitID + '" title="צפיה בפרטי דירה">';
                r[++j] = '<th scope="row">';
                r[++j] = '<a class="visitsLogMapView" role="button" data-street="' + resultsArray[i].V_YOMAN_BIKUR_SHEM_RECHOV_0 + '" data-city="' + resultsArray[i].V_YOMAN_BIKUR_SHEM_ISHUV_0 + '">';
                r[++j] = '<img src="assets/img/icon.png"/>';
                r[++j] = '</a>';
                r[++j] = '<a class="visitWaze" data-wazeaddress="waze://?q=' + resultsArray[i].V_YOMAN_BIKUR_SHEM_RECHOV_0 + ' ' + resultsArray[i].V_YOMAN_BIKUR_MIS_BAIT_0 + ', ' + resultsArray[i].V_YOMAN_BIKUR_SHEM_ISHUV_0 + ', ' + 'ישראל' + '" target="_blank"><img src="assets/img/navigation-arrow.png" alt="navigate"/></a>';
                r[++j] = '</a>';
                r[++j] = '</th>';
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
                r[++j] = resultsArray[i].V_YOMAN_BIKUR_SHEM_0;
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
                r[++j] = resultsArray[i].V_YOMAN_BIKUR_SHAAT_BIKUR_0;
                r[++j] = '</td>';
                r[++j] = '<td class="bg-danger">';
                r[++j] = 'יש להוסיף לטופס';
                r[++j] = '</td>';
                r[++j] = '</tr>';
                appendLocation(
                    resultsArray[i].V_YOMAN_BIKUR_SHEM_RECHOV_0,
                    resultsArray[i].V_YOMAN_BIKUR_SHEM_ISHUV_0,
                    resultsArray[i].V_YOMAN_BIKUR_SHEM_RECHOV_0,
                    sVisitID
                );
                // (name, paramCity, paramStreet, taskId)
                // todo: set the zoom option for viewing all the tasks & and get focused on the first task (i=0)
                initGoogleMaps(14, 0, 'hide');
            }
            $tbodyVisitsLog.html(r.join(''));

            visitWaze = $('.visitWaze').click(function () {
                var wazeAddress, $this;
                $this = $(this);
                wazeAddress = $this.data('wazeaddress');
                window.open(wazeAddress);
                return false;
            });

            // go to search screen
            $VisitsLog = $('.visitsLog').click(function () {
                var visitsLog, $this;
                $this = $(this);
                visitsLog = $this.data('visitslog');
                window.location.replace(global.applicationRootURL + "apartment-details.html" + "?" + "visitsLog=" + visitsLog);
            });


            $visitsLogMapView = $('.visitsLogMapView').click(function (e) {
                $this = $(this);
                mCity = $this.data('city');
                mStreet = $this.data('street');
                var marker, i, markerImg;
                var mCountry, mCity, mStreet, mStreetNumber, newLat, newLng;
                mCountry = 'ישראל';
                mStreetNumber = 1;
                pointerTitle = 'מיקום המבנה';

                $.ajax({
                    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + mStreet + '+' + mStreetNumber + '+' + mCity + ',+' + mCountry + '&key=AIzaSyDgjenjZ9IFQ4OWHtfKhSzR6yEm47EOvKg',
                    type: 'GET',
                    async: true,
                    success: function (data) {
                        newLat = data.results[0].geometry.location.lat;
                        newLng = data.results[0].geometry.location.lng;

                        var map = new google.maps.Map(document.getElementById('map'), {
                            zoom: 17,
                            //center: new google.maps.LatLng(32.0105367, 34.7629804),
                            center: new google.maps.LatLng(newLat, newLng),
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        });

                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(newLat, newLng),
                            map: map,
                            icon: 'assets/img/map/' + 'mapRED' + '.png',
                            animation: google.maps.Animation.DROP,
                            title: pointerTitle
                        });
                        $divVisitLogBox = $('#divVisitLogBox');
                        $divMapBox = $('#divMapBox');

                        $divVisitLogBox.removeClass('col-xs-12').addClass('col-xs-9');
                        $divMapBox.removeClass('col-xs-0').addClass('col-xs-3');

                    },
                    error: function () {
                        // todo
                        alert('error while getting lat lang from Google!');
                    }
                });
                return false;
            })
        }

        var $btnVisitLogActions;
        $btnVisitLogActions = $('.btnVisitLogActions').click(function () {
            var visitLogAction, $this;
            $this = $(this);
            visitLogAction = $this.data('action');
            if (visitLogAction == 'search') {
                window.location.replace(global.applicationRootURL + "search.html");
            }
        });

        $divVisitLogBox = $('#divVisitLogBox');
        $divMapBox = $('#divMapBox');
        $spanViewMapText = $('#spanViewMapText');

        $btnToggleMap = $('#btnToggleMap').click(function () {
            if ($divVisitLogBox.hasClass('col-xs-12')) {
                // hide map
                $spanViewMapText.html('הסתר מפה')
                $divVisitLogBox.addClass('col-xs-9').removeClass('col-xs-12');
                $divMapBox.addClass('col-xs-3').removeClass('col-xs-0');
            } else {
                // show map
                $spanViewMapText.html('הצג מפה')
                $divVisitLogBox.removeClass('col-xs-9').addClass('col-xs-12');
                $divMapBox.removeClass('col-xs-3').addClass('col-xs-0');
            }
        });

    }
);