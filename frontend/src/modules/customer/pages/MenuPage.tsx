import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../services/api";
import MenuItemCard from "../components/MenuItemCard";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: string;
  image?: string | null;
  category: Category;
  options?: Record<string, any>;
};

const fetchMenu = async (): Promise<MenuItem[]> => {
  const res = await api.get("/menu/items/");
  return res.data;
};

const MenuPage: React.FC = () => {
  const { data: items = [], isLoading } = useQuery<MenuItem[]>(["menu"], fetchMenu, { staleTime: 1000 * 30 });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Menú</h1>
      {isLoading ? (
        <div>Cargando menú...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <MenuItemCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;