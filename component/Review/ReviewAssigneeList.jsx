import React, { useState, useEffect } from "react";
import CustomTable from "../../helpers/CustomTable";
// import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { Modal, Collapse, Skeleton, Row, Col } from "antd";
import AnswerViewComponent from "./AnswerViewComponent";

export function ReviewAssigneeList({ data, setReviewAssignee, user }) {
  const { Panel } = Collapse;
  const datePattern = "DD-MM-YYYY";
  const [answerData, setAnswerData] = useState({});
  const [answerDataModel, setAnswerDataModel] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    await fetch("/api/review/answer/" + user.id, {
      method: "POST",
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setAnswerData(response.data);
        }
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col sm={18} md={18} lg={18}>
          {/* <div className="grid grid-cols-1 px-4 mb-16"> */}
          <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
            <div className="">
              <div className="overflow-x-auto">
                <Collapse
                  accordion
                  defaultActiveKey={["1"]}
                  className="review-collapse"
                  expandIconPosition="right"
                >
                  {Object.entries(dataSource)
                    .reverse()
                    .map(([key, value], idx) => {
                      return (
                        <>
                          <Panel
                            header={moment(key, "YYYY-MM-DD").format(
                              datePattern
                            )}
                            key={1 + idx}
                          >
                            <CustomTable dataSource={value} columns={columns} />
                          </Panel>
                        </>
                      );
                    })}
                </Collapse>
              </div>
            </div>
          </div>
        </Col>
        <Col
          sm={24}
          md={24}
          lg={6}
          className=" bg-white rounded-xl shadow-md py-2"
        >
          <Row justify="center">
            <Col lg={8}></Col>
            <Col lg={16}>
              <div className="flex  flex-col items-center justify-between">
                <p className="font-medium text-sm mr-4">
                  Review Name :{" "}
                  <span className="font-semibold text-sm">
                    {data.review_name}
                  </span>{" "}
                </p>
                <p className="font-medium text-sm mr-4">
                  Frequency :
                  <span className="font-semibold text-sm">
                    {data.frequency}
                  </span>
                </p>
                <p className="font-medium text-sm">
                  Review Type :
                  <span className="font-semibold text-sm">
                    {data.review_type}
                  </span>
                </p>
              </div>
            </Col>

            {/* <button
                className={`bg-indigo-800
                     text-white text-sm py-3 text-center px-4 rounded-md `}
                onClick={() => setReviewAssignee(false)}
              >
                Back
              </button> */}
          </Row>
          <div className="flex justify-between">
            <div className="text-lime-600 text-sm">Review genrated:50</div>
            <div className="text-red-700 text-sm">Review pending:20</div>
          </div>
        </Col>
      </Row>
      <Modal
        title="Answers"
        visible={answerDataModel}
        //    onOk={handleOk}
        onCancel={() => setAnswerDataModel(false)}
        footer={null}
      >
        <div>
          {loading ? (
            <Skeleton
              title={false}
              active={true}
              width={[200]}
              className="mt-4"
              rows={3}
            />
          ) : answerData?.length > 0 ? (
            answerData.map((ans, idx) => {
              return (
                <div key={idx + "que"}>
                  {ans?.ReviewAssigneeAnswerOption?.length > 0
                    ? ans?.ReviewAssigneeAnswerOption.map((item, i) => {
                        return (
                          <>
                            <AnswerViewComponent
                              questionText={item.question.questionText}
                              option={item.option}
                              type={item.question.type}
                              idx={i}
                            />
                            {/* <div 
                            //   key={i + "ans"}
                            //   className=" m-1 bg-slate-200 p-2"
                            // >
                            //   <p>
                            //     {item.question.questionText} :{"    "}{" "}
                            //     {item.option}
                            //   </p>
                            // </div>*/}
                          </>
                        );
                      })
                    : null}
                </div>
              );
            })
          ) : null}
        </div>
      </Modal>
    </>
  );
}
