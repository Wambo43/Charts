$(function () {
    /*////////////////////////////////////////////////////////////////////////////////*/
    var dates = $("#datepickerstart, #datepickerend").datepicker({
        //yearRange: "-3",
        //maxDate: "+1D",

        changeMonth: true,
        changeYear: true,
        numberOfMonths: [1, 2],
        dateFormat: 'dd.mm.yy',
        showButtonPanel: true,

        //showOn: "button",
        //buttonImage: "Content/Images/calendar.gif",
        //buttonImageOnly: true,

        //onSelect: function (selectedDate) {
        //    var option = this.id == "datepickerstart" ? "minDate" : "maxDate";
        //    var curDate = $(this).datepicker("getDate");
        //    dates.not(this).datepicker("option", option, curDate);
        //}
    });

    $("#datepickerstart").val("23.04.2014");
    $("#datepickerend").val("201405-02");
    /*////////////////////////////////////////////////////////////////////////////////*/
})