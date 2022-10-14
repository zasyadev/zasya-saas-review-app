import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { ToggleButton } from "../common/CustomButton";
import { SkeletonTemplateCard, TemplateCard } from "./TemplateCard";

function TemplateListView({ user }) {
  const [userTemplateList, setUserTemplateList] = useState([]);
  const [defaultTemplateList, setDefaultTemplateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changeTemaplateView, setChangeTemaplateView] = useState(true);

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
          className={`rounded-l-none border-l-0 rounded-r-md w-1/2  md:w-fit ${
            changeTemaplateView
              ? "bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-600 "
              : "bg-primary text-white"
          } `}
          onClick={() => setChangeTemaplateView(false)}
          title={"Default Templates"}
        />
      </div>

      <div className="container mx-auto max-w-full mt-3">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-8 2xl:gap-12 "
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                duration: 0.3,
                staggerChildren: 0.5,
                delayChildren: 0.5,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {changeTemaplateView ? (
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
                    linkHref={`/review/edit/${form.id}`}
                  />
                ))
              ) : (
                <div className="template  template-list flex bg-white items-center justify-center rounded-md  shadow-md p-5 ">
                  <p className="text-gray-600 text-center text-sm font-medium  mb-0">
                    No Templates Found
                  </p>
                </div>
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
                linkHref={`/review/edit/${form.id}`}
              />
            ))
          ) : (
            <div className="template  template-list flex bg-white items-center justify-center rounded-md  shadow-md p-5 ">
              <p className="text-gray-600 text-center text-sm font-medium  mb-0">
                No Templates Found
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default TemplateListView;
