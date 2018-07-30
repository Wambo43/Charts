$(function () {
    var startDate = new Date();
    var endDate = new Date(1000 * 60 * 60 * 24 + (startDate).valueOf());
    var groups = new vis.DataSet();
    var groups1 = new vis.DataSet();
    groups.add({
        id: 0,
        content: 'SquareShaded',
        options: {
            yAxisOrientation: 'right',
            drawPoints: {
                style: 'square' // square, circle
            },
            shaded: {
                orientation: 'bottom' // top, bottom
            }
        }
    });
    groups.add({
        id: 2,
        content: 'Blank',
        options: { drawPoints: false }
    });

    groups.add({
        id: 3,
        content: 'CircleShaded',
        options: {
            yAxisOrientation: 'right',
            drawPoints: {
                style: 'circle' // square, circle
            },
            shaded: {
                orientation: 'top' // top, bottom
            }
        }
    });

    var items = [
      { x: '2014-06-17', y: 60 },
      { x: '2014-06-18', y: 40 },
      { x: '2014-06-19', y: 55 },
      { x: '2014-06-20', y: 40 },
      { x: '2014-06-21', y: 50 },
      { x: '2014-06-17', y: 30, group: 0 },
      { x: '2014-06-18', y: 10, group: 0 },
      { x: '2014-06-21', y: 20, group: 2 },
      { x: '2014-06-22', y: 60, group: 2 },
      { x: '2014-06-23', y: 10, group: 2 },
      { x: '2014-06-24', y: 25, group: 2 },
      { x: '2014-06-25', y: 30, group: 2 },
      { x: '2014-06-26', y: 20, group: 3 },
      { x: '2014-06-27', y: 60, group: 3 },
      { x: '2014-06-28', y: 10, group: 3 },
      { x: '2014-06-29', y: 25, group: 3 },
      { x: '2014-06-30', y: 30, group: 3 },
      //////////////////////Für die Blaken
    ];
    var dataset = new vis.DataSet(items);

    var options = {
        defaultGroup: 'ungrouped',
        legend: { left: { position: "bottom-left" } },
        start: '2014-06-10',
        end: '2014-07-04',
        height: '300px',
        dataAxis: {
            left: {
                title: {
                    text: "Linke Skalierung"
                },
            },
            right: {
                title: {
                    text: "Rechte Skalierung"
                },
            },
        }
    };
    ////////////////////////////////////Parameter Diagramm  ///////////////////
    var names = ['centripetal', 'chordal', 'uniform', 'disabled'];
    groups1.add({
        id: names[0],
        content: names[0],
        options: {
            drawPoints: false,
            interpolation: {
                parametrization: 'centripetal'
            }
        }
    });

    groups1.add({
        id: names[1],
        content: names[1],
        options: {
            drawPoints: false,
            interpolation: {
                parametrization: 'chordal'
            }
        }
    });

    groups1.add({
        id: names[2],
        content: names[2],
        options: {
            drawPoints: false,
            interpolation: {
                parametrization: 'uniform'
            }
        }
    });

    groups1.add({
        id: names[3],
        content: names[3],
        options: {
            drawPoints: { style: 'circle' },
            interpolation: false
        }
    });
    var dataset1 = new vis.DataSet();
    for (var i = 0; i < names.length; i++) {
        dataset1.add([
            { x: '2014-06-21 08:00:00', y: 0,  group: names[i] },
            { x: '2014-06-21 10:00:00', y: 20, group: names[i] },
            { x: '2014-06-21 12:00:00', y: 10, group: names[i] },
            { x: '2014-06-21 14:00:00', y: 15, group: names[i] },
            { x: '2014-06-21 14:00:00', y: 30, group: names[i] },
            { x: '2014-06-21 18:00:00', y: 10, group: names[i] },
            { x: '2014-06-21 20:00:00', y: 15, group: names[i] },
            { x: '2014-06-21 22:00:00', y: 52, group: names[i] },
            { x: '2014-06-22 00:00:00', y: 10, group: names[i] },
            { x: '2014-06-22 02:00:00', y: 20, group: names[i] }
        ]);
    }
    var options1 = {
        defaultGroup: 'ungrouped',
        legend: { left: { position: "bottom-left" } },
        start: '2014-06-21 04:00:00',
        end: '2014-06-22 04:00:00',
        height: '300px',
        dataAxis: {
            left: {
                title: {
                    text: "Linke Skalierung"
                },
            },
            right: {
                title: {
                    text: "Rechte Skalierung"
                },
            },
        }
    };
    var graph2d = new vis.Graph2d($('#Diagramm')[0], dataset, groups, options);
    var graph2d1 = new vis.Graph2d($('#Diagramm1')[0], dataset1, groups1, options1);



})