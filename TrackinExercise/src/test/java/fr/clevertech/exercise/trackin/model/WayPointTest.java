package fr.clevertech.exercise.trackin.model;

import static org.junit.Assert.*;

import org.json.JSONObject;
import org.junit.Test;

/**
 * Waypoint unit tests
 * @author ETP3433
 *
 */
public class WayPointTest {

	WayPoint waypoint = new WayPoint();
	
	public WayPointTest() {
		waypoint.setId(1);
		waypoint.setLabel("My Waypoint");
		waypoint.setLatitude("5.12");
		waypoint.setLongitude("7.49");
		waypoint.setPosition(1);
		waypoint.setTourId(5);
		waypoint.setType(1);
	}
	
	@Test
	public void testIdSetterAndGetter() {
		assertTrue(waypoint.getId() == 1);
	}

	@Test
	public void testLabelSetterAndGetter() {
		assertTrue("My Waypoint".equals(waypoint.getLabel()));
	}
	
	@Test
	public void testLatitudeSetterAndGetter() {
		assertTrue("5.12".equals(waypoint.getLatitude()));
	}
	
	@Test
	public void testLongitudeSetterAndGetter() {
		assertTrue("7.49".equals(waypoint.getLongitude()));
	}
	
	@Test
	public void testPositionSetterAndGetter() {
		assertTrue(waypoint.getPosition() == 1);
	}
	
	@Test
	public void testTourIdSetterAndGetter() {
		assertTrue(waypoint.getTourId() == 5);
	}
	
	@Test
	public void testTypeSetterAndGetter() {
		assertTrue(waypoint.getType() == 1);
	}

	@Test
	public void testToJson() {
		final String jsonValue = waypoint.toJson();
		final JSONObject json = new JSONObject(jsonValue);
		assertTrue(json.optInt("id") == 1);
		assertTrue("My Waypoint".equals(json.optString("label")));
		assertTrue("5.12".equals(json.optString("latitude")));
		assertTrue("7.49".equals(json.optString("longitude")));
		assertTrue(json.optInt("position") == 1);
		assertTrue(json.optInt("tourId") == 5);
		assertTrue(json.optInt("type") == 1);
	}

}
