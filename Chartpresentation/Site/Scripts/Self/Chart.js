$(function () {
    var groups = new vis.DataSet();
    groups.add({
        id: 'Balken0', content: "Balken0",
        options: {
            style: 'bar'
        }
    })
    groups.add({
        id: 'Balken1', content: "Balken1",
        options: {
            style: 'bar'
        }
    })
    groups.add({
        id: 'Balken2', content: "Balken2",
        options: {
            style: 'bar'
        }
    })
    var items = [{ x: '2014-06-11', y: 10, group: 'Balken0' },
    { x: '2014-06-12', y: 25, group: 'Balken0' },
    { x: '2014-06-13', y: 30, group: 'Balken0' },
    { x: '2014-06-14', y: 10, group: 'Balken0' },
    { x: '2014-06-15', y: 15, group: 'Balken0' },
    { x: '2014-06-16', y: 30, group: 'Balken0' },
    { x: '2014-06-11', y: 12, group: 'Balken1' },
    { x: '2014-06-12', y: 15, group: 'Balken1' },
    { x: '2014-06-13', y: 34, group: 'Balken1' },
    { x: '2014-06-14', y: 24, group: 'Balken1' },
    { x: '2014-06-15', y: 5, group: 'Balken1' },
    { x: '2014-06-16', y: 12, group: 'Balken1' },
    { x: '2014-06-11', y: 22, group: 'Balken2' },
    { x: '2014-06-12', y: 14, group: 'Balken2' },
    { x: '2014-06-13', y: 24, group: 'Balken2' },
    { x: '2014-06-14', y: 21, group: 'Balken2' },
    { x: '2014-06-15', y: 30, group: 'Balken2' },
    { x: '2014-06-16', y: 18, group: 'Balken2' }
    ];
    var dataset = new vis.DataSet(items);
    var options = {
        orientation: 'bottom',
        defaultGroup: 'ungrouped',
        legend: true,
        start: '2014-06-10',
        end: '2014-06-18',
        height: '300px',
        dataAxis: {
            left: {
                title: {
                    text: "Linke Skalierung"
                },
            },
        }
    };

    var graph2d = new vis.Graph2d($('#Diagramm')[0], dataset, groups, options);
    $("#dropdownID").change(function () {
        var options = { stack: this.value === 'stack', barChart: { sideBySide: this.value === 'sideBySide' } };
        graph2d.setOptions(options);
    })
    $('#axis-orientation').change( function () {
        graph2d.setOptions({ orientation: { axis: this.value } });
    });
})