import { Col, Row } from "antd";
import React from "react";
import { PrimaryButton, SecondaryButton } from "../../common/CustomButton";

export function PreviewAnswer({ item, nextSlide, setNextSlide, length }) {
  return (
    <div className="my-auto answer-bg  ">
      <Row justify="center">
        <Col xs={20} md={18}>
          <div className=" bg-white rounded-md shadow-md px-2 py-2 mt-8 sm:mt-15 md:my-10">
            <div className="text-xl font-bold text-red-400 mt-5 px-2 text-center">
              {item.questionText}
            </div>
            <div className="text-lg text-primary mt-5 text-center px-2">
              {item.option}
            </div>
            <div className="flex items-center justify-center px-3 my-6 space-x-3">
              {nextSlide === 0 ? (
                ""
              ) : (
                <SecondaryButton
                  onClick={() => setNextSlide(nextSlide - 1)}
                  className="bg-gray-400"
                  title="Previous"
                />
              )}

              {length - 1 === nextSlide ? (
                <PrimaryButton
                  withLink={true}
                  className=""
                  linkHref={"/review/received"}
                  title="Back"
                />
              ) : (
                <PrimaryButton
                  className=""
                  title="Next"
                  onClick={() => {
                    setNextSlide(nextSlide + 1);
                  }}
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
