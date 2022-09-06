import { Popconfirm } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AddIcon, DeleteTemplateIcon } from "../../assets/icons";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";

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
      {formList.length > 0 ? (
        <div className="flex justify-end items-center mb-4 md:mb-6">
          <PrimaryButton
            withLink={true}
            className="rounded-md  "
            linkHref="/template/add"
            title={"Create"}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 mb-16">
        <div className="w-full bg-white rounded-md shadow-md md:p-4 p-0">
          <div className="p-4 ">
            <div className="container mx-auto max-w-full">
              <div className="grid grid-cols-1 lg:grid-cols-4 mb-4 items-center justify-center gap-4">
                {formList.length > 0 ? (
                  formList.map((form, idx) => {
                    return (
                      <div
                        className="template-list h-full w-full shadow-md flex  flex-col items-center justify-between p-6"
                        key={idx + "form"}
                      >
                        <Link href={`/template/edit/${form.id}`} passHref>
                          <div className="flex flex-wrap border-gray-200 cursor-pointer item-center justify-center">
                            <div className="rounded-md grid items-center justify-center text-primary text-lg font-semibold text-center">
                              {form?.form_data?.title}
                            </div>
                          </div>
                        </Link>
                        <div className="text-sm text-primary  flex items-center  justify-center my-3">
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
                ) : (
                  <Link href="/template/add">
                    <div className="template  template-list flex bg-white items-center justify-center flex-col  w-full h-full  rounded-md overflow-hdden shadow-md p-5  cursor-pointer my-2">
                      <div className="cursor-pointer">
                        <AddIcon className="text-center " />
                      </div>
                      <div className="text-primary text-center text-base font-medium mt-5">
                        Create Template
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateLayout;
