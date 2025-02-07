import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axios';
import './css/EventDashboard.css';
import useSocket from "./hooks/useSocket";

const EventDashboard = forwardRef(({ token, isGuest }, ref) => {
  const { attendees, socket } = useSocket();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const userId = localStorage.getItem('userId'); // Get logged-in user ID

  const navigate = useNavigate();

  // ✅ Fetch events when the component mounts
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

  // ✅ Real-time event updates with WebSockets
  useEffect(() => {
    events.forEach((event) => {
      socket.emit("join_event", event._id);
    });

    socket.on("update_attendees", ({ eventId, count }) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, attendeeCount: count } : event
        )
      );
    });

    return () => {
      events.forEach((event) => {
        socket.emit("leave_event", event._id);
      });
      socket.off("update_attendees");
    };
  }, [events, socket]);

  // ✅ Handle Edit Event
  const handleEdit = (event) => {
    if (isGuest) {
      alert("You need to log in to edit events.");
      navigate("/login");
      return;
    }
    navigate('/create-event', { state: { event } });
  };

  // ✅ Handle Delete Event
  const handleDelete = async (eventId) => {
    if (isGuest) {
      alert("You need to log in to delete events.");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId)); // ✅ Remove from UI instantly
      alert('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error.response?.data || error.message);
      alert('Failed to delete event. Please try again.');
    }
  };

  // ✅ Reset Filters
  useImperativeHandle(ref, () => ({
    resetFilters: () => {
      setSearchTerm('');
      setCategoryFilter('');
      setLocationFilter('');
      setStartDate('');
    },
  }));

  // ✅ Filter events based on search and filters
  const filteredEvents = events
    .filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((event) => (categoryFilter ? event.category?.toLowerCase().trim() === categoryFilter.toLowerCase().trim() : true))
    .filter((event) => (locationFilter ? event.location?.toLowerCase().trim().includes(locationFilter.toLowerCase().trim()) : true))
    .filter((event) => (startDate ? new Date(event.date) >= new Date(startDate) : true));

  const upcomingEvents = filteredEvents.filter((event) => new Date(event.date) >= new Date());
  const pastEvents = filteredEvents.filter((event) => new Date(event.date) < new Date());

  return (
    <div className="event-dashboard">
      <div className="filters">
        <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Education">Education</option>
          <option value="Technology">Technology</option>
        </select>

        <input type="text" placeholder="Search by location..." value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />

        <div className="date-filter">
          <input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
      </div>

      <h3 className="section-title">Upcoming Events</h3>
      <div className="event-grid">
        {upcomingEvents.length === 0 ? (
          <p className="no-events-message">No upcoming events available.</p>
        ) : (
          upcomingEvents.map((event) => (
            <div className="event-card" key={event._id}>
              {event.imageUrl && (
                <img
                src={event.imageUrl}
                alt={event.title}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "contain", // ✅ Prevents cropping
                  borderRadius: "5px",
                  backgroundColor: "#f8f8f8", // ✅ Ensures background fills empty spaces
                }}
              />
              
              )}
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <p className="event-date"><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
              <p className="event-location"><strong>Location:</strong> {event.location || 'N/A'}</p>
              <p className="event-category"><strong>Category:</strong> {event.category || 'N/A'}</p>
              <p className="event-attendees"><strong>Attendees:</strong> {attendees[event._id] || 0}</p>

              {/* ✅ Show Edit/Delete Buttons Only for the Event Creator */}
              {token && String(event.creator) === String(userId) && (
                <div className="event-actions">
                  <button className="edit-button" onClick={() => handleEdit(event)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(event._id)}>Delete</button>
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
              {event.imageUrl && (
                <img
                src={event.imageUrl}
                alt={event.title}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "contain", // ✅ Prevents cropping
                  borderRadius: "5px",
                  backgroundColor: "#f8f8f8", // ✅ Ensures background fills empty spaces
                }}
              />
              
              )}
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <p className="event-date"><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
              <p className="event-location"><strong>Location:</strong> {event.location || 'N/A'}</p>
              <p className="event-category"><strong>Category:</strong> {event.category || 'N/A'}</p>

               {/* ✅ Show Edit/Delete Buttons Only for the Event Creator */}
               {token && String(event.creator) === String(userId) && (
                <div className="event-actions">
                  <button className="edit-button" onClick={() => handleEdit(event)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(event._id)}>Delete</button>
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
