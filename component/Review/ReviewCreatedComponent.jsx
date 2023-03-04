import {
  EditOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Collapse, Form, Grid, Popconfirm, Select, Tooltip } from "antd";
import xlsx from "json-as-xlsx";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";
import { MONTH_DATE_FORMAT, YEAR_DATE_FORMAT } from "../../helpers/dateHelper";
import { calculateDuration } from "../../helpers/momentHelper";
import httpService from "../../lib/httpService";
import CountHeaderCard from "../common/CountHeaderCard";
import { PrimaryButton, SecondaryButton } from "../common/CustomButton";
import CustomModal from "../common/CustomModal";
import CustomPopover from "../common/CustomPopover";
import CustomTable from "../common/CustomTable";
import { ResizableTitle } from "./ResizableTitle";
import ReviewAssignessModal from "./ReviewAssignessModal";

const { useBreakpoint } = Grid;

const initialReviewCountModalData = {
  review_name: "",
  ReviewAssignee: [],
  isVisible: false,
};

function ReviewCreatedComponent({
  reviewData,
  reviewId,
  fetchReviewData,
  answerData,
}) {
  const { lg } = useBreakpoint();
  const { Panel } = Collapse;
  const [FrequencyUpdateForm] = Form.useForm();
  const [editFreqModalVisible, setEditFreqModalVisible] = useState(false);
  const [updateFreqApiLoading, setUpdateFreqApiLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
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
    fixed: lg,
    sorter: (a, b) => a.name?.localeCompare(b.name),
    render: (_, record) => (
      <div>
        <p className="mb-0">{record.name}</p>
        <p className="mb-0 flex items-center gap-2  text-sm ">
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
    if (Number(answerData.length) > 0) {
      headersData = answerData[0].ReviewAssigneeAnswerOption.map((item, i) => {
        return {
          title: item.question.questionText,
          dataIndex: `question_${item.question_id}`,
          width: getWidthLength(item.question),
          sorter: (a, b) => a[`option${i}`]?.localeCompare(b[`option${i}`]),
        };
      });
    }
    if (headersData?.length) headersData.unshift(nameTitle);

    handleAnswerChange(answerData);
    setColumns([...headersData]);
  }, [lg]);

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
        optionObj[`question_${data.question_id}`] = data.option;
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

  const jobChangeHandler = async (obj) => {
    setUpdateFreqApiLoading(true);
    await httpService
      .put(`/api/review/manage`, obj)
      .then(({ data: response }) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          fetchReviewData(reviewId);
          setUpdateFreqApiLoading(false);
          if (editFreqModalVisible) {
            setEditFreqModalVisible(false);
          }
        }
      })
      .catch((err) => {
        openNotificationBox(
          "error",
          err?.response?.data?.message || "Unable to update! Please try again"
        );
        setUpdateFreqApiLoading(false);
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

  const handleExport = async (data) => {
    let excelData = [];
    setIsExporting(true);

    Object.entries(data).forEach(([key, values]) => {
      if (Number(values?.length) > 0) {
        let sheetObj = {};

        sheetObj["sheet"] = key;

        sheetObj["columns"] = columns.map((col) => {
          return { label: col.title, value: col.dataIndex };
        });
        let duplicateCount = 0;
        sheetObj["columns"] = sheetObj["columns"].map((col, idx) => {
          const findSameLabelKey = sheetObj["columns"].find(
            (data, index) => data.label === col.label && index != idx
          );

          if (findSameLabelKey) {
            const underScoresString = new Array(duplicateCount)
              .fill("_")
              .toString();
            duplicateCount++;
            return {
              label: `${col.label}${
                underScoresString ? underScoresString : ""
              }`,
              value: col.value,
            };
          } else {
            return col;
          }
        });

        sheetObj["content"] = [];

        values.forEach((answerData) => {
          let obj = {};
          columns.forEach((col, index) => {
            obj[col.dataIndex] = answerData[col.dataIndex];
          });

          sheetObj["content"].push(obj);
        });

        excelData.push(sheetObj);
      }
    });

    let settings = {
      fileName: reviewData?.review_name ?? "Review",
      extraLength: 3,
      writeMode: "writeFile",
      writeOptions: {},
      RTL: false,
    };
    await xlsx(excelData, settings, function () {
      openNotificationBox("success", "Exported Successfully", 3, "data-export");
    });

    setIsExporting(false);
  };

  const handleUpdateFrequency = (values) => {
    jobChangeHandler({ id: reviewId, ...values });
  };

  return (
    <div className="container mx-auto max-w-full">
      <div className="flex flex-row items-center justify-between flex-wrap gap-4  mb-2 xl:mb-4 ">
        <p className="text-xl font-semibold mb-0">Personal Feedback</p>
        {dataSource &&
        typeof dataSource === "object" &&
        Object.keys(dataSource).length ? (
          <PrimaryButton
            loading={isExporting}
            disabled={isExporting}
            title="Export"
            withLink={false}
            onClick={() => handleExport(dataSource)}
          />
        ) : null}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
        <CountHeaderCard
          imgSrc="/media/svg/contract-pending.svg"
          imgSrcClassNames="bg-brandBlue-200"
          title="Created Date"
          subTitle={moment(reviewData?.created_date).format(MONTH_DATE_FORMAT)}
        />
        <CountHeaderCard
          imgSrc="/media/svg/completed-goals.svg"
          imgSrcClassNames="bg-brandOrange-200"
          title="Frequency"
          subTitle={
            <span className="flex justify-between items-center">
              <span className="capitalize">{reviewData?.frequency} </span>
              <span className="flex justify-between items-center">
                <Tooltip
                  placement="bottom"
                  trigger={"hover"}
                  title="Update Frequency"
                >
                  <div
                    className="w-8 h-8 primary-color-blue p-2 rounded-full bg-gray-100 text-base cursor-pointer grid place-content-center ml-2"
                    onClick={() => setEditFreqModalVisible(true)}
                  >
                    <EditOutlined className="primary-color-bluetext-base " />
                  </div>
                </Tooltip>
                {reviewData.frequency != "once" &&
                  reviewId &&
                  !reviewData.frequency_status && (
                    <Popconfirm
                      title={
                        <p className="font-medium mb-0">
                          Are you sure you want to stop the frequency of this
                          review?
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
                        <StopOutlined className="text-base p-2 leading-0 bg-gray-100 text-red-700  text-center rounded-full ml-2" />
                      </Tooltip>
                    </Popconfirm>
                  )}
              </span>
            </span>
          }
        />
        <CountHeaderCard
          imgSrc="/media/svg/contract-pending.svg"
          imgSrcClassNames="bg-brandBlue-200"
          title="Rating"
          subTitle={totalRating ?? 0}
        />

        <CountHeaderCard
          imgSrc="/media/svg/assign-user.svg"
          imgSrcClassNames="bg-brandGreen-400"
          title="Assign Count"
          subTitle={
            <span className="flex justify-between items-center">
              <span className="capitalize">
                {reviewData?.ReviewAssignee?.length}{" "}
              </span>
              <span className="flex justify-between items-center">
                <InfoCircleOutlined
                  className="text-gray-600 cursor-pointer select-none"
                  onClick={() =>
                    ShowReviewCountModal({
                      review_name: reviewData?.review_name,
                      ReviewAssignee: reviewData?.ReviewAssignee,
                    })
                  }
                />
              </span>
            </span>
          }
        />
      </div>

      <div className="overflow-x-auto  mt-4 md:mt-6">
        {dataSource &&
        typeof dataSource === "object" &&
        Object.keys(dataSource).length ? (
          <Collapse
            accordion
            defaultActiveKey={["1"]}
            className="review-collapse "
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
                  size="middle"
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

      <CustomModal
        title={
          <p className="single-line-clamp mb-0 pr-6">Update Review Frequency</p>
        }
        visible={editFreqModalVisible}
        onCancel={() => setEditFreqModalVisible(false)}
        customFooter
        footer={[
          <>
            <SecondaryButton
              onClick={() => setEditFreqModalVisible(false)}
              className=" h-full mr-2"
              title="Cancel"
            />
            <PrimaryButton
              onClick={() => FrequencyUpdateForm.submit()}
              className=" h-full  "
              title="Update"
              disabled={updateFreqApiLoading}
              loading={updateFreqApiLoading}
            />
          </>,
        ]}
      >
        <Form
          layout="vertical"
          form={FrequencyUpdateForm}
          onFinish={(value) => handleUpdateFrequency(value)}
          initialValues={{
            frequency: reviewData.frequency,
          }}
        >
          <Form.Item
            name="frequency"
            className="mb-0 margin-b-0"
            rules={[
              {
                required: true,
                message: "Please select your frequency",
              },
            ]}
          >
            <Select
              placeholder="Select Frequency"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              size="large"
              className="w-full font-bold"
            >
              <Select.Option value="once">Once</Select.Option>
              <Select.Option value="daily">Daily</Select.Option>
              <Select.Option value="weekly">Weekly</Select.Option>
              <Select.Option value="monthly">Monthly</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </CustomModal>
    </div>
  );
}

export default ReviewCreatedComponent;
