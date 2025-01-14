import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axios';
import './css/EventDashboard.css';

const EventDashboard = forwardRef(({ token }, ref) => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [userId] = useState(localStorage.getItem('userId'));

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEdit = (event) => {
    navigate('/create-event', { state: { event } }); // Navigate to Create Event route with event data
  };

  const handleDelete = async (eventId) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return; // Exit if the user cancels
  
    try {
      const response = await api.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('Delete response:', response.data);
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId)); // Update state
      alert('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error.response?.data || error.message);
      alert('Failed to delete event. Please try again.');
    }
  };    

  // Expose the resetFilters function to the parent component
  useImperativeHandle(ref, () => ({
    resetFilters: () => {
      setSearchTerm('');
      setCategoryFilter('');
      setLocationFilter('');
      setStartDate('');
    },
  }));

  const filteredEvents = events
    .filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((event) =>
      categoryFilter
        ? event.category?.toLowerCase().trim() === categoryFilter.toLowerCase().trim()
        : true
    )
    .filter((event) =>
      locationFilter
        ? event.location?.toLowerCase().trim().includes(locationFilter.toLowerCase().trim())
        : true
    )
    .filter((event) =>
      startDate ? new Date(event.date) >= new Date(startDate) : true
    );

  const upcomingEvents = filteredEvents.filter(
    (event) => new Date(event.date) >= new Date()
  );

  const pastEvents = filteredEvents.filter(
    (event) => new Date(event.date) < new Date()
  );

  return (
    <div className="event-dashboard">
      <div className="filters">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Education">Education</option>
          <option value="Technology">Technology</option>
        </select>

        <input
          type="text"
          placeholder="Search by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />

        <div className="date-filter">
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
      </div>

      <h3 className="section-title">Upcoming Events</h3>
      <div className="event-grid">
        {upcomingEvents.length === 0 ? (
          <p className="no-events-message">No upcoming events available.</p>
        ) : (
          upcomingEvents.map((event) => (
            <div className="event-card" key={event._id}>
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <p className="event-date">
                <strong>Date:</strong> {new Date(event.date).toLocaleString()}
              </p>
              <p className="event-location">
                <strong>Location:</strong> {event.location || 'N/A'}
              </p>
              <p className="event-category">
                <strong>Category:</strong> {event.category || 'N/A'}
              </p>
              {token && event.creator === userId && (
                <div className="event-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(event)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <h3 className="section-title">Past Events</h3>
      <div className="event-grid">
        {pastEvents.length === 0 ? (
          <p className="no-events-message">No past events available.</p>
        ) : (
          pastEvents.map((event) => (
            <div className="event-card" key={event._id}>
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <p className="event-date">
                <strong>Date:</strong> {new Date(event.date).toLocaleString()}
              </p>
              <p className="event-location">
                <strong>Location:</strong> {event.location || 'N/A'}
              </p>
              <p className="event-category">
                <strong>Category:</strong> {event.category || 'N/A'}
              </p>
              {token && event.creator === userId && (
                <div className="event-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(event)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export default EventDashboard;
