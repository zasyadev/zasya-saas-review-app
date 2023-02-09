import { Select } from "antd";
import React from "react";

function OrganizationSelectBox({ user, changeOragnizationHandle }) {
  return (
    <Select
      placeholder="Select Frequency"
      defaultValue={user?.organization?.company_name}
      onChange={changeOragnizationHandle}
      size="large"
      className="w-full bg-brandGray-100"
    >
      {user?.UserOraganizationGroups?.length > 0 &&
        user?.UserOraganizationGroups.map((item) => (
          <Select.Option value={item?.organization_id} key={item.id}>
            {item?.organization?.company_name}
          </Select.Option>
        ))}
    </Select>
  );
}

export default OrganizationSelectBox;
