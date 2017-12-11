<!doctype html>
<html lang="en">
<head>

	<meta charset="utf-8">
	<title>Trackin Exercise</title>

  	<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=edge"><![endif]-->
  	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
  	<meta name="description" content="Trackin Exercise Demo">
  	<meta name="keywords" content="Trackin,Exercise,Quentin,QuentinSup,Demo">
  	<meta name="author" content="Quentin Supernant">

	<link rel="stylesheet" href="resources/assets/vendor/jquery/jquery.nanoscroller-0.8.7.css">
	<link rel="stylesheet" href="resources/assets/vendor/jquery/jquery.tooltipster-3.3.0.min.css">
	<link rel="stylesheet" href="resources/assets/vendor/jquery-ui/jquery-ui-1.12.1.structure.min.css">
	<link rel="stylesheet" href="resources/assets/vendor/bootstrap/bootstrap-grid.min.css">
	<link rel="stylesheet" href="resources/assets/vendor/animate/animate.css">
	<link rel="stylesheet" href="resources/assets/vendor/iziToast/iziToast.min.css">
	<link rel="stylesheet" href="resources/assets/css/style.css">
	
	<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800" rel="stylesheet">

</head>
<body>
	
	<div class="loading_text">
		Chargement en cours...
	</div>
	
	<div id="progress_route" class="progress_area">
		<span>Calculating route...</span>
	</div>
	
	<div id="trackin_support" class="medaillon hidden" data-bind="click: function() { app.talk(); }">
		<div id="trackin_message_area"></div>
	</div>

	<a id="main-search-box" class="search-box hidden">
		<input id="main-search-input" class="search-input" type="text" placeholder="Seize an address to append it to the tour..." />
	</a>

	<div id="map"></div>

	<div id="tour" class="hidden">
		<!-- ko if: currentTour() -->
		<div id="shop">
			<!-- ko with: shopAddress() -->
			<a data-bind="event: { 'dblclick': function() { $root.gMap.centerizeWayPoint($data) } }">
				<img width="25px" alt="shop" data-bind="attr: { 'src': getIcon() }" />
				<span class="waypoint_label" data-bind="text: label"></span>
			</a>
			<!-- /ko -->
			<div id="drivers">
				<div class="driver_title">Driver</div>
				<div class="select_box">
					<div class="select_box_value">
						<!-- ko ifnot: app.selectedDriver() -->
						<span>Choose a driver...</span>
						<!-- /ko -->
						<!-- ko if: app.selectedDriver() -->
						<img data-bind="attr: { 'src': 'resources/assets/images/gender_' + app.selectedDriver().gender + '.png' }" alt="gender" />
						<span data-bind="text: app.selectedDriver().fullName()"></span>
						<!-- /ko -->
					</div>
					<div class="select_box_list nano">
						<ul>
						<!-- ko foreach: drivers() -->
							<li data-bind="click: function() { app.updateTourDriver($data); }">
								<img data-bind="attr: { 'src': 'resources/assets/images/gender_' + gender + '.png' }" alt="gender" />
								<span data-bind="text: firstName"></span>&nbsp;<span data-bind="text: lastName"></span>
							</li>
						<!-- /ko -->
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div id="waypoints" class="nano">
			<div class="nano-content">
				<div class="waypoints_line"></div>
				<ul class="sortable">
					<!-- ko foreach: currentTour().wayPoints -->
					<li>
						<a data-bind="event: { 'dblclick': function() { $root.gMap.centerizeWayPoint($data) } }">
							<img width="25px" alt="pickup" data-bind="attr: { 'src': getIcon() } , event: { dblclick: function() { setType(type() == 1?2:1) } }" />
							<span class="waypoint_label" data-bind="text: label"></span>
							<span data-bind="click: function() { $root.removeWayPoint($data) }" class="close"></span>
						</a>
						<!-- ko if: duration() > 0 -->
						<div class="waypoint_detail">
							<img src="resources/assets/images/distance-128.png" />+<span data-bind="text: distanceInMiles()"></span> miles<br />
							<img src="resources/assets/images/duration.png" />+<span data-bind="text: durationInMinutes()"></span> minutes
						</div>
						<!-- /ko -->
					</li>
					<!-- /ko -->
					<li>
						<div id="tour-search-box" class="search-box">
							<input id="tour-search-input" class="search-input" type="text" placeholder="Add a waypoint..." />
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div id="waypoint_total" class="waypoint_detail">
			<h4>Resume</h4>
			<div>
				<img src="resources/assets/images/distance-128.png" /><span data-bind="text: currentTour().distanceInMiles()"></span> miles
			</div>
			<div>
				<img src="resources/assets/images/duration.png" /><span data-bind="text: currentTour().durationInMinutes()"></span> minutes
			</div> 
			<a class="clickable" title="Try to optimize the route" data-bind="click: function() { app.drawWayPointsRoads(true); }">Optimize the tour</a>
			<a class="clickable" title="Center map to see the entire route" data-bind="click: function() { $root.centerBounds() }">Center tour on map</a>
		</div>
		<!-- /ko -->
	</div>

	<%-- resources --%>
	<script src="resources/assets/vendor/jquery/jquery-3.2.1.min.js"></script>
	<script src="resources/assets/vendor/jquery-ui/jquery-ui-1.12.1.min.js"></script>
	<script src="resources/assets/vendor/jquery/jquery.nanoscroller-0.8.7.min.js"></script>
	<script src="resources/assets/vendor/jquery/jquery.tooltipster-3.3.0-fix.min.js"></script>
	<script src="resources/assets/vendor/knockout/knockout-3.4.2.min.js"></script>
	<script src="resources/assets/vendor/iziToast/iziToast.min.js"></script>
	
	<%-- App --%>
	<script src="resources/assets/js/app.js"></script>

	<%-- Other --%>
	<script async defer
		src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAV-WGVIfG4yamTnCInxyJ24E3Uqmc92Zk&libraries=places&callback=onMapLoaded"></script>


</body>
</html>