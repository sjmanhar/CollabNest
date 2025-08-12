import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import { getAllEvents } from '../service/eventService';

const AlumniEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllEvents()
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch events.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="alumni-bg homepage-flex-wrapper">
      <Container style={{ marginTop: 30, maxWidth: 700 }}>
        <h2 className="text-white">Alumni Events</h2>
        {loading && <Spinner animation="border" variant="primary" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          events.length > 0 ? (
            events.map(ev => (
              <Card key={ev.eventId} className="alumni-card" style={{ marginBottom: 20 }}>
                <Card.Body>
                  <Card.Title className="text-dark">{ev.title}</Card.Title>
                  <Card.Text>{ev.description}</Card.Text>
                  <div>Date & Time: {ev.datetime ? new Date(ev.datetime).toLocaleString() : 'N/A'}</div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Alert variant="info">No events found.</Alert>
          )
        )}
      </Container>
    </div>
  );
};

export default AlumniEvents;
