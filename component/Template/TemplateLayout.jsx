import { Popconfirm } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AddIcon, DeleteTemplateIcon } from "../../assets/icons";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";

function TemplateLayout({ user }) {
  const [formList, setFormList] = useState(false);

  async function fetchFormList() {
    // setLoading(true);
    setFormList([]);

    await httpService
      .get(`/api/template/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let filterData = response.data.filter((item) => item.status);
          setFormList(filterData);
        }
      })
      .catch((err) => {
        console.error(err.response.data.message);
        setFormList([]);
      });
  }

  async function deleteForm(id) {
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
          console.error(err.response.data.message);
          openNotificationBox("error", err.response.data.message);
        });
    }
  }

  useEffect(() => {
    fetchFormList();
  }, []);

  return (
    <div className="container mx-auto max-w-full">
      <div className="grid grid-cols-1 mb-16">
        <div className="w-full bg-white rounded-md shadow-md md:p-4 p-0 mt-6 ">
          <h2 className="text-black text-2xl font-bold p-4 primary-color-blue">
            Template Lists
          </h2>
          <div className="p-4 ">
            <div className="container mx-auto max-w-full">
              <div className="grid grid-cols-1 lg:grid-cols-4 mb-4 items-center justify-center gap-4">
                <Link href="/template/add">
                  <div className="template flex primary-bg-color items-center justify-center flex-col  w-full h-full  rounded-md overflow-hdden shadow-md p-5  cursor-pointer my-2">
                    <div className="cursor-pointer">
                      <AddIcon className="text-center " />
                    </div>
                    <div className="text-white text-center text-sm font-medium mt-5">
                      Add Template
                    </div>
                  </div>
                </Link>
                {formList.length > 0
                  ? formList.map((form, idx) => {
                      return (
                        <div
                          className="template-list h-full w-full shadow-md flex  flex-col items-center justify-between p-6"
                          key={idx + "form"}
                        >
                          <Link href={`/template/edit/${form.id}`}>
                            <div className="flex flex-wrap border-gray-200 cursor-pointer item-center justify-center">
                              <div className="rounded-md grid items-center justify-center primary-color-blue text-lg font-semibold text-center">
                                {form?.form_data?.title}
                              </div>
                            </div>
                          </Link>
                          <div className="text-sm primary-color-blue  flex items-center  justify-center my-3">
                            <Popconfirm
                              title={`Are you sure to delete ${form.form_data.title} ？`}
                              okText="Yes"
                              cancelText="No"
                              icon={false}
                              onConfirm={() => deleteForm(form.id)}
                            >
                              <span className="font-semibold whitespace-nowrap cursor-pointer">
                                <DeleteTemplateIcon className="cursor-pointer text-red-500" />
                              </span>
                            </Popconfirm>
                          </div>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateLayout;
