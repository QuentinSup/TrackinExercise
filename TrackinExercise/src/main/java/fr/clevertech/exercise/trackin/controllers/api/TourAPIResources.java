package fr.clevertech.exercise.trackin.controllers.api;

import java.util.List;

import org.hibernate.Session;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import fr.clevertech.exercise.trackin.api.APIResources;
import fr.clevertech.exercise.trackin.controllers.Application;
import fr.clevertech.exercise.trackin.model.Tour;
import fr.clevertech.exercise.trackin.model.WayPoint;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

/**
 * API Driver resources GET /api/tours
 * 
 * @author QuentinSup
 */
@Controller
@Api(value = "/tours")
@RequestMapping("/api/tours")
public class TourAPIResources extends APIResources<Tour> {

	/**
	 * Logger
	 */
	final static private Logger logger = LoggerFactory.getLogger(TourAPIResources.class);

	/**
	 * Constructor
	 */
	public TourAPIResources() {
		super(Tour.class, null);
	}

	/**
	 * Populate Tour data
	 * 
	 * @param tour
	 * @param jsonValue
	 * @return
	 */
	@Override
	public void populateModel(Tour tour, final String jsonValue) {

		if (jsonValue != null && !"".equals(jsonValue.trim())) {
			// Parse json value
			JSONObject json = new JSONObject(jsonValue);

			// Populate tour data
			tour.setDriverId(json.optInt("driverId"));
		}

	}

	/**
	 * LIST Return all tours list from database
	 * 
	 * @param json
	 * @return
	 */
	@ApiOperation(httpMethod = "GET", produces = "application/json; charset=UTF-8", value = "Return list of tours", response = Tour.class)
	@ApiResponses({ @ApiResponse(code = 200, message = "OK"),
			@ApiResponse(code = 412, message = "Not connected to database"),
			@ApiResponse(code = 500, message = "Internal server error") })
	@RequestMapping(method = RequestMethod.GET, produces = "application/json; charset=UTF-8")
	@Override
	public ResponseEntity<String> list() {
		return super.list();
	}

	/**
	 * PUT Update a tour
	 * 
	 * @param json
	 * @return
	 * @throws IllegalAccessException
	 * @throws InstantiationException
	 */
	@ApiOperation(httpMethod = "PUT", value = "Update a tour")
	@ApiResponses({ @ApiResponse(code = 200, message = "SUCCESS"),
			@ApiResponse(code = 412, message = "Not connected to database"),
			@ApiResponse(code = 500, message = "Internal server error") })
	@RequestMapping(method = RequestMethod.PUT, value = "/{tour_id}")
	@Override
	public ResponseEntity<String> update(
			@ApiParam(value = "tour identifier", required = true) @PathVariable("tour_id") final String id,
			@ApiParam(value = "tour json data", required = true) @RequestBody String jsonValue)
			throws NumberFormatException, InstantiationException, IllegalAccessException {
		return super.update(id, jsonValue);
	}
	
	/**
	 * LIST Return all waypoints of a tour from database
	 * 
	 * @param json
	 * @return
	 */
	@ApiOperation(httpMethod = "GET", produces = "application/json; charset=UTF-8", value = "Return all waypoints from a tour", response = Tour.class)
	@ApiResponses({ @ApiResponse(code = 200, message = "OK"),
			@ApiResponse(code = 412, message = "Not connected to database"),
			@ApiResponse(code = 500, message = "Internal server error") })
	@RequestMapping(method = RequestMethod.GET, value = "/{tour_id}/waypoints", produces = "application/json; charset=UTF-8")
	public ResponseEntity<String> listWaypoints(
			@ApiParam(value = "tour identifier", required = true) @PathVariable("tour_id") final String id) {

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("Return waypoints list from database"));
		}

		// Get hibernate session factory
		final Session session = Application.getSession();
		if (!session.isOpen() || !session.isConnected()) {
			logger.error("Not connected to the database");
			// Return HttpStatus 412
			return new ResponseEntity<String>(HttpStatus.PRECONDITION_FAILED);
		}

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("Retrieve waypoints list of tour '%s' from database", id));
		}

		// Retrieve data from database
		@SuppressWarnings("unchecked")
		final List<WayPoint> waypoints = (List<WayPoint>) session.createQuery("from WayPoint WHERE tour_id = :tourId ORDER BY position ASC").setParameter("tourId", id).list();

		// Convert into json
		final Gson gson = new GsonBuilder().create();
		final String jsonValue = gson.toJson(waypoints);

		// Return all drivers as json with HttpStatus 200
		return new ResponseEntity<String>(jsonValue, HttpStatus.OK);

	}
}
