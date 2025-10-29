import React from "react";
import { Link } from "react-router-dom";

const WaiterDashboard: React.FC = () => {
  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel Camarero</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/waiter/new-order" className="p-4 bg-white rounded shadow">Tomar pedido</Link>
        <Link to="/waiter/orders" className="p-4 bg-white rounded shadow">Pedidos activos</Link>
      </div>
      <div className="mt-6 text-sm text-gray-600">Este panel aún es scaffold; agrega las páginas de carrito/crear pedido según sea necesario.</div>
    </div>
  );
};

export default WaiterDashboard;