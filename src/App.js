import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'
import Header from './components/Header';
import ListDashboard from './components/ListDashboard';
import EditDashboard from './components/EditDashboard';
import ViewDashboard from './components/ViewDashboard';
import DashboardService from './service/DashboardService';
import Auth from './components/Auth';
import './App.css'


function App() {
  let jwtToken = localStorage.getItem("jwt-token");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    jwtToken = localStorage.getItem("jwt-token");
    if (authenticated) {
      setLoading(true);
      DashboardService.getAllDashboard(jwtToken)
        .then(response => {
          localStorage.setItem("dashboardList", JSON.stringify(response.data));
          setLoading(false);
        });
    } else {
      navigate("/auth");
    }
  }, []);

  const requireAuth = (nextState, replace) => {
    if (!authenticated) {
      replace({
        pathname: "/auth",
        state: { nextPathname: nextState.location.pathname }
      });
    }
  }

  const authenticated = () => {
    if (jwtToken) {
      const now = new Date();
      const expiry = new Date(Number(localStorage.getItem("jwt-token-expiry")));
      if (expiry > now) return true;
    }
    return false;
  }

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
          <Route path="/" element={<ListDashboard />} onEnter={requireAuth()} />
          <Route path="/dashboards" element={<ListDashboard />} onEnter={requireAuth()} />
          <Route path="/dashboard/edit/:index" element={<EditDashboard />} onEnter={requireAuth()} />
          <Route path="/dashboard/view/:index" element={<ViewDashboard />} onEnter={requireAuth()} />
          <Route path='/auth' element={<Auth />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;