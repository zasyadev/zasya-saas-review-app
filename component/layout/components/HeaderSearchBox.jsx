import { SearchOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useMember } from "../../common/hooks/useMember";

function HeaderSearchBox({ user }) {
  const route = useRouter();
  const { membersList } = useMember(user);
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
      onSelect={(e) => {
        route.push(`/profile/preview/${e}`);
      }}
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
