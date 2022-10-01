import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { SkeletonTemplateCard, TemplateCard } from "./TemplateCard";

function TemplateListView({ user }) {
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

  useEffect(() => {
    fetchFormList();
  }, []);

  return (
    <div className="container mx-auto max-w-full">
      <div className="w-full bg-white rounded-md shadow-md p-4 lg:p-6">
        <div className="flex justify-center space-x-3 flex-wrap mb-3">
          <p className="text-primary  py-2 px-4 cursor-pointer border border-gray-100">
            My Template
          </p>
          {/* <p className="text-primary  py-2 px-4 cursor-pointer border border-gray-100">
            From App
          </p> */}
        </div>
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4 2xl:gap-10 ">
            {loading
              ? [...Array(3)].map((_, idx) => (
                  <SkeletonTemplateCard key={idx + "temp"} />
                ))
              : formList.length > 0 &&
                formList.map((form) => (
                  <TemplateCard
                    key={form.id}
                    id={form.id}
                    title={form?.form_data?.title}
                    isDelete={false}
                    linkHref={`/review/edit/${form.id}`}
                    // deleteTemplate={deleteTemplate}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateListView;
