package fr.clevertech.exercise.trackin.model.def;

public interface IDriver {
	public int getId();
	public void setId(int id);
	public void setFirstName(String firstName);
	public String getFirstName();
	public void setLastName(String lastName);
	public String getLastName();
	public int getGender();
	public void setGender(int gender);
}
