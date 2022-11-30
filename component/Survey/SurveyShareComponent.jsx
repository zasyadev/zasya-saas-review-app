import { Input, Skeleton, Switch } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { DATE_FORMAT_FULL } from "../../helpers/dateHelper";
import httpService from "../../lib/httpService";
import CustomTable from "../common/CustomTable";
import NoRecordFound from "../common/NoRecordFound";
import { openNotificationBox } from "../common/notification";
import AdminLayout from "../layout/AdminLayout";

const SURVEY_BASE_URL = process.env.NEXT_PUBLIC_APP_URL + "survey/";

function SurveyResponsePage({ user }) {
  const router = useRouter();
  const { surveyId } = router.query;

  const [surveyData, setSurveyData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSurveyData = async (surveyId) => {
    setLoading(true);
    setSurveyData({});

    await httpService
      .post(`/api/survey/getByChannel`, {
        surveyId: surveyId,
        user_id: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setSurveyData(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (surveyId) fetchSurveyData(surveyId);
  }, [surveyId]);

  const handleCopyUrl = (url) => {
    if (navigator) {
      navigator.clipboard.writeText(url);
      openNotificationBox("success", "Url Copied!", 3, "copied-text");
    }
  };

  const handleUpdateSurveyChannelStatus = (id, status) => {
    console.log({ id, status });
  };

  const allSharesColumn = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created At",
      dataIndex: "created_date",
      key: "created_date",
      render: (date) => (date ? moment(date).format(DATE_FORMAT_FULL) : null),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Switch
          className={`${record.status ? "bg-green-700" : "bg-red-700"}`}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={record.status}
          onChange={() =>
            handleUpdateSurveyChannelStatus(record, !record.status)
          }
        />
      ),
    },

    {
      title: "Action",
      key: "action",
    },
  ];

  const defaultUrl = useMemo(() => {
    if (Number(surveyData?.SurveyChannels?.length) > 0) {
      const findDefaultUrlObj = surveyData?.SurveyChannels.find(
        (share) => share.isDefault === true
      );

      if (findDefaultUrlObj)
        return `${SURVEY_BASE_URL}${findDefaultUrlObj.url}`;
    }

    return null;
  }, [surveyData]);

  return (
    <AdminLayout user={user} isBack title={surveyData?.survey_name}>
      {loading ? (
        <div className="container bg-white rounded-md p-5 mx-auto max-w-full">
          <Skeleton active />
        </div>
      ) : surveyData ? (
        <>
          <div className="container mx-auto rounded-md bg-white max-w-full">
            <div className="p-4 md:p-6 ">
              <h3 className="text-center text-lg lg:text-xl font-bold leading-6 -tracking-wider">
                Link To Share
              </h3>
              <div className="flex items-center max-w-xl mx-auto my-4">
                <Input
                  size="large"
                  className="rounded-l-md font-semibold text-primary leading-6"
                  value={defaultUrl}
                />
                <button
                  className={`text-white text-center px-4 py-2 h-10 w-24 flex-shrink-0 rounded-r-md
              bg-primary
                `}
                  onClick={() => handleCopyUrl(defaultUrl)}
                >
                  Copy Url
                </button>
              </div>
            </div>
          </div>
          <h3 className="px-4 text-lg lg:text-xl font-bold leading-6 -tracking-wider my-4">
            All Shares
          </h3>
          <CustomTable
            dataSource={
              Number(surveyData?.SurveyChannels?.length) > 0
                ? surveyData?.SurveyChannels
                : []
            }
            columns={allSharesColumn}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "50", "100", "200", "500"],
              className: "px-2 sm:px-4",
            }}
          />
        </>
      ) : (
        <NoRecordFound />
      )}
    </AdminLayout>
  );
}

export default SurveyResponsePage;