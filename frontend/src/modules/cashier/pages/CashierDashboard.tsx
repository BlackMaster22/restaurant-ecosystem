import React from "react";

const CashierDashboard: React.FC = () => {
  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel Caja</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Pedidos</div>
        <div className="p-4 bg-white rounded shadow">Gestión Menú</div>
        <div className="p-4 bg-white rounded shadow">Usuarios</div>
      </div>
      <div className="mt-6 text-sm text-gray-600">Dashboard con métricas y acciones para caja. Implementar endpoints y widgets.</div>
    </div>
  );
};

export default CashierDashboard;