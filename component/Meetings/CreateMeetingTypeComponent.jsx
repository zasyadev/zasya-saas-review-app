import { Form } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import httpService from "../../lib/httpService";
import NoRecordFound from "../common/NoRecordFound";
import { openNotificationBox } from "../common/notification";
import MeetingForm from "./component/MeetingForm";
import {
  GOAL_MEETINGTYPE,
  GOAL_TYPE,
  REVIEW_MEETINGTYPE,
  REVIEW_TYPE,
} from "./constants";
import { INDIVIDUAL_TYPE } from "../Goals/constants";
import { OrganizationUserListHook } from "../common/hooks";

function CreateMeetingTypeComponent({ user }) {
  const router = useRouter();
  const { type_id, tp: meetingEditType } = router.query;
  const [form] = Form.useForm();
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [meetingType, setMeetingType] = useState(null);
  const [reviewsList, setReviewsList] = useState([]);
  const [goalsList, setGoalsList] = useState([]);
  const { userList } = OrganizationUserListHook(user.id);

  const assigneeList = useMemo(() => {
    if (meetingEditType === GOAL_MEETINGTYPE && Number(goalsList.length) > 0) {
      const goalData = goalsList.find((item) => item.goal.id === type_id);
      return goalData?.goal?.GoalAssignee.map((i) => {
        return i.assignee_id;
      });
    } else if (
      meetingEditType === REVIEW_MEETINGTYPE &&
      Number(reviewsList.length) > 0
    ) {
      let list = [];
      const reviewData = reviewsList.find((item) => item.id === type_id);
      list = reviewData?.ReviewAssignee.map((i) => {
        return i.assigned_to_id;
      });
      if (list?.length > 0) list.push(reviewData?.created_by);

      return list;
    } else return [];
  }, [goalsList, reviewsList, type_id, meetingEditType]);

  async function fetchReviewsList() {
    await httpService
      .get(`/api/review/${user.id}`)
      .then(({ data: response }) => {
        setReviewsList(response.data);
      })
      .catch((err) => {
        openNotificationBox(
          "error",
          err?.response?.data?.message || "Failed! Please try again"
        );
      });
  }

  async function fetchGoalList() {
    await httpService
      .get(`/api/goals?status=All`)
      .then(({ data: response }) => {
        setGoalsList(response.data);
      })
      .catch((err) =>
        openNotificationBox(
          "error",
          err?.response?.data?.message || "Failed! Please try again"
        )
      );
  }

  const filterUserList = useMemo(() => {
    if (Number(assigneeList.length) > 0) {
      return userList?.filter((item) => {
        if (Number(assigneeList.length) > 0) {
          return assigneeList.find((assignee) => assignee === item.user_id);
        }
        return null;
      });
    } else {
      return [];
    }
  }, [assigneeList, userList]);

  useEffect(() => {
    if (Number(filterUserList.length) > 0) {
      form.setFieldsValue({
        members: filterUserList.map((user) => user.user_id),
      });
    }
  }, [filterUserList.length]);

  const handleMeetingData = (type_id, meetingEditType) => {
    if (type_id) {
      if (
        meetingEditType === GOAL_MEETINGTYPE &&
        Number(goalsList.length) > 0
      ) {
        const goalData = goalsList.find(
          (item) =>
            item.goal.id === type_id && item.goal.goal_type === INDIVIDUAL_TYPE
        );
        if (goalData) {
          form.setFieldsValue({
            meeting_description: goalData.goal.goal_title,
            meeting_type: GOAL_TYPE,
            type_id: [type_id],
          });
          setMeetingType(GOAL_TYPE);
          setMeetingData(goalData);
        }
      } else if (
        meetingEditType === REVIEW_MEETINGTYPE &&
        Number(reviewsList.length) > 0
      ) {
        const reviewData = reviewsList.find((item) => item.id === type_id);
        if (reviewData) {
          form.setFieldsValue({
            meeting_description: reviewData.review_name,
            meeting_type: REVIEW_TYPE,
            type_id: [type_id],
          });
          setMeetingType(REVIEW_TYPE);
          setMeetingData(reviewData);
        }
      }
    }
  };

  useEffect(() => {
    fetchReviewsList();
    fetchGoalList();
    handleMeetingData(type_id, meetingEditType);
  }, [goalsList.length, reviewsList.length]);

  const onFinish = (values) => {
    const reqAssigneeList = [...values.members];
    assigneeList.forEach((assignee) => {
      if (reqAssigneeList.indexOf(assignee) === -1)
        reqAssigneeList.push(assignee);
    });

    addMeetingsData({
      ...values,
      assigneeList: reqAssigneeList,
    });
  };

  const addMeetingsData = async (data) => {
    setLoadingSubmitSpin(true);

    delete data.members;
    await httpService
      .post("/api/meetings", data)
      .then(({ data: response }) => {
        router.push("/followups");
        openNotificationBox("success", response.message, 3);
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message);
        setLoadingSubmitSpin(false);
      });
  };

  if (!meetingData)
    return <NoRecordFound title={"No Follow Up Meeting Found"} />;

  return (
    <MeetingForm
      form={form}
      onFinish={onFinish}
      setMeetingType={setMeetingType}
      meetingType={meetingType}
      loadingSubmitSpin={loadingSubmitSpin}
      disabledTypeField={true}
      reviewsList={reviewsList}
      goalsList={goalsList}
      userList={userList}
    />
  );
}

export default CreateMeetingTypeComponent;
