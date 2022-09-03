import { Col, DatePicker, Row, Skeleton } from "antd";

import React, { useState, useEffect } from "react";
import CustomTable from "../../component/common/CustomTable";
import moment from "moment";
import { CalanderIcon, CommentIcons, UserIcon } from "../../assets/icons";
import { PrimaryButton } from "../../component/common/CustomButton";
import httpService from "../../lib/httpService";
import { openNotificationBox } from "../common/notification";
import CustomPopover from "../common/CustomPopover";

function Applaud({ user }) {
  const [applaudList, setApplaudList] = useState([]);
  const [receivedApplaudList, setReceivedApplaudList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState({
    lte: moment().endOf("month"),
    gte: moment().startOf("month"),
  });

  // const onUpdate = (data) => {
  //   setEditMode(true);
  //   setUpdateData(data);
  //   setIsModalVisible(true);
  //   applaudform.setFieldsValue({
  //     user_id: data.user_id,
  //     comment: data.comment,
  //   });
  // };

  useEffect(() => {
    // fetchApplaud();
    fetchApplaudData();
  }, [currentMonth]);

  const fetchApplaudData = async () => {
    setReceivedApplaudList([]);
    await httpService
      .post(`/api/applaud/${user.id}`, {
        currentMonth: currentMonth,
      })
      .then(({ data: res }) => {
        setReceivedApplaudList(res.data.receivedApplaud);
        setApplaudList(res.data.givenApplaud);
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data.message);
        setReceivedApplaudList([]);
      });
  };

  const columns = [
    {
      title: "Name",
      render: (_, record) => record.user.first_name,
    },
    {
      title: "Comment",
      dataIndex: "comment",
    },

    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <div className="flex items-center ">
    //       <button
    //         className="text-white text-base primary-bg-btn text-center px-3 rounded-md pb-2 mr-2  cursor-pointer"
    //         onClick={() => onUpdate(record)}
    //       >
    //         <EditOutlined />
    //       </button>
    //       <button
    //         className="text-white text-base primary-bg-btn text-center px-3 rounded-md pb-2 mr-2  cursor-pointer"
    //         onClick={() => onDelete(record.id)}
    //       >
    //         <DeleteOutlined />
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  function onDateChange(date, _) {
    setCurrentMonth({
      lte: moment(date).endOf("month"),
      gte: moment(date).startOf("month"),
    });
  }

  return (
    <div>
      <div className="px-3 md:px-8 h-auto mt-5">
        <div className="container mx-auto max-w-full">
          <div className="flex justify-end">
            <div className="bg-white rounded-md overflow-hidden shadow-md  py-2 px-4 mt-2 h-12">
              <DatePicker
                onChange={onDateChange}
                picker="month"
                bordered={false}
                allowClear={false}
                format="MMMM"
                defaultValue={moment()}
              />
            </div>
            <div className="my-3 mx-3 ">
              <div>
                <PrimaryButton
                  withLink={true}
                  className="rounded-md  "
                  linkHref="/applaud/add"
                  title={"Create"}
                />
              </div>
            </div>
          </div>

          <Row>
            <Col xs={24} md={12}>
              <div className="grid grid-cols-1 px-2 w-full">
                <div className=" bg-white rounded-xl overflow-hdden shadow-md my-3">
                  <div className="p-4 ">
                    <div className="overflow-x-auto">
                      <p className="font-semibold text-lg primary-color-blue flex items-center">
                        Received Applaud
                        <span className="leading-[0] ml-2">
                          {CustomPopover(
                            "Applauds given to you by your team members."
                          )}
                        </span>
                      </p>
                      <div className="received-applaud-table">
                        {receivedApplaudList.length > 0 ? (
                          receivedApplaudList.map((item, idx) => {
                            return (
                              <div
                                className=" border-2 rounded md:m-3 mt-2 shadow-md "
                                key={"applaud" + idx}
                              >
                                <Row className="m-5 px-2">
                                  <Col xs={4} md={4}>
                                    <UserIcon className="primary-color-blue font-bold text-base mb-0 " />
                                  </Col>
                                  <Col xs={20} md={20}>
                                    <p className="ml-2 text-base mb-0 ">
                                      <span className="uppercase ">
                                        {item.created.first_name}
                                      </span>{" "}
                                      has Applauded you.
                                    </p>{" "}
                                  </Col>
                                </Row>
                                <Row className="m-5 px-2">
                                  <Col xs={4} md={4}>
                                    <CommentIcons className="primary-color-blue font-bold text-base" />
                                  </Col>

                                  <Col xs={20} md={20}>
                                    <p className="ml-2 break-all text-base mb-0">
                                      {item.comment}
                                    </p>
                                  </Col>
                                </Row>
                                <Row className="m-5 px-2">
                                  <Col xs={4} md={4}>
                                    <CalanderIcon className="primary-color-blue font-bold  text-base " />
                                  </Col>

                                  <Col xs={20} md={20}>
                                    <p className=" ml-2 text-base mb-0">
                                      {moment(item.created_date).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </p>
                                  </Col>
                                </Row>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-center p-4 mb-0">
                            No Applauds received.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="px-1  h-auto ">
                <div className="container mx-auto max-w-full ">
                  <div className="grid grid-cols-1 px-2  mb-16">
                    <div className="flex justify-end "></div>
                    <div className="w-full bg-white rounded-xl overflow-hdden shadow-md my-3">
                      <div className="p-4 ">
                        <div className="overflow-x-auto">
                          <p className="font-semibold text-lg primary-color-blue flex items-center">
                            Applaud Given
                            <span className="leading-[0] ml-2">
                              {CustomPopover(
                                "Applauds given by you to your team members."
                              )}
                            </span>
                          </p>
                          {loading ? (
                            <Skeleton
                              title={false}
                              active={true}
                              width={[200]}
                              className="mt-4"
                              rows={3}
                            />
                          ) : (
                            <CustomTable
                              dataSource={applaudList}
                              columns={columns}
                              pagination={true}
                              className="custom-table"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default Applaud;
