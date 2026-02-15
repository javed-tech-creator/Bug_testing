import { useLazyGetPartnerByIdQuery } from "@/api/admin/partner-profile-management/partner.management.api";
import { useParams } from "react-router-dom";
import DynamicProfileView from "../../components/DynamicProfileView";

const PartnerProfileView = () => {
  const { id } = useParams();

  return (
    <DynamicProfileView
      title="Partner Profile"
      id={id}
      fetchById={useLazyGetPartnerByIdQuery()}
    />
  );
};

export default PartnerProfileView;
