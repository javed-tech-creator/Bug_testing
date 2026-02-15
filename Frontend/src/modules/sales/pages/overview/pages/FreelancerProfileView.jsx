
import { useParams } from "react-router-dom";
import DynamicProfileView from "../DynamicProfileView";
import { useLazyGetFreelancerByIdQuery } from "@/api/admin/freelancer-profile-management/freelancer.management.api";

const FreelancerProfileView = () =>{
  const { id } = useParams();

  return (
    <DynamicProfileView
      title="Freelancer Profile"
      id={id}
      fetchById={useLazyGetFreelancerByIdQuery()}
    />
  );
};
export default FreelancerProfileView;
