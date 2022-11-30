import React from "react";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";
import SurveyList from "../../component/Survey/SurveyList";

function SurveyPage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Surveys"}>
          <SurveyList user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default SurveyPage;
