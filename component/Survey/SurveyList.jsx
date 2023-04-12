import { EllipsisOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Popconfirm, Skeleton } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { URLS } from "../../constants/urls";
import httpService from "../../lib/httpService";
import { ButtonGray, PrimaryButton } from "../common/CustomButton";
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
        setSurveyList(response.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchSurveyList();
  }, []);

  async function onDelete(id) {
    if (id) {
      let obj = {
        id: id,
        userId: user.id,
      };
      await httpService
        .delete(`/api/survey/getSurveyByUrl`, { data: obj })
        .then(({ data: response }) => {
          fetchSurveyList();
          openNotificationBox("success", response.message, 3);
        })
        .catch((err) => {
          openNotificationBox("error", err.response?.data?.message, 3);
        });
    }
  }

  const columns = [
    {
      title: "Survey Name",
      key: "survey_name",
      render: (_, survey) => (
        <Link href={`${URLS.SURVEY_RESPONSE}/${survey.id}`} passHref>
          <p className="cursor-pointer underline text-gray-500 mb-0">
            {survey.survey_name}
          </p>
        </Link>
      ),
    },
    {
      title: "Questions",
      key: "Questions",
      render: (_, survey) => survey.SurveyQuestions.length,
    },
    {
      title: "Responses",
      key: "responses",
      render: (_, survey) => survey._count.SurveyAnswers,
    },

    {
      title: "Action",
      key: "action",
      render: (_, survey) => (
        <div className="flex items-center space-x-4">
          <ButtonGray
            className="grid place-content-center w-9 h-9"
            rounded="rounded-full"
            title={<ShareAltOutlined className=" leading-0" title="Share" />}
            withLink={true}
            linkHref={`${URLS.SURVEY_SHARE}/${survey.id}`}
          />

          <Dropdown
            trigger={"click"}
            overlay={
              <Menu className="divide-y">
                <Menu.Item className="font-semibold" key={"call-preview"}>
                  <Link href={`${URLS.SURVEY_PREVIEW}/${survey.id}`}>
                    Preview
                  </Link>
                </Menu.Item>
                {survey.created_by === user.id && (
                  <Menu.Item
                    className="text-red-600 font-semibold"
                    key={"call-delete"}
                  >
                    <Popconfirm
                      title={`Are you sure to delete ${survey.survey_name} ？`}
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => onDelete(survey.id)}
                      icon={false}
                    >
                      Delete
                    </Popconfirm>
                  </Menu.Item>
                )}
              </Menu>
            }
            placement="bottomRight"
          >
            <ButtonGray
              className="grid place-content-center w-9 h-9"
              rounded="rounded-full"
              title={
                <EllipsisOutlined rotate={90} className="text-lg leading-0" />
              }
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto max-w-full">
      <div className="grid grid-cols-1 mb-16">
        <div className="flex flex-row items-center justify-between flex-wrap gap-4  mb-4 md:mb-6 ">
          <p className="text-xl font-semibold mb-0">Surveys</p>
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
            <CustomTable dataSource={surveyList} columns={columns} />
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
