import { Popconfirm } from "antd";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DeleteTemplateIcon } from "../../assets/icons";
import { URLS } from "../../constants/urls";
import { ButtonGray } from "../common/CustomButton";

const motionVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const TemplateCard = ({
  id,
  title,
  deleteTemplate,
  isDelete = false,
  description = "",
  questionLength = 0,
}) => {
  return (
    <motion.div
      key={id}
      variants={motionVariants}
      className="template-list rounded-md shadow-md bg-white flex flex-col relative group overflow-hidden p-2
      "
    >
      <Link
        href={`${URLS.TEMPLATE}/${isDelete ? "edit" : "preview"}/${id}`}
        passHref
      >
        <div className="relative w-full h-40 cursor-pointer  rounded-md">
          <Image
            src={"/media/images/template_dummy.png"}
            layout="fill"
            alt="template"
          />
        </div>
      </Link>

      <div className=" border-gray-200  p-3 space-y-2 flex flex-1 flex-col ">
        <Link
          href={`${URLS.TEMPLATE}/${isDelete ? "edit" : "preview"}/${id}`}
          passHref
        >
          <div className=" space-y-2 cursor-pointer flex-1">
            <p className="text-base xl:text-lg  font-semibold mb-0 flex-1">
              {title}
            </p>
            <p className="text-sm xl:text-base   mb-0 flex-1  two-line-clamp ">
              {description}
            </p>
          </div>
        </Link>
        <div className="flex items-center justify-between">
          <p className="flex items-center space-x-1 text-sm xl:text-base  mb-0 flex-1">
            <Image
              src="/media/svg/question-mark.svg"
              alt="plus-sign"
              width={15}
              height={15}
            />
            <span className="font-semibold text-primary-green">
              {questionLength}
            </span>
            <span className="text-primary-green">Questions</span>{" "}
          </p>
          {isDelete && (
            <Popconfirm
              title={
                <p className="font-medium ">
                  Are you sure to delete{" "}
                  <span className="font-semibold">{title}</span> ?
                </p>
              }
              okText="Yes"
              cancelText="No"
              icon={false}
              onConfirm={() => deleteTemplate(id)}
            >
              <div className="text-sm   flex items-center  justify-center p-2 border hover:bg-gray-100 hover:border-primary-green rounded-full cursor-pointer">
                <span className="font-semibold whitespace-nowrap ">
                  <DeleteTemplateIcon
                    size="20"
                    className=" text-primary-green"
                  />
                </span>
              </div>
            </Popconfirm>
          )}
        </div>
      </div>
      {!isDelete && (
        <div className="hidden opacity-0 absolute inset-0 px-4 group-hover:opacity-100 md:grid place-content-center bg-black bg-opacity-50 rounded-md transition-all duration-300 ease-in-out">
          <div className="space-y-4 ">
            <ButtonGray
              withLink={true}
              linkHref={`${URLS.TEMPLATE_PREVIEW}/${id}/review`}
              className="w-full "
              title="Preview Template"
            />
            <ButtonGray
              withLink={true}
              linkHref={`${URLS.REVIEW_EDIT}/${id}`}
              className="w-full"
              title="Use Template"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TemplateCard;
