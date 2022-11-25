import {
  CalendarOutlined,
  FileTextOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  StarOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Collapse, Grid, Popconfirm, Tooltip } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";
import { calculateDuration } from "../../helpers/momentHelper";
import httpService from "../../lib/httpService";
import CustomTable from "../common/CustomTable";
import { ResizableTitle } from "./ResizableTitle";
import { MONTH_DATE_FORMAT, YEAR_DATE_FORMAT } from "../../helpers/dateHelper";
import CustomPopover from "../common/CustomPopover";
import ReviewAssignessModal from "./ReviewAssignessModal";

const { useBreakpoint } = Grid;

const initialReviewCountModalData = {
  review_name: "",
  ReviewAssignee: [],
  isVisible: false,
};

function InfoCard({ count, title, Icon, className = "", ActionButton }) {
  return (
    <div className={`bg-white p-5 rounded-md  ${className}`}>
      <div className="flex flex-wrap items-stretch h-full gap-3">
        <div className="bg-primary-gray text-primary grid items-center w-10 h-10 py-1 px-1 justify-center shadow-lg-pink rounded-full">
          <Icon />
        </div>
        <div className="flex-1">
          <div className="text-primary font-semibold capitalize tracking-wide text-sm mb-2">
            {title}
          </div>
          <div className="flex flex-wrap items-center">
            <span className="flex-1 text-lg 2xl:text-xl capitalize text-primary font-semibold leading-6">
              {count}
            </span>
            {ActionButton && <ActionButton />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewCreatedComponent({
  reviewData,
  reviewId,
  fetchReviewData,
  answerData,
}) {
  const { xs } = useBreakpoint();
  const { Panel } = Collapse;

  const [dataSource, setDataSource] = useState({});
  const [totalRating, setTotalRating] = useState(0);
  const [columns, setColumns] = useState([]);
  const [reviewCountModalData, setReviewCountModalData] = useState(
    initialReviewCountModalData
  );

  const applyFilters = (object) => {
    if (object.length > 0) {
      let result = object?.reduce(function (obj, key) {
        obj[key.created_date.split("T")[0]] =
          obj[key.created_date.split("T")[0]] || [];
        obj[key.created_date.split("T")[0]].push(key);
        return obj;
      }, {});

      setDataSource(result);
    } else setDataSource({});
  };

  let nameTitle = {
    title: "Name",
    dataIndex: "name",
    width: 180,
    fixed: xs ? false : true,
    sorter: (a, b) => a.name?.localeCompare(b.name),
    render: (_, record) => (
      <div>
        <p className="mb-0">{record.name}</p>
        <p className="mb-0 flex items-center gap-2 text-gray-400 text-sm ">
          {calculateDuration({
            from: reviewData.created_date,
            to: record.answer_date,
          })}

          {CustomPopover("Reactive Time")}
        </p>
      </div>
    ),
  };

  const getWidthLength = (item) => {
    const width =
      item?.questionText && item?.questionText?.length > 40 ? 400 : 300;
    return width;
  };

  useEffect(() => {
    let headersData = [];

    if (Number(reviewData?.form?.form_data?.questions?.length) > 0) {
      headersData = reviewData?.form?.form_data.questions.map((item, i) => {
        return {
          title: item.questionText,
          dataIndex: "option" + i,
          width: getWidthLength(item),
          sorter: (a, b) => a[`option${i}`]?.localeCompare(b[`option${i}`]),
        };
      });
    } else {
      if (Number(answerData.length) > 0) {
        headersData = answerData[0].ReviewAssigneeAnswerOption.map(
          (item, i) => {
            return {
              title: item.question.questionText,
              dataIndex: "option" + i,
              width: getWidthLength(item.question),
              sorter: (a, b) => a[`option${i}`]?.localeCompare(b[`option${i}`]),
            };
          }
        ).reverse();
      }
      // headersData = reviewData?.form?.form_data.map((item, i) => {
      //   return {
      //     title: item.questionText,
      //     dataIndex: "option" + i,
      //     width: getWidthLength(item),
      //     sorter: (a, b) => a[`option${i}`]?.localeCompare(b[`option${i}`]),
      //   };
      // });
    }
    if (headersData?.length) headersData.unshift(nameTitle);

    handleAnswerChange(answerData);
    setColumns([...headersData]);
  }, []);

  const handleAnswerChange = (answerData) => {
    let data = answerData.map((item) => ({
      user: item.user,
      answers: item.ReviewAssigneeAnswerOption,
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

    if (reviewData?.review_type == "feedback") totalRatingFunction(answerData);
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
          fetchReviewData(reviewId);
        }
      })
      .catch((err) => {
        console.error(err.response.data?.message);
      });
  };

  const handleResize =
    (index) =>
    (_, { size }) => {
      const newColumns = [...columns];

      if (size.width > 130) {
        newColumns[index] = { ...newColumns[index], width: size.width };
      }
      setColumns(newColumns);
    };

  const mergeColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  const ShowReviewCountModal = ({ review_name, ReviewAssignee }) => {
    setReviewCountModalData({
      review_name,
      ReviewAssignee,
      isVisible: true,
    });
  };

  const hideReviewCountModal = () => {
    setReviewCountModalData(initialReviewCountModalData);
  };

  return (
    <div className="container mx-auto max-w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 2xl:gap-6">
        <InfoCard
          title={`Review Created At`}
          count={moment(reviewData?.created_date).format(MONTH_DATE_FORMAT)}
          Icon={() => <FileTextOutlined className="text-xl leading-0" />}
        />
        <InfoCard
          title={`Review Frequency`}
          count={reviewData?.frequency}
          Icon={() => <HistoryOutlined className="text-xl leading-0" />}
          ActionButton={() =>
            reviewData.frequency != "once" &&
            reviewId &&
            !reviewData.frequency_status && (
              <Popconfirm
                title={
                  <p className="font-medium mb-0">
                    Are you sure you want to stop the frequency of this review?
                  </p>
                }
                okText="Yes"
                cancelText="No"
                onConfirm={() => jobChangeHandler(reviewId)}
                placement="topRight"
                overlayClassName="max-w-sm"
              >
                <Tooltip
                  placement="bottom"
                  title={"To stop the frequency of this review"}
                >
                  <StopOutlined className="text-base p-1 leading-0 bg-gray-100  text-center rounded-full mx-2" />
                </Tooltip>
              </Popconfirm>
            )
          }
        />
        <InfoCard
          title={"Total Rating"}
          count={totalRating ?? 0}
          Icon={() => <StarOutlined className="text-xl leading-0" />}
        />

        <InfoCard
          title={"Assign Count"}
          count={reviewData?.ReviewAssignee?.length}
          Icon={() => <UserOutlined className="text-xl leading-0" />}
          ActionButton={() => (
            <InfoCircleOutlined
              className="text-gray-600 cursor-pointer select-none"
              onClick={() =>
                ShowReviewCountModal({
                  review_name: reviewData?.review_name,
                  ReviewAssignee: reviewData?.ReviewAssignee,
                })
              }
            />
          )}
        />
      </div>

      <div className="overflow-x-auto mt-4 md:mt-6">
        {dataSource &&
        typeof dataSource === "object" &&
        Object.keys(dataSource).length ? (
          <Collapse
            accordion
            defaultActiveKey={["1"]}
            className="review-collapse"
            expandIconPosition="end"
          >
            {Object.entries(dataSource).map(([key, value], idx) => (
              <Panel
                header={
                  <div className="flex items-center">
                    <CalendarOutlined />
                    <p className="ml-3 my-auto">
                      {moment(key, YEAR_DATE_FORMAT).format(MONTH_DATE_FORMAT)}
                    </p>
                  </div>
                }
                key={1 + idx}
              >
                <CustomTable
                  components={{
                    header: {
                      cell: ResizableTitle,
                    },
                  }}
                  columns={mergeColumns}
                  dataSource={value}
                  scroll={{
                    x: 1500,
                    y: 500,
                  }}
                  bordered={true}
                  pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "50", "100", "200", "500"],
                    className: "px-2 sm:px-4",
                  }}
                />
              </Panel>
            ))}
          </Collapse>
        ) : (
          <div className="bg-white p-5 rounded-md text-base font-medium">
            <p>No answers yet</p>
          </div>
        )}
      </div>
      <ReviewAssignessModal
        reviewCountModalData={reviewCountModalData}
        hideReviewCountModal={hideReviewCountModal}
      />
    </div>
  );
}

export default ReviewCreatedComponent;
