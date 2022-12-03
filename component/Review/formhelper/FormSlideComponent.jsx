import { CloseOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../../common/CustomButton";
import {
  INPUT_TYPE,
  MULTIPLE_CHOICE_TYPE,
  RATING_TYPE,
  SCALE_TYPE,
  TEXTAREA_TYPE,
  YESNO_TYPE,
} from "../../Form/questioncomponents/constants";
import { REVIEW_TYPE } from "../../Template/constants";
import InputForm from "./InputForm";
import MutipleChoiceForm from "./MutipleChoiceForm";
import RateForm from "./RateForm";
import ScaleForm from "./ScaleForm";
import YesNoForm from "./YesNoForm";

export function FormSlideComponent({
  type,
  id,
  questionText,
  options,
  defaultQuestionAnswer,
  updateAnswerApiLoading,
  nextSlide,
  setNextSlide,
  totalQuestions,
  handleSubmit,
  handleAnswerChange,
  handleUpdateAnswer,
  fromType = REVIEW_TYPE,
}) {
  const router = useRouter();

  const defaultDisabledValue =
    defaultQuestionAnswer?.answer === undefined ? true : false;

  const [disableBtn, setDisableBtn] = useState(
    defaultQuestionAnswer?.answer ? false : true
  );

  const handleBtnDisable = (value) => {
    try {
      setDisableBtn(value && value?.trim() ? false : true);
    } catch {}
  };

  return (
    <div className="answer-preview ">
      <motion.div
        key={id + "quesSlid"}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className=" text-center bg-white rounded-md shadow-md md:w-10/12 2xl:w-8/12 mx-auto px-4 lg:px-6">
          <p className="relative text-lg font-bold text-gray-400 py-4 lg:py-6 ">
            {`Question ${nextSlide + 1}/${totalQuestions}`}
            <Popconfirm
              title={
                <p className="font-medium mb-0">
                  {`Are you sure you want to close ${
                    fromType === REVIEW_TYPE ? "review" : "survey"
                  }?`}
                </p>
              }
              okText="Yes"
              cancelText="No"
              onConfirm={() =>
                router.replace(
                  fromType === REVIEW_TYPE ? "/review/received" : "/"
                )
              }
              placement="right"
              overlayClassName="max-w-sm"
            >
              <span className="absolute top-2 lg:top-3 right-0  p-2 lg:p-3 leading-0 cursor-pointer rounded-full hover:bg-gray-100">
                <CloseOutlined />
              </span>
            </Popconfirm>
          </p>

          <div className="pb-4 lg:pb-6 space-y-4 lg:space-y-8">
            <p className="text-lg  lg:text-2xl font-bold text-primary">
              {questionText}
            </p>
            {Number(options?.length) > 0 && type === MULTIPLE_CHOICE_TYPE && (
              <MutipleChoiceForm
                id={id}
                defaultValue={defaultQuestionAnswer?.answer}
                options={options}
                handleAnswerChange={handleAnswerChange}
                handleBtnDisable={handleBtnDisable}
              />
            )}
            {[INPUT_TYPE, TEXTAREA_TYPE].includes(type) && (
              <InputForm
                id={id}
                type={type}
                defaultValue={defaultQuestionAnswer?.answer}
                handleAnswerChange={handleAnswerChange}
                handleBtnDisable={handleBtnDisable}
              />
            )}

            {type === RATING_TYPE && (
              <RateForm
                id={id}
                defaultValue={defaultQuestionAnswer?.answer}
                handleAnswerChange={handleAnswerChange}
                handleBtnDisable={handleBtnDisable}
              />
            )}

            {type === SCALE_TYPE && options?.length > 1 && (
              <ScaleForm
                id={id}
                defaultValue={defaultQuestionAnswer?.answer}
                options={options}
                handleAnswerChange={handleAnswerChange}
                handleBtnDisable={handleBtnDisable}
              />
            )}
            {type === YESNO_TYPE && (
              <YesNoForm
                id={id}
                defaultValue={defaultQuestionAnswer?.answer}
                handleAnswerChange={handleAnswerChange}
                handleBtnDisable={handleBtnDisable}
              />
            )}
            <div className="flex items-center justify-center px-3 space-x-3">
              {nextSlide > 0 && (
                <SecondaryButton
                  title={"Previous"}
                  className="bg-gray-400"
                  onClick={() => setNextSlide(nextSlide - 1)}
                />
              )}

              {totalQuestions - 1 === nextSlide ? (
                <Popconfirm
                  title={
                    <p className="font-medium mb-0">
                      {`Are you sure you want to submit your ${
                        fromType === REVIEW_TYPE ? "review" : "survey"
                      } ?`}
                    </p>
                  }
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleSubmit(id)}
                  placement="topRight"
                  overlayClassName="max-w-sm"
                >
                  <PrimaryButton
                    disabled={
                      disableBtn ||
                      defaultDisabledValue ||
                      updateAnswerApiLoading
                    }
                    loading={updateAnswerApiLoading}
                    title={"Submit"}
                  />
                </Popconfirm>
              ) : (
                <PrimaryButton
                  title={"Next"}
                  disabled={
                    disableBtn || defaultDisabledValue || updateAnswerApiLoading
                  }
                  loading={updateAnswerApiLoading}
                  onClick={() => {
                    if (fromType === REVIEW_TYPE) {
                      handleUpdateAnswer(id);
                    } else {
                      setNextSlide(nextSlide + 1);
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
