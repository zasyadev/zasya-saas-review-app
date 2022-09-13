import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Skeleton } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import CustomTable from "../../component/common/CustomTable";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import CustomModal from "../common/CustomModal";

function ReviewManagement({ user }) {
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
                <DeleteOutlined className="text-color-red text-xl" />
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
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between  mb-4 md:mb-6">
          <div className="flex w-auto">
            <PrimaryButton
              withLink={true}
              className="rounded-r-none rounded-l-md  w-1/2 md:w-fit "
              linkHref="/review/received"
              title={"Received"}
            />
            <SecondaryButton
              withLink={false}
              className="rounded-l-none rounded-r-md w-1/2 md:w-fit "
              title={"Created"}
            />
          </div>
          <div className="mb-4 md:mb-0 text-right">
            <PrimaryButton
              withLink={false}
              className="rounded-md"
              // linkHref="/review/add"
              onClick={() => setCreateReviewModal(true)}
              title={"Create"}
            />
          </div>
        </div>

        <div className="w-full bg-white rounded-md overflow-hdden shadow-md px-4 pb-4">
          <div className="">
            <div className="overflow-x-auto">
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
      </div>
      <CustomModal
        title="Create a Review"
        visible={createReviewModal}
        onCancel={() => setCreateReviewModal(false)}
        footer={false}
        customFooter
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4  space-x-3">
          <div className="flex flex-col items-center space-y-3">
            <p className="text-primary text-xl font-extrabold ">From scratch</p>
            <p className="text-primary text-md font-semibold text-center">
              Write your own questions with the style and format you like.
            </p>
            <PrimaryButton
              withLink={true}
              linkHref="/review/add"
              title={"From Scratch"}
            />
          </div>
          <div className="flex flex-col items-center space-y-3">
            <p className="text-primary text-xl font-extrabold ">
              From a template
            </p>
            <p className="text-primary text-md font-semibold text-center">
              Save time with pre-made questions
            </p>
            <PrimaryButton
              withLink={true}
              linkHref="/template/view"
              title={"From Template"}
            />
          </div>
        </div>
      </CustomModal>
    </div>
  );
}

export default ReviewManagement;
