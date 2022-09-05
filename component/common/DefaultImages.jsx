import React from "react";
import Image from "next/image";

function DefaultImages({
  imageSrc,
  className = "rounded-full",
  width = 60,
  height = 60,
}) {
  return (
    <Image
      src={imageSrc ? imageSrc : "/media/images/User.png"}
      alt="userImage"
      width={width}
      height={height}
      className={className}
    />
  );
}

export default DefaultImages;
