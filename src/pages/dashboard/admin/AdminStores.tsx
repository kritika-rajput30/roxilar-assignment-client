import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { del, get, post, put } from "../../../utils/api";
import StoreForm from "../../../components/StoreForm";
import ShowCard from "../../../components/ShowCard";
import toast from "react-hot-toast";
import StoreRatingsDrawer from "../../../components/StoreRatingsDrawer";

type Store = {
  store_id: string;
  name: string;
  address: string;
  email: string;
  image: string;
};

const AdminStores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [filteredStores, setFilteredStores] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showDrawer, setShowDrawer] = useState(false);

  const userId = useSelector((state) => state.users.currentUser.id);
  const token = useSelector((state) => state.auth.token);

  const fetchStores = async () => {
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
              }).catch(() => null),
              get(`/rating/stats/${store.store_id}`, {
                Authorization: `Bearer ${token}`,
              }).catch(() => null),
            ]);

            return {
              ...store,
              userRating: userRatingRes?.[0]?.rating || null,
              overallRating: statsRes?.averageRating || "N/A",
            };
          } catch (error) {
            console.error(
              `Failed to fetch ratings for store ${store.store_id}:`,
              error
            );
            return {
              ...store,
              userRating: null,
              overallRating: "N/A",
            };
          }
        })
      );

      setStores(enrichedData);
      setFilteredStores(enrichedData);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };
  const handleViewRatingsClick = (store: any) => {
    setSelectedStore(store);
    setShowDrawer(true);
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

  const handleAddClick = () => {
    setFormMode("add");
    setSelectedStore(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (store: Store) => {
    setFormMode("edit");
    setSelectedStore(store);
    setIsModalOpen(true);
  };
  const handleDeleteClick = async (storeId: string) => {
    try {
      const res = await del(`/store/${storeId}`, {
        Authorization: `Bearer ${token}`,
      });

      toast.success("Store deleted successfully!");
    } catch (error) {
      console.error("Failed to delete store:", error);
      toast.error("Failed to delete store. Please try again.");
    }
  };

  const handleStoreSubmit = async (
    values: Omit<Store, "store_id">,
    { resetForm }: any
  ) => {
    try {
      if (formMode === "add") {
        await post(
          "/store",
          { ...values, userId },
          {
            Authorization: `Bearer ${token}`,
          }
        );
      } else if (formMode === "edit" && selectedStore) {
        await put(
          `/store/${selectedStore.store_id}`,
          { ...values },
          {
            Authorization: `Bearer ${token}`,
          }
        );
      }
      setIsModalOpen(false);
      resetForm();
      fetchStores();
    } catch (error) {
      console.error("Error saving store:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="my-4">
        <input
          type="text"
          placeholder="Search by store name or address"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      {stores.length === 0 ? (
        <div className="text-center py-10">
          <p className="mb-4 text-lg">No store found.</p>
          <button
            className="bg-primary text-white px-6 py-2 rounded shadow hover:bg-primary-dark"
            onClick={handleAddClick}
          >
            Add Store
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              className="bg-primary text-white px-6 py-2 rounded shadow hover:bg-primary-dark"
              onClick={handleAddClick}
            >
              Add Store
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <ShowCard
                key={store.store_id}
                store={store}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onViewRatings={handleViewRatingsClick}
              />
            ))}
          </div>
        </>
      )}

      {/* StoreForm Modal */}
      <StoreForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleStoreSubmit}
        initialValues={
          selectedStore
            ? {
                name: selectedStore.name,
                address: selectedStore.address,
                email: selectedStore.email,
                image: selectedStore.image,
              }
            : { name: "", address: "", email: "", image: "" }
        }
        mode={formMode}
      />

      <StoreRatingsDrawer
        storeId={selectedStore?.store_id}
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
      />
    </div>
  );
};

export default AdminStores;
