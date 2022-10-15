import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TemplateBuildComponent from "../Template/TemplateBuildComponent";
import httpService from "../../lib/httpService";
import NoRecordFound from "../common/NoRecordFound";

function EditTemplateComponent({ user }) {
  const router = useRouter();
  const { template_id } = router.query;
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  async function fetchTemplateData() {
    setLoading(true);
    setFormData([]);
    await httpService
      .post(`/api/template/edit`, {
        template_id: template_id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setFormData(response.data);
          if (response.data.default_template) {
            router.push(`/template/preview/${response.data.id}`);
          } else {
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        console.error(err.response.data?.message);
        setFormData([]);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchTemplateData();
  }, []);

  return loading ? (
    <div className="border shadow bg-white rounded-md p-2 mt-4 w-full  md:w-4/6 mx-auto">
      <div className="w-full  rounded-md  p-2 mt-2 template-wrapper">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded"></div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
