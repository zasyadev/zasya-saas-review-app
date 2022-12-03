import { Tabs } from "antd";
import React from "react";
import CustomModal from "../common/CustomModal";

const SurveyCustomerModal = ({
  surveyCountModalData,
  hideSurveyCountModal,
}) => {
  const tabItems = [
    {
      label: `All (${
        getFilteredAssigneeList("ALL", surveyCountModalData?.SurveyCustomer)
          .length
      })`,
      key: "All",
      children: (
        <GetCustomerList
          type={"ALL"}
          surveyCustomer={surveyCountModalData?.SurveyCustomer}
        />
      ),
    },
    {
      label: `Answered (${
        getFilteredAssigneeList(
          "Answered",
          surveyCountModalData?.SurveyCustomer
        ).length
      })`,
      key: "Answered",
      children: (
        <GetCustomerList
          type={"Answered"}
          surveyCustomer={surveyCountModalData?.SurveyCustomer}
        />
      ),
    },
    {
      label: `Opened (${
        getFilteredAssigneeList("Opened", surveyCountModalData?.SurveyCustomer)
          .length
      })`,
      key: "Opened",
      children: (
        <GetCustomerList
          type={"Opened"}
          surveyCustomer={surveyCountModalData?.SurveyCustomer}
        />
      ),
    },
    {
      label: `Pending (${
        getFilteredAssigneeList("Pending", surveyCountModalData?.SurveyCustomer)
          .length
      })`,
      key: "Pending",
      children: (
        <GetCustomerList
          type={"Pending"}
          surveyCustomer={surveyCountModalData?.SurveyCustomer}
        />
      ),
    },
  ];

  return (
    <CustomModal
      title={
        <p className="single-line-clamp mb-0 pr-6">
          {surveyCountModalData?.survey_name}
        </p>
      }
      visible={surveyCountModalData?.isVisible}
      onCancel={() => hideSurveyCountModal()}
      customFooter
      footer={null}
      modalProps={{ wrapClassName: "view_form_modal" }}
    >
      <div>
        <Tabs
          defaultActiveKey="All"
          className="font-semibold"
          items={tabItems}
        />
      </div>
    </CustomModal>
  );
};

const getFilteredAssigneeList = (type, surveyCustomer) => {
  if (!Number(surveyCustomer?.length) > 0) return [];
  return type === "ALL"
    ? surveyCustomer
    : surveyCustomer.filter((channelUser) => channelUser.status === type);
};

const GetCustomerList = ({ type, surveyCustomer }) => {
  if (Number(surveyCustomer?.length) === 0) return null;

  const filteredAssigneeList = getFilteredAssigneeList(type, surveyCustomer);

  return (
    <div className="divide-y space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
      {Number(filteredAssigneeList.length) > 0 ? (
        filteredAssigneeList.map((customer) => (
          <div className="flex items-center gap-4 p-2" key={customer.id}>
            <div className="flex-1">
              <p className="mb-0 text-primary font-medium text-base">
                {customer?.name?.indexOf("@") > -1 &&
                Number(customer?.name.split("@").length) > 0
                  ? customer?.name.split("@")[0]
                  : ""}
              </p>
              <p className="text-gray-400 font-medium text-sm mb-0">
                {customer.name}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="mb-0 p-2 text-gray-400 font-medium text-sm">
          No customer
        </p>
      )}
    </div>
  );
};

export default SurveyCustomerModal;
