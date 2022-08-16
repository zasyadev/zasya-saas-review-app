import Link from "next/link";
import React from "react";

export function PrimaryButton({
  title,
  onClick = () => {},
  withLink,
  className,
  linkHref,
  btnProps,
}) {
  return withLink ? (
    <Link href={linkHref}>
      <button
        className={`primary-bg-btn
     text-white text-center px-4 py-3  ${className}`}
        {...btnProps}
      >
        {title}
      </button>
    </Link>
  ) : (
    <button
      className={`primary-bg-btn
     text-white text-center px-4 py-3  ${className}`}
      onClick={() => onClick()}
      {...btnProps}
    >
      {title}
    </button>
  );
}

export function SecondaryButton({
  title,
  onClick = () => {},
  withLink,
  className,
  linkHref,
  btnProps,
}) {
  return withLink ? (
    <Link href={linkHref}>
      <button
        className={`toggle-btn-bg
       text-white text-center px-4 py-3  ${className}`}
        {...btnProps}
      >
        {title}
      </button>
    </Link>
  ) : (
    <button
      className={`toggle-btn-bg
       text-white text-center px-4 py-3  ${className}`}
      onClick={() => onClick()}
      {...btnProps}
    >
      {title}
    </button>
  );
}
