import { EyeOutlined } from "@ant-design/icons";
import { Modal, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../helpers/notification";
import QuestionViewComponent from "./QuestionViewComponent";
import CustomTable from "../../helpers/CustomTable";
import Link from "next/link";

function FormView({ user }) {
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [formAssignList, setFormAssignList] = useState([]);
  const [formValues, setFormValues] = useState([]);

  async function fetchFormAssignList() {
    if (user.id) {
      setLoading(true);
      setFormAssignList([]);
      await fetch("/api/form/" + user.id, { method: "GET" })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            setFormAssignList(response.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    fetchFormAssignList();
  }, []);

  const columns = [
    {
      title: "Assign By",
      dataIndex: "review",
      key: "Assign_By",
      render: (review) =>
        review.created.first_name + " " + review.created.last_name,
    },

    {
      title: "Review Name",
      dataIndex: "review",
      key: "review",
      render: (review) => review.review_name,
    },
    {
      title: "Frequency",
      dataIndex: "review",
      key: "frequency",
      render: (review) => review.frequency,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) =>
        status ? (
          <p className="text-green-400">Answered</p>
        ) : (
          <p className="text-red-400">Pending</p>
        ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <p>
          {/* <span
            className="primary-color-blue text-lg mx-2 cursor-pointer"
            onClick={() => showModal(record)}
          >
            <EyeOutlined />
          </span> */}
          {!record.status ? (
            <Link href={`/review/id/${record.id}`}>
              <span
                className="primary-color-blue text-lg  cursor-pointer"
                title="Attempt"
              >
                <EyeOutlined />
              </span>
            </Link>
          ) : (
            ""
          )}
        </p>
      ),
    },
  ];

  return (
    <div>
      <div className="px-3 md:px-8 h-auto mt-5">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 px-4 mb-16">
            <div className="flex items-center justify-between mb-3">
              <div className="flex">
                <button
                  className={`
                    bg-red-400
                   text-white text-sm py-3 text-center px-4 rounded-r-none rounded-l-md rounded-md md:w-fit mt-2 `}
                >
                  Review Received
                </button>

                <Link href="/review">
                  <button
                    className={`primary-bg-btn
                    text-white text-sm py-3 text-center px-4 rounded-r-md rounded-l-none md:w-fit mt-2 `}
                  >
                    Review Created
                  </button>
                </Link>
              </div>
            </div>
            <div className="w-full bg-white rounded-xl overflow-hdden shadow-md px-4 pb-4">
              <div className="p-4 ">
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
                      dataSource={formAssignList}
                      columns={columns}
                      rowKey="form_view"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormView;
