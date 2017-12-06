package fr.clevertech.exercise.trackin.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Driver hibernate model
 * @author QuentinSup
 */
@Entity
@Table(name = "driver")
public class Driver extends AbstractModel {
	
	/**
	 * Identifier
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	/**
	 * Driver firstName
	 */
	private String firstName;
	/**
	 * Driver lastName
	 */
	private String lastName;
	/**
	 * Driver gender (0: Male, 1: Female)
	 */
	private Integer gender;
	
	/**
	 * Constructor
	 */
	public Driver() {
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
	 * Set driver firstName
	 * 
	 * @param firstName
	 */
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	/**
	 * Return driver firstName
	 * 
	 * @return
	 */
	public String getFirstName() {
		return firstName;
	}
	
	/**
	 * Set driver lastName
	 * 
	 * @param firstName
	 */
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	/**
	 * Return driver lastName
	 * 
	 * @return
	 */
	public String getLastName() {
		return lastName;
	}

	/**
	 * Return driver gender
	 * @return
	 */
	public int getGender() {
		return gender;
	}

	/**
	 * Set driver gender
	 * @param position
	 */
	public void setGender(int gender) {
		this.gender = new Integer(gender);
	}

}
