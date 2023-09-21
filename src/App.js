import React from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header';
import ListDashboard from './components/ListDashboard';
import EditDashboard from './components/EditDashboard';
import ViewDashboard from './components/ViewDashboard';

function App() {
  return (
    <div>
      <Header />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<ListDashboard />} />
          <Route path="/dashboards" element={<ListDashboard />} />
          <Route path="/dashboard/edit" element={<EditDashboard />} />
          <Route path="/dashboard/view" element={<ViewDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;