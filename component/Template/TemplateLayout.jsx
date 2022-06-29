import React, { useState, useEffect } from "react";
import FormComponent from "../Form/FormComponent";

// import DeleteIcon from "../../assets/images/delete.svg";
// import Image from "next/image";
import { Popconfirm } from "antd";
import { openNotificationBox } from "../../helpers/notification";

function TemplateLayout({ user }) {
  const [formDetailShow, setFormDetailShow] = useState(false);
  const [formList, setFormList] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  async function fetchFormList() {
    // setLoading(true);
    setFormList([]);
    await fetch("/api/template/" + user.id, {
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
      await fetch("/api/template", {
        method: "DELETE",
        body: JSON.stringify(obj),
        // headers: {
        //   "Content-Type": "application/json",
        // },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            openNotificationBox("success", response.message, 3);
            fetchFormList();
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
      <div className="px-3 md:px-8 h-auto ">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 px-4 mb-16">
            {/* <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 "> */}
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
              <>
                <div className="grid sm:flex  items-center w-full h-40 sm:h-24  justify-between">
                  <h2 className="text-black text-2xl font-bold">
                    Template Lists{" "}
                  </h2>
                  <div className="flex justify-end">
                    <div className="my-4 ">
                      <button
                        className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md"
                        onClick={() => {
                          setFormDetailShow(true);
                        }}
                      >
                        Add New
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-white rounded-xl shadow-md p-4 ">
                  <div className="p-4 mt-8">
                    <div className="container mx-auto max-w-full">
                      <div className="grid grid-cols-1 lg:grid-cols-3 mb-4 items-center">
                        {formList.length > 0 ? (
                          formList.map((form, idx) => {
                            return (
                              <div className="px-4" key={idx + "form"}>
                                <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
                                  <div
                                    className="flex flex-wrap border-b border-gray-200  cursor-pointer"
                                    onClick={() => {
                                      setFormDetailShow(true);
                                      setEditMode(true);
                                      setEditFormData(form);
                                    }}
                                  >
                                    <div className="bg-gradient-to-tr from-pink-500 to-pink-700 -mt-10 mb-4 rounded-xl text-white grid items-center w-full h-24 py-4 px-4 justify-center shadow-lg-pink ">
                                      <span className="material-icons text-white text-3xl leading-none">
                                        {form?.form_data?.title}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-700 pt-4 flex items-center  justify-end">
                                    <Popconfirm
                                      title="Are you sure to delete this Form?"
                                      okText="Yes"
                                      cancelText="No"
                                      icon={false}
                                      onConfirm={() => deleteForm(form.id)}
                                    >
                                      <span className="font-light whitespace-nowrap cursor-pointer">
                                        Remove
                                      </span>
                                    </Popconfirm>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="grid  lg:grid-cols-1 text-center items-center">
                            No Templates Found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* {formList.length > 0 ? (
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
                        )} */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateLayout;
