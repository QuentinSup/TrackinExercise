package fr.clevertech.exercise.trackin.model.def;

public interface IWayPoint {
	public int getId();
	public void setId(int id);
	public void setLabel(String label);
	public String getLabel();
	public String getLatitude();
	public void setLatitude(String latitude);
	public String getLongitude();
	public void setLongitude(String longitude);
	public int getPosition();
	public void setPosition(int position);
	public int getType();
	public void setType(int type);
	public int getTourId();
	public void setTourId(int tourId);
}
