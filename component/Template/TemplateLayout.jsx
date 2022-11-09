import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import ToggleButton from "../common/ToggleButton";
import NoRecordFound from "../common/NoRecordFound";
import {
  CreateTemplateCard,
  SkeletonTemplateCard,
  TemplateCard,
} from "./TemplateCard";
import {
  MY_TEMPLATE_KEY,
  TemplateToggleList,
  DefaultMotionVarient,
} from "./constants";
import { PrimaryButton } from "../common/CustomButton";

function TemplateLayout({ user }) {
  const [templateList, setTemplateList] = useState([]);
  const [defaultTemplateList, setDefaultTemplateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changeTemplateView, setChangeTemplateView] = useState(MY_TEMPLATE_KEY);

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
      <div className="flex flex-row items-center justify-between flex-wrap gap-4 mb-4 md:mb-6">
        <ToggleButton
          arrayList={TemplateToggleList}
          handleToggle={(activeKey) => setChangeTemplateView(activeKey)}
          activeKey={changeTemplateView}
        />
        {changeTemplateView === MY_TEMPLATE_KEY && (
          <PrimaryButton
            withLink={true}
            className="md:hidden"
            linkHref="/template/add"
            title={"Create"}
          />
        )}
      </div>

      <div className="container mx-auto max-w-full">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 xl:gap:6 2xl:gap-8 "
          variants={DefaultMotionVarient}
          initial="hidden"
          animate="show"
        >
          {changeTemplateView === MY_TEMPLATE_KEY ? (
            <>
              <CreateTemplateCard />
              {loading
                ? [...Array(3)].map((_, idx) => (
                    <SkeletonTemplateCard
                      key={idx + "temp"}
                      index={idx + "temp"}
                    />
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
              {defaultTemplateList.length > 0 ? (
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
                ))
              ) : (
                <NoRecordFound title="No Templates Found" />
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default TemplateLayout;
