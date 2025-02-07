import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "./axios";
import "./css/CreateEvent.css";

const CreateEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(location.state?.event || {});
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state?.event) {
      setEventData(location.state.event);
    }
  }, [location.state]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const MAX_WIDTH = 400; // Set max width
          const MAX_HEIGHT = 300; // Set max height

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            setImage(new File([blob], file.name, { type: file.type }));
          }, file.type);
        };
      };
    }
  };


  // ✅ Handle Image Removal
  const handleDeleteImage = () => {
    setImage(null);
    setEventData((prev) => ({ ...prev, imageUrl: "" })); // ✅ Clear the stored image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Submitting Event Data:", eventData);

    try {
      let imageUrl = eventData.imageUrl || "";

      // ✅ Upload Image Only If Selected
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const imageResponse = await api.post("/events/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = imageResponse.data.imageUrl; // ✅ Get Image URL
      }

      // ✅ Prepare Event Data
      const updatedEventData = { ...eventData, imageUrl };

      let response;
      if (eventData._id) {
        // ✅ Update Event (Fixed API path)
        response = await api.put(`/events/${eventData._id}`, updatedEventData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMessage("🎉 Event updated successfully!");
      } else {
        // ✅ Create New Event (Fixed API path)
        response = await api.post("/events", updatedEventData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMessage("🎉 Event created successfully!");
      }

      console.log("✅ Event Saved Successfully:", response.data);

      // ✅ Redirect to Event Dashboard
      setTimeout(() => {
        navigate("/events");
      }, 1000);
    } catch (error) {
      console.error("❌ Error saving event:", error);

      // ✅ Handle Unauthorized (Token Expired)
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setMessage("❌ Failed to save event");
      }
    }
  };

  return (
    <div className="create-event-container">
      <div className="form-wrapper">
        <h2 className="form-title">
          {eventData._id ? "Edit Event" : "Create Event"}
        </h2>
        <form className="create-event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Name</label>
            <input
              type="text"
              id="title"
              placeholder="Enter event name"
              value={eventData.title || ""}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Event Description</label>
            <textarea
              id="description"
              placeholder="Enter event description"
              value={eventData.description || ""}
              onChange={(e) =>
                setEventData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date & Time</label>
            <input
              type="datetime-local"
              id="date"
              value={eventData.date || ""}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, date: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              placeholder="Enter event location"
              value={eventData.location || ""}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={eventData.category || ""}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, category: e.target.value }))
              }
            >
              <option value="">Select Category</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          {/* ✅ Image Upload Input (Optional) */}
          <div className="form-group">
            <label htmlFor="image">Event Image (Optional)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>

          {/* ✅ Image Preview & Delete Button */}
          {(eventData.imageUrl || image) && (
            <div className="image-preview" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={image ? URL.createObjectURL(image) : eventData.imageUrl}
                alt="Event"
                style={{
                  maxWidth: "150px",  // Increase width for better visibility
                  maxHeight: "150px", // Increase height
                  width: "auto",
                  height: "auto",
                  objectFit: "contain", // ✅ Prevent cropping
                  borderRadius: "5px",
                  border: "1px solid #ccc", // Optional: Add border for clarity
                }}
              />

              <button
                type="button"
                onClick={handleDeleteImage}
                className="delete-image-btn"
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "5px"
                }}
              >
                ❌ Remove Image
              </button>
            </div>
          )}
          <button type="submit" className="submit-button">
            {eventData._id ? "Update Event" : "Create Event"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default CreateEvent;
