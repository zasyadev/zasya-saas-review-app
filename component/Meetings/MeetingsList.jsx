import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import CustomTable from "../common/CustomTable";
import MeetingListSkeleton from "./component/MeetingListSkeleton";
import { DEFAULT_DATE_FORMAT } from "../../helpers/dateHelper";
import { PrimaryButton } from "../common/CustomButton";

function GoalsList({ user }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [meetingsList, setMeetingsList] = useState([]);

  async function fetchMeetingList() {
    setLoading(true);
    setMeetingsList([]);

    await httpService
      .get(`/api/meetings`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setMeetingsList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err?.response?.data?.message);
      });
  }

  useEffect(() => {
    fetchMeetingList();
  }, []);

  const columns = [
    {
      title: "Title",
      key: "meeting_title",
      render: (_, record) => (
        <Link href={`/goals/${record.id}/detail`} passHref>
          <p className="cursor-pointer text-gray-500 mb-0">
            {record.meeting_title}
          </p>
        </Link>
      ),
    },

    {
      title: "Meeting Date",
      key: "meeting_at",
      render: (_, record) =>
        moment(record.meeting_at).format(DEFAULT_DATE_FORMAT),
    },
    {
      title: "Action",
      key: "action",
      // render: (_, record) =>
      //   record.goal.created_by === userId && (
      //     <Dropdown
      //       trigger={"click"}
      //       overlay={
      //         <Menu className="divide-y">
      //           <Menu.Item className="font-semibold" key={"call-preview"}>
      //             <Link href={`/goals/${record.goal.id}/edit`}>Edit</Link>
      //           </Menu.Item>

      //           <Menu.Item
      //             className="text-gray-400 font-semibold"
      //             key={"call-Archived"}
      //             onClick={() =>
      //               goalEditHandle({
      //                 goal_id: record.goal.id,
      //                 id: record.id,
      //                 value: record.goal.is_archived ? false : true,
      //                 type: "forArchived",
      //               })
      //             }
      //           >
      //             {record.goal.is_archived ? "UnArchived" : "Archived"}
      //           </Menu.Item>
      //         </Menu>
      //       }
      //       placement="bottomRight"
      //     >
      //       <ButtonGray
      //         className="grid place-content-center w-8 h-8"
      //         rounded="rounded-full"
      //         title={
      //           <EllipsisOutlined rotate={90} className="text-lg leading-0" />
      //         }
      //       />
      //     </Dropdown>
      //   ),
    },
  ];

  return (
    <div className="container mx-auto max-w-full">
      {loading ? (
        <MeetingListSkeleton />
      ) : (
        <>
          <div className="flex  justify-end items-center gap-4 mb-4 md:mb-6 ">
            <PrimaryButton
              withLink={true}
              linkHref={`/meetings/add`}
              title={"Create"}
            />
          </div>
          <CustomTable
            dataSource={meetingsList}
            columns={columns}
            className="custom-table"
            isPagination
          />
        </>
      )}

      {/* {goalAssigneeModalData?.isVisible && (
        <GoalAssignessModal
          goalAssigneeModalData={goalAssigneeModalData}
          hideAssigneeModal={hideAssigneeModal}
          userId={user.id}
        />
      )} */}
    </div>
  );
}

export default GoalsList;
