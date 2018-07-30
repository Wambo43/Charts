var FirmID = 6012;
var Timespan = 1000 * 60 * 60 * 24;
var Driver = {
    "css": [
        { "DriverC": "", "Color": "Driver1" },
        { "DriverC": "", "Color": "Driver2" },
        { "DriverC": "", "Color": "Driver3" },
        { "DriverC": "", "Color": "Driver4" },
        { "DriverC": "", "Color": "Driver5" },
        { "DriverC": "", "Color": "Driver6" },
    ]
};
var Drivers = [
    { "Driver": "Hans Müller", "DriverC": "1a" },
    { "Driver": "Hans Paul", "DriverC": "2b" },
    { "Driver": "Itza ma Uebel", "DriverC": "1b" },
];
var Activitys = ["Availability", "Work", "Driving", "BreakRest"];
var FMSName = ['EngineSpeed', 'BrakeSwitch', 'Speed', 'AcceleratorPedalPosition', 'FuelLevel']
var DiagrammCount= 4
$(function () {
    $("#Div_Diagramm").hide();
    var name = "#Legend";
    var menuYloc = parseInt($(name).css("top").substring(0, $(name).css("top").indexOf("px")));
    $(window).scroll(function () {
        offset = menuYloc + $(document).scrollTop() + "px";
        $(name).animate({ top: offset }, { duration: 50, queue: true });
    });
    $("#datepickerstart").val("2014-06-24");
    var zoomMin = 1000 * 60 * 30;
    var zoomMax = 1000 * 60 * 60 * 12;
    var DiagrammOptions = [];
    var DiagrammHeight = '150px';
    DiagrammOptions.push( {
        height: DiagrammHeight,
        legend: false,
        start: '2014-04-17',
        end: '2014-04-18',
        showMajorLabels: false,
        showMinorLabels: false,
        dataAxis: {
            left: {
                range: { min: 0, max: 100 },
                title: {
                    text: "in Prozent"
                },
            },
        },
        zoomMin: zoomMin,
        zoomMax: zoomMax,
    });
    DiagrammOptions.push( {
        height: DiagrammHeight,
        legend: false,
        start: '2014-04-17',
        end: '2014-04-18',
        showMajorLabels: false,
        showMinorLabels: false,
        dataAxis: {
            left: {
                range: { min: 0, },
                title: {
                    text: "Drehzahl in U/min",
                },
            },
        },
        zoomMin: zoomMin,
        zoomMax: zoomMax,
    });
    DiagrammOptions.push({
        height: DiagrammHeight,
        legend: false,
        start: '2014-04-17',
        end: '2014-04-18',
        showMajorLabels: false,
        showMinorLabels: false,
        dataAxis: {
            left: {
                
                range: {
                    min: 0,
                    max: 100,
                },
                title: {
                    text: "Geschwindigkeit in km/h",
                },
            },
        },
        zoomMin: zoomMin,
        zoomMax: zoomMax,
    });
    var TimelineOptions = {
        stack: false,
        start: "2014-04-17",
        end: '2014-04-18',
        zoomMin: zoomMin,
        zoomMax: zoomMax,
    };
    var Timelinegroups = new vis.DataSet([
        { id: 0, content: 'Activity', title: ' Activity' }
    ]);

    DiTel.init('#Div_Diagramm', DiagrammOptions, TimelineOptions, Timelinegroups);
    DiTel.setGoupeTimeline({ id: 1, content: 'Driver', title: ' Driver' });
    $("#DivCheckDiagramm").hide();
    $("#selectBUID").change(function () {
        if (this.value == -1)
            return;
        var DatepickerTime = $("#datepickerstart").datepicker("getDate");
        DiTel.TimeDomain.StartTimeDomain = DatepickerTime;
        DiTel.TimeDomain.EndTimeDomain = (new Date(1000 * 60 * 60 * 24 + (DatepickerTime).valueOf()));
        DiTel.LoadTimeDomain.StartTime = DiTel.TimeDomain.StartTimeDomain;
        DiTel.LoadTimeDomain.EndTime = DiTel.TimeDomain.EndTimeDomain;
        buildNewDia(TimelineOptions, DiagrammOptions, this.value, DiTel.LoadTimeDomain);

    });
})
function buildNewDia(TimelineOptions, DiagrammOptions, BUID, TimeZone) {
    DiTel.destroyDiTel();

    var Timelinegroups = new vis.DataSet([
          { id: 0, content: 'Fahrzeug', title: ' Fahrzeug' }
    ]);
    DiTel.init('#Div_Diagramm', DiagrammOptions, TimelineOptions, Timelinegroups);
    // Start Datum des Diagramms und der Timeline anpassen
    for (var idx = 0; idx < DiTel.Diagramms.length; idx++)
        DiTel.Diagramms[idx].Diagramm.setOptions({ start: TimeZone.StartTime.toString(), end: TimeZone.EndTime.toString() });
    DiTel.Timeline.setOptions({ start: TimeZone.StartTime.toString(), end: TimeZone.EndTime.toString() });
    DiTel.LoadTimeDomain.StartTime = TimeZone.StartTime;
    DiTel.LoadTimeDomain.EndTime = TimeZone.EndTime;
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //Diagramm Datenladen
    addDataDiagramm(BUID);
    // wenn sich rand von timeline verändert dann lade Daten
    $('#Div_Diagramm').mouseup(function () {
        calcutlteTimeDomain(DiTel.Timeline.range.getRange(), BUID)
    });
}
function calcutlteTimeDomain(range, BUID) {
    if (range.end >= DiTel.TimeDomain.EndTimeDomain) {
        //nach rechts
        DiTel.LoadTimeDomain.StartTime = DiTel.TimeDomain.EndTimeDomain;
        DiTel.LoadTimeDomain.EndTime = new Date(DiTel.TimeDomain.EndTimeDomain.getTime() + Timespan);
        DiTel.TimeDomain.EndTimeDomain = DiTel.LoadTimeDomain.EndTime;
        loadDiaData(BUID);
    }
    else if (range.start <= DiTel.TimeDomain.StartTimeDomain) {
        //nach links
        DiTel.LoadTimeDomain.EndTime = DiTel.TimeDomain.StartTimeDomain;
        DiTel.LoadTimeDomain.StartTime = new Date(DiTel.TimeDomain.StartTimeDomain.getTime() - (Timespan));
        DiTel.TimeDomain.StartTimeDomain = DiTel.LoadTimeDomain.StartTime;
        loadDiaData(BUID);
    }
}

// Diagramm Daten laden beim erstellen des Diagramms
function addDataDiagramm(Buid) {    
    var VehicleFMSInfo = {
        FirmID: FirmID,
        BUID: Buid,
        Start: DiTel.LoadTimeDomain.StartTime,
        End: DiTel.LoadTimeDomain.EndTime,
    };
    $("#Div_Diagramm").show();
    //GROUP setzen in die Diagramme
    setDiagrammGroups();
    setDiagrammItems(VehicleFMSInfo);

    //Legende bauen;
    DiTel.populateExternalLegend();

//  //Timeline Daten laden
  addDataTimeline(Buid);

}
//function zum nachladen von Daten für den Graphen
function loadDiaData(BUID) {
    if ($("#Diagramm").css("display") == 'none') {

    } else {
        setDiagrammItems({
            FirmID: FirmID,
            BUID: BUID,
            Start: DiTel.LoadTimeDomain.StartTime,
            End: DiTel.LoadTimeDomain.EndTime,
        });
    }
    //Timeline Daten laden
    addDataTimeline(BUID);
}
//Timline Daten laden
function addDataTimeline(BUID) {
    DiTel.setItemTimline(convertDataForTimelineAktivity({
        FirmID: FirmID,
        BUID: BUID,
        Start: DiTel.LoadTimeDomain.StartTime,
        End: DiTel.LoadTimeDomain.EndTime,
    }, DiTel.Timeline.components[3].groupIds[0]));

}
function setDiagrammGroups()
{
    var Groups = convertDiagrammGoupe();
    DiTel.Diagramms[2].groups.add(Groups[2]); // Speed
    DiTel.Diagramms[0].groups.add(Groups[1]); // BrakeSwitch
    DiTel.Diagramms[1].groups.add(Groups[0]); // EngineSpeed
    DiTel.Diagramms[0].groups.add(Groups[3]); // AcceleratorPedalPosition
    DiTel.Diagramms[0].groups.add(Groups[4]); // FuelLevel
    for (var i = 0 ; i < DiTel.Diagramms.length ; i++) 
        DiTel.Diagramms[i].Diagramm.setGroups(DiTel.Diagramms[i].groups);
}
//Diagrammitems setzen
function setDiagrammItems(DiagrammData)
{
    var data = getVehicleFMS(DiagrammData);
    DiTel.Diagramms[2].items.add(data[2]);
    DiTel.Diagramms[0].items.add(data[1]);
    DiTel.Diagramms[1].items.add(data[0]);
    DiTel.Diagramms[0].items.add(data[3]);
    DiTel.Diagramms[0].items.add(data[4]);
    for (var i = 0 ; i < DiTel.Diagramms.length ; i++) 
        DiTel.Diagramms[i].Diagramm.setItems(DiTel.Diagramms[i].items);
}
// Diagrammgroup setzen; nur aufrufen wenn das Diagramm initialisiert wird
function convertDiagrammGoupe() {
    var groups = []
    for (var idx = 0 ; idx < FMSName.length; idx++) {
        groups.push({
            id: FMSName[idx],
            content: FMSName[idx],
            className: FMSName[idx] + "-style",
            options: {
                drawPoints: false,
                interpolation: false,
            },
        });
    }
    return groups;
}
function convertDataForTimelineAktivity(Datas, id) {
    var start = new Date(Datas.Start).valueOf() + (1000* 60* 60 * 7);
    var end = new Date(Datas.End).valueOf() - (1000 * 60 * 60 * 8);
    var driverActivity = [];
    while (start < end) {
        var idx = Math.floor((Math.random() * 3) + 0);
        driverActivity.push({
            group: id,
            start: new Date(start),
            end: new Date(start += (1000 * 60 * 45)),
            // [Availability, Work, Driving, BreakRest]
            title: Activitys[idx],
            className: Activitys[idx],
        }
        );
    }
    return driverActivity;
}

function getVehicleFMS(VehicleFMSInfo) {
    var BrakeSwitch = []; //BrakeSwitch = Bremsstellung
    var EngineSpeed = [];//EngineSpeed = umdreheung
    var AcceleratorPedalPosition = [];//AcceleratorPedalPosition = Gaspedalstellung
    var Speed = [];
    var FuelLevel = [];
    var convertData = [];
    var start = new Date(VehicleFMSInfo.Start).valueOf();
    var end = new Date(VehicleFMSInfo.End).valueOf();
    while (start < end) {
        var Time = new Date(start);
        EngineSpeed.push({
            y: (Math.cos(start + Math.floor((Math.random() * 5) + 1)) * 25) + 1000,
            x: Time,
            group: FMSName[0]
        });
        BrakeSwitch.push({
            y: (Math.sin(start + Math.floor((Math.random() * 5) + 1)) * 25) + Math.floor((Math.random() * 30) + 3),
            x: Time,
            group: FMSName[1]
        });
        Speed.push({
            y: (Math.cos(start + Math.floor((Math.random() * 5) + 1)) * 25) + Math.floor((Math.random() * 50) + 15),
            x: Time,
            group: FMSName[2]
        });
        AcceleratorPedalPosition.push({
            y: (Math.sin(start + Math.floor((Math.random() * 5) + 1)) * 15) + Math.floor((Math.random() * 10) + 3),
            x: Time,
            group: FMSName[3]
        });
        FuelLevel.push({
            y: (Math.sin(start + Math.floor((Math.random() * 5) + 1)) * 25) + 70,
            x: Time,
            group: FMSName[4]
        });
        start += 1000 * 60*20;
    }
    convertData.push(EngineSpeed);
    convertData.push(BrakeSwitch);
    convertData.push(Speed);
    convertData.push(AcceleratorPedalPosition);
    convertData.push(FuelLevel);
    return convertData
}


