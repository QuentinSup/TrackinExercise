package fr.clevertech.exercise.trackin.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Tour hibernate model
 * @author QuentinSup
 */
@Entity
@Table(name = "tour")
public class Tour extends AbstractModel {
	
	/**
	 * Identifier
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	/**
	 * Tour driver identifier
	 */
	@Column(name = "driver_id")
	private Integer driverId;
	
	/**
	 * Constructor
	 */
	public Tour() {
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
	 * Set tour driver id
	 * 
	 * @param driverId
	 */
	public void setDriverId(int driverId) {
		this.driverId = driverId;
	}

	/**
	 * Return tour driver id
	 * 
	 * @return
	 */
	public int getDriverId() {
		return driverId;
	}

}
