import { useRouter } from "next/router";
import React from "react";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";
import SurveyQuestionPreviewWrapper from "../../../component/Survey/SurveyQuestionPreviewWrapper";

function PreviewQuestionPage() {
  const router = useRouter();
  const { survey_id } = router.query;
  return (
    <WithMe>
      {({ user }) => (
        <>
          <AdminLayout user={user} title="Preview questions" isBack>
            <SurveyQuestionPreviewWrapper surveyId={survey_id} user={user} />
          </AdminLayout>
        </>
      )}
    </WithMe>
  );
}

export default PreviewQuestionPage;
