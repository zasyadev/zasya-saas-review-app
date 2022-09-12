import React from "react";
import { Popover, Steps } from "antd";
// import {
//   CheckOutlined,
//   ClockCircleOutlined,
//   SyncOutlined,
// } from "@ant-design/icons";
const { Step } = Steps;

function CustomSteps({
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

export default CustomSteps;
