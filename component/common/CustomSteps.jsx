import React from "react";
import { Steps, Grid } from "antd";

const { Step } = Steps;
const { useBreakpoint } = Grid;

function CustomSteps({
  setActiveStepState,
  activeStepState,
  stepsArray = [],
  ...restProps
}) {
  const { lg } = useBreakpoint();

  const onChangeStep = (value) => {
    setActiveStepState(value);
  };

  return (
    <>
      <Steps
        type={"navigation"}
        current={activeStepState}
        size={lg ? "default" : "small"}
        className="pt-0 font-semibold custom-steps-wrapper"
        {...restProps}
      >
        {stepsArray.map((step) => {
          return (
            <Step
              key={step.key}
              {...(activeStepState > step.id
                ? { onStepClick: onChangeStep }
                : {})}
              title={step.title}
            />
          );
        })}
      </Steps>
    </>
  );
}

export default CustomSteps;
