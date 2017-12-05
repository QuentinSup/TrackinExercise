// <reference path="./types/jquery/index.d.ts"/>
/// <reference path="./types/knockout/index.d.ts"/>
/// <reference path="./models/WayPoint.cls.ts"/>
/// <reference path="./gmap.ts"/>

declare var $;
declare var google;

var waypoints = ko.observableArray<models.WayPoint>();

function createWayPoint(wayPoint) {

    wayPoint.save(function() {
        // Add wayPoint to route
        addWayPoint(this);

    });

}

function deleteWayPoint(wayPoint) {

    wayPoint.remove(function() {
        removeWayPoint(wayPoint);
    });

}

function addWayPoint(wayPoint, draw: boolean = true) {

    waypoints.push(wayPoint);
    let waypointsData: models.WayPoint[] = waypoints();
    wayPoint.setType(waypointsData.length == 1 ? 0 : 1);
    addWayPointMarker(wayPoint);

    if (draw) {
        // Draw roads
        drawWayPointsRoads();
    }

}

function drawWayPointsRoads() {

    cleanRoads();

    let waypointsData: models.WayPoint[] = waypoints();

    if (waypointsData.length == 0) {
        return;
    }
    
    waypointsData[0].duration(0);
    waypointsData[0].distance(0);
    
    for (let i = 1; i < waypointsData.length; i++) {
        let wayPointFrom: models.WayPoint = waypointsData[i - 1];
        let wayPointTo: models.WayPoint = waypointsData[i];
        drawRoute(wayPointFrom.getCoordinates(), wayPointTo.getCoordinates(), function() {
            let duration = this.routes[0].legs[0].duration.value;
            let distance = this.routes[0].legs[0].distance.value;
            wayPointTo.duration(duration);
            wayPointTo.distance(distance);
        });
    }

}

function removeWayPoint(wayPoint) {

    // Remove waypoint from list
    waypoints.remove(wayPoint);

    // Remove marker from map
    wayPoint.marker.setMap(null);

    // Redraw roads (could be optimized)
    drawWayPointsRoads();

}

function retrieveWayPointList() {

    models.WayPoint.list(function(data) {

        $.each(data, function(n, waypointJson) {
            addWayPoint(new models.WayPoint(waypointJson), false);
        });
        drawWayPointsRoads();

        $('#waypoints > ul').sortable({
            update: function(event, ui) {
                updateWayPointsPositions();
            }
        });

    });
}

function updateWayPointsPositions() {

    let wpoints = [];

    $('#waypoints > ul > li').each(function() {
        let $item = $(this);
        let wayPoint = ko.dataFor(this);
        if (wayPoint.position != $item.index()) {
            wayPoint.position = $item.index();
            wayPoint.save();
        }
        wpoints.push(wayPoint);
    });

    // Update waypoint list order
    waypoints(wpoints);

    // Redraw roads (could be optimized)
    drawWayPointsRoads();


}

// JQuery load on ready
$(function() {

    let model = {
        waypoints: waypoints,
        fn: {
            createWayPoint: createWayPoint
        }
    };

    ko.applyBindings(model);

});

function onMapLoaded() {
    initGMap();
    retrieveWayPointList();
}