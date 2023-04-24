import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { URLS } from "../../constants/urls";
import httpService from "../../lib/httpService";
import NoRecordFound from "../common/NoRecordFound";
import TemplateBuildComponent from "../Template/TemplateBuildComponent";
import EditiorTitlePageLoader from "./components/EditiorTitlePageLoader";

function EditTemplateComponent({ user }) {
  const router = useRouter();
  const { template_id } = router.query;
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchTemplateData() {
    setLoading(true);
    setFormData(null);
    await httpService
      .post(`/api/template/edit`, {
        template_id: template_id,
      })
      .then(({ data: response }) => {
        setFormData(response.data);
        if (response.data.default_template) {
          router.push(`${URLS.TEMPLATE_PREVIEW}/${response.data.id}/review`);
        }
      })
      .catch(() => setFormData(null))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchTemplateData();
  }, []);

  return loading ? (
    <EditiorTitlePageLoader />
  ) : formData && Object.keys(formData).length ? (
    <TemplateBuildComponent
      user={user}
      editFormData={formData}
      editMode={true}
    />
  ) : (
    <div className="px-4 md:px-6 pb-28 pt-20 md:pt-20 md:pb-24  bg-gray-100 min-h-screen ">
      <div className="w-full  md:w-4/6 mx-auto">
        <NoRecordFound />
      </div>
    </div>
  );
}

export default EditTemplateComponent;
