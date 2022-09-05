import React, { useState, useEffect } from "react";
import { Form, Skeleton, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { openNotificationBox } from "../../component/common/notification";
import CustomTable from "../../component/common/CustomTable";
import Link from "next/link";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import httpService from "../../lib/httpService";

function ReviewManagement({ user }) {
  const [loading, setLoading] = useState(false);

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
        console.error(err.response.data.message);
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
          console.error(err.response.data.message);
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
          <Link href={`/review/${record.id}`}>
            <p className="cursor-pointer underline text-gray-500">
              {record.review_name}
            </p>
          </Link>
        </div>
      ),
    },
    {
      title: "Frequency",
      key: "frequency ",
      dataIndex: "frequency",
      render: (frequency) => <p className={`capitalize `}>{frequency}</p>,
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
            <Link href={`/review/edit/${record.id}`}>
              <span
                className="primary-color-blue text-xl mr-4 cursor-pointer"
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
        <div className=" md:flex items-center justify-between mb-3  ">
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
          <div className="mt-2 md:mt-0">
            <PrimaryButton
              withLink={true}
              className="rounded-md w-full"
              linkHref="/review/add"
              title={"Create"}
            />
          </div>
        </div>

        <div className="w-full bg-white rounded-xl overflow-hdden shadow-md px-4 pb-4">
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
    </div>
  );
}

export default ReviewManagement;
