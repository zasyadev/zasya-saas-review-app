import {
  CopyOutlined,
  DeleteOutlined,
  MailOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Popconfirm,
  Popover,
  Select,
  Skeleton,
  Switch,
} from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { DATE_FORMAT_FULL } from "../../helpers/dateHelper";
import { validateEmail } from "../../helpers/validateEmail";
import httpService from "../../lib/httpService";
import { PrimaryButton, SecondaryButton } from "../common/CustomButton";
import CustomModal from "../common/CustomModal";
import CustomTable from "../common/CustomTable";
import NoRecordFound from "../common/NoRecordFound";
import { openNotificationBox } from "../common/notification";
import AdminLayout from "../layout/AdminLayout";
import SurveyCustomerModal from "./SurveyCustomerModal";

const SURVEY_BASE_URL = process.env.NEXT_PUBLIC_APP_URL + "survey/";

const initialSurveyCountModalData = {
  survey_name: "",
  SurveyCustomer: [],
  isVisible: false,
};

function SurveyResponsePage({ user }) {
  const router = useRouter();
  const [emailForm] = Form.useForm();
  const { surveyId } = router.query;
  const [surveyData, setSurveyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [surveyCountModalData, setSurveyCountModalData] = useState(
    initialSurveyCountModalData
  );

  const ShowReviewCountModal = ({ survey_name, SurveyCustomer }) => {
    setSurveyCountModalData({
      survey_name,
      SurveyCustomer,
      isVisible: true,
    });
  };

  const hideSurveyCountModal = () => {
    setSurveyCountModalData(initialSurveyCountModalData);
  };

  const fetchSurveyData = async (isLoadingRequired = true) => {
    if (isLoadingRequired) {
      setLoading(true);
      setSurveyData({});
    }

    await httpService
      .post(`/api/survey/channels`, {
        surveyId: surveyId,
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
    if (surveyId) fetchSurveyData();
  }, [surveyId]);

  const handleCopyUrl = (url) => {
    if (navigator) {
      navigator.clipboard.writeText(url);
      openNotificationBox("success", "Url Copied!", 3, "copied-text");
    }
  };

  const handleUpdateSurveyChannelStatus = async (id, status) => {
    const oldSurveyData = surveyData;
    setSurveyData((prev) => ({
      ...prev,
      SurveyChannels: prev.SurveyChannels.map((channel) =>
        channel.id === id ? { ...channel, status: status } : channel
      ),
    }));
    await httpService
      .put(`/api/survey/channels`, {
        channelId: id,
        status: status,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          fetchSurveyData(false);
          openNotificationBox("success", response.message, 3, "updateKey");
        }
      })
      .catch((err) => {
        setSurveyData(oldSurveyData);
        setLoading(false);
      });
  };

  async function onDelete(channelId) {
    if (channelId) {
      await httpService
        .delete(`/api/survey/channels`, {
          data: {
            channelId: channelId,
          },
        })
        .then(({ data: response }) => {
          if (response.status === 200) {
            fetchSurveyData(false);
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

  const allSharesColumn = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <p
          className={
            record.type === "Email" ? "underline cursor-pointer mb-0" : ""
          }
          onClick={() => {
            if (record.type === "Email") {
              ShowReviewCountModal({
                survey_name: record.name,
                SurveyCustomer: record?.SurveyChannelUser,
              });
            }
          }}
        >
          {record.name}
        </p>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
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
          className={`${record.status ? "bg-green-600" : "bg-red-600"}`}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={record.status}
          onChange={() =>
            handleUpdateSurveyChannelStatus(record.id, !record.status)
          }
        />
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <p>
          {record.type === "Link" && (
            <Popover
              content={<p className="font-medium mb-0">Copy Url</p>}
              trigger={["click", "hover"]}
              placement="top"
              overlayClassName="max-w-sm"
            >
              <CopyOutlined
                className=" text-xl mx-1  md:mx-2 cursor-pointer"
                onClick={() => handleCopyUrl(SURVEY_BASE_URL + record.url)}
              />
            </Popover>
          )}

          <Popconfirm
            title={`Are you sure to delete this channel？`}
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record.id)}
            icon={false}
          >
            <DeleteOutlined className="text-red-500 text-xl mx-1 md:mx-2 cursor-pointer" />
          </Popconfirm>
        </p>
      ),
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

  const onFinishEmailHandler = async (values) => {
    const oldSurveyData = surveyData;
    let notValidEmail = values.email.filter((item) => {
      return !validateEmail(item);
    });
    let errorStr = "";
    if (Number(notValidEmail.length) > 0) {
      notValidEmail.forEach((item, idx) => {
        errorStr = `${errorStr}  ${item} ${
          notValidEmail.length === 1
            ? ""
            : notValidEmail.length === idx + 1
            ? ""
            : ","
        }`;
      });
      errorStr = `${errorStr} is not valid email`;
    }
    if (errorStr) {
      openNotificationBox(
        "error",
        "Email Not Valid",
        3,
        "errorEmailKey",
        errorStr
      );
      return;
    }

    await httpService
      .put(`/api/survey/add`, {
        surveyId: surveyId,
        email: values.email,
        channelType: "Email",
        status: "Pending",
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          fetchSurveyData();
          openNotificationBox("success", response.message, 3, "newChannelKey");
          setEmailModalVisible(false);
          emailForm.resetFields();
        }
      })
      .catch((err) => {
        setSurveyData(oldSurveyData);
        setLoading(false);
      });
  };

  const onNewUrlHandler = async () => {
    await httpService
      .put(`/api/survey/add`, {
        surveyId: surveyId,

        channelType: "Link",
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          fetchSurveyData();
          openNotificationBox("success", response.message, 3, "newChannelKey");
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

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
              <h3 className="text-center text-lg lg:text-xl font-bold leading-6  -tracking-wider">
                Link To Share
              </h3>
              <div className="flex items-center max-w-3xl mx-auto my-4">
                <Input
                  size="large"
                  className="rounded-l-md font-semibold  leading-6"
                  value={defaultUrl}
                />
                <button
                  className={`text-white text-center px-4 py-2 h-10 w-24 flex-shrink-0 rounded-r-md
              bg-primary-green
                `}
                  onClick={() => handleCopyUrl(defaultUrl)}
                >
                  Copy Url
                </button>
              </div>
              <h3 className="px-1 text-lg lg:text-xl font-bold leading-6 -tracking-wider my-4 mt-6   text-center">
                Create New Shares
              </h3>
              <div className="md:flex justify-center items-center md:space-x-4  space-y-3 md:space-y-0  mx-4 md:mx-0">
                <div
                  className="w-full md:w-36 h-20 md:h-28 cursor-pointer border border-primary-green flex flex-col justify-center items-center rounded-md"
                  onClick={() => {
                    setEmailModalVisible(true);
                  }}
                >
                  <div>
                    <MailOutlined className="text-primary-green text-xl md:text-2xl" />
                  </div>
                  <p className="mb-0 text-base md:text-lg text-primary-green">
                    Send Email
                  </p>
                </div>
                <Popconfirm
                  title={`Are you sure you want to Create new Link`}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => onNewUrlHandler()}
                  icon={false}
                >
                  <div className="w-full md:w-36 h-20 md:h-28 cursor-pointer border border-primary-green flex flex-col justify-center items-center rounded-md">
                    <div>
                      <LinkOutlined className="text-primary-green text-xl md:text-2xl" />
                    </div>
                    <p className="mb-0 text-base md:text-lg text-primary-green">
                      Create Url
                    </p>
                  </div>
                </Popconfirm>
              </div>
            </div>
          </div>

          <h3 className="px-1 text-lg lg:text-xl font-bold leading-6 -tracking-wider my-4 ">
            All Shares
          </h3>
          <div className="w-full bg-white rounded-md overflow-hdden ">
            <CustomTable
              dataSource={
                Number(surveyData?.SurveyChannels?.length) > 0
                  ? surveyData?.SurveyChannels
                  : []
              }
              columns={allSharesColumn}
            />
          </div>
        </>
      ) : (
        <NoRecordFound />
      )}
      <CustomModal
        title="Email Share"
        visible={emailModalVisible}
        onCancel={() => setEmailModalVisible(false)}
        customFooter
        footer={[
          <>
            <SecondaryButton
              onClick={() => setEmailModalVisible(false)}
              className=" h-full mr-2"
              title="Cancel"
            />
            <PrimaryButton
              onClick={() => emailForm.submit()}
              className=" h-full  "
              title="Submit"
            />
          </>,
        ]}
        modalProps={{ wrapClassName: "view_form_modal" }}
      >
        <div>
          <Form
            form={emailForm}
            layout="vertical"
            autoComplete="off"
            onFinish={onFinishEmailHandler}
          >
            <div className=" mx-2">
              <Form.Item
                label="Send to"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter a Email!",
                  },
                ]}
              >
                <Select
                  size="large"
                  mode="tags"
                  placeholder="Emails"
                  className="select-tag tag-select-box"
                  maxTagCount="responsive"
                ></Select>
              </Form.Item>
            </div>
          </Form>
        </div>
      </CustomModal>
      <SurveyCustomerModal
        surveyCountModalData={surveyCountModalData}
        hideSurveyCountModal={hideSurveyCountModal}
      />
    </AdminLayout>
  );
}

export default SurveyResponsePage;
