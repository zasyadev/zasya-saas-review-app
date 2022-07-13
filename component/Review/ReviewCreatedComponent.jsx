import React, { useState, useEffect } from "react";

import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import { Modal, Collapse, Skeleton, Row, Col, Table } from "antd";
import AnswerViewComponent from "./AnswerViewComponent";
import Link from "next/link";

function ReviewCreatedComponent({ user, reviewData }) {
  const { Panel } = Collapse;
  const datePattern = "DD-MM-YYYY";
  const [answerData, setAnswerData] = useState([]);
  const [headersData, setHeadersData] = useState([]);
  const [answerDataModel, setAnswerDataModel] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]);

  const applyFilters = (object) => {
    if (object.length > 0) {
      let result = object?.reduce(function (obj, key) {
        obj[key.created_date.split("T")[0]] =
          obj[key.created_date.split("T")[0]] || [];
        obj[key.created_date.split("T")[0]].push(key);
        return obj;
      }, {});
      setDataSource(result);
    } else setDataSource([]);
  };

  let nameTitle = {
    title: "Name",
    dataIndex: "name",
    fixed: "left",
  };

  useEffect(() => {
    let headersData = reviewData?.form?.form_data?.questions.map((item, i) => {
      return {
        title: item.questionText,
        dataIndex: "option" + i,
      };
    });
    headersData.unshift(nameTitle);
    setHeadersData(headersData);
    fetchAnswer(reviewData.id);
  }, []);

  const columns = [...headersData];

  const fetchAnswer = async (id) => {
    setDataSource([]);
    setLoading(true);
    await fetch("/api/review/answer/" + id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.map((item) => ({
            user: item.user,
            answers: item.ReviewAssigneeAnswerOption.reverse(),
            created_date: item.created_date,
          }));

          let dataobj = data.map((item) => {
            let optionObj = {};

            item.answers.forEach((data, i) => {
              optionObj[`option${i}`] = data.option;
            });

            return {
              name: item.user.first_name + " " + item.user.last_name,
              created_date: item.created_date,
              ...optionObj,
            };
          });
          applyFilters(dataobj);
          // setAnswerData(dataobj);
        }
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <div className="px-3 md:px-8 h-auto mt-5">
        <div className="container mx-auto max-w-full">
          <div className="flex items-end justify-end my-3">
            <div className="flex ">
              <Link href="/review">
                <button className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md ">
                  Back
                </button>
              </Link>
            </div>
          </div>
          {/* <Table
            className="review-question-table"
            columns={columns}
            dataSource={answerData}
            scroll={{
              x: 1300,
            }}
            rowClassName={(_, index) =>
              index % 2 === 0 ? "" : "background-color-voilet"
            }
            bordered
          /> */}

          <Row gutter={[16, 16]}>
            <Col xs={24} md={24}>
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
                            header={
                              <div className="flex items-center">
                                <CalendarOutlined />
                                <p className="ml-3">
                                  {moment(key, "YYYY-MM-DD").format(
                                    datePattern
                                  )}
                                </p>
                              </div>
                            }
                            key={1 + idx}
                          >
                            <Table
                              className="review-question-table"
                              columns={columns}
                              dataSource={value}
                              scroll={{
                                x: 1300,
                              }}
                              rowClassName={(_, index) =>
                                index % 2 === 0 ? "" : "background-color-voilet"
                              }
                              bordered
                            />
                          </Panel>
                        </>
                      );
                    })}
                </Collapse>
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
        </div>
      </div>
    </div>
  );
}

export default ReviewCreatedComponent;
