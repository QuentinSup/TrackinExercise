// <reference path="./types/jquery/index.d.ts"/>
/// <reference path="./types/knockout/index.d.ts"/>
/// <reference path="./classes/commons/APIResourceInterface.cls.ts"/>
/// <reference path="./classes/commons/API.cls.ts"/>
/// <reference path="./models/WayPoint.cls.ts"/>
/// <reference path="./models/Driver.cls.ts"/>
/// <reference path="./models/Tour.cls.ts"/>
/// <reference path="./classes/GMap.cls.ts"/>
/// <reference path="./classes/App.cls.ts"/>

declare var $;
declare var google;

import GMap = trackinexercise.GMap;
import App = trackinexercise.App;

let gmap: GMap = new GMap();
let app: App = new App(gmap);

// JQuery load on ready
$(function() {
    ko.applyBindings(app);
});

function onMapLoaded() {
    app.init();
}