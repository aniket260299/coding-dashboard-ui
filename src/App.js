import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header';
import ListDashboard from './components/ListDashboard';
import EditDashboard from './components/EditDashboard';
import ViewDashboard from './components/ViewDashboard';
import DashboardService from './service/DashboardService';
import './App.css'

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    DashboardService.getAllDashboard()
      .then(response => {
        localStorage.setItem("dashboardList", JSON.stringify(response.data));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner"></div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ padding: '20px 30px' }}>
        <Routes>
          <Route path="/" element={<ListDashboard />} />
          <Route path="/dashboards" element={<ListDashboard />} />
          <Route path="/dashboard/edit/:index" element={<EditDashboard />} />
          <Route path="/dashboard/view/:index" element={<ViewDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;