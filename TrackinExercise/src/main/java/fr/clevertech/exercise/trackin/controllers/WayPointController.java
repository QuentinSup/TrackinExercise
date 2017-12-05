package fr.clevertech.exercise.trackin.controllers;

import java.util.List;

import javax.persistence.EntityManager;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
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
public class WayPointController {

	/**
	 * Logger
	 */
	final static private Logger logger = LoggerFactory.getLogger(WayPoint.class);

	/**
	 * Retrieve Waypoint from session or create a new one
	 * 
	 * @param id
	 * @param jsonValue
	 * @return
	 */
	private static WayPoint retrieveWayPoint(final String id, final String jsonValue) {

		// Get hibernate session factory
		final Session session = Application.getActiveSession();

		WayPoint waypoint;

		if (id != null && !"".equals(id.trim())) {
			// Get waypoint from session
			waypoint = session.load(WayPoint.class, new Integer(id));
			if (waypoint == null) {
				// If not, create waypoint object
				waypoint = new WayPoint(Integer.valueOf(id));
			}
		} else {
			// Create waypoint
			waypoint = new WayPoint();
		}

		if (jsonValue != null && !"".equals(id.trim())) {
			// Parse json value
			JSONObject json = new JSONObject(jsonValue);

			// Create waypoint
			waypoint.setLabel(json.optString("label", "No label"));
			waypoint.setLatitude(json.optString("latitude", "0"));
			waypoint.setLongitude(json.optString("longitude", "0"));
			waypoint.setPosition(json.optInt("position"));
		}

		return waypoint;
	}

	/**
	 * CREATE Create a new waypoint and persist into database
	 * 
	 * @param json
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST, produces = "application/json; charset=UTF-8")
	public ResponseEntity<String> create(@RequestBody String jsonValue) {

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("Create a new waypoint with json data : %s", jsonValue));
		}

		// Get hibernate session factory
		final SessionFactory factory = Application.getSessionFactory();
		if (!factory.isOpen()) {
			logger.error("Not connected to the database");
			// Return HttpStatus 412
			return new ResponseEntity<String>(HttpStatus.PRECONDITION_FAILED);
		}

		if (logger.isTraceEnabled()) {
			logger.trace("Create WayPoint class");
		}

		// Create waypoint
		WayPoint waypoint = retrieveWayPoint(null, jsonValue);

		if (logger.isTraceEnabled()) {
			logger.trace("Add new WayPoint data");
		}

		// Save
		final EntityManager manager = factory.createEntityManager();

		// Remove data from database
		try {
			manager.getTransaction().begin();
			manager.persist(waypoint);
			manager.getTransaction().commit();
			// Return HttpStatus 200 for Success
			return new ResponseEntity<String>(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			manager.getTransaction().rollback();
			// Return HttpStatus 500
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	/**
	 * LIST Return all waypoints from database
	 * 
	 * @param json
	 * @return
	 */
	@RequestMapping(method = RequestMethod.GET, produces = "application/json; charset=UTF-8")
	public ResponseEntity<String> listWaypoints() {

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("Return waypoints"));
		}

		// Get hibernate session factory
		final Session session = Application.getActiveSession();
		if (!session.isOpen() || !session.isConnected()) {
			logger.error("Not connected to the database");
			// Return HttpStatus 412
			return new ResponseEntity<String>(HttpStatus.PRECONDITION_FAILED);
		}

		if (logger.isTraceEnabled()) {
			logger.trace("Retrieve waypoint list from database");
		}

		// Retrieve data from database
		@SuppressWarnings("unchecked")
		List<WayPoint> waypoints = (List<WayPoint>) session.createQuery("from WayPoint ORDER BY position ASC").list();

		// Convert into json
		final Gson gson = new GsonBuilder().create();
		final String jsonValue = gson.toJson(waypoints);

		// Return all waypoints as json with HttpStatus 200
		return new ResponseEntity<String>(jsonValue, HttpStatus.OK);
	}

	/**
	 * DELETE Remove a waypoint from database
	 * 
	 * @param json
	 * @return
	 */
	@RequestMapping(method = RequestMethod.DELETE, value = "/{waypoint_id}")
	public synchronized ResponseEntity<String> remove(@PathVariable("waypoint_id") final String id) throws NumberFormatException {

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("Remove a waypoint with id : %s", id));
		}

		// Get hibernate session factory
		final Session session = Application.getActiveSession();
		if (!session.isOpen() || !session.isConnected()) {
			logger.error("Not connected to the database");
			// Return HttpStatus 412
			return new ResponseEntity<String>(HttpStatus.PRECONDITION_FAILED);
		}

		if (logger.isTraceEnabled()) {
			logger.trace("Remove waypoint from database");
		}

		// Get waypoint
		WayPoint waypoint = retrieveWayPoint(id, null);

		// Remove data from database
		try {
			session.getTransaction().begin();
			session.delete(waypoint);
			session.getTransaction().commit();
			// Return HttpStatus 200
			return new ResponseEntity<String>(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			session.getTransaction().rollback();
			// Return HttpStatus 500
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	/**
	 * PUT Update a waypoint to database
	 * 
	 * @param json
	 * @return
	 */
	@RequestMapping(method = RequestMethod.PUT, value = "/{waypoint_id}")
	public synchronized ResponseEntity<String> update(@PathVariable("waypoint_id") final String id, @RequestBody String jsonValue)
			throws NumberFormatException {

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("Update a waypoint with id : %s", id));
		}

		// Get hibernate session factory
		final Session session = Application.getActiveSession();
		if (!session.isOpen() || !session.isConnected()) {
			logger.error("Not connected to the database");
			// Return HttpStatus 412
			return new ResponseEntity<String>(HttpStatus.PRECONDITION_FAILED);
		}

		if (logger.isTraceEnabled()) {
			logger.trace("Update waypoint from database");
		}

		// Get waypoint
		WayPoint waypoint = retrieveWayPoint(id, jsonValue);

		// Remove data from database
		try {
			session.getTransaction().begin();
			session.persist(waypoint);
			session.getTransaction().commit();
			// Return HttpStatus 200
			return new ResponseEntity<String>(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			session.getTransaction().rollback();
			// Return HttpStatus 500
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

}
