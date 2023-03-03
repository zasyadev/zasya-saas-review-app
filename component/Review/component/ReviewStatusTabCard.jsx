import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function ReviewStatusTabCard({ data }) {
  const {
    onClickStatus,
    countData,
    className,
    title,
    imageSrc,
    isActive = false,
  } = data;
  return (
    <div
      className={twMerge(
        clsx(
          "flex space-x-4 p-4 rounded-t-md  cursor-pointer transition-all duration-300 ease-in border-t-4 border-transparent  ",
          "hover:border-primary-green  hover:bg-brandGray-100 hover:border-t-4",
          { "border-primary-green bg-brandGray-100 border-t-4": isActive }
        )
      )}
      onClick={onClickStatus}
    >
      <div
        className={`grid place-content-center w-12 h-12 rounded-full ${className}`}
      >
        <img src={imageSrc} className="w-5 h-5" alt={title} />
      </div>
      <div>
        <p className="text-lg font-medium ">{title}</p>
        <p className="text-base font-medium text-gray-400">{countData}</p>
      </div>
    </div>
  );
}
