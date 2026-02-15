import { useLazyGetRegisteredUsersByIdQuery } from "@/api/admin/user-management/user.management.api";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import UserProfile from "../../components/UserProfile";

const UserProfileView = () => {
  const { id } = useParams();

  return (
  <UserProfile
        title="User's Profile"
        id={id}
        fetchById={useLazyGetRegisteredUsersByIdQuery()}
      />
  );
};

export default UserProfileView;