import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminNavbar from './components/AdminNavbar';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './pages/AdminDashboard';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import FacultyJobs from './pages/FacultyJobs';
import FacultyEvents from './pages/FacultyEvents';
import FacultyProfile from './pages/FacultyProfile';
import StudentEvents from './pages/StudentEvents';
import StudentJobOpenings from './pages/StudentJobOpenings';
import StudentProfile from './pages/StudentProfile';
import StudentReferrals from './pages/StudentReferrals';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import NotAuthorizedPage from './pages/NotAuthorizedPage';

import StudentDashboard from './pages/StudentDashboard';
import AlumniDashboard from './pages/AlumniDashboard';
import AlumniJobs from './pages/AlumniJobs';
import AlumniReferrals from './pages/AlumniReferrals';
import AlumniApplications from './pages/AlumniApplications';
import AlumniProfile from './pages/AlumniProfile';
import AlumniEvents from './pages/AlumniEvents';
import FacultyDashboard from './pages/FacultyDashboard';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import './App.css';

function App() {
  return (
    <Router>
      <AdminNavbar />
      <ToastContainer position="top-center" />
      <Routes>
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/student/contact" element={<ContactUs />} />
        <Route path="/not-authorized" element={<NotAuthorizedPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/about" element={<AboutUs />} />
<Route path="/admin/contact" element={<ContactUs />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
<Route path="/student/about" element={<AboutUs />} />
<Route path="/student/events" element={<StudentEvents />} />
          <Route path="/student/job-openings" element={<StudentJobOpenings />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/referrals" element={<StudentReferrals />} />
          <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
<Route path="/alumni/about" element={<AboutUs />} />
<Route path="/alumni/contact" element={<ContactUs />} />
          <Route path="/alumni/jobs" element={<AlumniJobs />} />
          <Route path="/alumni/referrals" element={<AlumniReferrals />} />
          <Route path="/alumni/applications" element={<AlumniApplications />} />
          <Route path="/alumni/profile" element={<AlumniProfile />} />
          <Route path="/alumni/events" element={<AlumniEvents />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
<Route path="/faculty/about" element={<AboutUs />} />
<Route path="/faculty/contact" element={<ContactUs />} />
          <Route path="/faculty/jobs" element={<FacultyJobs />} />
          <Route path="/faculty/events" element={<FacultyEvents />} />
          <Route path="/faculty/profile" element={<FacultyProfile />} />
        </Route>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
