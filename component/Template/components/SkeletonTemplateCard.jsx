import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "antd";

const motionVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const SkeletonTemplateCard = ({ index }) => {
  return (
    <motion.div
      key={index}
      variants={motionVariants}
      className="template-list h-full w-full shadow-md add-template-card"
    >
      <Skeleton.Image active className="w-full h-40" />

      <div className="flex flex-wrap border-gray-200 items-center justify-between py-4 px-4 space-x-3">
        <Skeleton active title={false} className="w-full h-32" />
      </div>
    </motion.div>
  );
};

export default SkeletonTemplateCard;
