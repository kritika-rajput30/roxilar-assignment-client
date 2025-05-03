import { useEffect, useState } from "react";
import { get } from "../../../utils/api";
import { useSelector } from "react-redux";
import clsx from "clsx";
import Loader from "../../../components/Loader"; // Update path as needed
import UserModal from "../../../components/UserModal"; // Import UserModal

type User = {
  user_id: number;
  name: string;
  email: string;
  address: string;
  role: "admin" | "user" | "owner";
  ratings?: number;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const token = useSelector((state: any) => state.auth.token);
  const [sort, setSort] = useState({ key: "", direction: "asc" });

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const filterParams = Object.entries(filters)
        .filter(([_, v]) => v.trim() !== "")
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      const sortParam = sort.key
        ? `&sortKey=${sort.key}&sortOrder=${sort.direction}`
        : "";
      const query = `${filterParams}${sortParam}`;

      const res = await get(`/user?${query}`, {
        Authorization: `Bearer ${token}`,
      });

      setUsers(res);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, sort]);

  const badgeColor = (role: string) => {
    return clsx(
      "text-xs px-2 py-1 rounded-full font-semibold",
      {
        admin: "bg-red-100 text-red-700",
        user: "bg-blue-100 text-blue-700",
        owner: "bg-green-100 text-green-700",
      }[role.toLowerCase()] || "bg-gray-100 text-gray-700"
    );
  };
  const handleSort = (key: string) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleAddNewUser = () => {
    setUserToEdit(null); // Ensure we clear the user state
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {["name", "email", "address", "role"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={`Filter by ${field}`}
            value={(filters as any)[field]}
            onChange={(e) =>
              setFilters({ ...filters, [field]: e.target.value })
            }
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>

      {/* Add New User Button */}
      <div className="mb-6 flex gap-4 items-center">
        <button
          onClick={handleAddNewUser}
          className="px-4 py-2 bg-primary text-white rounded-md shadow-md hover:bg-primary-dark"
        >
          Add New User
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => handleSort("name")}
            className={clsx(
              "px-4 py-2 rounded-md border shadow-sm",
              sort.key === "name" ? "bg-blue-100 text-blue-700" : "bg-white"
            )}
          >
            Sort by Name{" "}
            {sort.key === "name" && (sort.direction === "asc" ? "↑" : "↓")}
          </button>

          <button
            onClick={() => handleSort("email")}
            className={clsx(
              "px-4 py-2 rounded-md border shadow-sm",
              sort.key === "email" ? "bg-blue-100 text-blue-700" : "bg-white"
            )}
          >
            Sort by Email{" "}
            {sort.key === "email" && (sort.direction === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {/* Loader & Error */}
      {loading && <Loader />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* User Table */}
      {!loading && (
        <div className="overflow-auto">
          <table className="min-w-full table-auto border border-gray-200 shadow-sm rounded-md">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>

                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.user_id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.address}</td>
                    <td className="border px-4 py-2">
                      <span className={badgeColor(user.role)}>{user.role}</span>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit User */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserUpdated={fetchUsers}
        userToEdit={userToEdit || undefined}
      />
    </div>
  );
}
