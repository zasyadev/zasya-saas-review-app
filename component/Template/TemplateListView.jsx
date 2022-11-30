import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import ToggleButton from "../common/ToggleButton";
import NoRecordFound from "../common/NoRecordFound";

import {
  MY_TEMPLATE_KEY,
  TemplateToggleList,
  DefaultMotionVarient,
  REVIEW_TYPE,
  SURVEY_TYPE,
} from "./constants";
import SkeletonTemplateCard from "./components/SkeletonTemplateCard";
import TemplateCard from "./TemplateCard";
import { useRouter } from "next/router";
import SurveyTemplateCard from "../Survey/SurveyTemplateCard";

function TemplateListView({ user }) {
  const router = useRouter();
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

  const getTypeCard = (type, template) => {
    switch (type) {
      case REVIEW_TYPE:
        return (
          <TemplateCard
            key={template.id}
            id={template.id}
            title={template?.form_data?.title}
            description={template?.form_data?.description}
            questionLength={template?.form_data?.questions?.length}
            isDelete={false}
            // linkHref={`/template/preview/${template.id}`}
          />
        );
      case SURVEY_TYPE:
        return (
          <SurveyTemplateCard
            key={template.id}
            id={template.id}
            title={template?.form_data?.title}
            description={template?.form_data?.description}
            questionLength={template?.form_data?.questions?.length}
          />
        );

      default:
        return null;
    }
  };

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
                userTemplateList.map((form) =>
                  getTypeCard(router.query.type, form)
                )
              ) : (
                <NoRecordFound title="No Templates Found" />
              )}
            </>
          ) : defaultTemplateList.length > 0 ? (
            defaultTemplateList.map((form) =>
              getTypeCard(router.query.type, form)
            )
          ) : (
            <NoRecordFound title="No Templates Found" />
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default TemplateListView;
