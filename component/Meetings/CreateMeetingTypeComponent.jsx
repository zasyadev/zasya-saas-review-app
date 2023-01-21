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

function CreateEditGoalComponent({ user }) {
  const router = useRouter();
  const { type_id, tp: meetingEditType } = router.query;
  const [form] = Form.useForm();
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [meetingType, setMeetingType] = useState(null);
  const [reviewsList, setReviewsList] = useState([]);
  const [goalsList, setGoalsList] = useState([]);
  const [userList, setUserList] = useState([]);

  const onFinish = (values) => {
    assigneeList.forEach((assignee) => {
      if (values.members.indexOf(assignee) === -1)
        values.members.push(assignee);
    });

    addMeetingsData({
      ...values,
      assigneeList: values.members,
    });
  };

  const addMeetingsData = async (data) => {
    setLoadingSubmitSpin(true);
    await httpService
      .post("/api/meetings", data)
      .then(({ data: response }) => {
        if (response.status === 200) {
          router.push("/followups");
          openNotificationBox("success", response.message, 3);
        }
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message);
        setLoadingSubmitSpin(false);
      });
  };

  async function fetchReviewsList() {
    await httpService
      .get(`/api/review/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setReviewsList(response.data);
        }
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
        if (response.status === 200) {
          setGoalsList(response.data);
        }
      })
      .catch((err) => {
        openNotificationBox(
          "error",
          err?.response?.data?.message || "Failed! Please try again"
        );
      });
  }

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
  }, [goalsList.length, reviewsList.length]);

  async function fetchUserData() {
    setUserList([]);
    await httpService
      .get(`/api/user/organizationId`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let filterData = response.data.filter(
            (item) => item.user.status && item.user_id != user.id
          );
          setUserList(filterData);
        }
      })
      .catch((err) => {
        setUserList([]);
        console.error(err.response?.data?.message);
      });
  }

  const fillFormWithData = () => {
    if (meetingEditType === GOAL_MEETINGTYPE) {
      setMeetingType(GOAL_TYPE);
      form.setFieldsValue({
        meeting_description: meetingData.goal.goal_title,
        meeting_type: GOAL_TYPE,
        type_id: [type_id],
        members: filterUserList,
      });
    } else if (meetingEditType === REVIEW_MEETINGTYPE) {
      setMeetingType(REVIEW_TYPE);
      form.setFieldsValue({
        meeting_description: meetingData.review_name,
        meeting_type: REVIEW_TYPE,
        type_id: [type_id],
      });
    }
  };

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
  }, [assigneeList.length, userList.length]);

  useEffect(() => {
    if (Number(filterUserList.length) > 0) {
      form.setFieldsValue({
        members: filterUserList.map((user) => user.user_id),
      });
    }
  }, [filterUserList.length]);

  useEffect(() => {
    if (type_id) {
      if (
        meetingEditType === GOAL_MEETINGTYPE &&
        Number(goalsList.length) > 0
      ) {
        setMeetingData(goalsList.find((item) => item.goal.id === type_id));
      } else if (
        meetingEditType === REVIEW_MEETINGTYPE &&
        Number(reviewsList.length) > 0
      ) {
        setMeetingData(reviewsList.find((item) => item.id === type_id));
      }
    }
    fetchReviewsList();
    fetchGoalList();
    fetchUserData();
  }, [goalsList.length, reviewsList.length]);

  useEffect(() => {
    if (meetingData) {
      fillFormWithData();
    }
  }, [meetingData]);

  if (!meetingData) return <NoRecordFound title={"No Meeting Found"} />;

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

export default CreateEditGoalComponent;
