import Link from "next/link";
import React from "react";
import { Row, Col } from "antd";

export function PreviewAnswer({ item, nextSlide, setNextSlide, length }) {
  return (
    <div className="my-auto answer-bg  ">
      <Row justify="center">
        <Col xs={20} md={18}>
          <div className=" bg-white rounded-md shadow-md px-2 py-2 mt-8 sm:mt-15 md:my-10">
            <div className="text-xl font-bold text-red-400 mt-5 px-2 text-center">
              {item.questionText}
            </div>
            <div className="text-lg primary-color-blue mt-5 text-center px-2">
              {item.option}
            </div>
            <div className="flex items-center justify-center px-3 my-6">
              {nextSlide === 0 ? (
                ""
              ) : (
                <div className="md:w-1/4 w-1/2 mx-2 ">
                  <button
                    className="primary-bg-btn rounded-md text-lg text-white py-2 w-full"
                    onClick={() => {
                      setNextSlide(nextSlide - 1);
                    }}
                  >
                    Previous
                  </button>
                </div>
              )}
              <div className="md:w-1/4 w-1/2 mx-2">
                {length - 1 === nextSlide ? (
                  <Link href="/review/received">
                    <button className="toggle-btn-bg rounded-md text-lg text-white py-2    w-full ">
                      Back
                    </button>
                  </Link>
                ) : (
                  <button
                    className="toggle-btn-bg rounded-md text-lg text-white py-2    w-full "
                    onClick={() => {
                      setNextSlide(nextSlide + 1);
                    }}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
