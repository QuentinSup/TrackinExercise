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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import fr.clevertech.exercise.trackin.model.WayPoint;

/**
 * API WayPoint resources
 * @author QuentinSup
 *
 */
@Controller
@RequestMapping("/api/waypoint")
public class WayPointController {

	/**
	 * Logger
	 */
	final static private Logger logger = LoggerFactory.getLogger(WayPoint.class);

	/**
	 * Create a new waypoint and persist into database
	 * @param json
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<String> create(@RequestBody String jsonValue) {
		
		if(logger.isDebugEnabled()) {
			logger.debug(String.format("Create a new waypoint with json data : %s", jsonValue));
		}
		
		// Get hibernate session factory
		final SessionFactory factory = Application.getSessionFactory();
		if(!factory.isOpen()) {
			logger.error("Not connected to the database");
			// Return HttpStatus 412
			return new ResponseEntity<String>(HttpStatus.PRECONDITION_FAILED); 
		}
		
		if(logger.isTraceEnabled()) {
			logger.trace("Create WayPoint class");
		}
		
		// Parse json value
		JSONObject json = new JSONObject(jsonValue);
		
		// Create waypoint
		WayPoint waypoint = new WayPoint();
		waypoint.setLabel(json.optString("label", "No label"));
		waypoint.setLatitude(json.optString("latitude", "0"));
		waypoint.setLongitude(json.optString("longitude", "0"));
		
		if(logger.isTraceEnabled()) {
			logger.trace("Add new WayPoint data");
		}
		
		// Save
		final EntityManager manager = factory.createEntityManager();
		manager.getTransaction().begin();
		manager.persist(waypoint);
		manager.getTransaction().commit();
		
		// Return HttpStatus 200 for Success
		return new ResponseEntity<String>(HttpStatus.OK);
	}
	
	/**
	 * Return all waypoints from database
	 * @param json
	 * @return
	 */
	@RequestMapping(method = RequestMethod.GET)
	public ResponseEntity<String> listWaypoints() {
		
		if(logger.isDebugEnabled()) {
			logger.debug(String.format("Return waypoints"));
		}
		
		// Get hibernate session factory
		final Session session = Application.getActiveSession();
		if(!session.isOpen() || !session.isConnected()) {
			logger.error("Not connected to the database");
			// Return HttpStatus 412
			return new ResponseEntity<String>(HttpStatus.PRECONDITION_FAILED); 
		}
		
		if(logger.isTraceEnabled()) {
			logger.trace("Retrieve waypoint list from database");
		}
		
		// Retrieve data from database
		@SuppressWarnings("unchecked")
		List<WayPoint> waypoints = (List<WayPoint>)session.createQuery("from WayPoint").list();
		
		// Convert into json
		final Gson gson = new GsonBuilder().create();
		final String jsonValue = gson.toJson(waypoints);
		
		// Return all waypoints as json with HttpStatus 200
		return new ResponseEntity<String>(jsonValue, HttpStatus.OK);
	}
	
	/**
	 * Remove a waypoint from database
	 * @param json
	 * @return
	 */
	@RequestMapping(method = RequestMethod.DELETE)
	public ResponseEntity<String> remove(@RequestBody String jsonValue) {
		
		if(logger.isDebugEnabled()) {
			logger.debug(String.format("Remove a waypoint with json data : %s", jsonValue));
		}
		
		// Get hibernate session factory
		final Session session = Application.getActiveSession();
		if(!session.isOpen() || !session.isConnected()) {
			logger.error("Not connected to the database");
			// Return HttpStatus 412
			return new ResponseEntity<String>(HttpStatus.PRECONDITION_FAILED); 
		}
		
		if(logger.isTraceEnabled()) {
			logger.trace("Remove waypoint from database");
		}
		
		// Parse json value
		final JSONObject json = new JSONObject(jsonValue);
		
		// Get waypoint from session
		WayPoint waypoint = session.load(WayPoint.class, new Integer(json.optInt("id")));
		if(waypoint == null) {
			// If not, create waypoint object
			waypoint = new WayPoint(json.optInt("id"));
		}
		
		// Remove data from database
		try {
			session.getTransaction().begin();
			session.delete(waypoint);
			session.getTransaction().commit();
			// Return HttpStatus 200
			return new ResponseEntity<String>(HttpStatus.OK);
		} catch(Exception e) {
			logger.error(e.getMessage(), e);
			session.getTransaction().rollback();
			// Return HttpStatus 500
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

}
