/*////////////////////////////////////////////////////////////////////////////////*/
// DiTel
var DiTel = (function ($) {
    var module = {
        TimeDomain: {
            StartTimeDomain: new Date("2015-07-19"),
            EndTimeDomain: new Date(1000 * 60 * 60 * 24 + (new Date("2015-07-19")).valueOf()),
        },
        LoadTimeDomain: {
            StartTime: 0,
            EndTime: 0,
        },
        Legende: [],
        Diagramms: [],
        Timeline: "",
        TimelineItems: "",
        Timelinegroups: "",
        Blueline: "",
        BluelineID: 555,
        TimespanOneDay: 1000 * 60 * 60 * 24,
        TimespanOneWeek: 1000 * 60 * 60 * 24 * 7,

        init: function (DiTelID, DiagrammOptions, TimelineOptions, TimelineGroups) {
            var DateTomorrow = $.datepicker.formatDate("dd.mm.yy",
                new Date(this.TimespanOneDay + (new Date).valueOf()));
            var oldIndex;
            var div = $('<div>', { "style": "", "id": "Diagramms", "class": "Diagrams" });

            $(DiTelID).append(div);
            for (var i = 0; i < DiagrammOptions.length; i++) {
                var divID= "Diagramm"+i
                var div = $('<div>', { "style": "", "id": divID, "class": "Diagramm" });
                $('#Diagramms').append(div);

                this.Diagramms.push(createDiagramm(divID, DiagrammOptions[i]));
            }
            if (!$.isEmptyObject(TimelineOptions))
            {
                var div = $('<div>', { "style": "", "id": "Timeline", "class": "Diagramm" });
                $(DiTelID).append(div);
                this.TimelineItems = new vis.DataSet();
                this.Timelinegroups = new vis.DataSet();
                if (!$.isEmptyObject(TimelineGroups))
                    this.Timelinegroups = TimelineGroups;
                this.Timeline = new vis.Timeline($("#Timeline")[0], null, this.Timelinegroups, TimelineOptions);
                this.Timeline.setOptions({
                    max: DateTomorrow,
                    zoomMin: this.TimespanOneDay / 24,
                    zoomMax: this.TimespanOneWeek,
                    showCurrentTime: true,
                    editable: false,
                    locale: 'de',
                    margin: {
                        item: 10, // minimal margin between items
                        axis: 5,   // minimal margin between items and the axis
                    },
                });
                $(".Diagrams").sortable({
                    revert: true,
                    cancel: '.vis-line-graph',
                    axis: "y",
                    activate: function (event, ui)
                    {
                        oldIndex = ui.item.index();
                    },
                    update: function (event, ui)
                    {
                        var newIndex = ui.item.index();
                        var TmpLegende = DiTel.Legende.splice(oldIndex, 1)[0];

                        $('#'+TmpLegende.id).remove();
                        DiTel.Legende.splice(newIndex, 0, TmpLegende);
                        if (newIndex == 0)
                            $('#'+DiTel.Legende[newIndex + 1].id).before(TmpLegende);
                        else
                            $('#'+DiTel.Legende[newIndex - 1].id).after(TmpLegende);

                    }
                });
                $(".vis-panel.vis-left").css("width", '95');
                this.Timeline.on(
                    'panmove',
                    allEventCaller
                );
                /*für mozilla*/
                this.Timeline.on(
                    'DOMMouseScroll',
                    allEventCaller
                );
                /*für chrome*/
                this.Timeline.on(
                    'mousewheel',
                    allEventCaller
                );
            }
        },
        destroyDiTel: function(){
            var lange = this.Diagramms.length - 1;
            for (var idx = lange; idx >= 0  ; idx--) {
                this.Diagramms[idx].Diagramm.destroy();
                this.Diagramms.pop(this.Diagramms[idx]);
                $('#Diagramm' + idx).remove();
                $('#DiagrammLegende' + idx).remove();
            }
            $('#Diagramms').remove();
            this.Timeline.destroy();
            $('#Timeline').remove();
        },
        setGoupeTimeline: function (_groups) {
            this.Timelinegroups.add(_groups);
            this.Timeline.setGroups(this.Timelinegroups);
        },
        move: function (_properties, _actor, _reactor) {
            var r = _actor.range.getRange();
            for (var i = 0; i < _reactor.length; i++) {
                _reactor[i].range.setRange(r.start, r.end);
            }
            // TODO: Slider hier einbauen wenn er gewünscht wird
        },
        setItemTimline: function (_TimItems) {
            this.TimelineItems.add(_TimItems);
            this.Timeline.setItems(this.TimelineItems);
        },
        toggleGraph: function (idxDiagramm)
        {
            var container = DiTel.Diagramms[idxDiagramm];
            if (!container.visible)
            {
                $(container.divId).show();
                container.visible = true;
            }
            else{
                var groupsVisible = false;

                for (var groupId in container.Diagramm.groupsData._data)
                {
                    if (container.Diagramm.isGroupVisible(groupId) == true)
                        groupsVisible = true;
                }
                if (!groupsVisible) {
                    $(container.divId).hide();
                    container.visible = false;
                }
            }
        },
        populateExternalLegend: function (/*groupsData, legend*/) {
            var legendDiv = $("#Legend")[0];
            for (var idx = 0 ; idx < DiTel.Diagramms.length ; idx++) {
                var containerDivFromDiagramm = $('<div>', {
                    "id": "DiagrammLegende"+idx,
                    "class": "external-Diagramm",
                });
                for (var groupId in DiTel.Diagramms[idx].groups._data) {
                    var LegendIcon = DiTel.Diagramms[idx].Diagramm.getLegend(groupId, 20, 20).icon
                    // create divs
                    var containerDiv = $('<div>', {
                        "id": groupId + "_legendContainer",
                        "class": 'legend-element-container',
                    });
                    var iconDiv = $('<div>', {
                        "class": "icon-container"
                    }).append(LegendIcon);
                    var descriptionDiv = $('<div>', {
                        "style": "text-align: left",
                        "class": "description-container",

                    }).append(groupId);

                    LegendIcon.setAttributeNS(null, "class", "legend-icon");

                    containerDiv.append(iconDiv[0], descriptionDiv[0]);
                    containerDivFromDiagramm.append(containerDiv[0]);

                    containerDiv[0].onclick = this.toggleGroup.bind(this, groupId);

                }
                //TODO: Diagramms Array extra speichern
                this.Legende.push( containerDivFromDiagramm[0]);
                legendDiv.appendChild(containerDivFromDiagramm[0]);
            }
        },
        /**
         * This function switchs the visible option of the selected group on an off.
         * @param groupId
         */
        toggleGroup: function (groupId) {
            // get the container that was clicked on.
            var container = $("#" + groupId + "_legendContainer")[0];

            for (var idxDia = 0 ; idxDia < DiTel.Diagramms.length ; idxDia++) {
                // if in Diagramm
                if (DiTel.Diagramms[idxDia].Diagramm.groupsData._data[groupId] != null) {
                    // if visible, hide
                    if (DiTel.Diagramms[idxDia].Diagramm.isGroupVisible(groupId) == true) {
                        DiTel.Diagramms[idxDia].groups.update({ id: groupId, visible: false });
                        container.className = container.className + " hidden";
                        this.toggleGraph(idxDia);
                        break;
                    }
                    else { // if invisible, show
                        DiTel.Diagramms[idxDia].groups.update({ id: groupId, visible: true });
                        container.className = container.className.replace("hidden", "");
                        this.toggleGraph(idxDia);
                        break;
                    }
                }
            }
        },
    }
    function allEventCaller (props) {
        var elem = this;
        var moveElem = $.map(DiTel.Diagramms, function (n) {
            if(n.Diagramm != elem)
                return n.Diagramm;
        });
        if (elem != DiTel.Timeline)
            moveElem.push(DiTel.Timeline);
        DiTel.move(props, elem, moveElem);
    }
    function createDiagramm(divID, DiagrammOptions) {
        var Diagramm = {
            Diagramm: null,
            visible: true,
            items: "",
            groups: "",
            divId: "",
            TimespanOneDay: 1000 * 60 * 60 * 24,
            TimespanOneWeek: 1000 * 60 * 60 * 24 * 7,
            init: function (divID, DiagrammOptions) {
                var DateTomorrow = $.datepicker.formatDate("dd.mm.yy",
                    new Date(this.TimespanOneDay + (new Date).valueOf()));
                this.items = new vis.DataSet();
                this.groups = new vis.DataSet();
                this.divId = "#" + divID;
                this.Diagramm = new vis.Graph2d($(this.divId)[0], this.DiagrammItems, this.DiagrammGroups, DiagrammOptions);
                this.Diagramm.setOptions({
                    dataAxis: {
                        width: '95',
                    },
                    max: DateTomorrow,
                    zoomMin: this.TimespanOneDay / 24,
                    zoomMax: this.TimespanOneWeek,
                });
                this.Diagramm.on(
                    'panmove',
                    allEventCaller);
                /*für mozilla*/
                this.Diagramm.on(
                    'DOMMouseScroll',
                    allEventCaller
                );
                /*für chrome*/
                this.Diagramm.on(
                    'mousewheel',
                    allEventCaller
                );
            },

        };

        Diagramm.init(divID, DiagrammOptions);
        return Diagramm;

    }


    return module;

}(jQuery));

//Petie Drogo