import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./component/layout/DashbardLayout";

import Dashboard from "./pages/Dashboard";

import LiveLogs from "./pages/LiveLogs";

import Threats from "./pages/Threats";

import ThreatDetails from "./pages/ThreatDetails";

import Analytics from "./pages/Analytics";

import Analyzer from "./pages/Analyzer";

import Copilot from "./pages/Copilot";

import Reports from "./pages/Reports";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./component/ProtectedRoute";

function Settings() {
  return <h1>Settings</h1>;
}

function App() {
  return (
    <Routes>
<Route path="/login" element={<Login />} />

<Route path="/register" element={<Register />} />

<Route
  path="/"
  element={<Navigate to="/login" replace />}
/>
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>

      <Route
        path="/logs"
        element={
          <ProtectedRoute>
          <DashboardLayout>
            <LiveLogs />
          </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/threats"
        element={
          <ProtectedRoute>
          <DashboardLayout>
            <Threats />
          </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/threats/:id" element={<ThreatDetails />} />

<Route
  path="/analyzer"
  element={
    <ProtectedRoute>
    <DashboardLayout>
      <Analyzer />
    </DashboardLayout>
    </ProtectedRoute>
  }
/>

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
          <DashboardLayout>
            <Analytics />
          </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/copilot"
        element={
          <ProtectedRoute>
          <DashboardLayout>
            <Copilot />
          </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
          <DashboardLayout>
            <Reports />
          </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
