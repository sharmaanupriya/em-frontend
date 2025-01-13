import React, { useEffect, useState } from 'react';
import api from './axios';
// import AttendeeList from './AttendeeList';

const EventDashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.log('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Event Dashboard</h2>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>Date: {new Date(event.date).toLocaleString()}</p>
              {/* <AttendeeList eventId={event._id} /> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventDashboard;
