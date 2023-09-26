import React from 'react';
import { Route, Routes } from 'react-router-dom'
import { Container } from 'reactstrap';
import Header from './components/Header';
import ListDashboard from './components/ListDashboard';
import EditDashboard from './components/EditDashboard';
import ViewDashboard from './components/ViewDashboard';

function App() {
  return (
    <div>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<ListDashboard />} />
          <Route path="/dashboards" element={<ListDashboard />} />
          <Route path="/dashboard/edit" element={<EditDashboard />} />
          <Route path="/dashboard/view" element={<ViewDashboard />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;