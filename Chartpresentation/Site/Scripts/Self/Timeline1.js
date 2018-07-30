$(function () {
    $('#Timeline').hide();
    var groups = new vis.DataSet();
    var Klassen = 1;
    var items = new vis.DataSet()
    var edit = true
    var options = {
        locale: 'de',
        groupOrder: function (a, b) {
            return a.value - b.value;
        },
        //groupOrderSwap: function (a, b, groups) {
        //    var v = a.value;
        //    a.value = b.value;
        //    b.value = v;
        //},
        snap: function (date, scale, step) {
            var hour = 5 * 60 * 1000;
            return Math.round(date / hour) * hour;
        },
        format:{
            minorLabels: {
                minute:     'HH:mm',
                hour:       'HH:mm',
            },
            majorLabels: {

                minute:     'ddd',
                hour:       'dddd',
            }
        },
        margin: {
            item: 0,
            axis: 0,   // minimal margin between items and the axis
        },
        editable: true,
        //groupEditable: true,
        zoomMin: 1000*60*60*5,
        start:  new Date(2015, 8, 7, 8, 0, 0),
        end:    new Date(2015, 8, 12, 16, 0, 0),
        min:    new Date(2015, 8, 7, 8, 0, 0),
        max:    new Date(2015, 8, 12, 16, 0, 0),
        hiddenDates: [
            { start: '2013-03-29 16:00:00', end: '2013-03-30 08:00:00', repeat: 'daily' }
        ],
    };

    var timeline = new vis.Timeline($('#Timeline')[0]);
    timeline.setOptions(options);
    timeline.setGroups(groups);
    timeline.setItems(items);
    $('#addKlasse').click(function () {
        $('#Timeline').show();
        if (edit == true) {
            groups.add({
                id: 'Klasse' + Klassen,
                content:  Klassen + '.Klasse',
                title: Klassen + '.Klasse',
            });
            timeline.setGroups(groups);
            timeline.setItems(pausen('Klasse' + Klassen, items));
            Klassen++
        }
    });
    $('#addFach').click(function () {
 	if (edit != true)
		return
        var Fachname = $("#Fach").val();
        var Lehrkraft = $('#Lehrkraft').val();
        items.add({
            start: '2015-9-8 08:00:00',
            end: '2015-9-8 08:45:00',
            content: Fachname + ' <br> Lehrkraft: ' + Lehrkraft ,
            group: timeline.groupsData._data.Klasse1.id,
            className: Fachname,
        })
        timeline.setItems(items);
    });
    $('#btnEditable').click(function () {
        edit = !edit
        timeline.setOptions({ editable: edit })
    });
});
function pausen(klasse,items) {
    for (var day = 7; day < 15; day++) {
        items.add([
            {
                start: '2015-9-'+day+' 08:45:00',
                end: '2015-9-' + day + ' 08:50:00',
                type: 'background',
                group: klasse,
                className: 'pausen',
            },
            {
                start: '2015-9-' + day + ' 09:35:00',
                end: '2015-9-' + day + ' 09:50:00',
                type: 'background',
                group: klasse,
                className: 'pausen',
            },
            {
                start: '2015-9-' + day + ' 10:35:00',
                end: '2015-9-' + day + ' 10:40:00',
                type: 'background',
                group: klasse,
                className: 'pausen',
            },
            {
                start: '2015-9-' + day + ' 11:25:00',
                end: '2015-9-' + day + ' 11:30:00',
                type: 'background',
                group: klasse,
                className: 'pausen',
            },
            {
                start: '2015-9-' + day + ' 12:15:00',
                end: '2015-9-' + day + ' 12:30:00',
                type: 'background',
                group: klasse,
                className: 'pausen',
            },
            {
                start: '2015-9-' + day + ' 13:15:00',
                end: '2015-9-' + day + ' 13:20:00',
                type: 'background',
                group: klasse,
                className: 'pausen',
            },
            {
                start: '2015-9-' + day + ' 14:05:00',
                end: '2015-9-' + day + ' 14:10:00',
                type: 'background',
                group: klasse,
                className: 'pausen',
            },
            {
                start: '2015-9-' + day + ' 14:55:00',
                end: '2015-9-' + day + ' 15:00:00',
                type: 'background',
                group: klasse,
                className: 'pausen',
            },
        ]);
    }
   return items;
}

