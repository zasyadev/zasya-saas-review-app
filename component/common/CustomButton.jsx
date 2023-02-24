import React from "react";
import Link from "next/link";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { twMerge } from "tailwind-merge";

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

  const btnClassName = twMerge(
    `text-white text-center px-4 py-2 rounded-md  ${
      isDisabled ? "bg-primary-green/70" : "bg-primary-green"
    }`,
    className
  );

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

  const btnClassName = twMerge(
    `rounded-md text-primary-green text-center px-4 py-2 border-2 border-primary-green ${
      isDisabled ? "bg-secondary/70" : "bg-white"
    }`,
    className
  );

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

export function ButtonGray({
  title,
  onClick = () => {},
  withLink,
  className = "",
  linkHref,
  rounded = "rounded-md",
  disabled = false,
  loading = false,
  ...restProp
}) {
  const isDisabled = disabled || loading;

  const btnClassName = twMerge(
    `${rounded} text-center px-4 py-2 border border-gray-300 font-medium text-gray-600 ${
      isDisabled ? "bg-gray-200" : "bg-gray-50 hover:bg-gray-100"
    }`,
    className
  );

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
