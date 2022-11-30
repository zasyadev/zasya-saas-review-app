import { Grid } from "antd";
import xlsx from "json-as-xlsx";
import React, { useEffect, useState } from "react";
import { calculateDuration } from "../../helpers/momentHelper";
import { ButtonGray } from "../common/CustomButton";
import CustomPopover from "../common/CustomPopover";
import { openNotificationBox } from "../common/notification";

const { useBreakpoint } = Grid;

function ReviewCreatedComponent({
  surveyData,
  surveyId,
  fetchSurveyData,
  answerData,
}) {
  const { xs } = useBreakpoint();

  const [isExporting, setIsExporting] = useState(false);
  const [dataSource, setDataSource] = useState({});

  const [columns, setColumns] = useState([]);

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
    // if (Number(surveyData.length) > 0) {
    //   headersData = surveyData[0].ReviewAssigneeAnswerOption.map((item, i) => {
    //     return {
    //       title: item.question.questionText,
    //       dataIndex: `question_${item.question_id}`,
    //       width: getWidthLength(item.question),
    //       sorter: (a, b) => a[`option${i}`]?.localeCompare(b[`option${i}`]),
    //     };
    //   });
    // }
    // if (headersData?.length) headersData.unshift(nameTitle);

    // handleAnswerChange(answerData);
    // setColumns([...headersData]);
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

  return (
    <div className="container mx-auto max-w-full">
      <div className="overflow-x-auto mt-4 md:mt-6">
        {dataSource &&
        typeof dataSource === "object" &&
        Object.keys(dataSource).length ? (
          <>
            <div className="text-right mb-4">
              <ButtonGray
                loading={isExporting}
                disabled={isExporting}
                title="Export"
                onClick={() => handleExport(dataSource)}
              />
            </div>

            {/* <CustomTable
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
                    }} />
                */}
          </>
        ) : (
          <div className="bg-white p-5 rounded-md text-base font-medium">
            <p>No answers yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewCreatedComponent;
