import React, { useState, useEffect } from "react";
import FormComponent from "./FormComponent";
import { Layout } from "antd";
import DeleteIcon from "../../assets/images/delete.svg";
import Image from "next/image";
import { Popconfirm } from "antd";
import { openNotificationBox } from "../../helpers/notification";

const { Content } = Layout;

function FormLayout({ user }) {
  const [formDetailShow, setFormDetailShow] = useState(false);
  const [formList, setFormList] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  async function fetchFormList() {
    // setLoading(true);
    setFormList([]);
    await fetch("/api/form", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.filter((item) => item.status);
          setFormList(data);
        }
        // setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setFormList([]);
      });
  }

  async function deleteForm(id) {
    if (id) {
      let obj = {
        id: id,
      };
      await fetch("/api/form", {
        method: "DELETE",
        body: JSON.stringify(obj),
        // headers: {
        //   "Content-Type": "application/json",
        // },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            fetchFormList();
            openNotificationBox("success", response.message, 3);
          } else {
            openNotificationBox("error", response.message, 3);
          }
        })
        .catch((err) => console.log(err));
    }
  }

  useEffect(() => {
    fetchFormList();
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-3 md:px-8 h-40" />

      <div className="px-3 md:px-8 h-auto -mt-24">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 px-4 mb-16">
            <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
              {formDetailShow ? (
                <FormComponent
                  user={user}
                  setFormDetailShow={setFormDetailShow}
                  formList={formList}
                  editFormData={editFormData}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  fetchFormList={fetchFormList}
                />
              ) : (
                <div className="">
                  <div className="grid sm:flex bg-gradient-to-tr from-purple-500 to-purple-700 -mt-10 mb-4 rounded-xl text-white  items-center w-full h-40 sm:h-24 py-4 px-8 justify-between shadow-lg-purple ">
                    <h2 className="text-white text-2xl font-bold">
                      Form Lists{" "}
                    </h2>
                    <span
                      className="text-center  rounded-full border-2 px-4 py-2 cursor-pointer hover:bg-white hover:text-purple-500 hover:border-2 hover:border-purple-500 "
                      onClick={() => {
                        setFormDetailShow(true);
                      }}
                    >
                      Add New
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-1/2 mx-auto mt-5">
                      {formList.length > 0 ? (
                        formList.map((form, idx) => {
                          return (
                            <div
                              className="rounded overflow-hidden shadow-lg bg-gray-200"
                              key={idx + "form"}
                            >
                              <div className="px-4 pt-4 pb-2 flex justify-between items-center ">
                                <span
                                  className="text-sm font-semibold text-gray-700 cursor-pointer w-3/4"
                                  onClick={() => {
                                    setFormDetailShow(true);
                                    setEditMode(true);
                                    setEditFormData(form);
                                  }}
                                >
                                  {" "}
                                  {form?.form_data?.title}
                                </span>
                                <Popconfirm
                                  title="Are you sure to delete this Form?"
                                  okText="Yes"
                                  cancelText="No"
                                  icon={false}
                                  onConfirm={() => deleteForm(form.id)}
                                >
                                  <span className="cursor-pointer ">
                                    <Image
                                      src={DeleteIcon}
                                      alt="Delete"
                                      width={20}
                                      height={20}
                                    />
                                  </span>
                                </Popconfirm>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p>No Forms Found</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormLayout;
