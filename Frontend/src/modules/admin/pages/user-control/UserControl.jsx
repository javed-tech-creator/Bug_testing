import { useGetActionGroupsQuery } from '@/api/admin/department-management/department-designation/department.api';
import DataLoading from '@/modules/vendor/components/DataLoading';
import React from 'react'
import ActionGroup from '../../components/department-management/department-designation/ActionGroup';

const UserControl = () => {

    const {
      data: usercontrolData,
      isLoading: usercontrolLoading,
      isError: usercontrolError,
    } = useGetActionGroupsQuery();
  const usercontrol = usercontrolData?.data || [];


   if (usercontrolLoading) {
      return (
        <div className="flex justify-center items-center h-[80vh]">
          <DataLoading />
        </div>
      );
    }
  return (
<div className="px-6">  
     <ActionGroup actiongroup={usercontrol} isError={usercontrolError} />
    </div>
  )
}

export default UserControl