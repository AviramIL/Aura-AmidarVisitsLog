//function mapZoom(paramStreet, paramCity) {
//$(document).ready(function () {

    $visitsLogMapView = $('.visitsLogMapView').click(function (e) {

        alert('sdsd');

        $this = $(this);

        mCity = $this.data('city');
        mStreet = $this.data('street');


        event.preventDefault();
        alert(paramStreet, paramCity);

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: zoomNum,
            center: new google.maps.LatLng(32.0105367, 34.7629804),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

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
        return false;
    })

//})