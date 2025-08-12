import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';

const team = [
  { name: 'Team Member 1', role: 'Developer', desc: 'Frontend & Backend' },
  { name: 'Team Member 2', role: 'Designer', desc: 'UI/UX Design' },
  { name: 'Team Member 3', role: 'Coordinator', desc: 'Project Management' },
];

const AboutUs = () => (
  <Container className="my-4">
    <h2 className="mb-4">About CollabNest</h2>
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Our Website</Card.Title>
        <Card.Text>
          CollabNest is the campus collaboration hub for events, alumni, and student engagement. Built to simplify and empower college communities.
        </Card.Text>
      </Card.Body>
    </Card>
    <h3 className="mb-3">Our Team</h3>
    <Row>
      {team.map((member, idx) => (
        <Col key={idx} md={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>{member.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{member.role}</Card.Subtitle>
              <Card.Text>{member.desc}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);

export default AboutUs;
