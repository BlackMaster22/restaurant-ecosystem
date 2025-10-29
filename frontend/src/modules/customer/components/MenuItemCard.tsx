import React from "react";

type Props = {
  item: {
    id: number;
    name: string;
    description?: string;
    price: string;
    image?: string | null;
    options?: Record<string, any>;
  };
};

const MenuItemCard: React.FC<Props> = ({ item }) => {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col">
      {item.image ? <img src={item.image} alt={item.name} className="h-40 object-cover rounded mb-3" /> : <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400">Sin imagen</div>}
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-bold">{item.price} €</span>
        <button className="text-indigo-600">Ver</button>
      </div>
    </div>
  );
};

export default MenuItemCard;