import { useLazyGetFreelancerByIdQuery } from "@/api/admin/freelancer-profile-management/freelancer.management.api";
import { useParams } from "react-router-dom";
import DynamicProfileView from "../../components/DynamicProfileView";

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
