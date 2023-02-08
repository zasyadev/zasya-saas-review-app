import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ButtonGray } from "../common/CustomButton";

const motionVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const SurveyTemplateCard = ({
  id,
  title,
  description = "",
  questionLength = 0,
}) => {
  return (
    <motion.div
      key={id}
      variants={motionVariants}
      className="template-list rounded-md shadow-md bg-white flex flex-col relative group overflow-hidden
      "
    >
      <Link href={`${URLS.TEMPLATE_PREVIEW}/${id}/survey`} passHref>
        <div className="relative w-full h-40 cursor-pointer  ">
          <Image
            src={"/media/images/template_dummy.png"}
            layout="fill"
            alt="template"
            objectFit="cover"
          />
        </div>
      </Link>

      <div className=" border-gray-200  p-3 space-y-2 flex flex-1 flex-col ">
        <Link href={`${URLS.TEMPLATE_PREVIEW}/${id}/survey`} passHref>
          <div className=" space-y-2 cursor-pointer flex-1">
            <p className="text-base xl:text-lg text-primary font-semibold mb-0 flex-1">
              {title}
            </p>
            <p className="text-sm xl:text-base text-primary  mb-0 flex-1  two-line-clamp ">
              {description}
            </p>
          </div>
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-sm xl:text-base text-primary mb-0 flex-1">
            <span className="font-semibold">{questionLength}</span> Questions
          </p>
        </div>
      </div>

      <div className="hidden opacity-0 absolute inset-0 px-4 group-hover:opacity-100 md:grid place-content-center bg-black bg-opacity-50 rounded-md transition-all duration-300 ease-in-out">
        <div className="space-y-4 ">
          <ButtonGray
            withLink={true}
            linkHref={`${URLS.TEMPLATE_PREVIEW}/${id}/survey`}
            className="w-full "
            title="Preview Template"
          />
          <ButtonGray
            withLink={true}
            linkHref={`${URLS.SURVEY_EDIT}/${id}`}
            className="w-full"
            title="Use Template"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SurveyTemplateCard;
