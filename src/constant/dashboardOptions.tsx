// src/constants/dashboardOptions.js

import { HomeIcon, Lock, ShieldEllipsis, Star, StarIcon, Store, User, UserIcon } from "lucide-react";

  
  export const dashboardOptions = {
    user: [
      { label: "My Profile", path: "/dashboard/user/profile", icon: <User/> },
      { label: "My Ratings", path: "/dashboard/user/ratings", icon: <Star /> },
      { label: "Change Password", path: "/dashboard/user/change-password", icon: <Lock /> },
    ],
    owner: [
      { label: "Dashboard", path: "/dashboard/owner", icon: <HomeIcon /> },
      { label: "Change Password", path: "/dashboard/user/change-password", icon: <Lock /> },

    ],
    admin: [
      { label: "Dashboard", path: "/dashboard/admin", icon: <ShieldEllipsis /> },
      { label: "Stores", path: "/dashboard/admin/stores", icon: <Store /> },
      { label: "Ratings", path: "/dashboard/ratings", icon: <StarIcon/> },
      { label: "Users", path: "/dashboard/users", icon: <UserIcon/> },



    ],
  };
  