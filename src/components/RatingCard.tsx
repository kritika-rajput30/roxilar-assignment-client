import { StarIcon } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const RatingCard = ({ rating, currentUserId, onUpdate }: any) => {
  const userId = useSelector((state: any) => state.users.currentUser.id);

  const isUserRating = rating.user_id === userId;
  return (
    <div className="mb-4 border-b pb-2">
      <p className="text-sm flex gap-2">
        <StarIcon size={18} /> {rating.rating}/5
      </p>
      <p className="text-sm text-gray-700">{rating.comment}</p>
      <p className="text-xs text-gray-400">
        {new Date(rating.createdAt).toLocaleString()}
      </p>

      {isUserRating && (
        <button
          className="mt-2 text-blue-600 text-sm underline hover:text-blue-800"
          onClick={() => onUpdate(rating)}
        >
          Update Rating
        </button>
      )}
    </div>
  );
};

export default RatingCard;
