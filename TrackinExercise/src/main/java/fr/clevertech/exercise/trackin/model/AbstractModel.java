package fr.clevertech.exercise.trackin.model;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Abstract class for hibernate model
 * @author QuentinSup
 */
public abstract class AbstractModel {

	/**
	 * Constructor
	 */
	public AbstractModel() {
		super();
	}
	
	/**
	 * Return waypoint as JSON data
	 */
	public String toJson() {
		final Gson gson = new GsonBuilder().create();
		return gson.toJson(this);
	}

	// Abstract methods
	public abstract void setId(int id);
	public abstract int getId();

}
