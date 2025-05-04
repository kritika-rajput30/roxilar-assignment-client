import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { get } from "../../../utils/api";
import Loader from "../../../components/Loader";

type Rating = {
  rating_id: string;
  rating: number;
  comment?: string;
  store: {
    name: string;
    address: string;
  };
  createdAt: string;
};

interface StoreRatingsProps {}

const OwnerRatings: React.FC<StoreRatingsProps> = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = useSelector((state: any) => state.auth.token);
  const userId = useSelector((state: any) => state.users.currentUser.id);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await get(`/store/${userId}/store-ratings`, {
          Authorization: `Bearer ${token}`,
        });
        console.log(res);

        const stores = res.stores || [];
        const allRatings = stores.flatMap((store: any) =>
          (store.ratings || []).map((rating: any) => ({
            rating_id: rating.rating_id,
            rating: rating.rating,
            comment: rating.comment,
            createdAt: rating.createdAt,
            store: {
              name: store.name,
              address: store.address,
            },
            user: rating.user,
          }))
        );

        setRatings(allRatings);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch ratings");
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchRatings();
    }
  }, [userId, token]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (ratings.length === 0) return <p>No ratings found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {ratings.map((rating) => (
        <div
          key={rating.rating_id}
          className="border border-gray-200 rounded-lg p-4 shadow-md bg-white"
        >
          <h3 className="text-lg font-semibold">{rating.store.name}</h3>
          <p className="text-sm text-gray-600">{rating.store.address}</p>
          <div className="flex items-center mt-2 space-x-2">
            <span className="text-yellow-500 font-bold">
              Rating: {rating.rating}★
            </span>
          </div>
          {rating.comment && (
            <p className="mt-2 italic text-gray-700">“{rating.comment}”</p>
          )}
          {rating.user && (
            <p className="mt-2 italic text-primary-dark">
              By {rating.user.email}
            </p>
          )}

          <p className="text-xs text-gray-400 mt-3">
            {new Date(rating.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OwnerRatings;
