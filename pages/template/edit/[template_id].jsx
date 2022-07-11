import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../component/layout/AdminLayout";
import { getSession } from "next-auth/client";
import FormComponent from "../../../component/Form/FormComponent";

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
          // let data = response.data.filter((item) => item.status);
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
        "Loading"
      ) : Object.keys(formData).length ? (
        <FormComponent user={user} editFormData={formData} editMode={true} />
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
