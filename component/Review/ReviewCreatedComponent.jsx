import React, { useState, useEffect } from "react";
import { Grid } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import { Modal, Collapse, Skeleton, Row, Col, Table } from "antd";
import AnswerViewComponent from "./AnswerViewComponent";
import Link from "next/link";
import {
  CalanderIcon,
  ShareIcon,
  StarSmallIcon,
  UserIcon,
} from "../../assets/Icon/icons";
const { useBreakpoint } = Grid;

function ReviewCreatedComponent({ user, reviewData }) {
  const { xs } = useBreakpoint();
  const { Panel } = Collapse;
  const datePattern = "DD-MM-YYYY";
  const [answerData, setAnswerData] = useState([]);
  const [headersData, setHeadersData] = useState([]);
  const [answerDataModel, setAnswerDataModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [fixed, setFixed] = useState(false);
  const [totalRating, setTotalRating] = useState(0);

  useEffect(() => {
    if (xs) setFixed(xs);
    else setFixed(xs);
  }, [xs]);

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
    fixed: fixed ? false : true,
    sorter: (a, b) => a.name?.localeCompare(b.name),
  };

  useEffect(() => {
    let headersData = reviewData?.form?.form_data?.questions.map((item, i) => {
      return {
        title: item.questionText,
        dataIndex: "option" + i,
        sorter: (a, b) => a[`option${i}`]?.localeCompare(b[`option${i}`]),
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
          if (reviewData?.review_type == "feedback")
            totalRatingFunction(response.data);
          // setAnswerData(dataobj);
        }
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const totalRatingFunction = (data) => {
    let sum = 0;
    let total = data.reduce((prev, curr) => {
      if (curr?.ReviewAssigneeAnswerOption?.length > 0) {
        return (
          Number(prev) +
          Number(
            curr?.ReviewAssigneeAnswerOption[
              curr?.ReviewAssigneeAnswerOption?.length - 1
            ].option
          )
        );
      } else return 0;
    }, sum);

    let totalRating = Number(total) / Number(data?.length);
    setTotalRating(totalRating);
  };

  return (
    <div>
      <div className="px-3 md:px-8 h-auto mt-5">
        <div className="container mx-auto max-w-full">
          <div className="md:flex items-center justify-between text-base font-medium my-4 ">
            <div className="md:flex items-center ">
              <div className="primary-color-blue capitalize">
                {reviewData?.frequency} Review
              </div>
              <div className="flex ml-2">
                <div className="bg-red-400 py-2 px-2 rounded-full ">
                  <ShareIcon />
                </div>
              </div>
              <div className="flex  primary-color-blue md:mx-10">
                <p className="mr-1">Type:</p>
                <p className="capitalize">{reviewData?.review_type}</p>
              </div>
              <div className="flex  primary-color-blue">
                <p className="">Created Date:</p>
                <p>{moment(reviewData?.created_date).format(datePattern)}</p>
              </div>
            </div>

            <div>
              <div className="flex items-end justify-end ">
                <div className="flex ">
                  <Link href="/review">
                    <button className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md ">
                      Back
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Row justify="space-between" gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Row gutter={8} className="bg-white rounded-lg h-full py-6 ">
                <Col md={8} className="mx-auto my-auto">
                  <div className="flex     ">
                    <div className="  bg-violet-300 mx-auto my-auto rounded-full ">
                      <div className="px-3 py-3">
                        <StarSmallIcon />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={16} className="mx-auto my-auto">
                  <div className="flex flex-col my-auto">
                    <div className="text-sm md:text-base font-medium">
                      Total Rating
                    </div>
                    <div className="text-lg font-medium">{totalRating}</div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={6}>
              <Row gutter={8} className="bg-white rounded-lg h-full py-6 ">
                <Col md={8} className="mx-auto my-auto">
                  <div className="flex     ">
                    <div className="  bg-violet-300 mx-auto my-auto rounded-full ">
                      <div className="px-3 py-3">
                        <CalanderIcon />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={16} className="mx-auto my-auto">
                  <div className="flex flex-col my-auto">
                    <div className="text-sm md:text-base font-medium">
                      Next Due Date
                    </div>
                    <div className="text-lg font-medium">
                      {reviewData?.frequency === "monthly"
                        ? moment(reviewData?.created_date)
                            .add(30, "days")
                            .format(datePattern)
                        : reviewData?.frequency === "weekly"
                        ? moment(reviewData?.created_date)
                            .add(7, "days")
                            .format(datePattern)
                        : reviewData?.frequency === "daily"
                        ? moment(reviewData?.created_date)
                            .add(1, "days")
                            .format(datePattern)
                        : null}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={6}>
              <Row gutter={8} className="bg-white rounded-lg h-full py-6">
                <Col md={8} className="mx-auto my-auto">
                  <div className="flex     ">
                    <div className="  bg-violet-300 mx-auto my-auto rounded-full ">
                      <div className="px-3 py-3">
                        <UserIcon />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={16} className="mx-auto my-auto">
                  <div className="flex flex-col my-auto">
                    <div className="text-sm md:text-base font-medium">
                      Assign to people
                    </div>
                    <div className="text-lg font-medium">
                      {reviewData?.ReviewAssignee?.length}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
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
              <div className="overflow-x-auto mt-4">
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
                                <p className="ml-3 my-auto">
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
                              bordered={true}
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
