import { SearchOutlined } from "@ant-design/icons";
import { Select } from "antd";
import React from "react";
import { MemberListHook } from "../../common/hooks";

function HeaderSearchBox({ user }) {
  const { membersList } = MemberListHook(user);
  return (
    <Select
      size="large"
      showSearch
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      className="w-44 md:w-52 lg:w-72"
      placeholder="Search"
      suffixIcon={<SearchOutlined />}
    >
      {membersList.map((data, index) => (
        <Select.Option key={index} value={data.user_id}>
          {data?.user?.first_name}
        </Select.Option>
      ))}
    </Select>
  );
}

export default HeaderSearchBox;
