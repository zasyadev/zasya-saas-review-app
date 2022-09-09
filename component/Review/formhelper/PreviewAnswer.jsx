import { Col, Row } from "antd";
import Link from "next/link";
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
            <div className="flex items-center justify-center px-3 my-6">
              {nextSlide === 0 ? (
                ""
              ) : (
                <div className="md:w-1/4 w-1/2 mx-2 ">
                  <SecondaryButton
                    onClick={() => setNextSlide(nextSlide - 1)}
                    className="px-14 py-2 text-lg text-white w-full"
                    title="Previous"
                  />
                </div>
              )}
              <div className="md:w-1/4 w-1/2 mx-2">
                {length - 1 === nextSlide ? (
                  <PrimaryButton
                    withLink={true}
                    className="rounded-md text-lg text-white w-full"
                    linkHref={"/review/received"}
                    title="Back"
                  />
                ) : (
                  <PrimaryButton
                    className="rounded-md text-lg text-white w-full"
                    title="Next"
                    onClick={() => {
                      setNextSlide(nextSlide + 1);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
