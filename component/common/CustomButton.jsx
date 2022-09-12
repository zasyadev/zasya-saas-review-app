import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import Link from "next/link";
import React from "react";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
      color: "white",
    }}
    spin
  />
);

export function PrimaryButton({
  title,
  onClick = () => {},
  withLink,
  className = "",
  linkHref,
  disabled = false,
  loading = false,
  ...restProp
}) {
  const isDisabled = disabled || loading;

  const btnClassName = `text-white text-center px-4 py-2 rounded-md ${className} ${
    isDisabled ? "bg-primary/70" : "bg-primary"
  }`;

  return withLink ? (
    <Link href={linkHref} passHref>
      <button className={btnClassName} {...restProp} disabled={isDisabled}>
        {loading ? <Spin indicator={antIcon} /> : title}
      </button>
    </Link>
  ) : (
    <button
      className={btnClassName}
      onClick={() => onClick()}
      {...restProp}
      disabled={isDisabled}
    >
      {loading ? <Spin indicator={antIcon} /> : title}
    </button>
  );
}

export function SecondaryButton({
  title,
  onClick = () => {},
  withLink,
  className = "",
  linkHref,

  disabled = false,
  loading = false,
  ...restProp
}) {
  const isDisabled = disabled || loading;

  const btnClassName = `rounded-md text-white text-center px-4 py-2  ${className} ${
    isDisabled ? "bg-secondary/70" : "bg-secondary"
  }`;
  return withLink ? (
    <Link href={linkHref} passHref>
      <button className={btnClassName} {...restProp} disabled={isDisabled}>
        {loading ? <Spin indicator={antIcon} /> : title}
      </button>
    </Link>
  ) : (
    <button
      className={btnClassName}
      onClick={() => onClick()}
      {...restProp}
      disabled={isDisabled}
    >
      {loading ? <Spin indicator={antIcon} /> : title}
    </button>
  );
}
