import { Col, DatePicker, Row, Skeleton } from "antd";

import moment from "moment";
import React, { useEffect, useState } from "react";
import { CalanderIcon, CommentIcons, UserIcon } from "../../assets/icons";
import { PrimaryButton } from "../../component/common/CustomButton";
import CustomTable from "../../component/common/CustomTable";
import httpService from "../../lib/httpService";
import CustomPopover from "../common/CustomPopover";
import { openNotificationBox } from "../common/notification";

function Applaud({ user }) {
  const [applaudList, setApplaudList] = useState([]);
  const [receivedApplaudList, setReceivedApplaudList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState({
    lte: moment().endOf("month"),
    gte: moment().startOf("month"),
  });

  useEffect(() => {
    fetchApplaudData();
  }, [currentMonth]);

  const fetchApplaudData = async () => {
    setLoading(true);
    setReceivedApplaudList([]);
    await httpService
      .post(`/api/applaud/${user.id}`, {
        currentMonth: currentMonth,
      })
      .then(({ data: res }) => {
        setReceivedApplaudList(res.data.receivedApplaud);
        setApplaudList(res.data.givenApplaud);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data.message);
        setReceivedApplaudList([]);
        setLoading(false);
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
  ];

  function onDateChange(date, _) {
    setCurrentMonth({
      lte: moment(date).endOf("month"),
      gte: moment(date).startOf("month"),
    });
  }

  return (
    <div className="container mx-auto max-w-full">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className="bg-white rounded-md overflow-hidden shadow-md  py-1 px-2">
          <DatePicker
            onChange={onDateChange}
            picker="month"
            bordered={false}
            allowClear={false}
            format="MMMM"
            defaultValue={moment()}
            className="font-semibold"
          />
        </div>

        <div>
          <PrimaryButton
            withLink={true}
            className="rounded-md  "
            linkHref="/applaud/add"
            title={"Create"}
          />
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <div className="grid grid-cols-1 w-full">
            <div className=" bg-white rounded-md overflow-hdden shadow-md">
              <div className="p-4 ">
                <div className="overflow-x-auto">
                  <p className="font-semibold text-lg text-primary flex items-center">
                    Received Applaud
                    <span className="leading-[0] ml-2">
                      {CustomPopover(
                        "Applauds given to you by your team members."
                      )}
                    </span>
                  </p>
                  <div className="received-applaud-table">
                    {loading ? (
                      [2, 3, 4].map((loop) => (
                        <Skeleton
                          title={false}
                          active={true}
                          width={[200]}
                          className="my-4"
                          key={loop}
                        />
                      ))
                    ) : receivedApplaudList.length > 0 ? (
                      receivedApplaudList.map((item, idx) => {
                        return (
                          <div
                            className=" border-2 rounded md:m-3 mt-2 shadow-md "
                            key={"applaud" + idx}
                          >
                            <Row className="m-5 px-2">
                              <Col xs={4} md={4}>
                                <UserIcon className="text-primary font-bold text-base mb-0 " />
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
                                <CommentIcons className="text-primary font-bold text-base" />
                              </Col>

                              <Col xs={20} md={20}>
                                <p className="ml-2 break-all text-base mb-0">
                                  {item.comment}
                                </p>
                              </Col>
                            </Row>
                            <Row className="m-5 px-2">
                              <Col xs={4} md={4}>
                                <CalanderIcon className="text-primary font-bold  text-base " />
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
              <div className="grid grid-cols-1">
                <div className="flex justify-end "></div>
                <div className="w-full bg-white rounded-md overflow-hdden shadow-md">
                  <div className="p-4 ">
                    <div className="overflow-x-auto">
                      <p className="font-semibold text-lg text-primary flex items-center">
                        Applaud Given
                        <span className="leading-[0] ml-2">
                          {CustomPopover(
                            "Applauds given by you to your team members."
                          )}
                        </span>
                      </p>
                      {loading ? (
                        [1, 2, 3].map((loop) => (
                          <Skeleton
                            title={false}
                            active={true}
                            width={[200]}
                            className="my-4"
                            key={loop}
                          />
                        ))
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
  );
}

export default Applaud;
