import Link from "next/link";
import React from "react";
import { AddIcon } from "../../../assets/icons";

const CreateTemplateCard = () => (
  <Link href="/template/add" passHref>
    <div className="hidden template  template-list md:flex bg-white items-center justify-center flex-col  w-full rounded-md overflow-hdden shadow-md p-5  cursor-pointer  h-56 sm:h-full add-template-card">
      <div className="cursor-pointer">
        <AddIcon className="text-center " />
      </div>
      <div className="text-primary text-center text-base font-medium mt-5">
        Create Template From Scratch
      </div>
    </div>
  </Link>
);

export default CreateTemplateCard;
