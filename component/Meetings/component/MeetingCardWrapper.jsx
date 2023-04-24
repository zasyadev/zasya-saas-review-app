import { motion } from "framer-motion";
import React from "react";
import { DefaultMotionVarient } from "../../Template/constants";
import MettingCard from "./MettingCard";

const MeetingCardWrapper = ({ list, user, fetchMeetingList }) => {
  if (!list.length) return null;

  return (
    <motion.div
      className="space-y-4 max-h-screen overflow-auto custom-scrollbar mb-4 md:mb-0"
      variants={DefaultMotionVarient}
      initial="hidden"
      animate="show"
    >
      {list.map((item) => (
        <MettingCard
          item={item}
          key={item.id}
          user={user}
          fetchMeetingList={fetchMeetingList}
        />
      ))}
    </motion.div>
  );
};

export default MeetingCardWrapper;
