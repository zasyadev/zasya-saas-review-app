import { DatePicker, Skeleton } from "antd";
import { motion } from "framer-motion";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
  ToggleButton,
} from "../../component/common/CustomButton";
import getApplaudCategoryName from "../../helpers/getApplaudCategoryName";
import httpService from "../../lib/httpService";
import { openNotificationBox } from "../common/notification";

const ApplaudCard = ({ applaud, type }) => {
  return (
    <div className="flex flex-col template-list h-full w-full rounded-md shadow-md bg-white space-y-4 p-4">
      <div className="relative h-auto p-4 bg-teal-100 space-y-4 rounded-md flex flex-col flex-1">
        <p className="mb-0 font-medium flex-1">{applaud.comment}</p>
        {applaud?.category?.length > 0 && (
          <p className="mb-0 flex flex-wrap gap-2">
            {applaud?.category.map((item, idx) => (
              <span
                key={idx + "cat"}
                className=" px-3 py-1 rounded-full bg-teal-200 text-xs "
              >
                {getApplaudCategoryName(item)}
              </span>
            ))}
          </p>
        )}
      </div>

      <div className=" border-gray-200  px-2 ">
        <p className="text-base text-primary mb-0 ">
          {type === "received" ? "From " : "Sent To "}

          <span className="font-semibold">
            {type === "received"
              ? applaud.created.first_name
              : applaud.user.first_name}{" "}
          </span>
        </p>
        <p className="text-sm  text-gray-500 font-medium mb-0 ">
          {moment(applaud.created_date).format("MMMM DD, YYYY")}
        </p>
      </div>
    </div>
  );
};

function Applaud({ user }) {
  const [applaudList, setApplaudList] = useState([]);
  const [receivedApplaudList, setReceivedApplaudList] = useState([]);
  const [changeReceivedView, setChangeReceivedView] = useState(true);

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
    setApplaudList([]);
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
        openNotificationBox("error", err.response.data?.message);
        setReceivedApplaudList([]);
        setLoading(false);
      });
  };
  function onDateChange(date, _) {
    setCurrentMonth({
      lte: moment(date).endOf("month"),
      gte: moment(date).startOf("month"),
    });
  }
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf("month");
  };

  return (
    <div className="container mx-auto max-w-full">
      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between  mb-4 md:mb-6 gap-3">
        <div className="flex w-auto">
          <ToggleButton
            className={`rounded-r-none rounded-l-md w-1/2  md:w-fit ${
              changeReceivedView
                ? "bg-primary text-white"
                : " bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-600"
            }`}
            onClick={() => setChangeReceivedView(true)}
            title={"Received"}
          />
          <ToggleButton
            className={`rounded-l-none rounded-r-md w-1/2  md:w-fit ${
              changeReceivedView
                ? "bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-600 "
                : "bg-primary text-white"
            } `}
            onClick={() => setChangeReceivedView(false)}
            title={"Sent"}
          />
        </div>

        <div className="bg-white rounded-md overflow-hidden shadow-md  py-1 px-2">
          <DatePicker
            onChange={onDateChange}
            picker="month"
            bordered={false}
            allowClear={false}
            format="MMMM"
            defaultValue={moment()}
            className="font-semibold w-full md:w-auto"
            disabledDate={disabledDate}
          />
        </div>

        <div className="mx-auto md:mx-0">
          <SecondaryButton
            withLink={true}
            className="rounded-md mr-3"
            linkHref="/applaud/allapplaud"
            title={"View All"}
          />

          <PrimaryButton
            withLink={true}
            className="rounded-md "
            linkHref="/applaud/add"
            title={"Create"}
          />
        </div>
      </div>
      <div className="container mx-auto max-w-full">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 2xl:gap-12 "
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                duration: 0.3,
                staggerChildren: 0.5,
                delayChildren: 0.5,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {loading ? (
            [2, 3, 4].map((loop) => (
              <motion.div
                key={"loaderquesSlid" + loop}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  show: { y: 0, opacity: 1 },
                }}
              >
                <div className="template-list h-full w-full rounded-md shadow-md bg-white space-y-2 p-4">
                  <Skeleton
                    title={false}
                    active={true}
                    width={[200]}
                    className="my-4"
                    key={loop}
                  />
                </div>
              </motion.div>
            ))
          ) : changeReceivedView ? (
            receivedApplaudList.length > 0 ? (
              receivedApplaudList.map((item, idx) => (
                <motion.div
                  key={idx + "received"}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    show: { y: 0, opacity: 1 },
                  }}
                >
                  <ApplaudCard applaud={item} type={"received"} />
                </motion.div>
              ))
            ) : (
              <div className="template-list h-full w-full rounded-md shadow-md bg-white space-y-2">
                <p className="p-6 mb-0 ">No Applaud Received</p>
              </div>
            )
          ) : applaudList.length > 0 ? (
            applaudList.map((item, idx) => (
              <motion.div
                key={idx + "sent"}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  show: { y: 0, opacity: 1 },
                }}
              >
                <ApplaudCard applaud={item} type={"sent"} />
              </motion.div>
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
