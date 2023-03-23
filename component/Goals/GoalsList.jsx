import { ApartmentOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Form, Input, Select, Tooltip } from "antd";
import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { URLS } from "../../constants/urls";
import { useLocalStorage } from "../../helpers/useStorage";
import httpService from "../../lib/httpService";
import CountHeaderCard from "../common/CountHeaderCard";
import {
  ButtonGray,
  PrimaryButton,
  SecondaryButton,
} from "../common/CustomButton";
import CustomModal from "../common/CustomModal";
import CustomSelectBox from "../common/CustomSelectBox";
import { PulseLoader } from "../Loader/LoadingSpinner";
import GoalsAvatar from "./component/GoalsAvatar";
import GoalsCustomTable from "./component/GoalsCustomTable";
import GoalsGroupList from "./component/GoalsGroupList";
import GoalsGroupListSkeleton from "./component/GoalsGroupListSkeleton";
import {
  ABANDONED_STATUS,
  COMPLETED_STATUS,
  DELAYED_STATUS,
  goalsFilterList,
  GRID_DISPLAY,
  groupItems,
  LIST_DISPLAY,
  ONTRACK_STATUS,
} from "./constants";
import GoalAssignessModal from "./GoalAssignessModal";

const initialModalVisible = {
  visible: false,
  id: "",
  goal_title: "",
  defaultValue: "",
  goal_id: "",
};

const initialGoalCountModalData = {
  goal_title: "",
  GoalAssignee: [],
  isVisible: false,
};
const ALL_STATUS = "All";
const currentTime = moment().format();

function GoalsList({ user }) {
  const [searchText, setSearchText] = useState("");
  const [isArchived, setIsArchived] = useState(false);
  const [filterByMembersId, setFilterByMembersId] = useState([]);
  const [updateGoalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [goalsList, setGoalsList] = useState([]);
  const [editGoalModalVisible, setEditGoalModalVisible] =
    useState(initialModalVisible);
  const [goalAssigneeModalData, setGoalAssigneeModalData] = useState(
    initialGoalCountModalData
  );
  const [userList, setUserList] = useState([]);
  const [displayMode, setDisplayMode] = useLocalStorage(
    "goalListView",
    LIST_DISPLAY
  );

  async function fetchGoalList(status) {
    setLoading(true);
    setGoalsList([]);

    await httpService
      .get(`/api/goals?status=${status}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let sortData = response.data.sort((a, b) => {
            if (
              a.goal.end_date < currentTime &&
              b.goal.end_date >= currentTime
            ) {
              return 1; // a should come after b in the sorted order
            }
            if (
              b.goal.end_date < currentTime &&
              a.goal.end_date >= currentTime
            ) {
              return -1; // a should come before b in the sorted order
            }
            return 0; // a and b are equal
          });
          setGoalsList(sortData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err?.response?.data?.message);
      });
  }

  async function fetchUserData() {
    setUserList([]);
    await httpService
      .get(`/api/user/organizationId`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setUserList(response.data);
        }
      })
      .catch(() => {
        setUserList([]);
      });
  }

  const activeGoalUsers = useMemo(() => {
    let goalUsers = [];
    goalsList.forEach((item) => {
      item?.goal?.GoalAssignee.forEach((assignee) => {
        if (goalUsers.indexOf(assignee?.assignee_id) === -1)
          goalUsers.push(assignee?.assignee_id);
      });
    });
    if (Number(goalUsers.length) > 0) {
      return userList.filter((user) =>
        goalUsers.find((item) => item === user?.user_id)
      );
    } else return [];
  }, [goalsList, userList]);

  useEffect(() => {
    fetchUserData();
    fetchGoalList(ALL_STATUS);
  }, []);

  const handleFilterChange = (value) => {
    if (value === "Archived") setIsArchived(true);
    else setIsArchived(false);
    fetchGoalList(value);
  };

  const filteredGoalList = useMemo(() => {
    if (Number(goalsList?.length) > 0) {
      const searchTextFilteredRes = goalsList.filter((item) =>
        item.goal.goal_title.toLowerCase().includes(searchText)
      );
      if (filterByMembersId.length > 0) {
        return searchTextFilteredRes.filter((item) =>
          Boolean(
            item.goal.GoalAssignee.find((assignee) =>
              filterByMembersId.includes(assignee.assignee_id)
            )
          )
        );
      }
      return searchTextFilteredRes;
    }
    return [];
  }, [goalsList, searchText, filterByMembersId]);

  const goalListData = useMemo(() => {
    let totalGoals = 0;
    let completedGoals = 0;
    let pendingGoals = 0;

    if (Number(goalsList?.length) > 0) {
      totalGoals = goalsList.length;
      completedGoals = goalsList.filter(
        (item) => item.status === COMPLETED_STATUS
      ).length;
      pendingGoals = goalsList.filter(
        (item) => item.status !== COMPLETED_STATUS
      ).length;
      return {
        totalGoals,
        completedGoals,
        pendingGoals,
      };
    } else
      return {
        totalGoals,
        completedGoals,
        pendingGoals,
      };
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
          fetchGoalList(ALL_STATUS);
          setEditGoalModalVisible(initialModalVisible);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const ShowAssigneeModal = ({ goal_title, GoalAssignee }) => {
    setGoalAssigneeModalData({
      goal_title,
      GoalAssignee,
      isVisible: true,
    });
  };

  const hideAssigneeModal = () => {
    setGoalAssigneeModalData(initialGoalCountModalData);
  };

  const ShowEditGoalModal = ({ record }) => {
    updateGoalForm.resetFields();
    updateGoalForm.setFieldValue({
      status: record.status,
    });
    setEditGoalModalVisible({
      visible: true,
      id: record.id,
      goal_title: record.goal.goal_title,
      defaultValue: record.status,
      goal_id: record.goal.id,
    });
  };

  const hideEditGoalModal = () => {
    setEditGoalModalVisible(initialModalVisible);
    updateGoalForm.setFieldValue({
      status: "",
    });
  };

  return (
    <div className="container mx-auto max-w-full">
      <div className="flex justify-between items-start mb-2 ">
        <p className="text-xl font-semibold mb-0">Goals</p>
        <PrimaryButton
          withLink={true}
          linkHref={URLS.GOAL_CREATE}
          title={"Create"}
        />
      </div>
      <div className="grid col-span-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 ">
        <CountHeaderCard
          imgSrc="/media/svg/contract-management.svg"
          imgSrcClassNames="bg-brandGreen-200"
          title="Total"
          subTitle={goalListData.totalGoals}
        />
        <CountHeaderCard
          imgSrc="/media/svg/completed-goals.svg"
          imgSrcClassNames="bg-brandOrange-200"
          title="Completed"
          subTitle={goalListData.completedGoals}
        />
        <CountHeaderCard
          imgSrc="/media/svg/contract-pending.svg"
          imgSrcClassNames="bg-brandBlue-200"
          title="Pending"
          subTitle={goalListData.pendingGoals}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center  flex-wrap gap-4  mb-4 md:mb-6 ">
        <div className="flex justify-center md:justify-start items-center  flex-wrap gap-4 flex-1">
          <Input
            size="large"
            className="rounded-md"
            placeholder="Search"
            style={{ maxWidth: 200 }}
            onChange={(event) => {
              let value = event.target.value;
              value = value?.trim() || "";
              setSearchText(value.toLowerCase());
            }}
          />

          <GoalsAvatar
            activeGoalUsers={activeGoalUsers}
            filterByMembersId={filterByMembersId}
            setFilterByMembersId={setFilterByMembersId}
          />

          <CustomSelectBox
            className={" w-36 text-sm"}
            arrayList={goalsFilterList}
            handleOnChange={(selectedKey) => handleFilterChange(selectedKey)}
            defaultValue={ALL_STATUS}
          />
        </div>
        <div className=" flex items-center justify-center md:justify-end flex-wrap gap-4 flex-1">
          <div className="space-x-2">
            <Tooltip title="Grid View">
              <ButtonGray
                withLink={false}
                onClick={() => setDisplayMode(GRID_DISPLAY)}
                title={<ApartmentOutlined />}
                className={clsx("leading-0", {
                  "border-2 border-primary-green bg-gray-200":
                    displayMode === GRID_DISPLAY,
                })}
              />
            </Tooltip>
            <Tooltip title="List View">
              <ButtonGray
                withLink={false}
                onClick={() => setDisplayMode(LIST_DISPLAY)}
                title={<UnorderedListOutlined />}
                className={clsx("leading-0", {
                  "border-2 border-primary-green bg-gray-200":
                    displayMode === LIST_DISPLAY,
                })}
              />
            </Tooltip>
          </div>
        </div>
      </div>

      <div
        className={clsx("grid grid-cols-1 gap-4", {
          "sm:grid-cols-2 xl:grid-cols-4": displayMode === GRID_DISPLAY,
        })}
      >
        {loading ? (
          displayMode === GRID_DISPLAY ? (
            groupItems.map((groupItem) => (
              <GoalsGroupListSkeleton
                title={groupItem.title}
                key={groupItem.type + "skeleton"}
              />
            ))
          ) : (
            <PulseLoader />
          )
        ) : displayMode === GRID_DISPLAY ? (
          groupItems.map((groupItem) => (
            <GoalsGroupList
              goalsList={filteredGoalList}
              userId={user.id}
              fetchGoalList={fetchGoalList}
              title={groupItem.title}
              key={groupItem.type}
              type={groupItem.type}
              isArchived={isArchived}
              goalEditHandle={goalEditHandle}
              updateGoalForm={updateGoalForm}
              setEditGoalModalVisible={setEditGoalModalVisible}
              ShowAssigneeModal={ShowAssigneeModal}
            />
          ))
        ) : (
          <div className="gap-4 mb-4 bg-white rounded-md">
            <GoalsCustomTable
              goalList={filteredGoalList}
              goalEditHandle={goalEditHandle}
              userId={user.id}
              isArchived={isArchived}
              ShowAssigneeModal={ShowAssigneeModal}
              isPagination
              ShowEditGoalModal={ShowEditGoalModal}
              showHeader={false}
            />
          </div>
        )}
      </div>
      <CustomModal
        title={
          <p className="single-line-clamp mb-0 pr-6 break-all">
            {editGoalModalVisible.goal_title}
          </p>
        }
        visible={editGoalModalVisible.visible}
        onCancel={() => hideEditGoalModal()}
        customFooter
        footer={[
          <>
            <SecondaryButton
              onClick={() => hideEditGoalModal()}
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
        >
          <Form.Item name="status" label="Status">
            <Select defaultValue={editGoalModalVisible.defaultValue}>
              <Select.Option value={ONTRACK_STATUS}>On Track</Select.Option>
              <Select.Option value={COMPLETED_STATUS}>Completed</Select.Option>
              <Select.Option value={DELAYED_STATUS}>Delayed</Select.Option>
              <Select.Option value={ABANDONED_STATUS}>Abandoned</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="comment" label="Comment">
            <Input
              className=" h-12 rounded-md"
              placeholder="Comment about the status"
            />
          </Form.Item>
        </Form>
      </CustomModal>

      {goalAssigneeModalData?.isVisible && (
        <GoalAssignessModal
          goalAssigneeModalData={goalAssigneeModalData}
          hideAssigneeModal={hideAssigneeModal}
          userId={user.id}
        />
      )}
    </div>
  );
}

export default GoalsList;
