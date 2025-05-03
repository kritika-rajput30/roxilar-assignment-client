import React from "react";

type StoreCardProps = {
  store: {
    store_id: string;
    name: string;
    address: string;
    email: string;
    image: string;
  };
  onEdit: (store: any) => void;
};

const ShowCard: React.FC<StoreCardProps> = ({ store, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <img
        src={store.image}
        alt={store.name}
        className="w-full h-96 object-cover rounded mb-4"
      />
      <h3 className="text-xl font-semibold">{store.name}</h3>
      <p className="text-gray-600">{store.address}</p>
      <p className="text-gray-500 text-sm">{store.email}</p>
      <button
        className="mt-4 text-sm text-blue-600 hover:underline"
        onClick={() => onEdit(store)}
      >
        Edit
      </button>
    </div>
  );
};

export default ShowCard;
