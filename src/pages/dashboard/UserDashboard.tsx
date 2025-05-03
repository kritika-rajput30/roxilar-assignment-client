
import React, { useState, useEffect } from "react";
import { get, post } from "../../utils/api";
import ShowCard from "../../components/ShowCard";
import { useSelector } from "react-redux";
import RatingModal from "../../components/RatingForm";
import StoreRatingsDrawer from "../../components/StoreRatingsDrawer";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [filteredStores, setFilteredStores] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state: any) => state.auth.token);
  const userId = useSelector((state: any) => state.users.currentUser.id);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await get("/store", {
        Authorization: `Bearer ${token}`,
      });

      const enrichedData = await Promise.all(
        data.map(async (store: any) => {
          try {
            const [userRatingRes, statsRes] = await Promise.all([
              get(`/rating?storeId=${store.store_id}`, {
                Authorization: `Bearer ${token}`,
              }),
              get(`/rating/stats/${store.store_id}`, {
                Authorization: `Bearer ${token}`,
              }),
            ]);

            return {
              ...store,
              userRating: userRatingRes?.[0]?.rating ?? null,
              overallRating: statsRes?.averageRating ?? "0.00",
              totalRatings: statsRes?.totalRatings ?? 0,
            };
          } catch (err) {
            console.warn(`Error fetching ratings for store ${store.store_id}:`, err);
            return {
              ...store,
              userRating: null,
              overallRating: "0.00",
              totalRatings: 0,
            };
          }
        })
      );

      setStores(enrichedData);
      setFilteredStores(enrichedData);
    } catch (err) {
      console.error("Error fetching stores:", err);
      toast.error("Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    setFilteredStores(
      stores.filter(
        (store) =>
          store.name.toLowerCase().includes(value) ||
          store.address.toLowerCase().includes(value)
      )
    );
  };

  const handleRateClick = (store: any) => {
    setSelectedStore(store);
    setShowRatingModal(true);
  };

  const handleViewRatingsClick = (store: any) => {
    setSelectedStore(store);
    setShowDrawer(true);
  };

  const handleSubmitRating = async (rating: number, comment: string) => {
    try {
      await post(
        "/rating",
        {
          rating,
          comment,
          storeId: selectedStore.store_id,
          userId,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      toast.success("Rating submitted!");
      setShowRatingModal(false);
      setSelectedStore(null);
      fetchStores();
    } catch (err) {
      console.error("Error submitting rating:", err);
      toast.error("Failed to submit rating");
    }
  };

  return (
    <>
      <div className="my-4">
        <input
          type="text"
          placeholder="Search by store name or address"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading stores...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <ShowCard
              key={store.store_id}
              store={{
                store_id: store.store_id,
                name: store.name,
                address: store.address,
                email: store.email,
                image: store.image,
              }}
              onEdit={() => {}}
              onAddRating={handleRateClick}
              onViewRatings={handleViewRatingsClick}
            />
          ))}
        </div>
      )}

      <RatingModal
        storeName={selectedStore?.name || ""}
        initialRating={selectedStore?.userRating || null}
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
      />

      <StoreRatingsDrawer
        storeId={selectedStore?.store_id}
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
      />
    </>
  );
};

export default UserDashboard;
