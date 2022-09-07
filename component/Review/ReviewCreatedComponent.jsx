import { CalendarOutlined } from "@ant-design/icons";
import { Col, Collapse, Grid, Popconfirm, Row, Table, Tooltip } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import {
  CalanderIcon,
  ShareIcon,
  StarSmallIcon,
  UserIcon,
} from "../../assets/icons";
import { openNotificationBox } from "../../component/common/notification";
import { calculateDuration } from "../../helpers/momentHelper";
import httpService from "../../lib/httpService";
const { useBreakpoint } = Grid;

function ReviewCreatedComponent({
  user,
  reviewData,
  reviewId,
  fetchReviewData,
}) {
  const { xs } = useBreakpoint();
  const { Panel } = Collapse;
  const datePattern = "DD-MM-YYYY";

  const [headersData, setHeadersData] = useState([]);

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
    render: (_, record) => (
      <div>
        <p className="mb-0">{record.name}</p>
        <p className="mb-0 text-gray-400 text-sm ">
          <Tooltip title="Reactive Time" placement={"bottom"}>
            {calculateDuration({
              from: reviewData.created_date,
              to: record.answer_date,
            })}
          </Tooltip>{" "}
        </p>
      </div>
    ),
  };

  // let reactivityTimeColoum = {
  //   title: "Reactivity Time",
  //   dataIndex: "answer_date",

  //   render: (answer_date) =>
  //     calculateDuration({
  //       from: reviewData.created_date,
  //       to: answer_date,
  //     }),

  useEffect(() => {
    let headersData = [];
    if (reviewData?.form?.form_data.length) {
      headersData = reviewData?.form?.form_data.map((item, i) => {
        return {
          title: item.questionText,
          dataIndex: "option" + i,
          sorter: (a, b) => a[`option${i}`]?.localeCompare(b[`option${i}`]),
        };
      });
    } else {
      headersData = reviewData?.form?.form_data.questions.map((item, i) => {
        return {
          title: item.questionText,
          dataIndex: "option" + i,
          sorter: (a, b) => a[`option${i}`]?.localeCompare(b[`option${i}`]),
        };
      });
    }
    if (headersData?.length) headersData.unshift(nameTitle);

    // headersData.push(reactivityTimeColoum);

    setHeadersData(headersData);
    fetchAnswer(reviewData.id);
  }, []);

  const columns = [...headersData];

  const fetchAnswer = async (id) => {
    setDataSource([]);
    setLoading(true);
    await httpService
      .get(`/api/review/answer/${id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let data = response.data.map((item) => ({
            user: item.user,
            answers: item.ReviewAssigneeAnswerOption.reverse(),
            created_date: item.created_assignee_date ?? item.created_date,
            answer_date: item.created_date,
          }));

          let dataobj = data.map((item) => {
            let optionObj = {};

            item.answers.forEach((data, i) => {
              optionObj[`option${i}`] = data.option;
            });

            return {
              name: item.user.first_name + " " + item.user.last_name,
              created_date: item.created_date,
              answer_date: item.answer_date,
              ...optionObj,
            };
          });
          applyFilters(dataobj);

          if (reviewData?.review_type == "feedback")
            totalRatingFunction(response.data);
        }
        setLoading(false);
      })
      .catch((err) => console.log(err.response.data.message));
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

    let totalRating = 0;
    if (total) totalRating = Number(total) / Number(data?.length);

    setTotalRating(totalRating.toFixed(2));
  };

  const jobChangeHandler = async (id) => {
    await httpService
      .put(`/api/review/manage`, {
        id: id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          fetchReviewData(user, reviewId);
        } else {
          openNotificationBox("error", response.message, 3);
        }
      })
      .catch((err) => {
        fetchReviewAssignList([]);
        console.error(err.response.data.message);
      });
  };

  return (
    <div className="container mx-auto max-w-full">
      <div className="md:flex items-center justify-between text-base font-medium my-4 ">
        <div className="md:flex items-center ">
          <div className="text-primary capitalize">
            {reviewData?.frequency} Review
          </div>
          <div className="flex ml-2">
            <div className="bg-red-400 py-2 px-2 rounded-full ">
              <ShareIcon />
            </div>
          </div>
          <div className="flex  text-primary md:mx-10 my-auto">
            <p className="mr-1">Type:</p>
            <p className="capitalize">{reviewData?.review_type}</p>
          </div>
          <div className="flex  text-primary my-auto">
            <p className="mr-1">Created Date: </p>
            <p>{moment(reviewData?.created_date).format(datePattern)}</p>
          </div>
        </div>

        <div className="flex items-end justify-between ">
          <Link href="/review">
            <button className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md ">
              Back
            </button>
          </Link>
          {reviewData.frequency != "once" &&
            reviewId &&
            !reviewData.frequency_status && (
              <Popconfirm
                title="Are you sure you want to stop the frequency of this review?"
                okText="Yes"
                cancelText="No"
                icon={false}
                onConfirm={() => jobChangeHandler(reviewId)}
                placement="bottomRight"
              >
                <div className="ml-2">
                  <button className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md ">
                    Stop
                  </button>
                </div>
              </Popconfirm>
            )}
        </div>
      </div>
      <Row justify="space-between" gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Row gutter={8} className="bg-white rounded-md h-full py-6">
            <Col md={8} className="mx-auto my-auto">
              <div className="flex     ">
                <div className="answer-bg-icon mx-auto my-auto rounded-full ">
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
                <div className="text-lg font-medium">{totalRating ?? 0}</div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={6}>
          <Row gutter={8} className="bg-white rounded-md h-full py-6 ">
            <Col md={8} className="mx-auto my-auto">
              <div className="flex     ">
                <div className="answer-bg-icon  mx-auto my-auto rounded-full ">
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
          <Row gutter={8} className="bg-white rounded-md h-full py-6">
            <Col md={8} className="mx-auto my-auto">
              <div className="flex     ">
                <div className="answer-bg-icon mx-auto my-auto rounded-full ">
                  <div className="px-3 py-3">
                    <UserIcon />
                  </div>
                </div>
              </div>
            </Col>
            <Col md={16} className="mx-auto my-auto">
              <div className="flex flex-col my-auto">
                <div className="text-sm md:text-base font-medium">
                  Assign Count
                </div>
                <div className="text-lg font-medium">
                  {reviewData?.ReviewAssignee?.length}
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

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
                              {moment(key, "YYYY-MM-DD").format(datePattern)}
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
                          pagination={false}
                        />
                      </Panel>
                    </>
                  );
                })}
            </Collapse>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ReviewCreatedComponent;
