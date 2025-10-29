import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../stores/authStore";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/auth/login/", { username, password });
      const { access, refresh } = res.data;
      // Fetch user info from backend (assumes /auth/users/me or similar endpoint). For now, optimistic approach:
      const meRes = await api.get('/auth/users/me/').catch(() => null);
      const me = meRes?.data ?? { username, role: "WAITER" };
      setAuth({ token: access, refresh, user: me });
      if (me.role === "WAITER") navigate("/waiter/new-order");
      else if (me.role === "CASHIER" || me.role === "ADMIN") navigate("/cashier");
      else navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <label className="block mb-2">
          <span className="text-sm">Usuario</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full rounded border-gray-300" />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Contraseña</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded border-gray-300" />
        </label>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;