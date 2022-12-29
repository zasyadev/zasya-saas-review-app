import { Form, Input, Select } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import httpService from "../../lib/httpService";
import { PrimaryButton, SecondaryButton } from "../common/CustomButton";
import CustomModal from "../common/CustomModal";
import CustomSelectBox from "../common/CustomSelectBox";
import GoalsCustomTable from "./component/GoalsCustomTable";
import GoalsGroupList from "./component/GoalsGroupList";
import GoalsGroupListSkeleton from "./component/GoalsGroupListSkeleton";
import { goalsFilterList, groupItems } from "./constants";

const initialModalVisible = {
  visible: false,
  id: "",
  goal_title: "",
  defaultValue: "",
  goal_id: "",
};

function GoalsList({ user, isArchived = false }) {
  const router = useRouter();
  const [updateGoalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [goalsList, setGoalsList] = useState([]);
  const [editGoalModalVisible, setEditGoalModalVisible] =
    useState(initialModalVisible);

  async function fetchGoalList(status) {
    setLoading(true);
    setGoalsList([]);

    await httpService
      .get(`/api/goals?status=${status}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setGoalsList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err?.response?.data?.message);
      });
  }
  async function fetchArchivedGoalList() {
    setLoading(true);
    setGoalsList([]);

    await httpService
      .get(`/api/goals?isArchived=true`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setGoalsList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err?.response?.data?.message);
      });
  }

  useEffect(() => {
    if (isArchived) {
      fetchArchivedGoalList();
    } else {
      fetchGoalList("All");
    }
  }, [isArchived]);

  const handleToggle = (value) => {
    if (value === "Archived") {
      router.push("/goals/archived");
    } else {
      fetchGoalList(value);
    }
  };

  const sortListByEndDate = useMemo(() => {
    if (Number(goalsList?.length) > 0) {
      const latestUpcomingGoalsList = goalsList
        .filter(
          (item) => moment(item?.goal?.end_date).diff(moment(), "days") >= 0
        )
        .sort((a, b) =>
          moment(a?.goal?.end_date).diff(moment(b?.goal?.end_date))
        );

      if (latestUpcomingGoalsList.length < 3) return latestUpcomingGoalsList;

      return latestUpcomingGoalsList.slice(0, 3);
    } else return [];
  }, [goalsList]);

  const goalEditHandle = async ({ goal_id, id, value, type }) => {
    setLoading(true);
    await httpService
      .put(`/api/goals/${goal_id}`, {
        value,
        type,
        id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          fetchGoalList("All");
          setEditGoalModalVisible(initialModalVisible);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="container mx-auto max-w-full">
      {!isArchived && (
        <div className="flex justify-between items-center  flex-wrap gap-4  mb-4 md:mb-6 ">
          <CustomSelectBox
            className={" w-36 text-sm"}
            arrayList={goalsFilterList}
            handleOnChange={(selectedKey) => handleToggle(selectedKey)}
            defaultValue={"All"}
          />

          <PrimaryButton
            withLink={true}
            linkHref={`/goals/add`}
            title={"Create"}
          />
        </div>
      )}
      {!loading && !isArchived && Number(sortListByEndDate?.length) > 0 && (
        <div className="gap-4 mb-4">
          <GoalsCustomTable
            sortListByEndDate={sortListByEndDate}
            setEditGoalModalVisible={setEditGoalModalVisible}
            updateGoalForm={updateGoalForm}
            goalEditHandle={goalEditHandle}
            userId={user.id}
            isArchived={isArchived}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? groupItems.map((groupItem) => (
              <GoalsGroupListSkeleton
                title={groupItem.title}
                key={groupItem.type + "skeleton"}
              />
            ))
          : groupItems.map((groupItem) => (
              <GoalsGroupList
                goalsList={goalsList}
                userId={user.id}
                fetchGoalList={
                  isArchived ? fetchArchivedGoalList : fetchGoalList
                }
                title={groupItem.title}
                key={groupItem.type}
                type={groupItem.type}
                isArchived={isArchived}
                goalEditHandle={goalEditHandle}
                updateGoalForm={updateGoalForm}
                setEditGoalModalVisible={setEditGoalModalVisible}
              />
            ))}
      </div>
      <CustomModal
        title={
          <p className="single-line-clamp mb-0 pr-6">
            {editGoalModalVisible.goal_title}
          </p>
        }
        visible={editGoalModalVisible.visible}
        onCancel={() => setEditGoalModalVisible(initialModalVisible)}
        customFooter
        footer={[
          <>
            <SecondaryButton
              onClick={() => setEditGoalModalVisible(initialModalVisible)}
              className=" h-full mr-2"
              title="Cancel"
            />
            <PrimaryButton
              onClick={() => updateGoalForm.submit()}
              className=" h-full  "
              title="Update"
              disabled={loading}
              loading={loading}
            />
          </>,
        ]}
      >
        <div>
          <Form
            layout="vertical"
            form={updateGoalForm}
            onFinish={(value) =>
              goalEditHandle({
                goal_id: editGoalModalVisible.goal_id,
                id: editGoalModalVisible.id,
                value: value,
                type: "forStatus",
              })
            }
            initialValues={{
              status: editGoalModalVisible.defaultValue,
            }}
          >
            <Form.Item name="status" label="Status">
              <Select value={editGoalModalVisible.defaultValue}>
                <Select.Option value="OnTrack">On Track</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
                <Select.Option value="Delayed">Delayed</Select.Option>
                <Select.Option value="Abandoned">Abandoned</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="comment" label="Comment">
              <Input />
            </Form.Item>
          </Form>
        </div>
      </CustomModal>
    </div>
  );
}

export default GoalsList;
