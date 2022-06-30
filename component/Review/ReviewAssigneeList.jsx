import React, { useState, useEffect } from "react";
import CustomTable from "../../helpers/CustomTable";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import { Modal, Collapse, Skeleton, Row, Col } from "antd";
import AnswerViewComponent from "./AnswerViewComponent";

function ReviewAssigneeList({ data, setReviewAssignee, user }) {
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
      key: "assigned_to",
      render: (assigned_to) =>
        assigned_to.first_name + " " + assigned_to.last_name,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status ? (
          <p className="text-green-400">Filled</p>
        ) : (
          <p className="text-red-400">Pending</p>
        ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="">
          {record.status == "answered" ? (
            <span
              className="FormView text-lg mx-2 cursor-pointer"
              onClick={() => {
                setAnswerDataModel(true);
                //   setAnswerData(record);
                fetchAnswer(record);
              }}
            >
              <EyeOutlined />
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
      <div className="flex items-end justify-end my-3">
        <div className="flex ">
          <button
            className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md "
            onClick={() => setReviewAssignee(false)}
          >
            Back
          </button>
        </div>
      </div>
      <Row gutter={[32, 16]}>
        <Col sm={24} md={16} lg={16}>
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
                        header={moment(key, "YYYY-MM-DD").format(datePattern)}
                        key={1 + idx}
                      >
                        <CustomTable dataSource={value} columns={columns} />
                      </Panel>
                    </>
                  );
                })}
            </Collapse>
          </div>
        </Col>
        <Col
          sm={24}
          md={8}
          lg={8}
          className=" bg-white rounded-xl shadow-md py-2 h-30"
        >
          <Row>
            <Col>
              <div className="flex  flex-col items-start justify-between text mx-3 my-3">
                <div className="primary-color-blue font-semibold text-lg mr-4 leading-3 mb-2">
                  Review Name :{" "}
                  <span className=" primary-color-blue font-semibold text-lg">
                    {data.review_name}
                  </span>{" "}
                </div>
                <div className="primary-color-blue font-semibold text-lg mr-4 leading-3 mb-2">
                  Frequency :
                  <span className="primary-color-blue font-semibold text-lg">
                    {data.frequency}
                  </span>
                </div>
                <div className="primary-color-blue font-semibold text-lg mb-2">
                  Review Type :
                  <span className="primary-color-blue font-semibold text-lg">
                    {data.review_type}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
          <div className="flex justify-between items-center my-4 ">
            <div className="text-green-400 text-base font-semibold px-2">
              Review genrated : 50
            </div>
            <div className="text-red-400 text-base font-semibold px-2">
              Review pending : 20
            </div>
          </div>
        </Col>
      </Row>
      <Modal
        title="Answers"
        visible={answerDataModel}
        //    onOk={handleOk}
        onCancel={() => setAnswerDataModel(false)}
        footer={null}
        wrapClassName="modal-answer-wrapper"
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

export default ReviewAssigneeList;
