import React from "react";
import HomeLogo from "../../assets/images/HomeLogo.png";
import DashboardSC from "../../assets/images/dashboardSC.png";
import Image from "next/image";
import { Row, Col } from "antd";

function LandingPage() {
  return (
    <>
      <div className="landing-page">
        <div className="background-image pb-10 ">
          <Row justify="space-between">
            <Col xs={24} md={6}>
              <div className="text-center my-4 cursor-pointer">
                <Image src={HomeLogo} width={130} height={40} />
              </div>
            </Col>
            <Col xs={24} md={14}>
              <div className="hidden md:flex items-center justify-between primary-color-blue text-base font-medium px-4">
                <div className="px-2 my-4">HOME</div>
                <div className="px-2 my-4">ABOUT US</div>
                <div className="px-2 my-4">FEATURES</div>
                <div className="px-2 my-4">BLOG</div>
                <div className="px-2 my-4">CONTACT US</div>
              </div>
            </Col>

            <Col xs={24} md={11}>
              <div className="md:pl-20 px-2 mt-8 ">
                <div className="text-xl md:text-4xl primary-color-blue font-bold mt-2 md:mt-4">
                  Capture feedback easily
                </div>
                <div className="text-xl md:text-4xl primary-color-blue font-bold md:mt-2">
                  Get more insights and
                </div>
                <div className="text-xl md:text-4xl primary-color-blue font-bold md:mt-2">
                  confidence
                </div>
                <div className="text-sm md:text-lg font-normal mt-2">
                  Usersnap helps you collect more product insights with in-app
                  screen captures, surveys and feature request boards. Your
                  all-in-one customer feedback software.
                </div>
                <div className="mt-4 flex">
                  <button className="toggle-btn-bg px-2 md:px-4 py-1 md:py-3 text-base md:text-xl font-medium text-white rounded-md ">
                    Get started, it’s free
                  </button>
                  <button className="primary-bg-btn px-2 md:px-4 py-1 md:py-3  text-base md:text-xl font-medium text-white rounded-md mx-2">
                    Book a Demo
                  </button>
                </div>
              </div>
            </Col>
            <Col xs={24} md={13} className="bg-group-img ">
              <div className="text-center mt-2 mx-2">
                <Image src={DashboardSC} width={650} height={450} />
              </div>
            </Col>
          </Row>
        </div>
        <Row justify="space-around">
          <Col xs={24} md={9}>
            <div className="py-6 mx-2">
              <div className="text-lg md:text-xl font-semibold primary-color-blue mt-4">
                Build surveys
              </div>
              <div className="text-lg md:text-2xl  font-semibold primary-color-blue mt-2">
                Make on-brand surveys in minutes
              </div>
              <div className="text-base md:text-lg font-medium mt-4">
                Pick from 125+ survey templates or start from scratch
              </div>
              <div className="text-base md:text-lg font-medium">
                Change colors, fonts and layouts with a visual editor Use 15
                question types including NPS, CSAT and CES Make smart surveys
                with skip logic, custom actions and redirects
              </div>
            </div>
          </Col>
          <Col xs={24} md={9}>
            <div className="flex item-center justify-center py-6 mx-2 ">
              <div className="background-color-grey h-52 w-full py-6 my-6"></div>
            </div>
          </Col>
        </Row>
        <Row justify="space-around">
          <Col md={9}>
            <div className="flex item-center justify-center py-6">
              <div className="background-color-grey h-52 w-full py-6 my-6"></div>
            </div>
          </Col>
          <Col xs={24} md={9}>
            <div className="py-6 mx-2">
              <div className="text-xl font-semibold primary-color-blue mt-6 ">
                Distribute surveys
              </div>
              <div className="text-lg md:text-2xl  font-semibold primary-color-blue mt-2">
                Run email, link, web and mobile surveys
              </div>
              <div className="text-base md:text-lg font-medium mt-4">
                Pick from 125+ survey templates or start from scratch
              </div>
              <div className="text-base md:text-lg font-medium">
                Send 1-click email-embedded surveys from your email tool Share
                link surveys on blog, social, email and more Trigger web surveys
                on any user behavior like exit intent or scroll Launch
                event-triggered mobile app surveys for iOS and Android
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={24}>
            <div className="backgroung-color-purple my-6 py-12 px-2">
              <div className="text-lg md:text-4xl font-semibold primary-color-blue text-center mt-4">
                Deliver better experiences across the customer lifecycle
              </div>
              <div className="text-base md:text-xl font-medium text-center mt-4">
                Let us handle customer experience management (CXM), so you can
                focus on accelerating your CX program.
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={24}>
            <div>
              <div className="text-xl font-semibold primary-color-blue text-center mt-6 ">
                Features
              </div>
              <div className="text-lg md:text-2xl font-semibold text-center my-4 primary-color-blue mx-2">
                Manage the customer experience at all touchpoints with one tool
              </div>
            </div>
          </Col>
          <Col xs={24} md={24}>
            <Row justify="space-around">
              <Col xs={24} md={7}>
                <div className="flex items-center justify-center my-6 mx-2">
                  <div className="background-color-grey h-64 w-64"></div>
                </div>
              </Col>
              <Col xs={24} md={7}>
                <div className="flex items-center justify-center  my-6 mx-2">
                  <div className="background-color-grey h-64 w-64"></div>
                </div>
              </Col>
              <Col xs={24} md={7}>
                <div className="flex items-center justify-center  my-6 mx-2">
                  <div className="background-color-grey h-64 w-64"></div>
                </div>
              </Col>
              <Col md={7}>
                <div className="flex items-center justify-center py-6 my-6 mx-2">
                  <div className="background-color-grey h-64 w-64"></div>
                </div>
              </Col>
              <Col xs={24} md={7}>
                <div className="flex items-center justify-center py-6 my-6 mx-2">
                  <div className="background-color-grey h-64 w-64"></div>
                </div>
              </Col>
              <Col xs={24} md={7}>
                <div className="flex items-center justify-center py-6 my-6 mx-2">
                  <div className="background-color-grey h-64 w-64"></div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="backgroung-color-purple py-8 ">
          <Col xs={24} md={24}>
            <div className="my-6">
              <div className="text-xl font-semibold primary-color-blue text-center mt-6">
                Blog
              </div>
              <div className="text-lg md:text-2xl font-semibold text-center mt-4 primary-color-blue">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </div>
            </div>
          </Col>
          <Col xs={24} md={24}>
            <Row justify="center">
              <Col xs={24} md={8}>
                <div className="flex items-center justify-center my-6">
                  <div className="background-color-grey h-64 w-64"></div>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="flex items-center justify-center my-6">
                  <div className="background-color-grey h-64 w-64"></div>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="flex items-center justify-center my-6">
                  <div className="background-color-grey h-64 w-64"></div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="background-color-grey" justify="center" align="middle">
          <Col xs={24} md={24}>
            <div className="text-center primary-color-blue mt-8 mx-2">
              <div className="text-xl md:text-4xl font-medium">
                Collect feedback,
              </div>
              <div className="md:text-4xl font-medium mt-2">
                ship better & faster
              </div>
            </div>
          </Col>
          <Col xs={24} md={24}>
            <div className="text-center text-lg md:text-xl text-gray-500 my-4 mx-2">
              Try it, it’s free, no credit card.
            </div>
          </Col>
          <Col xs={24} md={24}>
            <div className="text-center my-4 mx-2">
              <button className=" primary-bg-btn px-4 py-3 text-base font-medium text-white rounded-md">
                Start Free Trial
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default LandingPage;
