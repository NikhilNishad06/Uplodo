import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import ReportsDashboard from './pages/ReportsDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/reports" replace />} />
          <Route path="reports" element={<ReportsDashboard />} />
          <Route path="settings" element={<div className="text-2xl font-bold p-6">Settings Page</div>} />
          <Route path="*" element={<Navigate to="/reports" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
