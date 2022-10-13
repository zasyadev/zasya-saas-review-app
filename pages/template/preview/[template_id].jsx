import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../../component/common/CustomButton";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";
import { TemplatePreviewComponent } from "../../../component/Template/TemplatePreviewComponent";
import httpService from "../../../lib/httpService";

const PreviewWrraper = ({ user }) => {
  const router = useRouter();
  const { template_id } = router.query;
  const [templateData, setTemplateData] = useState({});
  const [loading, setLoading] = useState(false);

  async function fetchTemplateData() {
    setLoading(true);
    setTemplateData([]);

    await httpService
      .post(`/api/template/edit/${template_id}`, {
        userId: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setTemplateData(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response.data?.message);
        setTemplateData([]);
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
  ) : (
    templateData.form_data?.questions?.length && (
      <>
        <TemplatePreviewComponent
          length={templateData.form_data.questions.length}
          formTitle={templateData.form_data.title}
          questions={templateData.form_data.questions}
        />
        <div className="flex justify-center mt-3">
          <PrimaryButton
            withLink={true}
            className="mr-4"
            linkHref={`/review/edit/${templateData.id}`}
            title={"Use This Template"}
          />
        </div>
      </>
    )
  );
};

function TemplatePreviewPage() {
  return (
    <div>
      <WithMe>
        {({ user }) => (
          <AdminLayout user={user} title={""}>
            <PreviewWrraper user={user} />
          </AdminLayout>
        )}
      </WithMe>
    </div>
  );
}

export default TemplatePreviewPage;
