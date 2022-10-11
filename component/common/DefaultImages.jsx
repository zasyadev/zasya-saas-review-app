import React from "react";
import Image from "next/image";

function DefaultImages({
  imageSrc,
  className = "rounded-full",
  width = 60,
  height = 60,
  layout = "",
  objectFit = "cover",
}) {
  let props = {};
  if (layout) {
    props = {
      layout,
      objectFit,
    };
  } else {
    props = {
      width,
      height,
    };
  }

  return (
    <Image
      src={imageSrc ? imageSrc : "/media/images/User.png"}
      alt="userImage"
      className={className}
      {...props}
    />
  );
}

export default DefaultImages;
