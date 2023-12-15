import axios from "axios";
import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { performEventsValidation } from "../../services/helper";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import Toast from "../toast/Toast";
import { AuthContext } from "../../context/authContext";


import "./addEvent.css";

const AddEvent = () => {
  const INITIAL_STATE = {
    name: "",
    description: "",
    organizer: "",
    startTime: "",
    endTime: "",
    location: "",
    locationUrl: "",
    image: "",
    // links: [],
    // tags: [],
    // cost: 0,
  };

  const navigate = useNavigate();

  const [info, setInfo] = useState(INITIAL_STATE);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [organizer, setOrganizer] = useState("");
  console.log("Hello    AddEvent   organizer:", organizer);

  console.log("Hello    AddUser   info:", info);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const onSubmit = async () => {
    try {
      const data = { ...info, organizer };
      performEventsValidation(data);
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/event/create`,
        data
      );
      console.log("Hello    onSubmit   res:", res);
      setShowToast(true);
      setMessage("Event created successfully");
      setTimeout(() => {
        navigate("/events");
      }, 2000);
    } catch (error) {
      console.log("Hello    onSubmit   error:", error);
      setShowToast(true);
      setMessage(
        error?.response?.data || error?.message || "Something went wrong"
      );
    }
  };

  const { user } = useContext(AuthContext);
  console.log("Hello    AddEvent   user:", user);
  useEffect(() => {

    setOrganizer(user?._id);

  } , [user]);


  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="content">
        <Navbar />
        <div className="add-event-container">
          <h1 className="heading">Create Event</h1>
          <div className="formContainer">
            <div className="formGroup">
              <label htmlFor="name">Event Name</label>
              <input
                type="text"
                placeholder="Enter you event name"
                id="name"
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label htmlFor="organizer">Organizer</label>
              <input
                type="text"
                placeholder="Enter organizer details"
                id="organizer"
                // onChange={handleChange}
                value={organizer}
              />
            </div>
            <div className="formGroup">
              <label htmlFor="location">Event Location</label>
              <input
                type="text"
                id="location"
                placeholder="Enter you event location"
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label htmlFor="image">Event Location URL</label>
              <input
                type="text"
                id="locationUrl"
                placeholder="Enter you event location URL"
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label htmlFor="locationUrl">Image URL</label>
              <input
                type="text"
                id="image"
                placeholder="Enter you event image"
                onChange={handleChange}
              />
            </div>
            <div className="date">
              <div className="formGroup">
                <label htmlFor="">Start Time</label>
                <input
                  type="datetime-local"
                  id="startTime"
                  onChange={handleChange}
                />
              </div>
              <div className="formGroup">
                <label htmlFor="">End Time</label>
                <input
                  type="datetime-local"
                  id="endTime"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="formGroup">
              <label htmlFor="">Event Description</label>
              <textarea
                id="description"
                placeholder="Enter you event description"
                rows="6"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="buttonContainer">
            <button className="createButton" onClick={onSubmit}>
              Create
            </button>
          </div>
          <Toast
            message={message}
            show={showToast}
            onClose={() => {
              setShowToast(false);
            }}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AddEvent;
