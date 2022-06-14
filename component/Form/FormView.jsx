import { EyeOutlined } from "@ant-design/icons";
import { TextField } from "@material-ui/core";
import { Modal, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../helpers/notification";
import QuestionViewComponent from "./QuestionViewComponent";

function FormView({ user, setReviewAssign }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [formAssignList, setFormAssignList] = useState([]);
  const [formValues, setFormValues] = useState([]);

  const showModal = (item) => {
    setIsModalVisible(true);
    setUpdateData(item);
  };

  const onCancel = () => {
    setIsModalVisible(false);
  };

  async function fetchFormAssignList() {
    if (user.id) {
      setLoading(true);
      setFormAssignList([]);
      await fetch("/api/form/" + user.id, { method: "GET" })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            setFormAssignList(response.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    fetchFormAssignList();
  }, []);

  const handleSubmit = async () => {
    // let array = formValues.map((item) => {
    //   return { ...item, user_id: user.id, form_id: updateData.id };
    // });
    if (user.id && updateData.id) {
      let obj = {
        user_id: user.id,
        form_id: updateData.id,
        answers: formValues,
      };

      await fetch("/api/form/answer", {
        method: "POST",
        body: JSON.stringify(obj),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            openNotificationBox("success", response.message, 3);
            setIsModalVisible(false);
          } else {
            openNotificationBox("error", response.message, 3);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAnswerChange = (quesId, value) => {
    setFormValues((prev) =>
      prev.find((item) => item.questionId === quesId)
        ? prev.map((item) =>
            item.questionId === quesId ? { ...item, answer: value } : item
          )
        : [...prev, { questionId: quesId, answer: value }]
    );
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-3 md:px-8 h-40" />

      <div className="px-3 md:px-8 h-auto -mt-24">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 px-4 mb-16">
            <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
              <div className="grid sm:flex bg-gradient-to-tr from-purple-500 to-purple-700 -mt-10 mb-4 rounded-xl text-white  items-center w-full h-40 sm:h-24 py-4 px-8 justify-between shadow-lg-purple ">
                <h2 className="text-white text-2xl font-bold">
                  View Assigned Reviews{" "}
                </h2>
                <span
                  className="text-center  rounded-full border-2 px-4 py-2 cursor-pointer hover:bg-white hover:text-purple-500 hover:border-2 hover:border-purple-500 "
                  onClick={() => setReviewAssign(false)}
                >
                  Cancel
                </span>
              </div>
              <div className="p-4 ">
                <div className="overflow-x-auto">
                  <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                      <tr>
                        <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                          Assign By
                        </th>
                        <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                          Assign To
                        </th>
                        <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                          Form Title
                        </th>
                        <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                          Status
                        </th>
                        <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <th colSpan={5}>
                            <Skeleton
                              title={false}
                              active={true}
                              width={[200]}
                              className="mt-4"
                              rows={3}
                            />
                          </th>
                        </tr>
                      ) : formAssignList.length > 0 ? (
                        formAssignList.map((item, idx) => {
                          return (
                            <tr key={idx + "user"}>
                              <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                {item.assigned_by.first_name}{" "}
                                {item.assigned_by.last_name}
                              </th>
                              <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                {item.assigned_to.first_name}{" "}
                                {item.assigned_to.last_name}
                              </th>
                              <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                {item.form.form_title}
                              </th>
                              <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                {item.status ? "Active" : "InActive"}
                              </th>
                              <th className="border-b underline border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left cursor-pointer">
                                <p>
                                  <span
                                    className="text-yellow-500 text-lg mx-2"
                                    onClick={() => showModal(item)}
                                  >
                                    <EyeOutlined />
                                  </span>
                                </p>
                              </th>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <th
                            colSpan={5}
                            className="border-b text-center border-gray-200 align-middle font-semibold text-sm whitespace-nowrap px-2 py-4 "
                          >
                            No Data Found
                          </th>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="View Review Template"
        visible={isModalVisible}
        onOk={() => handleSubmit()}
        onCancel={() => onCancel()}
        // footer={[
        //   <div>
        //     <Button key="add" type="default" onClick={() => onCancel()}>
        //       Cancel
        //     </Button>
        //     <Button key="add" type="primary" onClick={form.submit}>
        //       {editMode ? "Update" : "Add"}
        //     </Button>
        //   </div>,
        // ]}
        width={900}
        wrapClassName="view_form_modal"
      >
        <div>
          <div className="  border-t-8 rounded-t-md border-cyan-500 shadow-lg mt-4">
            <div>
              <div className="w-full flex flex-col items-start px-4 pt-4 pb-5 ">
                <div>
                  <TextField
                    fullWidth={true}
                    placeholder="Form Tittle"
                    multiline={true}
                    // onChange={(e) => {
                    //   setFormTitle(e.target.value);
                    // }}
                    value={updateData?.form?.form_title}
                    inputProps={{ style: { fontSize: 40, paddingTop: 10 } }}
                    disabled={true}
                  />
                  <TextField
                    fullWidth={true}
                    placeholder="Description"
                    multiline={true}
                    // onChange={(e) => {
                    //   setFormDes(e.target.value);
                    // }}
                    value={updateData?.form?.form_description}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {updateData?.form?.questions.length > 0 &&
            updateData?.form?.questions?.map((question, idx) => (
              <QuestionViewComponent
                {...question}
                idx={idx}
                open={false}
                handleAnswerChange={handleAnswerChange}
              />
            ))}
        </div>
      </Modal>
    </div>
  );
}

export default FormView;
