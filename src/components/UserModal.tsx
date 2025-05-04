import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { put, post } from "../utils/api";
import toast from "react-hot-toast";

type User = {
  user_id?: number;
  name: string;
  email: string;
  address: string;
  role: "admin" | "user" | "owner";
  password?: string;
};

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
  userToEdit?: User;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onUserUpdated,
  userToEdit,
}) => {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    address: "",
    role: "user",
    ...(userToEdit || {}),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state: any) => state.auth.token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (userToEdit) {
        await put(`/user/${userToEdit.user_id}`, user, {
          Authorization: `Bearer ${token}`,
        });
      } else {
        await post("/admin/users", user, {
          Authorization: `Bearer ${token}`,
        });
      }
      toast.success("Operation success!");
      onUserUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50">
        <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">
            {userToEdit ? "Edit User" : "Add New User"}
          </h2>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-md"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            {!userToEdit && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={user.password || ""}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default UserModal;
