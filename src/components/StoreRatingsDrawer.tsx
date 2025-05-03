// components/StoreRatingsDrawer.tsx
import React, { useEffect, useState } from "react";
import { get } from "../utils/api";
import { useSelector } from "react-redux";

const StoreRatingsDrawer = ({ storeId, isOpen, onClose }: any) => {
  const [ratings, setRatings] = useState([]);
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        if (storeId) {
          const data = await get(`/rating?storeId=${storeId}`, {
            Authorization: `Bearer ${token}`,
          });
          setRatings(data);
        }
      } catch (err) {
        console.error("Failed to load ratings:", err);
      }
    };

    if (isOpen) {
      fetchRatings();
    }
  }, [storeId, isOpen]);

  return (
    <div
      className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Ratings</h2>
        <button onClick={onClose} className="text-red-500">Close</button>
      </div>
      <div className="p-4 overflow-y-auto max-h-full">
        {ratings.length > 0 ? (
          ratings.map((rating: any, index: number) => (
            <div key={index} className="mb-4 border-b pb-2">
              <p className="text-sm">⭐ {rating.rating}/5</p>
              <p className="text-sm text-gray-700">{rating.comment}</p>
              <p className="text-xs text-gray-400">{new Date(rating.createdAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No ratings found for this store.</p>
        )}
      </div>
    </div>
  );
};

export default StoreRatingsDrawer;
