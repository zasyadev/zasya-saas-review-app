import { Grid } from "antd";
import xlsx from "json-as-xlsx";
import React, { useEffect, useState } from "react";
import { ButtonGray } from "../common/CustomButton";
import CustomTable from "../common/CustomTable";
import { openNotificationBox } from "../common/notification";
import { ResizableTitle } from "../Review/ResizableTitle";

const { useBreakpoint } = Grid;

function SurveyResponseComponent({
  user,
  surveyId,
  surveyName,
  surveyQuestions,
  surveyAnswers,
  fetchSurveyData,
}) {
  const { xs } = useBreakpoint();

  const [isExporting, setIsExporting] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const [columns, setColumns] = useState([]);

  let nameTitle = {
    title: "Name",
    dataIndex: "name",
    width: 180,
    fixed: xs ? false : true,
    sorter: (a, b) => a.name?.localeCompare(b.name),
    render: (_, record) => (
      <div>
        <p className="mb-0">{record.name}</p>
        {/* <p className="mb-0 flex items-center gap-2 text-gray-400 text-sm ">
          {calculateDuration({
            from: reviewData.created_date,
            to: record.answer_date,
          })}

          {CustomPopover("Reactive Time")}
        </p> */}
      </div>
    ),
  };

  const getWidthLength = (item) => {
    const width =
      item?.questionText && item?.questionText?.length > 40 ? 400 : 300;
    return width;
  };

  const mapAnswerAccortingToTableHeader = (answerData) => {
    if (Number(answerData?.length) > 0) {
      let data = answerData.map((item) => ({
        answers: item.SurveyAnswerOption,
        created_date: item.created_survey_date ?? item.created_date,
        answer_date: item.created_date,
      }));

      let dataobj = data.map((item) => {
        let optionObj = {};

        item.answers.forEach((data, i) => {
          optionObj[`question_${data.question_id}`] = data.option;
        });

        return {
          name: "unknown",
          created_date: item.created_date,
          answer_date: item.answer_date,
          ...optionObj,
        };
      });

      setDataSource(dataobj);
    }
  };

  useEffect(() => {
    let headersData = [];
    if (Number(surveyQuestions.length) > 0) {
      headersData = surveyQuestions.map((item, i) => {
        return {
          title: item.questionText,
          dataIndex: `question_${item.id}`,
          width: getWidthLength(item),
          sorter: (a, b) => a[`option${i}`]?.localeCompare(b[`option${i}`]),
        };
      });
    }
    if (headersData?.length) headersData.unshift(nameTitle);
    mapAnswerAccortingToTableHeader(surveyAnswers);

    setColumns([...headersData]);
  }, []);

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
    console.log({ data });
    if (Number(data?.length) > 0) {
      let excelData = [];
      setIsExporting(true);

      data.forEach((values) => {
        let sheetObj = {};

        sheetObj["sheet"] = surveyName;

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

        data.forEach((surveyAnswers) => {
          let obj = {};
          columns.forEach((col, index) => {
            obj[col.dataIndex] = surveyAnswers[col.dataIndex];
          });

          sheetObj["content"].push(obj);
        });

        excelData.push(sheetObj);
      });

      let settings = {
        fileName: surveyName ?? "Survey",
        extraLength: 3,
        writeMode: "writeFile",
        writeOptions: {},
        RTL: false,
      };

      await xlsx(excelData, settings, function () {
        openNotificationBox(
          "success",
          "Exported Successfully",
          3,
          "data-export"
        );
      });

      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-full">
      <div className="overflow-x-auto ">
        {Number(dataSource?.length) > 0 ? (
          <>
            <div className="text-right mb-4">
              <ButtonGray
                loading={isExporting}
                disabled={isExporting}
                title="Export"
                onClick={() => handleExport(dataSource)}
              />
            </div>

            <CustomTable
              components={{
                header: {
                  cell: ResizableTitle,
                },
              }}
              columns={mergeColumns}
              dataSource={dataSource}
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

export default SurveyResponseComponent;
