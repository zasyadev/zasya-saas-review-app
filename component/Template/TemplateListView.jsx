import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import ToggleButton from "../common/ToggleButton";
import NoRecordFound from "../common/NoRecordFound";
import { SkeletonTemplateCard, TemplateCard } from "./TemplateCard";
import {
  MY_TEMPLATE_KEY,
  TemplateToggleList,
  DefaultMotionVarient,
} from "./constants";

function TemplateListView({ user }) {
  const [userTemplateList, setUserTemplateList] = useState([]);
  const [defaultTemplateList, setDefaultTemplateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changeTemplateView, setChangeTemplateView] = useState(MY_TEMPLATE_KEY);

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
      <div className="  mb-4 md:mb-6">
        <ToggleButton
          arrayList={TemplateToggleList}
          handleToggle={(activeKey) => setChangeTemplateView(activeKey)}
          activeKey={changeTemplateView}
        />
      </div>

      <div className="container mx-auto max-w-full ">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-8 2xl:gap-12 "
          variants={DefaultMotionVarient}
          initial="hidden"
          animate="show"
        >
          {changeTemplateView === MY_TEMPLATE_KEY ? (
            <>
              {loading ? (
                [...Array(3)].map((_, idx) => (
                  <SkeletonTemplateCard
                    key={idx + "temp"}
                    index={idx + "temp"}
                  />
                ))
              ) : userTemplateList.length > 0 ? (
                userTemplateList.map((form) => (
                  <TemplateCard
                    key={form.id}
                    id={form.id}
                    title={form?.form_data?.title}
                    description={form?.form_data?.description}
                    questionLength={form?.form_data?.questions?.length}
                    isDelete={false}
                    linkHref={`/template/preview/${form.id}`}
                    // linkHref={`/review/edit/${form.id}`}
                  />
                ))
              ) : (
                <NoRecordFound title="No Templates Found" />
              )}
            </>
          ) : defaultTemplateList.length > 0 ? (
            defaultTemplateList.map((form) => (
              <TemplateCard
                key={form.id}
                id={form.id}
                title={form?.form_data?.title}
                description={form?.form_data?.description}
                questionLength={form?.form_data?.questions?.length}
                isDelete={false}
                // linkHref={`/review/edit/${form.id}`}
                linkHref={`/template/preview/${form.id}`}
              />
            ))
          ) : (
            <NoRecordFound title="No Templates Found" />
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default TemplateListView;
