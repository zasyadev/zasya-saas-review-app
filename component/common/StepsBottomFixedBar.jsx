import React from "react";

import { LeftOutlined } from "@ant-design/icons";
import { PrimaryButton } from "./CustomButton";

import CustomSteps from "./CustomSteps";
const StepsBottomFixedBar = ({
  setActiveStepState,
  activeStepState,
  lastStep,
  previewStep,
  submitLoading,
  nextStepHandller,
  stepsArray = [],
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0">
      <div className=" bg-white p-3 md:p-5 rounded-md w-full">
        <div className="flex justify-between  items-center">
          <div className="w-full md:w-4/5 2xl:w-3/5 mx-auto hidden md:block">
            <CustomSteps
              activeStepState={activeStepState}
              setActiveStepState={setActiveStepState}
              stepsArray={stepsArray}
              responsive={false}
            />
          </div>
          <div className="px-2 md:hidden block">
            {activeStepState ? (
              <span
                onClick={() => {
                  setActiveStepState(activeStepState - 1);
                }}
              >
                <LeftOutlined className="text-base " />
              </span>
            ) : null}
          </div>

          <PrimaryButton
            title={
              activeStepState === lastStep
                ? "Submit"
                : activeStepState === previewStep
                ? "Preview"
                : "Continue"
            }
            onClick={() => {
              nextStepHandller(activeStepState);
            }}
            loading={submitLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default StepsBottomFixedBar;
