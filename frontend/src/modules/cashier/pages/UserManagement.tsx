import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../services/api";

type User = {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
};

const fetchUsers = async (): Promise<User[]> => {
  const res = await api.get("/auth/users/");
  return res.data;
};

const UserManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading } = useQuery(["users"], fetchUsers);
  const deleteMutation = useMutation((id: number) => api.delete(`/auth/users/${id}/`), {
    onSuccess: () => queryClient.invalidateQueries(["users"])
  });

  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <div className="mb-4">
        <a href="/cashier/users/new" className="px-4 py-2 bg-indigo-600 text-white rounded">Crear usuario</a>
      </div>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="bg-white rounded shadow p-3 flex justify-between items-center">
              <div>
                <div className="font-semibold">{u.username} {u.first_name && `({u.first_name})`}</div>
                <div className="text-sm text-gray-600">{u.email} • {u.role}</div>
              </div>
              <div className="flex gap-2">
                <a href={`/cashier/users/${u.id}/edit`} className="text-indigo-600">Editar</a>
                <button onClick={() => deleteMutation.mutate(u.id)} className="text-red-600">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;