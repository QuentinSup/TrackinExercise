package fr.clevertech.exercise.trackin.model;

import static org.junit.Assert.*;

import org.json.JSONObject;
import org.junit.Test;

/**
 * Driver unit tests
 * @author ETP3433
 *
 */
public class DriverTest {

	Driver driver = new Driver();
	
	public DriverTest() {
		driver.setId(1);
		driver.setFirstName("test");
		driver.setLastName("test2");
		driver.setGender(0);	
	}
	
	@Test
	public void testIdSetterAndGetter() {
		assertTrue(driver.getId() == 1);
	}

	@Test
	public void testFirstNameSetterAndGetter() {
		assertTrue("test".equals(driver.getFirstName()));
	}

	@Test
	public void testLastNameSetterAndGetter() {
		assertTrue("test2".equals(driver.getLastName()));
	}

	@Test
	public void testGender() {
		assertTrue(driver.getGender() == 0);
	}

	@Test
	public void testToJson() {
		final String jsonValue = driver.toJson();
		final JSONObject json = new JSONObject(jsonValue);
		assertTrue(json.optInt("id") == 1);
		assertTrue("test".equals(json.optString("firstName")));
		assertTrue("test2".equals(json.optString("lastName")));
		assertTrue(json.optInt("gender") == 0);
	}

}
