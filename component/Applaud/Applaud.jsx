import { Col, Row, Skeleton } from "antd";

import React, { useState, useEffect } from "react";
import CustomTable from "../../helpers/CustomTable";
import moment from "moment";
import { CalanderIcon, CommentIcons, UserIcon } from "../../assets/Icon/icons";
import Link from "next/link";

function Applaud({ user }) {
  const [applaudList, setApplaudList] = useState([]);
  const [receivedApplaudList, setReceivedApplaudList] = useState([]);

  const [loading, setLoading] = useState(false);

  async function fetchApplaud() {
    setLoading(true);
    await fetch("/api/applaud/" + user.id, { method: "GET" })
      .then((res) => res.json())
      .then((res) => {
        setApplaudList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setApplaudList([]);
      });
  }

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
    fetchApplaud();
    fetchReceivedApplaud();
  }, []);

  const fetchReceivedApplaud = async () => {
    setReceivedApplaudList([]);
    await fetch("/api/applaud/" + user.id, {
      method: "POST",
      body: JSON.stringify({
        user: user.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setReceivedApplaudList(res.data);
      })
      .catch((err) => {
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

  return (
    <div>
      <div className="px-3 md:px-8 h-auto mt-5">
        <div className="container mx-auto max-w-full">
          <div className="md:flex justify-end">
            <div className="my-3 mx-3 ">
              <div>
                <Link href="/applaud/add">
                  <button className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md w-full">
                    Create Applaud
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <Row>
            <Col xs={24} md={12}>
              <div className="grid grid-cols-1 px-2 w-full">
                <div className=" bg-white rounded-xl overflow-hdden shadow-md my-3">
                  <div className="p-4 ">
                    <div className="overflow-x-auto">
                      <p className="font-semibold text-lg primary-color-blue">
                        Received Applaud
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
                          <p className="font-semibold text-lg primary-color-blue">
                            Applaud Given
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
