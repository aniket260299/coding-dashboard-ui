import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'
import Header from './components/Header';
import ListDashboard from './components/ListDashboard';
import EditDashboard from './components/EditDashboard';
import ViewDashboard from './components/ViewDashboard';
import './App.css'
import Auth from './components/Auth';

function App() {
  const jwtToken = localStorage.getItem("jwt-token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwtToken) {
      navigate("/auth");
    }
  }, [jwtToken]);

  return (
    <div>
      <Header />
      <div style={{ padding: '20px 30px' }}>
        <Routes>
          <Route path="/" element={<ListDashboard />} />
          <Route path="/dashboards" element={<ListDashboard />} />
          <Route path="/dashboard/edit/:index" element={<EditDashboard />} />
          <Route path="/dashboard/view/:index" element={<ViewDashboard />} />
          <Route path='/auth' element={<Auth />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;