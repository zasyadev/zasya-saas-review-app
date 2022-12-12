import { Popconfirm } from "antd";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DeleteTemplateIcon } from "../../assets/icons";
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
      className="template-list rounded-md shadow-md bg-white flex flex-col relative group overflow-hidden
      "
    >
      <Link href={`/template/${isDelete ? "edit" : "preview"}/${id}`} passHref>
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
        <Link
          href={`/template/${isDelete ? "edit" : "preview"}/${id}`}
          passHref
        >
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
              <div className="text-sm text-primary  flex items-center  justify-center p-2 border hover:bg-gray-100 hover:border-red-600 rounded-full cursor-pointer">
                <span className="font-semibold whitespace-nowrap ">
                  <DeleteTemplateIcon size="20" className=" text-red-500" />
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
              linkHref={`/template/preview/${id}/review`}
              className="w-full "
              title="Preview Template"
            />
            <ButtonGray
              withLink={true}
              linkHref={`/review/edit/${id}`}
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
