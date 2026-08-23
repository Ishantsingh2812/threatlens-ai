import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./component/layout/DashbardLayout";

import Dashboard from "./pages/Dashboard";

import LiveLogs from "./pages/LiveLogs";

import Threats from "./pages/Threats";



function Analyzer() {
  return <h1>Analyzer</h1>;
}

function Analytics() {
  return <h1>Analytics</h1>;
}

function Copilot() {
  return <h1>AI Copilot</h1>;
}

function Reports() {
  return <h1>Reports</h1>;
}

function Settings() {
  return <h1>Settings</h1>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        }
      />

      <Route
        path="/logs"
        element={
          <DashboardLayout>
            <LiveLogs />
          </DashboardLayout>
        }
      />

      <Route
        path="/threats"
        element={
          <DashboardLayout>
            <Threats />
          </DashboardLayout>
        }
      />

      <Route
        path="/analyzer"
        element={
          <DashboardLayout>
            <Analyzer />
          </DashboardLayout>
        }
      />

      <Route
        path="/analytics"
        element={
          <DashboardLayout>
            <Analytics />
          </DashboardLayout>
        }
      />

      <Route
        path="/copilot"
        element={
          <DashboardLayout>
            <Copilot />
          </DashboardLayout>
        }
      />

      <Route
        path="/reports"
        element={
          <DashboardLayout>
            <Reports />
          </DashboardLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        }
      />
    </Routes>
  );
}

export default App;
