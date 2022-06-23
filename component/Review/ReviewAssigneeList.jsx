import React, { useState, useEffect } from "react";
import CustomTable from "../../helpers/CustomTable";
// import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { Modal, Collapse } from "antd";

export function ReviewAssigneeList({ data, setReviewAssignee, user }) {
  const { Panel } = Collapse;
  const datePattern = "DD-MM-YYYY";
  const [answerData, setAnswerData] = useState({});
  const [answerDataModel, setAnswerDataModel] = useState(false);

  const [dataSource, setDataSource] = useState([]);

  const applyFilters = (object) => {
    let result = object?.ReviewAssignee.reduce(function (obj, key) {
      obj[key.created_date.split("T")[0]] =
        obj[key.created_date.split("T")[0]] || [];
      obj[key.created_date.split("T")[0]].push(key);
      return obj;
    }, {});
    setDataSource(result);
  };

  useEffect(() => {
    applyFilters(data);
  }, []);

  const columns = [
    {
      title: "Assign To",
      dataIndex: "assigned_to",
      render: (assigned_to) =>
        assigned_to.first_name + " " + assigned_to.last_name,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => <p>{status ? "Filled" : "Pending"}</p>,
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="">
          {record.status == "answered" ? (
            <span
              className="text-yellow-500 text-lg mx-2 cursor-pointer"
              onClick={() => {
                setAnswerDataModel(true);
                //   setAnswerData(record);
                fetchAnswer(record);
              }}
            >
              View
            </span>
          ) : null}
          {/* 
          <button
            className="text-white text-base bg-indigo-800 text-center px-3 rounded-md pb-2"
            // onClick={() => onDelete(record.id)}
          >
            <DeleteOutlined />
          </button> */}
        </div>
      ),
    },
  ];

  const fetchAnswer = async (obj) => {
    setAnswerData({});
    await fetch("/api/review/answer/" + user.id, {
      method: "POST",
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setAnswerData(response.data);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="grid grid-cols-1 px-4 mb-16">
      <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
        <div className="">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-base mr-4">
                Review Name :{" "}
                <span className="font-semibold text-base">
                  {data.review_name}
                </span>{" "}
              </p>
              <p className="font-medium text-base mr-4">
                Frequency :{" "}
                <span className="font-semibold text-base">
                  {data.frequency}
                </span>
              </p>
              <p className="font-medium text-base">
                Review Type :{" "}
                <span className="font-semibold text-base">
                  {data.review_type}
                </span>
              </p>
            </div>
            <button
              className={`bg-indigo-800
                     text-white text-sm py-3 text-center px-4 rounded-md `}
              onClick={() => setReviewAssignee(false)}
            >
              Back
            </button>
          </div>

          <div className="overflow-x-auto">
            {/* {loading ? (
                    <Skeleton
                      title={false}
                      active={true}
                      width={[200]}
                      className="mt-4"
                      rows={3}
                    />
                  ) : ( */}
            <Collapse accordion>
              {Object.entries(dataSource).map(([key, value]) => {
                return (
                  <>
                    {/* <h3 className="font-semibold text-lg">
                    {moment(key, "YYYY-MM-DD").format(datePattern)}
                  </h3> */}
                    <Panel
                      header={moment(key, "YYYY-MM-DD").format(datePattern)}
                      key={key}
                    >
                      <CustomTable dataSource={value} columns={columns} />
                    </Panel>
                    {/* <CustomTable dataSource={value} columns={columns} /> */}
                  </>
                );
              })}
            </Collapse>
            {/* {data.ReviewAssignee.length > 0 ? (
              <CustomTable dataSource={data.ReviewAssignee} columns={columns} />
            ) : (
              <p>No Record Found</p>
            )} */}

            {/* )} */}
          </div>
        </div>
      </div>

      <Modal
        title="Answers"
        visible={answerDataModel}
        //    onOk={handleOk}
        onCancel={() => setAnswerDataModel(false)}
        footer={null}
      >
        <div>
          {answerData?.length > 0
            ? answerData.map((ans, idx) => {
                return (
                  <div
                    key={idx + "que"}
                    className=" border-2  border-slate-100  bg-slate-100 mx-2 p-2 "
                  >
                    {ans?.ReviewAssigneeAnswerOption?.length > 0
                      ? ans?.ReviewAssigneeAnswerOption.map((item, i) => {
                          return (
                            <div
                              key={i + "ans"}
                              className=" m-1 bg-slate-200 p-2"
                            >
                              <p>
                                {item.question.questionText} :{"    "}{" "}
                                {item.option}
                              </p>
                            </div>
                          );
                        })
                      : null}
                  </div>
                );
              })
            : null}
        </div>
      </Modal>
    </div>
  );
}
