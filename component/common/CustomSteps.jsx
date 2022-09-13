import React from "react";
import { Popover, Steps } from "antd";
import { CloseOutlined, LeftOutlined } from "@ant-design/icons";
import { PrimaryButton } from "./CustomButton";
// import {
//   CheckOutlined,
//   ClockCircleOutlined,
//   SyncOutlined,
// } from "@ant-design/icons";
const { Step } = Steps;

export function LineSteps({
  setActiveStepState,
  activeStepState,

  stepsArray = [],
  ...restProps
}) {
  const CustomDot = (dot, { index, status }) => {
    let data = stepsArray.find((item) => item.step === index);

    return (
      <>
        <Popover content={<span>{data?.title}</span>}>
          {/* <span className="text-primary mx-2">
            {status == "finish" ? (
              <CheckOutlined />
            ) : status == "process" ? (
              <ClockCircleOutlined />
            ) : (
              <SyncOutlined />
            )}
          </span> */}
          {dot}
        </Popover>
      </>
    );
  };
  const onChangeStep = (value) => {
    setActiveStepState(value);
  };

  return (
    <>
      <Steps
        current={activeStepState}
        progressDot={CustomDot}
        onChange={onChangeStep}
        className="my-1 md:mt-4 text-primary"
        {...restProps}
      >
        {stepsArray.map((data) => {
          return <Step key={data.key} />;
        })}
      </Steps>
    </>
  );
}

export function CustomStepsWrapper({
  setActiveStepState,
  activeStepState,
  lastStep,
  previewStep,
  submitLoading,
  disable,
  stepsArray = [],
  submitHandle = () => {},
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0">
      <div className=" bg-white p-5 rounded-md w-full">
        <div className="flex justify-between  items-center">
          <div className="w-full md:w-1/2 mx-auto hidden md:block">
            <LineSteps
              activeStepState={activeStepState}
              setActiveStepState={setActiveStepState}
              stepsArray={stepsArray}
              responsive={false}
            />
          </div>
          <div className="w-full md:w-1/2 mx-auto md:hidden block">
            {activeStepState ? (
              <span
                onClick={() => {
                  setActiveStepState(activeStepState - 1);
                }}
              >
                <LeftOutlined style={{ fontSize: "28px" }} />
              </span>
            ) : null}
          </div>
          <div className="text-primary ">
            <PrimaryButton
              title={
                activeStepState === lastStep
                  ? "Submit"
                  : activeStepState === previewStep
                  ? "Preview"
                  : "Continue"
              }
              onClick={() => {
                if (activeStepState === lastStep) {
                  submitHandle();
                } else {
                  setActiveStepState(activeStepState + 1);
                }
              }}
              loading={submitLoading}
              // disabled={!disable[activeStepState]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomStepsHeaderWrapper({ backUrl, title }) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white px-6 py-4 rounded-md z-10">
      <div className="flex justify-between items-center">
        <p className="text-lg text-primary font-semibold">{title} </p>
        <PrimaryButton
          withLink={true}
          linkHref={backUrl}
          className="leading-0"
          title={<CloseOutlined />}
        />
      </div>
    </div>
  );
}
