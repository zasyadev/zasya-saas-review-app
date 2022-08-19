import { Col, DatePicker, Row, Timeline } from "antd";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import User1 from "../../assets/images/User1.png";
import { ApplaudGiven, ApplaudIconSmall } from "../../assets/Icon/icons";
import { ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import httpService from "../../lib/httpService";

function AllAplaud({ user }) {
  const [allApplaud, setAllApplaud] = useState([]);
  const [allOrgApplaud, setAllOrgApplaud] = useState([]);

  const [currentMonth, setCurrentMonth] = useState({
    lte: moment().endOf("month"),
    gte: moment().startOf("month"),
  });

  async function fetchApplaudData() {
    setAllApplaud([]);

    await httpService
      .post("/api/applaud/all", { date: currentMonth, userId: user.id })
      .then(({ data: response }) => {
        if (response.status === 200) {
          let sortData = response.data.sort(
            (a, b) =>
              b[Object.keys(b)]?.taken?.length -
              a[Object.keys(a)]?.taken?.length
          );
          setAllApplaud(sortData);
        }
      })

      .catch((err) => {
        console.log(err);
      });
  }
  async function fetchAllOrgData() {
    setAllOrgApplaud([]);

    await httpService
      .post("/api/applaud/timeline", { date: currentMonth, userId: user.id })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setAllOrgApplaud(response.data);
        }
      })

      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchApplaudData();
    fetchAllOrgData();
  }, [currentMonth]);

  function onDateChange(date, _) {
    setCurrentMonth({
      lte: moment(date).endOf("month"),
      gte: moment(date).startOf("month"),
    });
  }

  return (
    <div className="mx-3">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24}>
          <div className="flex justify-end w-full">
            <div className="bg-white rounded-md overflow-hidden shadow-md  py-2 px-4 mt-2">
              <DatePicker
                onChange={onDateChange}
                picker="month"
                bordered={false}
                allowClear={false}
                format="MMMM"
              />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          {allApplaud.length > 0 ? (
            allApplaud.map((item, idx) => {
              return (
                <>
                  {Object.entries(item).map(([key, value]) => {
                    return (
                      <div className="bg-white rounded-md overflow-hidden shadow-md  py-3 px-1 mb-3">
                        <Row justify="center">
                          <Col xs={10} md={10}>
                            <div className=" flex justify-center">
                              <Image
                                src={value?.image ? value?.image : User1}
                                alt="userImage"
                                width={80}
                                height={80}
                                className="rounded-full"
                              />
                            </div>
                          </Col>

                          <Col xs={14} md={14}>
                            <div>
                              <p className="mb-2 primary-color-blue font-medium md:text-sm">
                                {key}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="flex" title="Applaud Taken">
                                <div className="flex ">
                                  <ApplaudIconSmall />
                                </div>
                                <div className="flex items-end pl-2 md:text-sm font-medium text-gray-500">
                                  {value?.taken?.length}
                                </div>
                              </p>
                              <p className="flex mx-3" title="Applaud Given">
                                <div className="flex">
                                  <ApplaudGiven />
                                </div>
                                <div className="flex items-end pl-2 md:text-sm font-medium text-gray-500">
                                  {value?.given?.length}
                                </div>
                              </p>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                </>
              );
            })
          ) : (
            <Col xs={24} md={24}>
              <div className="bg-white rounded-md overflow-hidden shadow-md mx-4 my-3 py-3 px-1">
                <div className="flex justify-center items-center h-48">
                  <div className="text-center  ">No Applaud Found</div>
                </div>
              </div>
            </Col>
          )}
        </Col>
        <Col xs={24} sm={24} md={16}>
          <div className="received--all-applaud bg-white rounded-md  shadow-md  p-4">
            <Timeline className="py-2 mt-1 px-4">
              {allOrgApplaud.length ? (
                allOrgApplaud.map((item, idx) => {
                  return (
                    <Timeline.Item
                      dot={
                        <ClockCircleOutlined
                          style={{
                            fontSize: "16px",
                            color: "#0f123f",
                          }}
                        />
                      }
                      key={idx + "timeline"}
                    >
                      <p className="font-semibold mb-1 text-base">
                        <span className="capitalize  ">
                          {item.created.first_name}
                        </span>{" "}
                        has Applauded {item.user.first_name}.
                      </p>
                      <p className=" mb-0 text-base">{item.comment}</p>
                      {item.created_date && (
                        <p className="font-semibold mb-1  text-blue-700 text-right">
                          {moment(item.created_date).fromNow()}
                        </p>
                      )}
                    </Timeline.Item>
                  );
                })
              ) : (
                <div className="text-center  ">No Applaud Found</div>
              )}
            </Timeline>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default AllAplaud;
