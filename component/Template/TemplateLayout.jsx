import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import { ToggleButton } from "../common/CustomButton";
import {
  CreateTemplateCard,
  SkeletonTemplateCard,
  TemplateCard,
} from "./TemplateCard";

function TemplateLayout({ user }) {
  const [templateList, setTemplateList] = useState([]);
  const [defaultTemplateList, setDefaultTemplateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changeTemaplateView, setChangeTemaplateView] = useState(true);

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
      <div className="flex w-auto">
        <ToggleButton
          className={`rounded-r-none rounded-l-md w-1/2  md:w-fit ${
            changeTemaplateView
              ? "bg-primary text-white"
              : " bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-600"
          }`}
          onClick={() => setChangeTemaplateView(true)}
          title={"My Templates"}
        />
        <ToggleButton
          className={`rounded-l-none rounded-r-md w-1/2  md:w-fit ${
            changeTemaplateView
              ? "bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-600 "
              : "bg-primary text-white"
          } `}
          onClick={() => setChangeTemaplateView(false)}
          title={"Default Templates"}
        />
      </div>

      <div className="container mx-auto max-w-full mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-8 2xl:gap-12 ">
          {changeTemaplateView ? (
            <>
              <CreateTemplateCard />
              {loading
                ? [...Array(3)].map((_, idx) => (
                    <SkeletonTemplateCard key={idx + "temp"} />
                  ))
                : templateList.length > 0 &&
                  templateList.map((template) => (
                    <TemplateCard
                      key={template.id + "template"}
                      id={template.id}
                      title={template?.form_data?.title}
                      description={template?.form_data?.description}
                      questionLength={template?.form_data?.questions?.length}
                      deleteTemplate={deleteTemplate}
                      linkHref={`/template/edit/${template.id}`}
                      isDelete={true}
                    />
                  ))}
            </>
          ) : (
            <>
              {defaultTemplateList.length > 0 &&
                defaultTemplateList.map((template) => (
                  <TemplateCard
                    key={template.id + "default"}
                    id={template.id}
                    title={template?.form_data?.title}
                    description={template?.form_data?.description}
                    questionLength={template?.form_data?.questions?.length}
                    deleteTemplate={deleteTemplate}
                    linkHref={`/template/preview/${template.id}`}
                    isDelete={false}
                  />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TemplateLayout;
