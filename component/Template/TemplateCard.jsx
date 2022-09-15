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
  isDelete = true,
}) => {
  return (
    <div className="template-list h-full w-full shadow-md " key={id + "form"}>
      <Link href={linkHref} passHref>
        <div className="relative w-full h-60 cursor-pointer">
          <Image
            src={"/media/images/template.webp"}
            layout="fill"
            objectFit="cover"
            alt="template"
          />
        </div>
      </Link>

      <div className="flex flex-wrap border-gray-200 items-center justify-between py-4 px-4 space-x-3">
        <Link href={linkHref} passHref>
          <p className="text-base xl:text-lg text-primary font-semibold mb-0 flex-1 cursor-pointer">
            {title}
          </p>
        </Link>
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
            <div className="text-sm text-primary  flex items-center  justify-center p-2 border hover:bg-gray-100 hover:border-red-600 rounded-full">
              <span className="font-semibold whitespace-nowrap cursor-pointer">
                <DeleteTemplateIcon
                  size="20"
                  className="cursor-pointer text-red-500"
                />
              </span>
            </div>
          </Popconfirm>
        )}
      </div>
    </div>
  );
};

export const SkeletonTemplateCard = () => {
  return (
    <div className="template-list h-full w-full shadow-md">
      <Skeleton.Image active className="w-full h-48" />

      <div className="flex flex-wrap border-gray-200 items-center justify-between py-4 px-4 space-x-3">
        <Skeleton active title={false} className="w-full" />
      </div>
    </div>
  );
};

export const CreateTemplateCard = () => (
  <Link href="/template/add" passHref>
    <div className="template  template-list flex bg-white items-center justify-center flex-col  w-full rounded-md overflow-hdden shadow-md p-5  cursor-pointer my-2 h-56">
      <div className="cursor-pointer">
        <AddIcon className="text-center " />
      </div>
      <div className="text-primary text-center text-base font-medium mt-5">
        Create Template
      </div>
    </div>
  </Link>
);
