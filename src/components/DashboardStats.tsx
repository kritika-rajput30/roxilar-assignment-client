import React, { useEffect, useState } from "react";
import { get } from "../utils/api";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const DashboardStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await get("/admin/dashboard/",{
            Authorization: `Bearer ${token}`,
          });
        setStats(response);
        console.log(response);
      } catch (err) {
        setError("Error fetching dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-2xl text-primary">
        <Loader/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-2xl text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 border-primary ">
      <h2 className="text-center text-2xl mb-6 text-primary-dark">Dashboard Stats</h2>

      <div className="flex justify-between text-black items-center">
        <div className="p-6 bg-primary-dark/10 rounded-lg shadow-md flex-1 mx-2 text-center">
          <h3>Total Users</h3>
          <p className="text-4xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="p-6 bg-primary-dark/10 rounded-lg shadow-md flex-1 mx-2 text-center">
          <h3>Total Stores</h3>
          <p className="text-4xl font-bold">{stats.totalStores}</p>
        </div>

        <div className="p-6 bg-primary-dark/10 rounded-lg shadow-md flex-1 mx-2 text-center">
          <h3>Total Ratings</h3>
          <p className="text-4xl font-bold">{stats.totalRatings}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
