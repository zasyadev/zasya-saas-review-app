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
  const [formList, setFormList] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchFormList() {
    setLoading(true);
    setFormList([]);

    await httpService
      .get(`/api/template/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let filterData = response.data.filter((item) => item.status);
          setFormList(filterData);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setFormList([]);
      });
  }

  async function deleteTemplate(id) {
    if (id) {
      let obj = {
        id: id,
      };

      await httpService
        .delete(`/api/template`, { data: obj })
        .then(({ data: response }) => {
          if (response.status === 200) {
            fetchFormList();
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
    fetchFormList();
  }, []);

  return (
    <div className="container mx-auto max-w-full">
      <div className="flex justify-end items-center mb-4 md:mb-6">
        <PrimaryButton
          withLink={true}
          className="rounded-md  "
          linkHref="/template/add"
          title={"Create"}
        />
      </div>

      <div className="w-full bg-white rounded-md shadow-md p-4 lg:p-6">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4 2xl:gap-10 ">
            {loading ? (
              [...Array(3)].map((_, idx) => (
                <SkeletonTemplateCard key={idx + "temp"} />
              ))
            ) : formList.length > 0 ? (
              formList.map((form) => (
                <TemplateCard
                  key={form.id}
                  id={form.id}
                  title={form?.form_data?.title}
                  deleteTemplate={deleteTemplate}
                />
              ))
            ) : (
              <CreateTemplateCard />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateLayout;
