import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { SkeletonTemplateCard, TemplateCard } from "./TemplateCard";

function TemplateListView({ user }) {
  const [userTemplateList, setUserTemplateList] = useState([]);
  const [defaultTemplateList, setDefaultTemplateList] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchUserTemplateList() {
    setLoading(true);
    setUserTemplateList([]);

    await httpService
      .get(`/api/template/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let filterData = response.data.filter((item) => item.status);
          setUserTemplateList(filterData);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setUserTemplateList([]);
      });
  }
  async function fetchDefaultTemplateList() {
    setDefaultTemplateList([]);

    await httpService
      .get(`/api/template/default_template`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let filterData = response.data.filter((item) => item.status);
          setDefaultTemplateList(filterData);
        }
      })
      .catch((err) => {
        setDefaultTemplateList([]);
      });
  }

  useEffect(() => {
    fetchUserTemplateList();
    fetchDefaultTemplateList();
  }, []);

  return (
    <div className="container mx-auto max-w-full">
      <div className="w-full bg-white rounded-md shadow-md p-4 lg:p-6">
        <Tabs defaultActiveKey="myTemplates" type="card">
          <Tabs.TabPane tab="My Templates" key="myTemplates">
            <div className="container mx-auto max-w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4 2xl:gap-10 ">
                {loading
                  ? [...Array(3)].map((_, idx) => (
                      <SkeletonTemplateCard key={idx + "temp"} />
                    ))
                  : userTemplateList.length > 0 &&
                    userTemplateList.map((form) => (
                      <TemplateCard
                        key={form.id}
                        id={form.id}
                        title={form?.form_data?.title}
                        description={form?.form_data?.description}
                        questionLength={form?.form_data?.questions?.length}
                        isDelete={false}
                        linkHref={`/review/edit/${form.id}`}
                        // deleteTemplate={deleteTemplate}
                      />
                    ))}
              </div>
            </div>
          </Tabs.TabPane>
          {defaultTemplateList.length > 0 && (
            <Tabs.TabPane tab="Default Templates" key="defaultTemplates">
              <div className="container mx-auto max-w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4 2xl:gap-10 ">
                  {defaultTemplateList.map((form) => (
                    <TemplateCard
                      key={form.id}
                      id={form.id}
                      title={form?.form_data?.title}
                      description={form?.form_data?.description}
                      questionLength={form?.form_data?.questions?.length}
                      isDelete={false}
                      linkHref={`/review/edit/${form.id}`}
                      // deleteTemplate={deleteTemplate}
                    />
                  ))}
                </div>
              </div>
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    </div>
  );
}

export default TemplateListView;
