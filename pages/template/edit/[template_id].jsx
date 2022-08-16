import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../component/layout/AdminLayout";
import { getSession } from "next-auth/client";
import TemplateBuildComponent from "../../../component/Template/TemplateBuildComponent";

function EditTemplate({ user }) {
  const router = useRouter();
  const { template_id } = router.query;
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  async function fetchTemplateData() {
    setLoading(true);
    setFormData([]);
    await fetch("/api/template/edit/" + template_id, {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setFormData(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setFormData([]);
      });
  }

  useEffect(() => {
    fetchTemplateData();
  }, []);
  return (
    <AdminLayout user={user} title="Template">
      {loading ? (
        <>
          <div className="border shadow bg-white rounded-md p-2 mt-4 w-full  md:w-4/6 mx-auto">
            <div className="w-full  rounded-xl  p-2 mt-2 template-wrapper">
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
      ) : Object.keys(formData).length ? (
        <TemplateBuildComponent
          user={user}
          editFormData={formData}
          editMode={true}
        />
      ) : null}
    </AdminLayout>
  );
}

export default EditTemplate;
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const { user } = session;
  return {
    props: { user },
  };
}
