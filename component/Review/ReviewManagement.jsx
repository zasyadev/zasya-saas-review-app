import {
  EllipsisOutlined,
  InfoCircleOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, Popconfirm, Skeleton } from "antd";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ButtonGray, PrimaryButton } from "../../component/common/CustomButton";
import CustomTable from "../../component/common/CustomTable";
import { openNotificationBox } from "../../component/common/notification";
import { URLS } from "../../constants/urls";
import randomBgColor from "../../helpers/randomBgColor";
import { getFirstTwoLetter } from "../../helpers/truncateString";
import httpService from "../../lib/httpService";
import DateInfoCard from "../Goals/component/GoalsGroupList/components/DateInfoCard";
import { REVIEW_MEETINGTYPE } from "../Meetings/constants";
import AddMembersModal from "./AddMembersModal";
import { ReviewStatusTabCard } from "./component/ReviewStatusTabCard";
import {
  REVIEW_All_STATUS_KEY,
  REVIEW_CREATED_KEY,
  REVIEW_PENDING_KEY,
  REVIEW_RECEIVED_KEY,
} from "./constants";
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

const initialCountData = {
  all: 0,
  recevied: 0,
  created: 0,
  pending: 0,
};

function ReviewManagement({ user }) {
  const router = useRouter();
  const { create: showCreateModal } = router.query;
  const [loading, setLoading] = useState(false);
  const [createReviewModal, setCreateReviewModal] = useState(false);
  const [reviewDataStatus, setReviewDataStatus] = useState(
    REVIEW_All_STATUS_KEY
  );
  const [countData, setCountData] = useState(initialCountData);
  const [addMembersReviewModal, setAddMembersReviewModal] = useState(
    initialAddMembersReviewModal
  );
  const [userList, setUserList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [reviewCountModalData, setReviewCountModalData] = useState(
    initialReviewCountModalData
  );

  async function fetchReviewAssignList(status) {
    setLoading(true);
    setReviewList([]);
    await httpService
      .get(`/api/review/get_by_status?status=${status}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setReviewList(response.data.list);
          setCountData(response.data.listCount);
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
    fetchReviewAssignList(reviewDataStatus);
  }, [reviewDataStatus]);

  useEffect(() => {
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

  const reviewProgressValue = (data) => {
    if (Number(data.length) > 0) {
      const completedData =
        data.filter((item) => item.status == "answered")?.length ?? 0;
      return Math.round((completedData / data.length) * 100);
    }
    return 0;
  };

  const columns = [
    {
      title: "Review Name",
      key: "review_name",
      width: 550,
      render: (_, record) => (
        <div className="flex ">
          {!record.is_published ? (
            <p className=" text-gray-500">{record.review.review_name}</p>
          ) : (
            <Link href={`/review/${record.id}`} passHref>
              <p className="cursor-pointer hover:underline text-gray-500">
                {record.review_name}
              </p>
            </Link>
          )}
        </div>
      ),
    },
    {
      title: "Date",
      key: "created_date",
      render: (_, record) => <DateInfoCard endDate={record?.created_date} />,
    },
    {
      title: "progress",
      key: "prgress",
      render: (_, record, index) => (
        <div className="flex items-center space-x-2 justify-end">
          {record.frequency ? (
            <>
              <p className={`mb-0 leading-none`}>
                {record.frequency !== "once" ? (
                  <RetweetOutlined title={record.frequency} />
                ) : (
                  ""
                )}
              </p>
              <div className="shrink-0 space-y-1">
                <div className=" flex-1  bg-gray-200 rounded-full h-1.5 w-28">
                  <div
                    className={clsx(
                      reviewProgressValue(record?.ReviewAssignee) < 25
                        ? "bg-red-500"
                        : "bg-green-600",
                      "h-1.5 rounded-full"
                    )}
                    style={{
                      width: `${reviewProgressValue(record?.ReviewAssignee)}%`,
                    }}
                  ></div>
                </div>
                <p
                  className={clsx(
                    reviewProgressValue(record?.ReviewAssignee) < 25
                      ? "text-red-500"
                      : "text-green-600",
                    "mb-0 text-xs"
                  )}
                >
                  {reviewProgressValue(record?.ReviewAssignee)} % Completed
                </p>
              </div>
              <InfoCircleOutlined
                className="text-gray-600 cursor-pointer select-none "
                onClick={() =>
                  ShowReviewCountModal({
                    review_name: record.review_name,
                    ReviewAssignee: record.ReviewAssignee,
                  })
                }
              />
              <div
                className="w-8 h-8 grid place-content-center rounded-full text-xs text-white capitalize"
                style={{
                  backgroundColor: `hsl(${(index * 9) % 360}, 50%, 50%)`,
                }}
              >
                {getFirstTwoLetter(record?.created?.first_name ?? "User")}
              </div>
            </>
          ) : (
            <>
              {record.status === "answered" ? (
                <div className="text-brandBlue-700 px-4 py-1 bg-brandBlue-200 rounded-md">
                  Answered
                </div>
              ) : (
                <div className="text-brandOrange-400 px-4 py-1 bg-brandOrange-300 rounded-md">
                  Pending
                </div>
              )}
              <div
                className="w-8 h-8 grid place-content-center rounded-full text-xs text-white capitalize"
                style={{
                  backgroundColor: randomBgColor(index),
                }}
              >
                {getFirstTwoLetter(
                  record?.review?.created?.first_name ?? "User"
                )}
              </div>
            </>
          )}
        </div>
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
                {record.is_published === "published" ? (
                  <>
                    {record?.ReviewAssignee?.length < userList?.length &&
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
                      <Link
                        href={`${URLS.REVIEW_QUESTION_PREVIEW}/${record.id}`}
                      >
                        Preview
                      </Link>
                    </Menu.Item>
                    {record.created_by === user.id && (
                      <>
                        <Menu.Item
                          className="font-semibold"
                          key={"call-follow-up"}
                        >
                          <Link
                            href={`${URLS.FOLLOW_UP_CREATE}/${record.id}?tp=${REVIEW_MEETINGTYPE}`}
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
                  </>
                ) : (
                  <Menu.Item className="font-semibold" key={"call-preview"}>
                    {record.status === "answered" ? (
                      <Link href={`${URLS.REVIEW_PREVIEW}/${record.id}`}>
                        View
                      </Link>
                    ) : (
                      <Link href={`${URLS.REVIEW_ATTEMPT}/${record.id}`}>
                        Attempt
                      </Link>
                    )}
                  </Menu.Item>
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

  const statusFilter = [
    {
      onClickStatus: () => setReviewDataStatus(REVIEW_All_STATUS_KEY),
      imageSrc: "/media/svg/all-review.svg",
      countData: countData.all,
      title: "All",
      className: "bg-brandBlue-200",
      isActive: reviewDataStatus === REVIEW_All_STATUS_KEY,
    },
    {
      onClickStatus: () => setReviewDataStatus(REVIEW_RECEIVED_KEY),
      imageSrc: "/media/svg/contract-management.svg",
      countData: countData.recevied,
      title: "Received",
      className: "bg-brandGreen-200",
      isActive: reviewDataStatus === REVIEW_RECEIVED_KEY,
    },
    {
      onClickStatus: () => setReviewDataStatus(REVIEW_CREATED_KEY),
      imageSrc: "/media/svg/completed-goals.svg",
      countData: countData.created,
      title: "Created",
      className: "bg-brandOrange-200",
      isActive: reviewDataStatus === REVIEW_CREATED_KEY,
    },
    {
      onClickStatus: () => setReviewDataStatus(REVIEW_PENDING_KEY),
      imageSrc: "/media/svg/contract-pending.svg",
      countData: countData.pending,
      title: "Pending",
      className: "bg-brandBlue-200",
      isActive: reviewDataStatus === REVIEW_PENDING_KEY,
    },
  ];

  return (
    <div className="container mx-auto max-w-full">
      <div className="grid grid-cols-1">
        <div className="flex flex-row items-center justify-between flex-wrap gap-4  mb-2 xl:mb-4 ">
          <p className="text-xl font-semibold mb-0">Review</p>
          {/* <ToggleButton
            arrayList={ReviewToggleList}
            handleToggle={(activeKey) => {
              if (activeKey !== REVIEW_CREATED_KEY)
                router.push("/review/received");
            }}
            activeKey={REVIEW_CREATED_KEY}
          /> */}

          <PrimaryButton
            withLink={false}
            onClick={() => setCreateReviewModal(true)}
            title={"Create"}
          />
        </div>

        <div className="grid col-span-1 sm:grid-cols-2 md:grid-cols-4 bg-white rounded-t-md">
          {statusFilter.map((item, idx) => (
            <ReviewStatusTabCard data={item} key={idx + "tab-card"} />
          ))}
        </div>

        <div className="w-full bg-white rounded-b-md overflow-hdden shadow-md">
          {loading ? (
            <div className="px-4">
              <Skeleton title={false} active={true} className="my-4" />
            </div>
          ) : (
            <CustomTable
              dataSource={reviewList}
              columns={columns}
              rowKey="review_id"
              showHeader={false}
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
          review_name={addMembersReviewModal.review_name}
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
