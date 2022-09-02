import React from "react";

import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

import TemplateBuildComponent from "../../component/Template/TemplateBuildComponent";

function AddTemplate({ user }) {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title="Template">
          <TemplateBuildComponent user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default AddTemplate;
