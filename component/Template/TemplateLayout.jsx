import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import {
  TemplateCard,
  CreateTemplateCard,
  SkeletonTemplateCard,
} from "./TemplateCard";

function TemplateLayout({ user }) {
  const [templateList, setTemplateList] = useState([]);
  const [defaultTemplateList, setDefaultTemplateList] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchUserTemplateList() {
    setLoading(true);
    setTemplateList([]);
    await httpService
      .get(`/api/template/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let filterData = response.data.filter((item) => item.status);

          setTemplateList(filterData);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setTemplateList([]);
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
        setTemplateList([]);
      });
  }

  async function deleteTemplate(id) {
    if (id) {
      await httpService
        .delete(`/api/template`, {
          data: {
            id: id,
          },
        })
        .then(({ data: response }) => {
          if (response.status === 200) {
            fetchUserTemplateList();
            openNotificationBox("success", response.message, 3);
          }
        })
        .catch((err) => {
          console.error(err.response.data?.message);
          openNotificationBox("error", err.response.data?.message);
        });
    }
  }

  useEffect(() => {
    fetchUserTemplateList();
    fetchDefaultTemplateList();
  }, []);

  return (
    <div className="container mx-auto max-w-full">
      <div className="flex justify-end items-center ">
        <PrimaryButton
          withLink={true}
          className="rounded-md  "
          linkHref="/template/add"
          title={"Create"}
        />
      </div>

      <div className="w-full pt-0 px-2 lg:px-4 pb-2 lg:pb-4">
        <div className="container mx-auto max-w-full">
          <Tabs defaultActiveKey="myTemplates" type="card">
            <Tabs.TabPane tab="My Templates" key="myTemplates">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-8 2xl:gap-12 ">
                {loading ? (
                  [...Array(3)].map((_, idx) => (
                    <SkeletonTemplateCard key={idx + "temp"} />
                  ))
                ) : templateList.length > 0 ? (
                  templateList.map((template) => (
                    <TemplateCard
                      key={template.id}
                      id={template.id}
                      title={template?.form_data?.title}
                      description={template?.form_data?.description}
                      questionLength={template?.form_data?.questions?.length}
                      deleteTemplate={deleteTemplate}
                      linkHref={`/template/edit/${template.id}`}
                    />
                  ))
                ) : (
                  <CreateTemplateCard />
                )}
              </div>
            </Tabs.TabPane>
            {defaultTemplateList.length > 0 && (
              <Tabs.TabPane tab="Default Templates" key="defaultTemplates">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-8 2xl:gap-12 ">
                  {defaultTemplateList.map((template) => (
                    <TemplateCard
                      key={template.id}
                      id={template.id}
                      title={template?.form_data?.title}
                      description={template?.form_data?.description}
                      questionLength={template?.form_data?.questions?.length}
                      deleteTemplate={deleteTemplate}
                      linkHref={`/template/edit/${template.id}`}
                    />
                  ))}
                </div>
              </Tabs.TabPane>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default TemplateLayout;
