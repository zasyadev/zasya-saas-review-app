import { EyeOutlined } from "@ant-design/icons";

import { Modal, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../helpers/notification";
import QuestionViewComponent from "./QuestionViewComponent";
import CustomTable from "../../helpers/CustomTable";
import Link from "next/link";

function FormView({ user, setReviewAssign, reviewAssign }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [formAssignList, setFormAssignList] = useState([]);
  const [formValues, setFormValues] = useState([]);

  const showModal = (item) => {
    setIsModalVisible(true);
    setUpdateData(item);
  };

  const onCancel = () => {
    setIsModalVisible(false);
  };
  console.log(formAssignList, "formAssignList");
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

  const handleSubmit = async () => {
    // let array = formValues.map((item) => {
    //   return { ...item, user_id: user.id, form_id: updateData.id };
    // });
    if (user.id && updateData.id) {
      let obj = {
        user_id: user.id,
        review_assignee_id: updateData.id,
        answers: formValues,
        review_id: updateData.review.id,
      };

      await fetch("/api/form/answer", {
        method: "POST",
        body: JSON.stringify(obj),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            setIsModalVisible(false);
            openNotificationBox("success", response.message, 3);
          } else {
            openNotificationBox("error", response.message, 3);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAnswerChange = (quesId, value) => {
    setFormValues((prev) =>
      prev.find((item) => item.questionId === quesId)
        ? prev.map((item) =>
            item.questionId === quesId ? { ...item, answer: value } : item
          )
        : [...prev, { questionId: quesId, answer: value }]
    );
  };
  const columns = [
    {
      title: "Assign By",
      dataIndex: "review",
      key: "Assign_By",
      render: (review) =>
        review.created.first_name + " " + review.created.last_name,
    },
    // {
    //   title: "Assign To",
    //   dataIndex: "assigned_to",
    //   render: (assigned_to) =>
    //     assigned_to.first_name + " " + assigned_to.last_name,
    // },
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
            <Link href={`/review/received/${record.id}`}>
              <span className="primary-color-blue text-lg mx-2 cursor-pointer">
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
                  className={`${
                    reviewAssign ? "bg-red-400" : "primary-bg-btn"
                  }  text-white text-sm py-3 text-center px-4 rounded-r-none rounded-l-md rounded-md md:w-fit mt-2 `}
                  onClick={() => setReviewAssign(true)}
                >
                  Review Received
                </button>
                <button
                  className={`${
                    reviewAssign ? "primary-bg-btn" : "bg-red-400"
                  } text-white text-sm py-3 text-center px-4 rounded-r-md rounded-l-none md:w-fit mt-2 `}
                  onClick={() => setReviewAssign(false)}
                >
                  Review Created
                </button>
              </div>
            </div>
            <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
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
      <Modal
        title="View Review Template"
        visible={isModalVisible}
        onOk={() => handleSubmit()}
        onCancel={() => onCancel()}
        width={900}
        wrapClassName="view_form_modal"
      >
        <div>
          <div className="">
            <div>
              <div className="w-full flex  flex-col items-start px-4 pt-4 pb-5 bg-gray-200 rounded">
                <div>
                  <h3 className="text-2xl font-medium primary-color-blue mb-2">
                    {updateData?.review?.form?.form_title}
                  </h3>
                  <p className="text-base  font-normal text-black mb-2">
                    {updateData?.review?.form?.form_description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {updateData?.review?.form?.questions.length > 0 &&
            updateData?.review?.form?.questions?.map((question, idx) => (
              <>
                <QuestionViewComponent
                  {...question}
                  idx={idx}
                  open={false}
                  handleAnswerChange={handleAnswerChange}
                />
              </>
            ))}
        </div>
      </Modal>
    </div>
  );
}

export default FormView;
