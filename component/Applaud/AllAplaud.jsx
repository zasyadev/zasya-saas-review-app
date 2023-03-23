import { DatePicker } from "antd";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { ApplaudGiven, ApplaudIconSmall } from "../../assets/icons";
import { disableDates, MONTH_FORMAT } from "../../helpers/dateHelper";
import httpService from "../../lib/httpService";
import DefaultImages from "../common/DefaultImages";
import { openNotificationBox } from "../common/notification";
import ApplaudTimeline from "./component/ApplaudTimeline";

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
        setAllApplaud([]);
        openNotificationBox("error", err.response.data?.message);
      });
  }
  async function fetchAllOrgData() {
    await httpService
      .post("/api/applaud/timeline", { date: currentMonth })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setAllOrgApplaud(response.data);
        }
      })

      .catch((err) => {
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
    <>
      <div className="flex justify-between w-full mb-4 md:mb-6">
        <p className="text-xl font-semibold mb-0">All Applaud</p>
        <div className="bg-white rounded-md py-1 px-4 ">
          <DatePicker
            onChange={onDateChange}
            picker="month"
            bordered={false}
            allowClear={false}
            format={MONTH_FORMAT}
            defaultValue={moment()}
            className="font-semibold"
            disabledDate={disableDates}
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 2xl:gap-6 w-full">
        <div className="lg:max-w-xs w-full  overflow-x-auto received--all-applaud">
          <div className="flex flex-row lg:flex-col space-x-4 lg:space-x-0 lg:w-full ">
            {allApplaud.length > 0 ? (
              allApplaud.map((item, idx) =>
                Object.entries(item).map(([key, value]) => (
                  <div
                    className={`bg-white rounded-md overflow-hidden shadow-md  p-4 mb-3 cursor-pointer flex gap-4 shrink-0 items-center ${
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
                    <div className="shrink-0  lg:hidden">
                      <DefaultImages
                        imageSrc={value?.image}
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="shrink-0 hidden lg:block">
                      <DefaultImages
                        imageSrc={value?.image}
                        width={60}
                        height={60}
                      />
                    </div>

                    <div className="flex-1 space-y-2 ">
                      <p className="font-semibold text-sm md:text-base">
                        {key}
                      </p>

                      <div className="flex justify-between items-center shrink-0">
                        <div className="flex" title="Applaud Taken">
                          <div className="flex ">
                            <ApplaudIconSmall />
                          </div>
                          <div className="flex items-end pl-2 text-sm md:text-base font-medium text-gray-600">
                            {value?.taken?.length}
                          </div>
                        </div>
                        <div className="flex mx-3" title="Applaud Given">
                          <div className="flex">
                            <ApplaudGiven />
                          </div>
                          <div className="flex items-end pl-2 text-sm md:text-base font-medium text-gray-600">
                            {value?.given?.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (
              <div className="bg-white rounded-md overflow-hidden shadow-md mx-4 my-3 py-4 px-2">
                <div className="flex justify-center items-center h-48">
                  <div className="text-center  ">No Applaud Found</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className=" bg-white rounded-md  shadow-md flex-1 p-4  lg:p-5 received--all-applaud">
            <ApplaudTimeline list={allFilterOrgApplaud} />
          </div>
        </div>
      </div>
    </>
  );
}

export default AllAplaud;
