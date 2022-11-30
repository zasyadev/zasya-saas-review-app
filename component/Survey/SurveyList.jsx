import { Dropdown, Menu, Popconfirm, Skeleton } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { ButtonGray, PrimaryButton } from "../common/CustomButton";
import CustomTable from "../common/CustomTable";
import { TempateSelectWrapper } from "../Review/TempateSelectWrapper";
import { SURVEY_TYPE } from "../Template/constants";
import { EllipsisOutlined } from "@ant-design/icons";

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

  async function onDelete(id) {
    if (id) {
      let obj = {
        id: id,
        userId: user.id,
      };
      await httpService
        .delete(`/api/survey/getSurveyByUrl`, { data: obj })
        .then(({ data: response }) => {
          if (response.status === 200) {
            fetchSurveyList();
            openNotificationBox("success", response.message, 3);
          } else {
            openNotificationBox("error", response.message, 3);
          }
        })
        .catch((err) => {
          fetchReviewAssignList([]);
        });
    }
  }

  const columns = [
    {
      title: "Survey Name",
      key: "survey_name",
      render: (_, survey) => (
        <Link href={`/survey/response/${survey.id}`} passHref>
          <p className="cursor-pointer underline text-gray-500">
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
        <>
          <Dropdown
            trigger={"click"}
            overlay={
              <Menu className="divide-y">
                <Menu.Item className="font-semibold" key={"call-preview"}>
                  <Link href={`/survey/share/${survey.id}`}>Share</Link>
                </Menu.Item>
                <Menu.Item className="font-semibold" key={"call-preview"}>
                  {/* <Link href={`/review/question/preview/${survey.id}`}> */}
                  Preview
                  {/* </Link> */}
                </Menu.Item>
                {survey.created_by === user.id && (
                  <Menu.Item
                    className="text-red-600 font-semibold"
                    key={"call-delete"}
                  >
                    <>
                      <Popconfirm
                        title={`Are you sure to delete ${survey.survey_name} ？`}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => onDelete(survey.id)}
                        icon={false}
                      >
                        Delete
                      </Popconfirm>
                    </>
                  </Menu.Item>
                )}
              </Menu>
            }
            placement="bottomRight"
          >
            <ButtonGray
              className="grid place-content-center w-8 h-8"
              rounded="rounded-full"
              title={
                <EllipsisOutlined rotate={90} className="text-lg leading-0" />
              }
            />
          </Dropdown>
        </>
      ),
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
