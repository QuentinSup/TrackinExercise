// <reference path="./types/jquery/index.d.ts"/>
/// <reference path="./types/knockout/index.d.ts"/>
/// <reference path="./models/WayPoint.cls.ts"/>
/// <reference path="./gmap.ts"/>

declare var $;
declare var google;

var waypoints = ko.observableArray<models.WayPoint>();

function createWayPoint(wayPoint) {

    $.ajax({
        method: 'POST',
        url: "api/waypoint",
        data: wayPoint.toJson(),
        contentType: "application/json"
    }).done(function() {
        addWayPoint(wayPoint);
        drawWayPointsRoads();
    });

}

function deleteWayPoint(wayPoint) {

    $.ajax({
        method: 'DELETE',
        url: "api/waypoint",
        data: wayPoint.toJson(),
        contentType: "application/json"
    }).done(function() {
        removeWayPoint(wayPoint);
    });

}

function addWayPoint(wayPoint) {
    waypoints.push(wayPoint);

    let waypointsData: models.WayPoint[] = waypoints();

    wayPoint.setType(waypointsData.length == 1 ? 0 : 1);

    addWayPointMarker(wayPoint);

}

function drawWayPointsRoads() {
    
    cleanRoads();
    
    let waypointsData: models.WayPoint[] = waypoints();
    for(var i = 1; i < waypointsData.length; i++) {
        drawRoute(waypointsData[i-1].getCoordinates(), waypointsData[i].getCoordinates());
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
    $.getJSON("api/waypoint").done(function(data) {
        $.each(data, function(n, waypointJson) {
            addWayPoint(new models.WayPoint(waypointJson));
        });
        drawWayPointsRoads();
    });
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