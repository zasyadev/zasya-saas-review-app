import React from "react";
import { HeadersComponent } from "../../component/common/HeadersComponent";

// import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

import TemplateBuildComponent from "../../component/Template/TemplateBuildComponent";

function AddTemplate({ user }) {
  return (
    <WithMe>
      {({ user }) => (
        // <AdminLayout user={user} title="Template">
        <>
          <HeadersComponent />
          <TemplateBuildComponent user={user} />
        </>

        // </AdminLayout>
      )}
    </WithMe>
  );
}

export default AddTemplate;
