import React from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header';
import ListDashboard from './components/ListDashboard';

function App() {
  return (
    <div>
      <Header />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<ListDashboard />} />
          <Route path="/dashboards" element={<ListDashboard />} />
          {/* <Route path="/add" element={<AddTutorial />} />
        <Route path="/tutorials/:id" element={<Tutorial />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;