export const getAssigneeName = (record) => {
  let assigneeName = "";

  assigneeName = record.GoalAssignee.find(
    (assignee) => assignee?.assignee_id !== record?.created_by
  ).assignee?.first_name;

  return assigneeName;
};
