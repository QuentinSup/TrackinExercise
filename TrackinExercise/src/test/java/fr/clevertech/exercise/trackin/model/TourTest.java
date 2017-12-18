package fr.clevertech.exercise.trackin.model;

import static org.junit.Assert.*;

import org.json.JSONObject;
import org.junit.Test;

/**
 * Tour unit tests
 * @author ETP3433
 *
 */
public class TourTest {

	Tour tour = new Tour();
	
	public TourTest() {
		tour.setId(1);
		tour.setDriverId(1);
	}
	
	@Test
	public void testIdSetterAndGetter() {
		assertTrue(tour.getId() == 1);
	}

	@Test
	public void testDriverIdSetterAndGetter() {
		assertTrue(tour.getDriverId() == 1);
	}

	@Test
	public void testToJson() {
		final String jsonValue = tour.toJson();
		final JSONObject json = new JSONObject(jsonValue);
		assertTrue(json.optInt("id") == 1);
		assertTrue(json.optInt("driverId") == 1);
	}

}
