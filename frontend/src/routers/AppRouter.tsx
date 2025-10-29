import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import MenuPage from "../modules/customer/pages/MenuPage";
import WaiterDashboard from "../modules/waiter/pages/WaiterDashboard";
import CashierDashboard from "../modules/cashier/pages/CashierDashboard";
import NewOrderPage from "../modules/waiter/pages/NewOrderPage";
import MenuManagement from "../modules/cashier/pages/MenuManagement";
import UserManagement from "../modules/cashier/pages/UserManagement";
import useAuthStore from "../stores/authStore";

const ProtectedRoute: React.FC<{ children: JSX.Element; roles?: string[] }> = ({ children, roles }) => {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/waiter/*"
        element={
          <ProtectedRoute roles={["WAITER"]}>
            <WaiterDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/waiter/new-order" element={<ProtectedRoute roles={["WAITER"]}><NewOrderPage /></ProtectedRoute>} />
      <Route
        path="/cashier/*"
        element={
          <ProtectedRoute roles={["CASHIER", "ADMIN"]}>
            <CashierDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/cashier/menu" element={<ProtectedRoute roles={["CASHIER", "ADMIN"]}><MenuManagement /></ProtectedRoute>} />
      <Route path="/cashier/users" element={<ProtectedRoute roles={["CASHIER", "ADMIN"]}><UserManagement /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;