import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import ToggleButton from "../common/ToggleButton";
import NoRecordFound from "../common/NoRecordFound";

import {
  MY_TEMPLATE_KEY,
  TemplateToggleList,
  DefaultMotionVarient,
} from "./constants";
import { PrimaryButton } from "../common/CustomButton";
import SkeletonTemplateCard from "./components/SkeletonTemplateCard";
import CreateTemplateCard from "./components/CreateTemplateCard";
import TemplateCard from "./TemplateCard";
import { URLS } from "../../constants/urls";

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
        let filterData = response.data.filter((item) => item.status);
        setTemplateList(filterData);
      })
      .catch(() => setTemplateList([]))
      .finally(() => setLoading(false));
  }

  async function fetchDefaultTemplateList() {
    setDefaultTemplateList([]);
    await httpService
      .get(`/api/template/default_template`)
      .then(({ data: response }) => {
        let filterData = response.data.filter((item) => item.status);
        setDefaultTemplateList(filterData);
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
          fetchUserTemplateList();
          openNotificationBox("success", response.message, 3);
        })
        .catch((err) => {
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
      <div className="flex flex-row items-center justify-between flex-wrap gap-4  mb-2 xl:mb-4 ">
        <p className="text-xl font-semibold mb-0">Templates</p>
        <ToggleButton
          arrayList={TemplateToggleList}
          handleToggle={(activeKey) => setChangeTemplateView(activeKey)}
          activeKey={changeTemplateView}
        />
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
                ? [1, 2, 3].map((_, idx) => (
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
                      linkHref={`${URLS.TEMPLATE_EDIT}/${template.id}`}
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
