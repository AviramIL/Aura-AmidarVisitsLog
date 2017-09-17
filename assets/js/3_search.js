// todo
function appendPageTitle(param) {
    param.html('<span class="glyphicon glyphicon-search"></span> חיפוש');
};

$(document).ready(function () {
    var $formSearchScreen, $btnCancelSearchScreen, $unit, $branch, $btnSearchSearchDefault, $searchValidationMsg;

    $formSearchScreen = $('#formSearchScreen');
    $unit = $('#unit');
    $branch = $('#branch');
    $coordinator = $('#coordinator');
    $searchValidationMsg = $('#searchValidationMsg');

    $unit.change(function () {
        $branch.attr('disabled', false);
    });

    $branch.change(function () {
        $coordinator.attr('disabled', false);
        $('.branchHelpBlock').html('');
    });


    $btnCancelSearchScreen = $('.btnCancelSearchScreen').click(function () {
        window.location.replace(global.applicationRootURL + "visits-log.html");
    });

    $btnSearchSearchDefault = $('#btnSearchSearchDefault').click(function (e) {

        if (
            $unit.val() != null &&
            $branch.val() != null
        ) {
            console.log($unit.val());
            $searchValidationMsg.html('המערכת טרם מחוברת לשרת, אך הנתונים שנשלחו לחיפוש הם: ' +
                $formSearchScreen.serialize()
            )
        } else {
            $searchValidationMsg.html('יש לבחור מחוז וסניף על מנת לבצע חיפוש');
            e.preventDefault();
        }

    });


});