package fr.clevertech.exercise.trackin.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Waypoint hibernate model
 * @author QuentinSup
 */
@Entity
@Table(name = "waypoint")
public class WayPoint extends AbstractModel {
	
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
	 * Route delivery position
	 */
	private Integer position;
	/**
	 * Route delivery type (0:pickup, 1:drop)
	 */
	private Integer type;
	
	/**
	 * Constructor
	 */
	public WayPoint() {
		super();
	}

	/**
	 * Return unique identifier
	 * 
	 * @return
	 */
	public int getId() {
		return id;
	}

	/**
	 * Set unique identifier
	 * 
	 * @param id
	 */
	public void setId(int id) {
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
		return label;
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
	
	/**
	 * Return delivery position
	 * @return
	 */
	public int getPosition() {
		return position;
	}

	/**
	 * Set delivery position
	 * @param position
	 */
	public void setPosition(int position) {
		this.position = new Integer(position);
	}

	/**
	 * Return delivery type
	 * @return
	 */
	public int getType() {
		return type;
	}

	/**
	 * Set delivery type
	 * @param position
	 */
	public void setType(int type) {
		this.type = new Integer(type);
	}

}
