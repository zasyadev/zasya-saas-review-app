import { ClockCircleOutlined } from "@ant-design/icons";
import { Col, DatePicker, Row, Timeline } from "antd";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { ApplaudGiven, ApplaudIconSmall } from "../../assets/icons";
import httpService from "../../lib/httpService";
import DefaultImages from "../common/DefaultImages";
import { openNotificationBox } from "../common/notification";

function AllAplaud({ user }) {
  const [allApplaud, setAllApplaud] = useState([]);
  const [allOrgApplaud, setAllOrgApplaud] = useState([]);
  const [filterByUserId, setFilterByUserId] = useState("");
  const [currentMonth, setCurrentMonth] = useState({
    lte: moment().endOf("month"),
    gte: moment().startOf("month"),
  });

  async function fetchApplaudData() {
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
        console.log(err.response.data?.message);
        setAllApplaud([]);
        openNotificationBox("error", err.response.data?.message);
      });
  }
  async function fetchAllOrgData() {
    await httpService
      .post("/api/applaud/timeline", { date: currentMonth, userId: user.id })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setAllOrgApplaud(response.data);
        }
      })

      .catch((err) => {
        console.log(err.response.data?.message);
        openNotificationBox("error", err.response.data?.message);
        setAllOrgApplaud([]);
      });
  }

  useEffect(() => {
    fetchApplaudData();
    fetchAllOrgData();
  }, [currentMonth]);

  function onDateChange(date, _) {
    if (filterByUserId) setFilterByUserId("");
    setCurrentMonth({
      lte: moment(date).endOf("month"),
      gte: moment(date).startOf("month"),
    });
  }

  const allFilterOrgApplaud = useMemo(
    () =>
      filterByUserId
        ? allOrgApplaud.filter(
            (item) =>
              item.user_id == filterByUserId ||
              item.created_by == filterByUserId
          )
        : allOrgApplaud,

    [filterByUserId, allOrgApplaud]
  );

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={24}>
        <div className="flex justify-start w-full">
          <div className="bg-white rounded-md overflow-hidden shadow-md  py-1 px-4 ">
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
        </div>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <div className="received--all-applaud">
          {allApplaud.length > 0 ? (
            allApplaud.map((item, idx) => {
              return (
                <>
                  {Object.entries(item).map(([key, value]) => {
                    return (
                      <div
                        className={`bg-white rounded-md overflow-hidden shadow-md  py-3 px-1 mb-3 cursor-pointer ${
                          filterByUserId === value.user_id
                            ? "border border-blue-800"
                            : ""
                        }`}
                        onClick={() => {
                          setFilterByUserId((prev) =>
                            prev === value.user_id ? "" : value.user_id
                          );
                        }}
                        key={key + idx}
                      >
                        <Row justify="center">
                          <Col xs={10} md={10}>
                            <div className=" flex justify-center">
                              <DefaultImages
                                imageSrc={value?.image}
                                width={80}
                                height={80}
                              />
                            </div>
                          </Col>

                          <Col xs={14} md={14}>
                            <div>
                              <p className="mb-2 text-primary font-medium md:text-sm">
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
        </div>
      </Col>
      <Col xs={24} sm={24} md={16}>
        <div className="received--all-applaud bg-white rounded-md  shadow-md  p-4">
          <Timeline className="py-2 mt-1 px-4">
            {allFilterOrgApplaud.length ? (
              allFilterOrgApplaud.map((item, idx) => {
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
                    className="pb-0"
                  >
                    <p className="font-semibold mb-1 text-base">
                      <span className="capitalize  ">
                        {item.created.first_name}
                      </span>{" "}
                      has Applauded {item.user.first_name}.
                    </p>
                    <p className=" mb-0 text-base">{item.comment}</p>
                    {item.created_date && (
                      <p className=" mb-1  text-gray-400  text-sm text-right">
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
  );
}

export default AllAplaud;
