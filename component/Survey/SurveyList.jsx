import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import CustomTable from "../common/CustomTable";
import { TempateSelectWrapper } from "../Review/TempateSelectWrapper";
import { SURVEY_TYPE } from "../Template/constants";

function SurveyList({ user }) {
  const [loading, setLoading] = useState(false);
  const [createSurveyModal, setCreateSurveyModal] = useState(false);
  const [surveyList, setSurveyList] = useState([]);

  async function fetchSurveyList() {
    setLoading(true);
    setSurveyList([]);

    await httpService
      .get(`/api/survey/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setSurveyList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response.data?.message);
      });
  }

  useEffect(() => {
    fetchSurveyList();
  }, []);

  const columns = [
    {
      title: "Survey Name",
      dataIndex: "survey_name",
      key: "survey_name",
    },
    {
      title: "Questions",
      key: "Questions",
      render: (_, survey) => survey.SurveyQuestions.length,
    },

    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) =>
        status ? (
          <p className="text-green-400 mb-0">Active</p>
        ) : (
          <p className="text-red-400 mb-0">Pending</p>
        ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, survey) => <p></p>,
    },
  ];

  return (
    <div className="container mx-auto max-w-full">
      <div className="grid grid-cols-1 mb-16">
        <div className="flex flex-row items-center justify-end flex-wrap gap-4  mb-4 md:mb-6 ">
          <PrimaryButton
            withLink={false}
            onClick={() => setCreateSurveyModal(true)}
            title={"Create"}
          />
        </div>
        <div className="w-full bg-white rounded-md overflow-hdden shadow-md">
          {loading ? (
            <div className="p-4">
              <Skeleton title={false} active={true} />
            </div>
          ) : (
            <CustomTable
              dataSource={surveyList}
              columns={columns}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "50", "100", "200", "500"],
                className: "px-2 sm:px-4",
              }}
            />
          )}
        </div>
      </div>
      <TempateSelectWrapper
        createReviewModal={createSurveyModal}
        setCreateReviewModal={setCreateSurveyModal}
        type={SURVEY_TYPE}
      />
    </div>
  );
}

export default SurveyList;
