import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from './axios';
import './css/CreateEvent.css';

const CreateEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(location.state?.event || {});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state?.event) {
      setEventData(location.state.event);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Event Data:', eventData); // Debugging log

    try {
      if (eventData._id) {
        // Update existing event
        await api.put(`/events/${eventData._id}`, eventData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMessage('🎉 Event updated successfully!');
      } else {
        // Create new event
        await api.post('/events', eventData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMessage('🎉 Event created successfully!');
      }

      // Redirect to EventDashboard
      setTimeout(() => {
        navigate('/events');
      }, 1000);
    } catch (error) {
      console.error('Error saving event:', error);
      setMessage('❌ Failed to save event');
    }
  };

  return (
    <div className="create-event-container">
      <div className="form-wrapper">
        <h2 className="form-title">
          {eventData._id ? 'Edit Event' : 'Create Event'}
        </h2>
        <form className="create-event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Name</label>
            <input
              type="text"
              id="title"
              placeholder="Enter event name"
              value={eventData.title || ''}
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
              value={eventData.description || ''}
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
              value={eventData.date || ''}
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
              value={eventData.location || ''}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={eventData.category || ''}
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

          <button type="submit" className="submit-button">
            {eventData._id ? 'Update Event' : 'Create Event'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default CreateEvent;
