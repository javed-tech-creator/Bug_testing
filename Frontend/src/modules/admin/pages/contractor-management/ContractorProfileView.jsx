import { useLazyGetContractorByIdQuery } from "@/api/admin/contractor-profile-management/contractor.management.api";
import { useParams } from "react-router-dom";
import DynamicProfileView from "../../components/DynamicProfileView";

const ContractorProfileView = () => {
  const { id } = useParams();

  return (
    <DynamicProfileView
      title="Contractor Profile"
      id={id}
      fetchById={useLazyGetContractorByIdQuery()}
    />
  );
};
export default ContractorProfileView;
