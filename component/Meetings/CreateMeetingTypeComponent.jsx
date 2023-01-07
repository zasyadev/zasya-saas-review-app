import { Form } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import httpService from "../../lib/httpService";
import NoRecordFound from "../common/NoRecordFound";
import { openNotificationBox } from "../common/notification";
import { PulseLoader } from "../Loader/LoadingSpinner";
import MeetingForm from "./component/MeetingForm";
import {
  GOAL_MEETINGTYPE,
  GOAL_TYPE,
  REVIEW_MEETINGTYPE,
  REVIEW_TYPE,
} from "./constants";

function AddEditGoalComponent({ user, editMode = false }) {
  const router = useRouter();
  const { type_id, tp: meetingEditType } = router.query;
  const [form] = Form.useForm();
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [meetingType, setMeetingType] = useState(null);
  const [reviewsList, setReviewsList] = useState([]);
  const [goalsList, setGoalsList] = useState([]);

  const onFinish = (values) => {
    addMeetingsData({
      ...values,
      type_id: type_id,
      assigneeList: assigneeList,
    });
  };

  const addMeetingsData = async (data) => {
    setLoadingSubmitSpin(true);

    await httpService
      .post("/api/meetings", data)
      .then(({ data: response }) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          router.push("/meetings");
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

  const fillFormWithData = () => {
    if (meetingEditType === GOAL_MEETINGTYPE) {
      form.setFieldsValue({
        meeting_title: meetingData.goal.goal_title,
        meeting_type: GOAL_TYPE,
      });
    } else if (meetingEditType === REVIEW_MEETINGTYPE) {
      form.setFieldsValue({
        meeting_title: meetingData.review_name,
        meeting_type: REVIEW_TYPE,
      });
    }
  };

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
  }, [goalsList.length, reviewsList.length]);

  useEffect(() => {
    if (meetingData) {
      fillFormWithData();
    }
  }, [meetingData]);

  if (loading)
    return (
      <div className="container mx-auto max-w-full">
        <PulseLoader />
      </div>
    );

  if (!meetingData) return <NoRecordFound title={"No Meeting Found"} />;

  return (
    <MeetingForm
      form={form}
      onFinish={onFinish}
      setMeetingType={setMeetingType}
      meetingType={meetingType}
      loadingSubmitSpin={loadingSubmitSpin}
      editMode={editMode}
      disabledTypeField={true}
      reviewsList={reviewsList}
      goalsList={goalsList}
    />
  );
}

export default AddEditGoalComponent;
