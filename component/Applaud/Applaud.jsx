import { DatePicker, Skeleton } from "antd";
import clsx from "clsx";
import { motion } from "framer-motion";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import ToggleButton from "../../component/common/ToggleButton";
import { URLS } from "../../constants/urls";
import {
  disableDates,
  MONTH_DATE_FORMAT,
  MONTH_FORMAT,
} from "../../helpers/dateHelper";
import getApplaudCategoryName from "../../helpers/getApplaudCategoryName";
import httpService from "../../lib/httpService";
import { openNotificationBox } from "../common/notification";
import { DefaultMotionVarient } from "../Template/constants";
import { defaultCurrentMonth } from "../../helpers/momentHelper";

const APPLAUD_FILTER_KEY = {
  RECEIVED: "Received",
  SENT: "Sent",
};

const applaudCardVarient = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const ApplaudCard = ({ applaud, type }) => {
  return (
    <motion.div key={applaud.id} variants={applaudCardVarient}>
      <div className="flex flex-col template-list h-full w-full rounded-md shadow-md bg-white space-y-4 p-2">
        <div className="relative h-auto p-2 bg-brandGray-150 space-y-4 rounded-md flex flex-col flex-1">
          <p className="mb-0 font-medium flex-1">{applaud.comment}</p>
          {applaud?.category?.length > 0 && (
            <p className="mb-0 flex flex-wrap gap-2">
              {applaud?.category.map((item, idx) => (
                <span
                  key={idx + "cat"}
                  className={twMerge(
                    clsx(
                      "px-3 py-1 rounded-full bg-transparent text-xs border-2 border-blue-700",
                      { "border-blue-400": idx % 2 === 0 },
                      { "border-cyan-400": idx % 3 === 0 }
                    )
                  )}
                >
                  {getApplaudCategoryName(item)}
                </span>
              ))}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center border-gray-200  px-2 ">
          <p className="text-base  mb-0 ">
            {type === "received" ? "From " : "Sent To "}

            <span className="font-semibold">
              {type === "received"
                ? applaud.created.first_name
                : applaud.user.first_name}
            </span>
          </p>
          <p className="text-sm  text-gray-500 font-medium mb-0 ">
            {moment(applaud.created_date).format(MONTH_DATE_FORMAT)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

function Applaud({ user }) {
  const [applaudList, setApplaudList] = useState([]);
  const [receivedApplaudList, setReceivedApplaudList] = useState([]);
  const [changeReceivedView, setChangeReceivedView] = useState(
    APPLAUD_FILTER_KEY.RECEIVED
  );

  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(defaultCurrentMonth);

  useEffect(() => {
    fetchApplaudData();
  }, [currentMonth]);

  const fetchApplaudData = async () => {
    setLoading(true);
    setReceivedApplaudList([]);
    setApplaudList([]);
    await httpService
      .post(`/api/applaud/${user.id}`, {
        currentMonth: currentMonth,
      })
      .then(({ data: res }) => {
        setReceivedApplaudList(res.data.receivedApplaud);
        setApplaudList(res.data.givenApplaud);
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message);
        setReceivedApplaudList([]);
      })
      .finally(() => setLoading(false));
  };
  function onDateChange(date, _) {
    setCurrentMonth({
      lte: moment(date).endOf("month"),
      gte: moment(date).startOf("month"),
    });
  }

  return (
    <div className="container mx-auto max-w-full">
      <p className="text-xl font-semibold  mb-4 md:mb-6">Applaud</p>
      <div className="flex flex-col-reverse md:flex-row flex-wrap items-center justify-between  mb-4 md:mb-6 gap-3">
        <div className="w-full justify-between md:justify-start md:w-auto flex items-center gap-4">
          <div className="bg-white rounded-md shrink-0 py-1 px-2">
            <DatePicker
              onChange={onDateChange}
              picker="month"
              bordered={false}
              allowClear={false}
              format={MONTH_FORMAT}
              defaultValue={moment()}
              className="font-semibold w-full md:w-auto"
              disabledDate={disableDates}
            />
          </div>

          <ToggleButton
            arrayList={[
              { label: APPLAUD_FILTER_KEY.RECEIVED },
              { label: APPLAUD_FILTER_KEY.SENT },
            ]}
            handleToggle={(activeKey) => setChangeReceivedView(activeKey)}
            activeKey={changeReceivedView}
          />
        </div>

        <div className="w-full md:w-auto flex items-center justify-end flex-shrink-0">
          <SecondaryButton
            withLink={true}
            className="mr-3"
            linkHref={URLS.ALL_APPLAUD}
            title={"View All"}
          />

          <PrimaryButton
            withLink={true}
            linkHref={URLS.APPLAUD_CREATE}
            title={"Create"}
          />
        </div>
      </div>
      <div className="container mx-auto max-w-full">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 2xl:gap-12 "
          variants={DefaultMotionVarient}
          initial="hidden"
          animate="show"
        >
          {loading ? (
            [2, 3, 4].map((loop) => (
              <motion.div
                key={"loaderquesSlid" + loop}
                variants={applaudCardVarient}
              >
                <div className="template-list h-full w-full rounded-md shadow-md bg-white space-y-2 p-5">
                  <Skeleton
                    title={false}
                    active={true}
                    className="my-4"
                    key={loop}
                  />
                </div>
              </motion.div>
            ))
          ) : changeReceivedView === APPLAUD_FILTER_KEY.RECEIVED ? (
            receivedApplaudList.length > 0 ? (
              receivedApplaudList.map((item) => (
                <ApplaudCard applaud={item} type={"received"} key={item.id} />
              ))
            ) : (
              <div className="template-list h-full w-full rounded-md shadow-md bg-white space-y-2">
                <p className="p-6 mb-0 ">No Applaud Received</p>
              </div>
            )
          ) : applaudList.length > 0 ? (
            applaudList.map((item) => (
              <ApplaudCard applaud={item} type={"sent"} key={item.id} />
            ))
          ) : (
            <div className="template-list h-full w-full rounded-md shadow-md bg-white space-y-2">
              <p className="p-6 mb-0 ">No Applaud Received</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Applaud;
