// src/constants/dashboardOptions.js

import { HomeIcon, Lock, ShieldEllipsis, Star, StarIcon, Store, User, UserIcon } from "lucide-react";

  
  export const dashboardOptions = {
    user: [
      { label: "My Profile", path: "/dashboard/user/profile", icon: <User/> },
      { label: "Change Password", path: "/dashboard/user/change-password", icon: <Lock /> },
    ],
    owner: [
      { label: "Dashboard", path: "/dashboard/owner", icon: <HomeIcon /> },
      { label: "Change Password", path: "/dashboard/user/change-password", icon: <Lock /> },

    ],
    admin: [
      { label: "Dashboard", path: "/dashboard/admin", icon: <ShieldEllipsis /> },
      { label: "Stores", path: "/dashboard/admin/stores", icon: <Store /> },
      { label: "Users", path: "/dashboard/admin/users", icon: <UserIcon/> },
      { label: "Change Password", path: "/dashboard/admin/change-password", icon: <Lock /> },



    ],
  };
  