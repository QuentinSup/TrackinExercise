package fr.clevertech.exercise.trackin.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 
 * @author QuentinSup
 *
 */
@Entity
@Table(name = "waypoint")
public class WayPoint {

	/**
	 * Identifier
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	/**
	 * Waypoint label
	 */
	private String label;
	/**
	 * GPS coords : latitude
	 */
	private String latitude;
	/**
	 * GPS coords : longitude
	 */
	private String longitude;

	/**
	 * Constructor
	 */
	public WayPoint() {
		super();
	}
	
	/**
	 * Constructor with identifier
	 * @param id
	 */
	public WayPoint(int id) {
		this();
		this.id = id;
	}

	/**
	 * Return unique identifier
	 * 
	 * @return
	 */
	public int getId() {
		return this.id;
	}

	/**
	 * Set unique identifier
	 * 
	 * @param id
	 */
	protected void setId(int id) {
		this.id = id;
	}

	/**
	 * Set waypoint label
	 * 
	 * @param label
	 */
	public void setLabel(String label) {
		this.label = label;
	}

	/**
	 * Return waypoint label
	 * 
	 * @return
	 */
	public String getLabel() {
		return this.label;
	}

	/**
	 * Return waypoint GPS coord : latitude
	 * 
	 * @return
	 */
	public String getLatitude() {
		return latitude;
	}

	/**
	 * Set waypoint GPS coord : latitude
	 * @param latitude
	 */
	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	/**
	 * Return waypoint GPS coord : longitude
	 * 
	 * @return
	 */
	public String getLongitude() {
		return longitude;
	}

	/**
	 * Set waypoint GPS coord : longitude
	 * @param longitude
	 */
	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

}