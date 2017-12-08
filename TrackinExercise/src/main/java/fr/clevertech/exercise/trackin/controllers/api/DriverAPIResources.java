package fr.clevertech.exercise.trackin.controllers.api;

import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import fr.clevertech.exercise.trackin.api.APIResources;
import fr.clevertech.exercise.trackin.model.Driver;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

/**
 * API Driver resources GET /api/drivers
 * 
 * @author QuentinSup
 */
@Controller
@Api(value = "/drivers")
@RequestMapping("/api/drivers")
public class DriverAPIResources extends APIResources<Driver> {

	/**
	 * Constructor
	 */
	public DriverAPIResources() {
		super(Driver.class, "firstName ASC");
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

			// Populate Driver data
			driver.setFirstName(json.optString("firstName"));
			driver.setLastName(json.optString("lastName"));
			driver.setGender(json.optInt("gender", 0));
		}

	}

	/**
	 * LIST Return all drivers list from database
	 * 
	 * @param json
	 * @return
	 */
	@ApiOperation(httpMethod = "GET", produces = "application/json; charset=UTF-8", value = "Return list of drivers sorted by lastName", response = Driver.class)
	@ApiResponses({ @ApiResponse(code = 200, message = "OK"),
			@ApiResponse(code = 412, message = "Not connected to database"),
			@ApiResponse(code = 500, message = "Internal server error") })
	@RequestMapping(method = RequestMethod.GET, produces = "application/json; charset=UTF-8")
	@Override
	public ResponseEntity<String> list() {
		return super.list();
	}

}
