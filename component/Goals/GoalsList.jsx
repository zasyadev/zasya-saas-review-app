import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import GoalGroupComponent from "./component/GoalGroupComponent";

function GoalsList({ user }) {
  const [loading, setLoading] = useState(false);

  const [goalsList, setGoalsList] = useState([]);

  async function fetchGoalList() {
    setLoading(true);
    setGoalsList([]);

    await httpService
      .get(`/api/goals`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setGoalsList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response.data?.message);
      });
  }
  async function fetchGoalList() {
    setLoading(true);
    setGoalsList([]);

    await httpService
      .get(`/api/goals`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setGoalsList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response.data?.message);
      });
  }

  useEffect(() => {
    fetchGoalList();
  }, []);

  const columns = [
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) =>
    //     record.created_by === user.id && (
    //       <Dropdown
    //         trigger={"click"}
    //         overlay={
    //           <Menu className="divide-y">
    //             <Menu.Item className="font-semibold" key={"call-preview"}>
    //               <Link href={`/goals/${record.id}/edit`}>Edit</Link>
    //             </Menu.Item>
    //             <Menu.Item
    //               className="text-red-600 font-semibold"
    //               key={"call-delete"}
    //               onClick={() =>
    //                 goalEditHandle(
    //                   record.id,
    //                   record.is_archived ? false : true,
    //                   "forArchived"
    //                 )
    //               }
    //             >
    //               {record.is_archived ? "UnArchived" : "Archived"}
    //             </Menu.Item>
    //           </Menu>
    //         }
    //         placement="bottomRight"
    //       >
    //         <ButtonGray
    //           className="grid place-content-center w-8 h-8"
    //           rounded="rounded-full"
    //           title={
    //             <EllipsisOutlined rotate={90} className="text-lg leading-0" />
    //           }
    //         />
    //       </Dropdown>
    //     ),
    // },
  ];

  return (
    <div className="container mx-auto max-w-full">
      <div className="grid grid-cols-1 mb-16">
        <div className="flex flex-row items-center justify-end flex-wrap gap-4  mb-4 md:mb-6 ">
          <PrimaryButton
            withLink={true}
            linkHref={`/goals/add`}
            title={"Create"}
          />
        </div>

        {loading ? (
          <div className="p-4">
            <Skeleton title={false} active={true} />
          </div>
        ) : (
          <GoalGroupComponent
            goalsList={goalsList}
            userId={user.id}
            fetchGoalList={fetchGoalList}
          />
        )}
      </div>
    </div>
  );
}

export default GoalsList;
