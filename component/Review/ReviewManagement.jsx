import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Skeleton } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ButtonGray, PrimaryButton } from "../../component/common/CustomButton";
import CustomTable from "../../component/common/CustomTable";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import ToggleButton from "../common/ToggleButton";
import { ReviewToggleList, REVIEW_CREATED_KEY } from "./constants";
import { TempateSelectWrapper } from "./TempateSelectWrapper";

function ReviewManagement({ user }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [createReviewModal, setCreateReviewModal] = useState(false);
  const [reviewAssignList, setReviewAssignList] = useState([]);

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
          console.error(err.response.data?.message);
        });
    }
  }

  useEffect(() => {
    fetchReviewAssignList();
  }, []);

  const answerAssignee = (data) => {
    if (data.length > 0) {
      let length = 0;
      let a = data.filter((item) => item.status);
      if (a.length) return a.length;
      else return length;
    }
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
      title: "Status",
      key: "is_published ",
      dataIndex: "is_published",
      render: (is_published) => (
        <p
          className={`capitalize ${
            is_published != "published" ? "text-red-400" : "text-green-400"
          }`}
        >
          {is_published}
        </p>
      ),
    },
    {
      title: "Count",
      key: "count ",

      render: (_, record) =>
        record.is_published != "published" ? (
          0
        ) : (
          <p>
            {answerAssignee(record.ReviewAssignee)}/
            {record.ReviewAssignee.length}
          </p>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <p>
          {record.is_published != "published" && (
            <Link href={`/review/edit/${record.id}`} passHref>
              <span
                className="text-primary text-xl mr-4 cursor-pointer"
                title="Assign"
              >
                <EditOutlined />
              </span>
            </Link>
          )}

          {record.created_by === user.id && (
            <>
              <Popconfirm
                title={`Are you sure to delete ${record.review_name} ？`}
                okText="Yes"
                cancelText="No"
                onConfirm={() => onDelete(record.id)}
                icon={false}
              >
                <DeleteOutlined className="text-red-500 text-xl" />
              </Popconfirm>
            </>
          )}
        </p>
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
          <div className="px-4">
            {loading ? (
              <Skeleton
                title={false}
                active={true}
                width={[200]}
                className="mt-4"
                rows={3}
              />
            ) : (
              <CustomTable
                dataSource={reviewAssignList}
                columns={columns}
                pagination={true}
                rowKey="review_id"
              />
            )}
          </div>
        </div>
      </div>
      <TempateSelectWrapper
        createReviewModal={createReviewModal}
        setCreateReviewModal={setCreateReviewModal}
      />
    </div>
  );
}

export default ReviewManagement;
