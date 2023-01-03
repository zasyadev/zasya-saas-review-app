import { UnorderedListOutlined, ApartmentOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import { Avatar, Form, Input, Select, Tooltip } from "antd";
import httpService from "../../lib/httpService";
import {
  ButtonGray,
  PrimaryButton,
  SecondaryButton,
} from "../common/CustomButton";
import CustomModal from "../common/CustomModal";
import CustomSelectBox from "../common/CustomSelectBox";
import GoalsCustomTable from "./component/GoalsCustomTable";
import GoalsGroupList from "./component/GoalsGroupList";
import GoalsGroupListSkeleton from "./component/GoalsGroupListSkeleton";
import {
  ABANDONED_STATUS,
  COMPLETED_STATUS,
  DELAYED_STATUS,
  goalsFilterList,
  groupItems,
  ONTRACK_STATUS,
} from "./constants";
import GoalAssignessModal from "./GoalAssignessModal";
import { getFirstTwoLetter } from "../../helpers/truncateString";

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

function GoalsList({ user, isArchived = false }) {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
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

  const [displayMode, setDisplayMode] = useState("grid");

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

  useEffect(() => {
    fetchUserData();
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

  const sortListByEndDate = useMemo(() => {
    if (Number(filteredGoalList?.length) > 0) {
      const latestUpcomingGoalsList = filteredGoalList
        .filter(
          (item) => moment(item?.goal?.end_date).diff(moment(), "days") >= 0
        )
        .sort((a, b) =>
          moment(a?.goal?.end_date).diff(moment(b?.goal?.end_date))
        );

      if (latestUpcomingGoalsList.length < 3) return latestUpcomingGoalsList;

      return latestUpcomingGoalsList.slice(0, 3);
    } else return [];
  }, [filteredGoalList]);

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

  return (
    <div className="container mx-auto max-w-full">
      {!loading && !isArchived && Number(sortListByEndDate?.length) > 0 && (
        <div className="gap-4 mb-4 bg-white">
          <GoalsCustomTable
            sortListByEndDate={sortListByEndDate}
            setEditGoalModalVisible={setEditGoalModalVisible}
            updateGoalForm={updateGoalForm}
            goalEditHandle={goalEditHandle}
            userId={user.id}
            isArchived={isArchived}
            ShowAssigneeModal={ShowAssigneeModal}
          />
        </div>
      )}
      {!isArchived && (
        <div className="flex justify-between items-center  flex-wrap gap-4  mb-4 md:mb-6 ">
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

            <Avatar.Group
              maxCount={3}
              maxPopoverTrigger="click"
              size="large"
              maxStyle={{
                color: "#0f123f",
                backgroundColor: "#fde3cf",
                cursor: "pointer",
              }}
            >
              {userList.length > 0 &&
                userList.map((data, index) => (
                  <Tooltip
                    title={data?.user?.first_name}
                    placement="top"
                    key={index + "users"}
                  >
                    <Avatar
                      className="bg-primary capitalize hover:cursor-pointer"
                      onClick={() => {
                        setFilterByMembersId(data?.user?.id);
                      }}
                    >
                      {getFirstTwoLetter(data?.user?.first_name)}
                    </Avatar>
                  </Tooltip>
                ))}
            </Avatar.Group>

            <CustomSelectBox
              className={" w-36 text-sm"}
              arrayList={goalsFilterList}
              handleOnChange={(selectedKey) => handleToggle(selectedKey)}
              defaultValue={"All"}
            />
          </div>
          <div className="space-x-3 flex items-center ">
            <div className="space-x-2">
              <ButtonGray
                withLink={false}
                onClick={() => setDisplayMode("grid")}
                title={<ApartmentOutlined />}
                className="leading-0"
              />
              <ButtonGray
                withLink={false}
                onClick={() => setDisplayMode("list")}
                title={<UnorderedListOutlined />}
                className="leading-0"
              />
            </div>
            <PrimaryButton
              withLink={true}
              linkHref={`/goals/add`}
              title={"Create"}
            />
          </div>
        </div>
      )}

      <div
        className={`grid grid-cols-1 ${
          displayMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-4" : ""
        } gap-4`}
      >
        {loading ? (
          groupItems.map((groupItem) => (
            <GoalsGroupListSkeleton
              title={groupItem.title}
              key={groupItem.type + "skeleton"}
            />
          ))
        ) : displayMode === "grid" ? (
          groupItems.map((groupItem) => (
            <GoalsGroupList
              goalsList={filteredGoalList}
              userId={user.id}
              fetchGoalList={isArchived ? fetchArchivedGoalList : fetchGoalList}
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
          <div className="gap-4 mb-4 bg-white">
            <GoalsCustomTable
              sortListByEndDate={filteredGoalList}
              setEditGoalModalVisible={setEditGoalModalVisible}
              updateGoalForm={updateGoalForm}
              goalEditHandle={goalEditHandle}
              userId={user.id}
              isArchived={isArchived}
              ShowAssigneeModal={ShowAssigneeModal}
            />
          </div>
        )}
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
              key="cancel_btn"
            />
            <PrimaryButton
              onClick={() => updateGoalForm.submit()}
              className=" h-full  "
              title="Update"
              disabled={loading}
              loading={loading}
              key="update_btn"
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
          initialValues={{
            status: editGoalModalVisible.defaultValue,
          }}
        >
          <Form.Item name="status" label="Status">
            <Select value={editGoalModalVisible.defaultValue}>
              <Select.Option value={ONTRACK_STATUS}>On Track</Select.Option>
              <Select.Option value={COMPLETED_STATUS}>Completed</Select.Option>
              <Select.Option value={DELAYED_STATUS}>Delayed</Select.Option>
              <Select.Option value={ABANDONED_STATUS}>Abandoned</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="comment" label="Comment">
            <Input />
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
