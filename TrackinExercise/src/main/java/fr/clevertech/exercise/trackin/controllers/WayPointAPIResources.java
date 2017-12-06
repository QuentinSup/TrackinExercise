package fr.clevertech.exercise.trackin.controllers;

import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import fr.clevertech.exercise.trackin.api.APIResources;
import fr.clevertech.exercise.trackin.model.WayPoint;

/**
 * API WayPoints resources
 * GET /api/waypoints 
 * POST /api/waypoints
 * PUT /api/waypoints/{waypoint_id} 
 * DELETE /api/waypoints/{waypoint_id}
 * 
 * @author QuentinSup
 */
@Controller
@RequestMapping("/api/waypoints")
public class WayPointAPIResources extends APIResources<WayPoint> {

	/**
	 * Constructor
	 */
	public WayPointAPIResources() {
		super(WayPoint.class, "position ASC");
	}
	
	/**
	 * Populate WayPoint Data
	 * 
	 * @param waypoint
	 * @param jsonValue
	 * @return
	 */
	public void populateModel(WayPoint waypoint, final String jsonValue) {
		
		// Parse json value
		JSONObject json = new JSONObject(jsonValue);

		// Create waypoint
		waypoint.setLabel(json.optString("label", "No label"));
		waypoint.setLatitude(json.optString("latitude", "0"));
		waypoint.setLongitude(json.optString("longitude", "0"));
		waypoint.setPosition(json.optInt("position"));
		waypoint.setType(json.optInt("type", 0));
		
	}
	
}