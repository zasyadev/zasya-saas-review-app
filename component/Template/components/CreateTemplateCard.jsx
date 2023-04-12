import Link from "next/link";
import React from "react";
import { URLS } from "../../../constants/urls";

const CreateTemplateCard = () => (
  <Link href={URLS.TEMPLATE_CREATE} passHref>
    <div className="template  template-list border-2 border-primary-green bg-white grid place-content-center   w-full rounded-md overflow-hdden shadow-md p-5  cursor-pointer  h-56 sm:h-full add-template-card">
      <div className="cursor-pointer grid place-content-center">
        <img
          src="/media/svg/plus-circle.svg"
          alt="plus-sign"
          className="w-12 h-12"
        />
      </div>
      <div className=" text-center text-base font-medium mt-5">
        Create from scratch
      </div>
    </div>
  </Link>
);

export default CreateTemplateCard;
