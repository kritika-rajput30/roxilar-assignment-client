import React, { useEffect, useState } from "react";
import { get, put } from "../utils/api";
import { useSelector } from "react-redux";
import RatingCard from "./RatingCard";
import RatingModal from "./RatingForm";

const StoreRatingsDrawer = ({
  storeId,
  isOpen,
  onClose,
  selectedStore,
}: any) => {
  const [ratings, setRatings] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  const token = useSelector((state: any) => state.auth.token);
  const userId = useSelector((state: any) => state.auth.userId);

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

  const handleUpdate = (rating: any) => {
    setSelectedRating(rating);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (rating, comment) => {
    await put(
      `/rating/${selectedRating.rating_id}`,
      {
        rating,
        comment,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    setShowRatingModal(false);
    setSelectedRating(null);
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Ratings</h2>
          <button onClick={onClose} className="text-red-500">
            Close
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-full">
          {ratings.length > 0 ? (
            ratings.map((rating: any, index: number) => (
              <RatingCard
                key={index}
                rating={rating}
                currentUserId={userId}
                onUpdate={handleUpdate}
              />
            ))
          ) : (
            <p>No ratings found for this store.</p>
          )}
        </div>
      </div>

      {showRatingModal && (
        <RatingModal
          storeName={selectedStore?.name || ""}
          initialRating={selectedRating}
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedRating(null);
          }}
          onSubmit={handleSubmitRating}
        />
      )}
    </>
  );
};

export default StoreRatingsDrawer;
