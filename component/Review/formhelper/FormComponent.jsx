import React from "react";
import { Input, Radio, Slider } from "antd";
import TextArea from "antd/lib/input/TextArea";

export function InputComponent() {
  return (
    <>
      <div className="">
        <div className="answer-bg h-full w-full">
          <div className="text-center  ">
            <div className="py-24 flex flex-col items-center justify-center">
              <p className="text-xl font-bold my-5 text-red-400">Question 1</p>
              <p className="text-2xl font-bold primary-color-blue my-5">
                What do you feel about your current work environment?
              </p>
              <div className="my-5 w-96 add-template-wrapper">
                <Input size="large" />
              </div>
              <div className="my-5">
                <button className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 ">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function OptionComponent() {
  return (
    <>
      <div className="">
        <div className="answer-bg h-full w-full">
          <div className="text-center  ">
            <div className="py-24 flex flex-col items-center justify-center">
              <p className="text-xl font-bold my-5 text-red-400">Question 1</p>
              <p className="text-2xl font-bold primary-color-blue my-5">
                Option to select feedback or create new template
              </p>
              <div className="text-left ">
                <Radio.Group>
                  <Radio value={1} className="text-lg primary-color-blue my-2">
                    Feedback
                  </Radio>
                  <br />
                  <Radio value={2} className="text-lg primary-color-blue my-2">
                    Create
                  </Radio>
                  <br />
                  <Radio value={3} className="text-lg primary-color-blue my-2">
                    Template
                  </Radio>
                  <br />
                  <Radio value={4} className="text-lg primary-color-blue my-2">
                    Option
                  </Radio>
                </Radio.Group>
              </div>
              <div className="my-5">
                <button className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 ">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function TextAreaComponent() {
  return (
    <>
      <div className="">
        <div className="answer-bg h-full w-full">
          <div className="text-center  ">
            <div className="py-24 flex flex-col items-center justify-center">
              <p className="text-xl font-bold my-5 text-red-400">Question 3</p>
              <p className="text-2xl font-bold primary-color-blue my-5">
                Textarea to select feedback or create new template
              </p>
              <div className=" text-left w-96">
                <TextArea rows={4} />
              </div>
              <div className="my-5">
                <button className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 ">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function SliderComponent() {
  return (
    <>
      <div className="">
        <div className="answer-bg h-full w-full">
          <div className="text-center  ">
            <div className="py-24 flex flex-col items-center justify-center">
              <p className="text-xl font-bold my-5 text-red-400">Question 4</p>
              <p className="text-2xl font-bold primary-color-blue my-5">
                Rating
              </p>
              <div className=" text-left w-96">
                <Slider
                  className="rating-slider-a"

                  // value={typeof inputValue === "number" ? inputValue : 0}
                />
              </div>
              <div className="my-5">
                <button className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 ">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
