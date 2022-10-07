import { Popconfirm, Skeleton } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AddIcon, DeleteTemplateIcon } from "../../assets/icons";

export const TemplateCard = ({
  id,
  title,
  deleteTemplate,
  linkHref,
  isDelete = false,
  description = "",
  questionLength = 0,
}) => {
  return (
    <div
      className="template-list h-full w-full rounded-md shadow-md bg-white"
      key={id + "form"}
    >
      <Link href={linkHref} passHref>
        <div className="relative w-full h-40 cursor-pointer ">
          <Image
            src={"/media/images/template_dummy.png"}
            layout="fill"
            // objectFit="cover"
            alt="template"
          />
        </div>
      </Link>

      <div className=" border-gray-200  p-3 space-y-2">
        <Link href={linkHref} passHref>
          <div className=" space-y-2 cursor-pointer">
            <p className="text-base xl:text-lg text-primary font-semibold mb-0 flex-1">
              {title}
            </p>
            <p className="text-sm xl:text-base text-primary  mb-0 flex-1  two-line-clamp sm:h-14 xl:h-16">
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
    </div>
  );
};

export const SkeletonTemplateCard = () => {
  return (
    <div className="template-list h-full w-full shadow-md">
      <Skeleton.Image active className="w-full h-40" />

      <div className="flex flex-wrap border-gray-200 items-center justify-between py-4 px-4 space-x-3">
        <Skeleton active title={false} className="w-full h-32" />
      </div>
    </div>
  );
};

export const CreateTemplateCard = () => (
  <Link href="/template/add" passHref>
    <div className="template  template-list flex bg-white items-center justify-center flex-col  w-full rounded-md overflow-hdden shadow-md p-5  cursor-pointer  h-56 sm:h-full">
      <div className="cursor-pointer">
        <AddIcon className="text-center " />
      </div>
      <div className="text-primary text-center text-base font-medium mt-5">
        Create Template From Scratch
      </div>
    </div>
  </Link>
);
