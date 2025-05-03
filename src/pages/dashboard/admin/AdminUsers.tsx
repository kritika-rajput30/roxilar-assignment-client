"use client";

import { useEffect, useState } from "react";
import { get } from "../../../utils/api";
import { useSelector } from "react-redux";
import clsx from "clsx";
import Loader from "../../../components/Loader"; // Update path as needed

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
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state: any) => state.auth.token);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = Object.entries(filters)
        .filter(([_, v]) => v.trim() !== "")
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");

      const res = await get(`/user?${params}`, {
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
  }, [filters]);

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
            onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>

      {/* Loader & Error */}
      {loading && <Loader />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Table */}
      {!loading && (
        <div className="overflow-auto">
          <table className="min-w-full table-auto border border-gray-200 shadow-sm rounded-md">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50 transition">
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.address}</td>
                    <td className="border px-4 py-2">
                      <span className={badgeColor(user.role)}>{user.role}</span>
                    </td>
                    <td className="border px-4 py-2 text-center">
  {user.role === "owner" && typeof user.ratings === "number"
    ? user.ratings.toFixed(1)
    : "-"}
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
    </div>
  );
}
