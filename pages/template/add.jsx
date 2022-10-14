import React from "react";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import WithMe from "../../component/layout/WithMe";
import TemplateBuildComponent from "../../component/Template/TemplateBuildComponent";

function AddTemplate() {
  return (
    <WithMe>
      {({ user }) => (
        <>
          <HeadersComponent />
          <TemplateBuildComponent user={user} />
        </>
      )}
    </WithMe>
  );
}

export default AddTemplate;
