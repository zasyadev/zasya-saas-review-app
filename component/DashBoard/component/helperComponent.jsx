import clsx from "clsx";
import moment from "moment";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { DATE_FORMAT, SHORT_MONTH_FORMAT } from "../../../helpers/dateHelper";

export function DateBox({ date, className }) {
  const month = moment(date).format(SHORT_MONTH_FORMAT);
  const endDate = moment(date).format(DATE_FORMAT);

  return (
    <div
      className={twMerge(
        clsx(
          "grid place-content-center text-center font-semibold text-sm lg:text-base",
          "w-12 h-12 lg:w-14 lg:h-14 text-white rounded-md bg-primary-green",
          className
        )
      )}
    >
      <p className=" mb-0">{endDate}</p>
      <p className="mb-0">{month}</p>
    </div>
  );
}

export function CountCard({
  count,
  title,
  Icon,
  className = "",
  iconClassName = "",
  href,
}) {
  return (
    <Link href={href} passHref>
      <div
        className={clsx(
          "px-5 py-3 rounded-t-md transition-all duration-300 ease-in border-t-4 border-transparent hover:bg-brandGray-100 hover:border-t-4 hover:border-primary-green",
          className
        )}
      >
        <div className="flex flex-wrap items-center h-full gap-2 select-none">
          <div className="flex-1">
            <div className="flex items-start justify-between font-medium tracking-wide text-base mb-1">
              <span className="flex-1">{title}</span>
            </div>
            <span className="text-xl xl:text-2xl   font-bold ">{count}</span>
          </div>
          <div
            className={clsx(
              "grid items-center w-10 h-10 py-1 px-1 justify-center shadow-md rounded-full",
              iconClassName
            )}
          >
            <Icon />
          </div>
        </div>
      </div>
    </Link>
  );
}
