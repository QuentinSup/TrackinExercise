package fr.clevertech.exercise.trackin.controllers.api;

import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import fr.clevertech.exercise.trackin.api.APIResources;
import fr.clevertech.exercise.trackin.model.WayPoint;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

/**
 * API WayPoints resources 
 * GET /api/waypoints 
 * POST /api/waypoints
 * GET /api/waypoints/{waypoint_id}
 * PUT /api/waypoints/{waypoint_id} 
 * DELETE /api/waypoints/{waypoint_id}
 * @author QuentinSup
 */
@Controller
@Api(value = "/waypoints")
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

		// Populate waypoint data
		waypoint.setLabel(json.optString("label", "No label"));
		waypoint.setLatitude(json.optString("latitude", "0"));
		waypoint.setLongitude(json.optString("longitude", "0"));
		waypoint.setPosition(json.optInt("position"));
		waypoint.setType(json.optInt("type", 0));

	}

	/**
	 * CREATE Create a new waypoint
	 * 
	 * @param json
	 * @return
	 * @throws IllegalAccessException
	 * @throws InstantiationException
	 */
	@ApiOperation(httpMethod = "POST", value = "Create a waypoint")
	@ApiResponses({ @ApiResponse(code = 200, message = "SUCCESS"),
			@ApiResponse(code = 412, message = "Not connected to database"),
			@ApiResponse(code = 500, message = "Internal server error") })
	@RequestMapping(method = RequestMethod.POST, produces = "application/json; charset=UTF-8")
	@Override
	public ResponseEntity<String> create(@ApiParam(value = "waypoint json data", required = true) @RequestBody String jsonValue)
			throws InstantiationException, IllegalAccessException {
		return super.create(jsonValue);
	}
	
	/**
	 * GET Return a waypoint from given id
	 * 
	 * @param id waypoint identifier
	 * @return
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	@ApiOperation(httpMethod = "GET", produces = "application/json; charset=UTF-8", value = "Return a waypoint from id", response = WayPoint.class)
	@ApiResponses({ @ApiResponse(code = 200, message = "OK"),
			@ApiResponse(code = 412, message = "Not connected to database"),
			@ApiResponse(code = 500, message = "Internal server error") })
	@RequestMapping(method = RequestMethod.GET, value = "/{waypoint_id}", produces = "application/json; charset=UTF-8")
	@Override
	public ResponseEntity<String> load(@ApiParam(value = "waypoint identifier") @PathVariable("waypoint_id") final String id) throws InstantiationException, IllegalAccessException {
		return super.load(id);
	}

	/**
	 * LIST Return all waypoints list from database
	 * 
	 * @param json
	 * @return
	 */
	@ApiOperation(httpMethod = "GET", produces = "application/json; charset=UTF-8", value = "Return list of waypoints sorted by position", response = WayPoint.class)
	@ApiResponses({ @ApiResponse(code = 200, message = "OK"),
			@ApiResponse(code = 412, message = "Not connected to database"),
			@ApiResponse(code = 500, message = "Internal server error") })
	@RequestMapping(method = RequestMethod.GET, produces = "application/json; charset=UTF-8")
	@Override
	public ResponseEntity<String> list() {
		return super.list();
	}

	/**
	 * DELETE Remove a waypoint
	 * 
	 * @param json
	 * @return
	 * @throws IllegalAccessException
	 * @throws InstantiationException
	 */
	@ApiOperation(httpMethod = "DELETE", value = "Remove a waypoint")
	@ApiResponses({ @ApiResponse(code = 200, message = "SUCCESS"),
			@ApiResponse(code = 412, message = "Not connected to database"),
			@ApiResponse(code = 500, message = "Internal server error") })
	@RequestMapping(method = RequestMethod.DELETE, value = "/{waypoint_id}")
	@Override
	public ResponseEntity<String> remove(
			@ApiParam(value = "waypoint identifier") @PathVariable("waypoint_id") final String id)
			throws NumberFormatException, InstantiationException, IllegalAccessException {
		return super.remove(id);
	}

	/**
	 * PUT Update a waypoint
	 * 
	 * @param json
	 * @return
	 * @throws IllegalAccessException
	 * @throws InstantiationException
	 */
	@ApiOperation(httpMethod = "PUT", value = "Update a waypoint")
	@ApiResponses({ @ApiResponse(code = 200, message = "SUCCESS"),
			@ApiResponse(code = 412, message = "Not connected to database"),
			@ApiResponse(code = 500, message = "Internal server error") })
	@RequestMapping(method = RequestMethod.PUT, value = "/{waypoint_id}")
	@Override
	public ResponseEntity<String> update(
			@ApiParam(value = "waypoint identifier", required = true) @PathVariable("waypoint_id") final String id,
			@ApiParam(value = "waypoint json data", required = true) @RequestBody String jsonValue)
			throws NumberFormatException, InstantiationException, IllegalAccessException {
		return super.update(id, jsonValue);
	}

}