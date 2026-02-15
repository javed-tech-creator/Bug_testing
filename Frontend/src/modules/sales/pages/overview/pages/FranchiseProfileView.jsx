
import { useParams } from "react-router-dom";
import DynamicProfileView from "../DynamicProfileView";
import { useLazyGetFranchiseByIdQuery } from "@/api/admin/franchise-profile-management/franchise.management.api";

const FranchiseProfileView = () => {
  const { id } = useParams();

  return (
    <DynamicProfileView
      title="Franchise Profile"
      id={id}
      fetchById={useLazyGetFranchiseByIdQuery()}
    />
  );
};
export default FranchiseProfileView;
