import React, { useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getToken } from '../service/tokenService';

const AdminNavbar = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getToken();
    if (auth && auth.role) {
      let expectedPath = null;
      switch (auth.role) {
        case 'ROLE_ADMIN':
        case 'ADMIN':
          expectedPath = '/admin/dashboard';
          break;
        case 'ROLE_FACULTY':
        case 'FACULTY':
          expectedPath = '/faculty/dashboard';
          break;
        case 'ROLE_ALUMNI':
        case 'ALUMNI':
          expectedPath = '/alumni/dashboard';
          break;
        case 'ROLE_STUDENT':
        case 'STUDENT':
          expectedPath = '/student/dashboard';
          break;
        default:
          expectedPath = '/home';
      }
      // Only redirect if on root, login, or home pages
      if (["/", "/login", "/home"].includes(window.location.pathname)) {
        navigate(expectedPath, { replace: true });
      }
    }
  }, [navigate]);
  const location = useLocation();
  const path = location.pathname;

  // Public pages navbar
  if (["/", "/home", "/about", "/contact", "/login", "/register"].includes(path)) {
    return (
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">CollabNest</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/about">About Us</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  // Student dashboard navbar
  if (path.startsWith('/student')) {
    return (
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/student/dashboard">CollabNest Student</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/student/about">About Us</Nav.Link>
              <Nav.Link as={Link} to="/student/contact">Contact Us</Nav.Link>
              <Nav.Link as={Link} to="/student/job-openings">Job Openings</Nav.Link>
              <Nav.Link as={Link} to="/student/events">Events</Nav.Link>
              <Nav.Link as={Link} to="/student/referrals">Referrals</Nav.Link>
              <Nav.Link as={Link} to="/student/profile">Profile</Nav.Link>
              <Nav.Link onClick={() => { import('../service/tokenService').then(({ removeToken }) => { removeToken(); }); window.location.href = '/home'; }}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  // Alumni dashboard navbar
  if (path.startsWith('/alumni')) {
    return (
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/alumni/dashboard">CollabNest Alumni</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/alumni/about">About Us</Nav.Link>
              <Nav.Link as={Link} to="/alumni/contact">Contact Us</Nav.Link>
              <Nav.Link as={Link} to="/alumni/profile">Profile</Nav.Link>
              <Nav.Link as={Link} to="/alumni/jobs">Job Openings</Nav.Link>
              <Nav.Link as={Link} to="/alumni/referrals">Referrals</Nav.Link>
              <Nav.Link as={Link} to="/alumni/applications">Applications</Nav.Link>
              <Nav.Link as={Link} to="/alumni/events">Events</Nav.Link>
              <Nav.Link onClick={() => { import('../service/tokenService').then(({ removeToken }) => { removeToken(); }); window.location.href = '/home'; }}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  // Faculty dashboard navbar
  if (path.startsWith('/faculty')) {
    return (
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/faculty/dashboard">CollabNest Faculty</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/faculty/about">About Us</Nav.Link>
              <Nav.Link as={Link} to="/faculty/contact">Contact Us</Nav.Link>
              <Nav.Link as={Link} to="/faculty/profile">Profile</Nav.Link>
              <Nav.Link as={Link} to="/faculty/jobs">Create Jobs</Nav.Link>
              <Nav.Link as={Link} to="/faculty/events?create=1">Create Events</Nav.Link>
              {/* <Nav.Link as={Link} to="/faculty/mock-interviews">Schedule Mock Interviews</Nav.Link> */}
              <Nav.Link onClick={() => { import('../service/tokenService').then(({ removeToken }) => { removeToken(); }); window.location.href = '/home'; }}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  // Admin dashboard navbar
  if (path.startsWith('/admin')) {
    return (
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/admin/dashboard">CollabNest Admin</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/about">About Us</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
              <Nav.Link as={Link} to="/admin/profile">Profile</Nav.Link>
              <Nav.Link as={Link} to="/admin/approve-alumni">Approve Alumni</Nav.Link>
              <NavDropdown title="Faculty" id="faculty-dropdown">
                <NavDropdown.Item as={Link} to="/admin/add-faculty">Add Faculty</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/remove-faculty">Remove Faculty</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={() => { import('../service/tokenService').then(({ removeToken }) => { removeToken(); }); window.location.href = '/home'; }}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  // Default navbar (fallback)
  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">CollabNest</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/about">About Us</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
