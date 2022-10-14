import React from "react";
import { HeadersComponent } from "../../../component/common/HeadersComponent";
import WithMe from "../../../component/layout/WithMe";
import EditTemplateComponent from "../../../component/Template/EditTemplateComponent";

function EditTemplate() {
  return (
    <WithMe>
      {({ user }) => (
        <>
          <HeadersComponent />
          <EditTemplateComponent user={user} />
        </>
      )}
    </WithMe>
  );
}

export default EditTemplate;
