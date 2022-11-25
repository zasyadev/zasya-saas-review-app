import { EllipsisOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Popconfirm, Select, Skeleton } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../component/common/CustomButton";
import CustomTable from "../../component/common/CustomTable";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import ToggleButton from "../common/ToggleButton";
import { ReviewToggleList, REVIEW_CREATED_KEY } from "./constants";
import ReviewAssignessModal from "./ReviewAssignessModal";
import { TempateSelectWrapper } from "./TempateSelectWrapper";

const initialReviewCountModalData = {
  review_name: "",
  ReviewAssignee: [],
  isVisible: false,
};

function ReviewManagement({ user }) {
  const router = useRouter();

  const { create: showCreateModal } = router.query;
  const [loading, setLoading] = useState(false);
  const [createReviewModal, setCreateReviewModal] = useState(false);
  const [addMembersReviewModal, setAddMembersReviewModal] = useState(false);
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
  const handleAddMembers = ({ review_name, ReviewAssignee }) => {
    setReviewCountModalData({});
  };

  const hideReviewCountModal = () => {
    setReviewCountModalData(initialReviewCountModalData);
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
              <Menu className="divide-y-2">
                <Menu.Item key={"call-add-member"}>
                  {record.is_published === "published" && (
                    <span
                      title="Assign"
                      onClick={() => {
                        handleAddMembers({
                          review_name: record.review_name,
                          ReviewAssignee: record.ReviewAssignee,
                        });
                      }}
                    >
                      Add Members
                    </span>
                  )}
                </Menu.Item>

                <Menu.Item className=" font-medium" key={"call-preview"}>
                  <Link href={`/review/question/preview/${record.id}`}>
                    Preview
                  </Link>
                </Menu.Item>
                <Menu.Item
                  className="text-red-500 font-medium"
                  key={"call-delete"}
                >
                  {record.created_by === user.id && (
                    <>
                      <Popconfirm
                        title={`Are you sure to delete ${record.review_name} ？`}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => onDelete(record.id)}
                        icon={false}
                      >
                        Delete
                      </Popconfirm>
                    </>
                  )}
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
          >
            <Button shape="circle" type="secondary">
              <EllipsisOutlined rotate={90} className="text-lg" />
            </Button>
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
              <Skeleton title={false} active={true} className="my-4" />{" "}
            </div>
          ) : (
            <CustomTable
              dataSource={reviewAssignList}
              columns={columns}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "50", "100", "200", "500"],
                className: "px-2 sm:px-4",
              }}
              rowKey="review_id"
            />
          )}
        </div>
      </div>
      <TempateSelectWrapper
        createReviewModal={createReviewModal}
        setCreateReviewModal={setCreateReviewModal}
      />

      <ReviewAssignessModal
        reviewCountModalData={reviewCountModalData}
        hideReviewCountModal={hideReviewCountModal}
      />
    </div>
  );
}

export default ReviewManagement;
