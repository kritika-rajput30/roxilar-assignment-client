import { StarIcon, UsersIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { get } from "../utils/api";

type StoreCardProps = {
  store: {
    store_id: string;
    name: string;
    address: string;
    email: string;
    image: string;
  };
  onEdit: (store: any) => void;
  onDelete?: (storeId: string) => void;
  onAddRating?: (storeId: string) => void;
  onViewRatings?: (store: any) => void;

};

type RatingData = {
  averageRating: string;
  totalRatings: number;
};

const ShowCard: React.FC<StoreCardProps> = ({ store, onEdit, onDelete, onAddRating, onViewRatings }) => {
      const token = useSelector((state: any) => state.auth.token);
    
  const role = useSelector((state: any) => state.auth.role);
  const [rating, setRating] = useState<RatingData>({ averageRating: "0.00", totalRatings: 0 });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const data = await get(`/rating/stats/${store.store_id}`, {
          Authorization: `Bearer ${token}`,
        });
  
        console.log("Rating Data:", data);
  
        setRating({
          averageRating: data.averageRating ?? "0.00",
          totalRatings: data.totalRatings ?? 0,
        });
      } catch (err: any) {
        setError("Unable to load rating");
        console.error("Error fetching rating:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRating();
  }, [store.store_id, token]);
  
  return (
    <div className="bg-white rounded-lg shadow p-4 w-full max-w-md">
      <img
        src={store.image}
        alt={store.name}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h3 className="text-xl font-semibold">{store.name}</h3>
      <p className="text-gray-600">{store.address}</p>
      <p className="text-gray-500 text-sm">{store.email}</p>

      {/* Rating Section */}
      <div className="mt-2 text-sm text-gray-700">
        {loading ? (
          <p>Loading rating...</p>
        ) : error ? (
          <p className="text-red-500 border-1 border-red-500  w-min text-nowrap p-[2px]">no ratings</p>
        ) : (
          <>
            <p className="flex gap-2"><StarIcon size={18}/> Average Rating: {rating.averageRating}</p>
            <p className="flex gap-2"> <UsersIcon size={18}/> Total Ratings: {rating.totalRatings}</p>
          </>
        )}
      </div>

      {/* Role-based buttons */}
      <div className="mt-4 flex gap-3">
        {(role === "admin" || role === "owner") && (
          <>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => onEdit(store)}
            >
              Edit
            </button>
            <button
              className="text-sm text-red-600 hover:underline"
              onClick={() => onDelete?.(store.store_id)}
            >
              Delete
            </button>
          </>
        )}
       {role === "user" && (
  <>
    <button
      className="text-sm text-green-600 hover:underline"
      onClick={() => onAddRating?.(store)}
    >
      Add Rating
    </button>
    <button
      className="text-sm text-purple-600  cursor-pointer"
      onClick={() => onViewRatings?.(store)}
    >
      View All Ratings
    </button>
  </>
)}

      </div>
    </div>
  );
};

export default ShowCard;
