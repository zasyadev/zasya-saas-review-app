import { EllipsisOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Popconfirm, Skeleton } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ButtonGray, PrimaryButton } from "../../component/common/CustomButton";
import CustomTable from "../../component/common/CustomTable";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import ToggleButton from "../common/ToggleButton";
import { REVIEW_MEETINGTYPE } from "../Meetings/constants";
import AddMembersModal from "./AddMembersModal";
import { ReviewToggleList, REVIEW_CREATED_KEY } from "./constants";
import ReviewAssignessModal from "./ReviewAssignessModal";
import { TempateSelectWrapper } from "./TempateSelectWrapper";

const initialReviewCountModalData = {
  review_name: "",
  ReviewAssignee: [],
  isVisible: false,
};

const initialAddMembersReviewModal = {
  review_id: "",
  review_name: "",
  reviewAssignee: [],
  isVisible: false,
};

function ReviewManagement({ user }) {
  const router = useRouter();
  const { create: showCreateModal } = router.query;
  const [loading, setLoading] = useState(false);
  const [createReviewModal, setCreateReviewModal] = useState(false);
  const [addMembersReviewModal, setAddMembersReviewModal] = useState(
    initialAddMembersReviewModal
  );
  const [userList, setUserList] = useState([]);
  const [reviewAssignList, setReviewAssignList] = useState([]);
  const [reviewCountModalData, setReviewCountModalData] = useState(
    initialReviewCountModalData
  );

  async function fetchReviewAssignList() {
    setLoading(true);
    setReviewAssignList([]);
    await httpService
      .get(`/api/review/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setReviewAssignList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response.data?.message);
      });
  }

  async function fetchAllMembers() {
    setUserList([]);
    await httpService
      .get(`/api/user/organizationId`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let filterData = response.data.filter(
            (item) => item.user.status && item.user_id != user.id
          );
          setUserList(filterData);
        }
      })
      .catch((err) => {
        setUserList([]);
      });
  }
  async function onDelete(id) {
    if (id) {
      let obj = {
        id: id,
      };
      await httpService
        .delete(`/api/review/manage`, { data: obj })
        .then(({ data: response }) => {
          if (response.status === 200) {
            fetchReviewAssignList();
            openNotificationBox("success", response.message, 3);
          } else {
            openNotificationBox("error", response.message, 3);
          }
        })
        .catch((err) => {
          fetchReviewAssignList([]);
        });
    }
  }

  useEffect(() => {
    fetchReviewAssignList();
    fetchAllMembers();
  }, []);

  useEffect(() => {
    let timeOutId = null;
    if (showCreateModal) {
      timeOutId = setTimeout(() => {
        setCreateReviewModal(true);
      }, 500);
      return () => {
        if (timeOutId) clearTimeout(timeOutId);
      };
    }
  }, [showCreateModal]);

  const answerAssignee = (data) => {
    if (data.length > 0) {
      return data.filter((item) => item.status == "answered")?.length ?? 0;
    }
  };

  const ShowReviewCountModal = ({ review_name, ReviewAssignee }) => {
    setReviewCountModalData({
      review_name,
      ReviewAssignee,
      isVisible: true,
    });
  };

  const hideReviewCountModal = () => {
    setReviewCountModalData(initialReviewCountModalData);
  };

  const ShowReviewAddModal = ({ review_id, review_name, ReviewAssignee }) => {
    setAddMembersReviewModal({
      review_id,
      review_name,
      reviewAssignee: ReviewAssignee,
      isVisible: true,
    });
  };

  const hideReviewAddMemberModal = () => {
    setAddMembersReviewModal(initialReviewCountModalData);
  };

  const columns = [
    {
      title: "Review Name",
      key: "review_name",
      width: 250,
      render: (_, record) => (
        <div className="flex">
          {record.is_published != "published" ? (
            <p className=" text-gray-500">{record.review_name}</p>
          ) : (
            <Link href={`/review/${record.id}`} passHref>
              <p className="cursor-pointer underline text-gray-500">
                {record.review_name}
              </p>
            </Link>
          )}
        </div>
      ),
    },
    {
      title: "Frequency",
      key: "frequency ",
      dataIndex: "frequency",
      render: (frequency) => (
        <p className={`capitalize `}>{frequency ?? "-"}</p>
      ),
    },
    {
      title: "Type",
      key: "review_type ",
      dataIndex: "review_type",
      render: (review_type) => <p className={`capitalize `}>{review_type}</p>,
    },
    {
      title: "Count",
      key: "count ",

      render: (_, record) =>
        record.is_published != "published" ? (
          0
        ) : (
          <div className="flex items-center gap-2">
            <p className="flex mb-0">
              {answerAssignee(record.ReviewAssignee)}/
              {record.ReviewAssignee.length}
            </p>
            <InfoCircleOutlined
              className="text-gray-600 cursor-pointer select-none"
              onClick={() =>
                ShowReviewCountModal({
                  review_name: record.review_name,
                  ReviewAssignee: record.ReviewAssignee,
                })
              }
            />
          </div>
        ),
    },
    {
      title: "Status",
      key: "is_published ",
      dataIndex: "is_published",
      render: (is_published) => (
        <p
          className={`capitalize ${
            is_published != "published" ? "text-red-600" : "text-green-600"
          }`}
        >
          {is_published}
        </p>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Dropdown
            trigger={"click"}
            overlay={
              <Menu className="divide-y">
                {record.is_published === "published" &&
                  record?.ReviewAssignee?.length < userList?.length &&
                  record.created_by === user.id && (
                    <Menu.Item
                      className="font-semibold"
                      key={"call-add-member"}
                      onClick={() => {
                        ShowReviewAddModal({
                          review_id: record.id,
                          review_name: record.review_name,
                          ReviewAssignee: record.ReviewAssignee,
                        });
                      }}
                    >
                      Add Members
                    </Menu.Item>
                  )}
                <Menu.Item className="font-semibold" key={"call-preview"}>
                  <Link href={`/review/question/preview/${record.id}`}>
                    Preview
                  </Link>
                </Menu.Item>
                {record.created_by === user.id && (
                  <>
                    <Menu.Item className="font-semibold" key={"call-follow-up"}>
                      <Link
                        href={`/followups/add/${record.id}?tp=${REVIEW_MEETINGTYPE}`}
                      >
                        Add Follow up
                      </Link>
                    </Menu.Item>

                    <Menu.Item
                      className="text-red-600 font-semibold"
                      key={"call-delete"}
                    >
                      <Popconfirm
                        title={`Are you sure to delete ${record.review_name} ？`}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={(e) => onDelete(record.id)}
                        icon={false}
                      >
                        Delete
                      </Popconfirm>
                    </Menu.Item>
                  </>
                )}
              </Menu>
            }
            placement="bottomRight"
          >
            <ButtonGray
              className="grid place-content-center w-8 h-8"
              rounded="rounded-full"
              title={
                <EllipsisOutlined rotate={90} className="text-lg leading-0" />
              }
            />
          </Dropdown>
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto max-w-full">
      <div className="grid grid-cols-1">
        <div className="flex flex-row items-center justify-between flex-wrap gap-4  mb-4 md:mb-6 ">
          <ToggleButton
            arrayList={ReviewToggleList}
            handleToggle={(activeKey) => {
              if (activeKey !== REVIEW_CREATED_KEY)
                router.push("/review/received");
            }}
            activeKey={REVIEW_CREATED_KEY}
          />

          <PrimaryButton
            withLink={false}
            onClick={() => setCreateReviewModal(true)}
            title={"Create"}
          />
        </div>

        <div className="w-full bg-white rounded-md overflow-hdden shadow-md">
          {loading ? (
            <div className="px-4">
              <Skeleton title={false} active={true} className="my-4" />
            </div>
          ) : (
            <CustomTable
              dataSource={reviewAssignList}
              columns={columns}
              rowKey="review_id"
            />
          )}
        </div>
      </div>
      <TempateSelectWrapper
        createReviewModal={createReviewModal}
        setCreateReviewModal={setCreateReviewModal}
      />

      {reviewCountModalData?.isVisible && (
        <ReviewAssignessModal
          reviewCountModalData={reviewCountModalData}
          hideReviewCountModal={hideReviewCountModal}
        />
      )}
      {addMembersReviewModal?.isVisible && (
        <AddMembersModal
          allTeamMembers={userList}
          review_name="asdasd"
          isVisible={addMembersReviewModal?.isVisible}
          review_id={addMembersReviewModal?.review_id}
          reviewAssignee={addMembersReviewModal?.reviewAssignee}
          hideReviewAddMemberModal={hideReviewAddMemberModal}
          fetchReviewAssignList={fetchReviewAssignList}
        />
      )}
    </div>
  );
}

export default ReviewManagement;
