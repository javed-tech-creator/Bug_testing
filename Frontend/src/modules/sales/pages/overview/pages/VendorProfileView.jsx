
import { useLazyGetVendorByIdQuery } from "@/api/admin/vendor-profile-management/vendor.management.api";
import { useParams } from "react-router-dom";
import DynamicProfileView from "../DynamicProfileView";

const VendorProfileView = () => {
  const { id } = useParams();

  return (
    <DynamicProfileView
      title="Vendor Profile"
      id={id}
      fetchById={useLazyGetVendorByIdQuery()}
    />
  );
};

export default VendorProfileView;
