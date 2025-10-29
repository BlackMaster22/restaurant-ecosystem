import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../services/api";

type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: string;
  category: { id: number; name: string };
  is_active: boolean;
};

const fetchItems = async (): Promise<MenuItem[]> => {
  const res = await api.get("/menu/items/");
  return res.data;
};

const MenuManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery(["menu-admin"], fetchItems);
  const deleteMutation = useMutation((id: number) => api.delete(`/menu/items/${id}/`), {
    onSuccess: () => queryClient.invalidateQueries(["menu-admin"])
  });

  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión del Menú</h1>
      <div className="mb-4">
        <a href="/cashier/menu/new" className="px-4 py-2 bg-indigo-600 text-white rounded">Nuevo ítem</a>
      </div>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((it) => (
            <div key={it.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
              <div>
                <div className="font-semibold">{it.name}</div>
                <div className="text-sm text-gray-600">{it.category?.name} • {it.price} €</div>
              </div>
              <div className="flex gap-2">
                <a href={`/cashier/menu/${it.id}/edit`} className="text-indigo-600">Editar</a>
                <button onClick={() => deleteMutation.mutate(it.id)} className="text-red-600">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;