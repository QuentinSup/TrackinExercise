package fr.clevertech.exercise.trackin.api;

import java.util.List;

import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import fr.clevertech.exercise.trackin.controllers.Application;
import fr.clevertech.exercise.trackin.model.AbstractModel;

/**
 * API Model resources
 * Contains commons API treatments for API resources
 * @author QuentinSup
 */
public abstract class APIResources<T extends AbstractModel> {

	/**
	 * Logger
	 */
	final static private Logger logger = LoggerFactory.getLogger(APIResources.class);

	/**
	 * Model class
	 */
	private Class<T> classModel;
	/**
	 * optional ORDER BY query string
	 */
	private String orderBy;
	
	/**
	 * constructor
	 * @param classModel
	 * @param orderBy
	 */
	public APIResources(final Class<T> classModel, final String orderBy) {
		this.classModel = classModel;
		this.orderBy = orderBy;
	}
	
	/**
	 * Method to be implemented to parse jsonValue and set data 
	 * @param jsonValue
	 */
	public abstract void populateModel(T model, final String jsonValue);
	
	/**
	 * Retrieve Model from session or create a new one
	 * 
	 * @param id
	 * @param jsonValue
	 * @return
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	private T retrieveModelObject(final String id, final String jsonValue) throws InstantiationException, IllegalAccessException {

		// Get hibernate session
		final Session session = Application.getSession();
		T model;

		if (id != null && !"".equals(id.trim())) {
			// Get model from session
			model = (T) session.get(this.classModel, new Integer(id));
			if (model == null) {
				// If not, create driver object
				model = (T)this.classModel.newInstance();
				model.setId(Integer.valueOf(id));
			}
		} else {
			// Create model
			model = (T)this.classModel.newInstance();
		}
		
		if (jsonValue != null && !"".equals(jsonValue.trim())) {
			// Populate data
			this.populateModel(model, jsonValue);
		}

		return model;
	}

	/**
	 * CREATE Create a new model object and persist into database
	 * 
	 * @param json
	 * @return
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	public ResponseEntity<String> create(final String jsonValue) throws InstantiationException, IllegalAccessException {

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("Create a new object with json data : %s", jsonValue));
		}
		
		// Get hibernate session 
		final Session session = Application.getSession();
		if (!session.isOpen() || !session.isConnected()) {
			logger.error("Not connected to the database");
			// Return HttpStatus 412
			return new ResponseEntity<String>(HttpStatus.PRECONDITION_FAILED);
		}

		if (logger.isTraceEnabled()) {
			logger.trace("Create class");
		}

		// Create model
		T model = retrieveModelObject(null, jsonValue);
		
		if (logger.isTraceEnabled()) {
			logger.trace(String.format("Add new model '%s' data", model.getClass()));
		}
				
		// Save data to database
		try {
			session.save(model);
			session.close();
			
			// Convert into json
			final Gson gson = new GsonBuilder().create();
			final String returnedJsonValue = gson.toJson(model);
			
			// Return HttpStatus 200 for Success
			return new ResponseEntity<String>(returnedJsonValue, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			// Return HttpStatus 500
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	/**
	 * LIST Return all model list from database
	 * 
	 * @param json
	 * @return
	 */
	public ResponseEntity<String> list() {

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("Return data list from database"));
		}

		// Get hibernate session factory
		final Session session = Application.getSession();
		if (!session.isOpen() || !session.isConnected()) {
			logger.error("Not connected to the database");
			// Return HttpStatus 412
			return new ResponseEntity<String>(HttpStatus.PRECONDITION_FAILED);
		}

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("Retrieve model list '%s' from database", this.classModel.getSimpleName()));
		}
		
		// Retrieve data from database
		@SuppressWarnings("unchecked")
		final List<T> models = (List<T>) session.createQuery(String.format("from %s" + (this.orderBy == null?"":" ORDER BY " + this.orderBy), this.classModel.getSimpleName())).list();
		session.close();
		
		// Convert into json
		final Gson gson = new GsonBuilder().create();
		final String jsonValue = gson.toJson(models);

		// Return all drivers as json with HttpStatus 200
		return new ResponseEntity<String>(jsonValue, HttpStatus.OK);
	}
	
	/**
	 * GET Return an instance of a model
	 * 
	 * @param id model identifier
	 * @return
	 */
	public ResponseEntity<String> load(final String id) throws InstantiationException, IllegalAccessException {

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("Return data model from database"));
		}

		// Get hibernate session factory
		final Session session = Application.getSession();
		if (!session.isOpen() || !session.isConnected()) {
			logger.error("Not connected to the database");
			// Return HttpStatus 412
			return new ResponseEntity<String>(HttpStatus.PRECONDITION_FAILED);
		}

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("Retrieve model object '%s' from database", this.classModel.getSimpleName()));
		}
		
		// Create model
		T model = retrieveModelObject(id, null);
	
		// Convert into json
		final Gson gson = new GsonBuilder().create();
		final String jsonValue = gson.toJson(model);

		// Return all drivers as json with HttpStatus 200
		return new ResponseEntity<String>(jsonValue, HttpStatus.OK);
	}

	/**
	 * DELETE Remove a model object from database
	 * 
	 * @param id model identifier
	 * @return
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	public ResponseEntity<String> remove(final String id) throws NumberFormatException, InstantiationException, IllegalAccessException {

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("Remove an object with id : %s", id));
		}

		// Get hibernate session factory
		final Session session = Application.getSession();
		if (!session.isOpen() || !session.isConnected()) {
			logger.error("Not connected to the database");
			// Return HttpStatus 412
			return new ResponseEntity<String>(HttpStatus.PRECONDITION_FAILED);
		}

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("Remove model '%s' from database", this.classModel.getSimpleName()));
		}

		// Get driver
		T model = retrieveModelObject(id, null);

		// Remove data from database
		try {
			session.beginTransaction();
			session.delete(model);
			session.getTransaction().commit();
			session.close();
			// Return HttpStatus 200
			return new ResponseEntity<String>(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			// Return HttpStatus 500
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	/**
	 * PUT Update a model object to database
	 * 
	 * @param id model identifier
	 * @param jsonValue model data
	 * @return
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	public ResponseEntity<String> update(final String id, String jsonValue)
			throws NumberFormatException, InstantiationException, IllegalAccessException {

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("Update an object with id : %s", id));
		}

		// Get hibernate session factory
		final Session session = Application.getSession();
		if (!session.isOpen() || !session.isConnected()) {
			logger.error("Not connected to the database");
			// Return HttpStatus 412
			return new ResponseEntity<String>(HttpStatus.PRECONDITION_FAILED);
		}

		if (logger.isTraceEnabled()) {
			logger.trace(String.format("Update model '%s' from database", this.classModel.getSimpleName()));
		}

		// Get driver
		T model = retrieveModelObject(id, jsonValue);

		// Remove data from database
		try {
			session.beginTransaction();
			session.update(model);
			session.getTransaction().commit();
			session.close();
			// Return HttpStatus 200
			return new ResponseEntity<String>(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			// Return HttpStatus 500
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

}
