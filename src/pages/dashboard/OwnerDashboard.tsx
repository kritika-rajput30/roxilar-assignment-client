import React, { useEffect, useState } from "react";
import { del, get, post, put } from "../../utils/api";
import { useSelector } from "react-redux";
import StoreForm from "../../components/StoreForm";
import toast from "react-hot-toast";
import ShowCard from "../../components/ShowCard";
import StoreRatingsDrawer from "../../components/StoreRatingsDrawer";

type Store = {
  store_id: string;
  name: string;
  address: string;
  email: string;
  image: string;
};

const OwnerDashboard: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const userId = useSelector((state) => state.users.currentUser.id);
  const token = useSelector((state) => state.auth.token);

  const fetchStores = async () => {
    try {
      const data = await get(`/store/owner/${userId}`, {
        Authorization: `Bearer ${token}`,
      });
      setStores(data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchStores();
    }
  }, [userId]);

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
      toast.success("store created successfully!");
    } catch (error) {
      console.error("Error saving store:", error);
    }
  };
  const handleViewRatingsClick = (store: any) => {
    setSelectedStore(store);
    setShowDrawer(true);
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
  return (
    <div className="p-6">
     
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
            {stores.map((store) => (
                <ShowCard
                key={store.store_id}
                store={store}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onViewRatings={handleViewRatingsClick}
              />
              // <div
              //   key={store.store_id}
              //   className="bg-white rounded-lg shadow p-4"
              // >
              //   <img
              //     src={store.image}
              //     alt={store.name}
              //     className="w-full h-96 object-cover rounded mb-4"
              //   />
              //   <h3 className="text-xl font-semibold">{store.name}</h3>
              //   <p className="text-gray-600">{store.address}</p>
              //   <p className="text-gray-500 text-sm">{store.email}</p>
              //   <button
              //     className="mt-4 text-sm text-blue-600 hover:underline"
              //     onClick={() => handleEditClick(store)}
              //   >
              //     Edit
              //   </button>
              // </div>
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

export default OwnerDashboard;
