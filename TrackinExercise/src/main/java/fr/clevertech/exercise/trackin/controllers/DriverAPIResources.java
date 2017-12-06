package fr.clevertech.exercise.trackin.controllers;

import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import fr.clevertech.exercise.trackin.api.APIResources;
import fr.clevertech.exercise.trackin.model.Driver;

/**
 * API Driver resources
 * GET /api/drivers
 * POST /api/drivers
 * PUT /api/drivers/{driver_id} 
 * DELETE /api/drivers/{driver_id}
 * 
 * @author QuentinSup
 */
@Controller
@RequestMapping("/api/drivers")
public class DriverAPIResources extends APIResources<Driver> {

	/**
	 * Constructor
	 */
	public DriverAPIResources() {
		super(Driver.class, "lastName ASC");
	}
	
	/**
	 * Populate Driver data
	 * 
	 * @param driver
	 * @param jsonValue
	 * @return
	 */
	@Override
	public void populateModel(Driver driver, final String jsonValue) {

		if (jsonValue != null && !"".equals(jsonValue.trim())) {
			// Parse json value
			JSONObject json = new JSONObject(jsonValue);

			// Create Driver
			driver.setFirstName(json.optString("firstName"));
			driver.setLastName(json.optString("lastName"));
			driver.setGender(json.optInt("gender", 0));
		}

	}

}
