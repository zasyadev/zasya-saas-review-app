import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TemplateBuildComponent from "../Template/TemplateBuildComponent";
import httpService from "../../lib/httpService";

function EditTemplateComponent({ user }) {
  const router = useRouter();
  const { template_id } = router.query;
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  async function fetchTemplateData() {
    setLoading(true);
    setFormData([]);

    await httpService
      .post(`/api/template/edit/${template_id}`, {
        userId: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setFormData(response.data);
        }
        setLoading(false);
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
    <>
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
    </>
  ) : formData && Object.keys(formData).length ? (
    <TemplateBuildComponent
      user={user}
      editFormData={formData}
      editMode={true}
    />
  ) : null;
}

export default EditTemplateComponent;
