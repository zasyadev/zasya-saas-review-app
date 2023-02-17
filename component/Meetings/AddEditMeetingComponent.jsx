import { Form } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import httpService from "../../lib/httpService";
import NoRecordFound from "../common/NoRecordFound";
import { openNotificationBox } from "../common/notification";
import { PulseLoader } from "../Loader/LoadingSpinner";
import MeetingForm from "./component/MeetingForm";
import { CASUAL_MEETINGTYPE, GOAL_TYPE, REVIEW_TYPE } from "./constants";

function AddEditMeetingComponent({ user, editMode = false }) {
  const router = useRouter();
  const { meeting_id, tp: meetingEditType } = router.query;
  const [form] = Form.useForm();
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [meetingType, setMeetingType] = useState(null);
  const [reviewsList, setReviewsList] = useState([]);
  const [goalsList, setGoalsList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const onFinish = (values) => {
    editMode
      ? updateMeeting({
          ...values,
          id: meeting_id,
        })
      : addMeetingsData(values);
  };

  const addMeetingsData = async (data) => {
    const assigneeList = [...data.members, user.id];

    const obj = {
      ...data,
      assigneeList,
    };
    delete obj.members;
    setLoadingSubmitSpin(true);

    await httpService
      .post("/api/meetings", obj)
      .then(({ data: response }) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          router.push("/followups");
        }
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message);
        setLoadingSubmitSpin(false);
      });
  };
  const updateMeeting = async (data) => {
    if (data.id) {
      setLoadingSubmitSpin(true);

      await httpService
        .put("/api/meetings", data)
        .then(({ data: response }) => {
          if (response.status === 200) {
            openNotificationBox("success", response.message, 3);
            router.push("/followups");
          }
        })
        .catch((err) => {
          openNotificationBox("error", err.response.data?.message);
          setLoadingSubmitSpin(false);
        });
    }
  };

  async function fetchMeetingData() {
    setLoading(true);

    await httpService
      .get(`/api/meetings/${meeting_id}`)
      .then(({ data: response }) => {
        setLoading(false);
        if (response.status === 200) {
          setMeetingData(response.data);
        }
      })
      .catch((err) => {
        openNotificationBox(
          "error",
          err?.response?.data?.message || "Failed! Please try again"
        );
        setLoading(false);
      });
  }

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

  const fetchUserData = useCallback(async () => {
    await httpService
      .get(`/api/user/organizationId`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let filterData = response.data.filter(
            (item) => item.user.status && item.role_id !== 2
          );
          setUserList(filterData);
        }
      })
      .catch((err) => {
        setUserList([]);
        openNotificationBox(
          "error",
          err.response.data?.message || "Failed ! Please try again"
        );
      });
  }, []);

  const fillFormWithData = () => {
    setMeetingType(meetingData.meeting_type);

    let typeID = [];

    if (meetingData.meeting_type === GOAL_TYPE) {
      typeID = meetingData.MeetingType.map((item) => {
        return item.goal_id;
      });
    } else if (meetingData.meeting_type === REVIEW_TYPE) {
      typeID = meetingData.MeetingType.map((item) => {
        return item.review_id;
      });
    }

    form.setFieldsValue({
      meeting_at: moment(meetingData.meeting_at),
      meeting_description: meetingData.meeting_description,
      meeting_title: meetingData.meeting_title,
      meeting_type: meetingData.meeting_type,
      type_id: typeID,
    });
  };

  const filterUserList = useMemo(() => {
    if (editMode && Number(userList.length) > 0) {
      return userList?.filter((item) => {
        if (Number(meetingData?.MeetingAssignee?.length) > 0) {
          return meetingData?.MeetingAssignee.find(
            (assignee) => assignee.assignee_id === item.user_id
          );
        }
        return null;
      });
    } else {
      return [];
    }
  }, [meetingData?.MeetingAssignee?.length, userList.length, editMode]);

  const filterGoalList = useMemo(() => {
    let list = [];
    if (Number(selectedMembers.length) > 0) {
      selectedMembers?.forEach((member) => {
        let filter = goalsList.filter((item) => {
          return item.goal.GoalAssignee.find(
            (assignee) => assignee.assignee_id === member
          );
        });
        list.push(...filter);
      });

      return list;
    } else {
      return goalsList;
    }
  }, [selectedMembers, meetingData]);

  useEffect(() => {
    if (editMode && Number(filterUserList?.length) > 0) {
      form.setFieldsValue({
        members: filterUserList.map((user) => user.user_id),
      });
    }
  }, [filterUserList.length, editMode]);

  useEffect(() => {
    if (editMode && meeting_id && meetingEditType === CASUAL_MEETINGTYPE) {
      fetchMeetingData();
    }
    fetchReviewsList();
    fetchGoalList();
    fetchUserData();
  }, [editMode, meeting_id]);

  useEffect(() => {
    if (meetingData) {
      fillFormWithData();
    }
  }, [meetingData]);

  const onValuesChange = (value) => {
    if (value && value?.members?.length) {
      setSelectedMembers(value.members);
    }
  };

  if (loading)
    return (
      <div className="container mx-auto max-w-full">
        <PulseLoader />
      </div>
    );

  if (editMode && !meetingData)
    return <NoRecordFound title={"No Meeting Found"} />;

  return (
    <MeetingForm
      form={form}
      onFinish={onFinish}
      setMeetingType={setMeetingType}
      meetingType={meetingType}
      loadingSubmitSpin={loadingSubmitSpin}
      editMode={editMode}
      disabledTypeField={editMode}
      reviewsList={reviewsList}
      goalsList={filterGoalList}
      userList={userList}
      onValuesChange={onValuesChange}
    />
  );
}

export default AddEditMeetingComponent;
