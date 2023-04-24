import { ApartmentOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { URLS } from "../../constants/urls";
import { useLocalStorage } from "../../helpers/useStorage";
import httpService from "../../lib/httpService";
import { PulseLoader } from "../Loader/LoadingSpinner";
import CountHeaderCard from "../common/CountHeaderCard";
import { ButtonGray, PrimaryButton } from "../common/CustomButton";
import CustomSelectBox from "../common/CustomSelectBox";
import GoalAssignessModal from "./GoalAssignessModal";
import GoalStatusModal from "./GoalStatusModal";
import GoalsAvatar from "./component/GoalsAvatar";
import GoalsCustomTable from "./component/GoalsCustomTable";
import GoalsGroupList from "./component/GoalsGroupList";
import GoalsGroupListSkeleton from "./component/GoalsGroupListSkeleton";
import {
  COMPLETED_STATUS,
  GRID_DISPLAY,
  LIST_DISPLAY,
  GOALS_FILTER_LIST,
  GROUP_ITEMS,
  GOALS_FILTER_STATUS,
} from "./constants";
import { openNotificationBox } from "../common/notification";

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

const currentTime = moment().format();

function GoalsList({ user }) {
  const [searchText, setSearchText] = useState("");
  const [isArchived, setIsArchived] = useState(false);
  const [filterByMembersId, setFilterByMembersId] = useState([]);
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
        const sortData = response.data.sort((a, b) => {
          if (a.goal.end_date < currentTime && b.goal.end_date >= currentTime) {
            return 1; // a should come after b in the sorted order
          }
          if (b.goal.end_date < currentTime && a.goal.end_date >= currentTime) {
            return -1; // a should come before b in the sorted order
          }
          return 0; // a and b are equal
        });
        setGoalsList(sortData);
      })
      .catch(() => setGoalsList([]))
      .finally(() => setLoading(false));
  }

  async function fetchUserData() {
    setUserList([]);
    await httpService
      .get(`/api/user/organizationId`)
      .then(({ data: response }) => {
        setUserList(response.data);
      })
      .catch(() => setUserList([]));
  }

  const activeGoalUsers = useMemo(() => {
    let goalUsers = [];
    goalsList.forEach((item) => {
      item?.goal?.GoalAssignee.forEach((assignee) => {
        if (goalUsers.indexOf(assignee?.assignee_id) === -1)
          goalUsers.push(assignee?.assignee_id);
      });
    });
    if (goalUsers.length > 0) {
      return userList.filter((user) =>
        goalUsers.find((item) => item === user?.user_id)
      );
    } else return [];
  }, [goalsList, userList]);

  useEffect(() => {
    fetchUserData();
    fetchGoalList(GOALS_FILTER_STATUS.ALL);
  }, []);

  const handleFilterChange = (value) => {
    if (value === GOALS_FILTER_STATUS.ARCHIVED) setIsArchived(true);
    else setIsArchived(false);
    fetchGoalList(value);
  };

  const filteredGoalList = useMemo(() => {
    if (goalsList?.length > 0) {
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

    if (goalsList?.length > 0) {
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
        fetchGoalList(GOALS_FILTER_STATUS.ALL);
        setEditGoalModalVisible(initialModalVisible);
        openNotificationBox("success", response.message, 3);
      })
      .catch((err) => openNotificationBox("error", err.response.data?.message))
      .finally(() => setLoading(false));
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

  const showEditGoalModal = ({ record }) => {
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
            className={"w-36 text-sm"}
            arrayList={GOALS_FILTER_LIST}
            handleOnChange={(selectedKey) => handleFilterChange(selectedKey)}
            defaultValue={GOALS_FILTER_STATUS.ALL}
          />
        </div>
        <div className=" flex items-center justify-center md:justify-end flex-wrap gap-4">
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
            GROUP_ITEMS.map((groupItem) => (
              <GoalsGroupListSkeleton
                title={groupItem.title}
                key={groupItem.type + "skeleton"}
              />
            ))
          ) : (
            <PulseLoader />
          )
        ) : displayMode === GRID_DISPLAY ? (
          GROUP_ITEMS.map((groupItem) => (
            <GoalsGroupList
              goalsList={filteredGoalList}
              userId={user.id}
              fetchGoalList={fetchGoalList}
              title={groupItem.title}
              key={groupItem.type}
              type={groupItem.type}
              isArchived={isArchived}
              goalEditHandle={goalEditHandle}
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
              isPagination
              showEditGoalModal={showEditGoalModal}
              showHeader={false}
            />
          </div>
        )}
      </div>
      {editGoalModalVisible?.visible && (
        <GoalStatusModal
          editGoalModalVisible={editGoalModalVisible}
          hideEditGoalModal={hideEditGoalModal}
          goalEditHandle={goalEditHandle}
          loading={loading}
        />
      )}

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
