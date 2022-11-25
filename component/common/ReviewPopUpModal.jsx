import { CloseOutlined } from "@ant-design/icons";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { getReviewPopupTime, setReviewPopupTime } from "../../lib/utils";
import { PrimaryButton } from "./CustomButton";
import CustomModal from "./CustomModal";

export default function ReviewPopUpModal({ userId }) {
  const [notificationModal, setNotificationModal] = useState(false);

  const getUserWeeklyReviews = async (userId) => {
    await httpService
      .post("/api/user/getweeklyreivewscount", { userId })
      .then(({ data: response }) => {
        if (response.status === 200 && response?.count === 0) {
          setNotificationModal(true);
          setReviewPopupTime(moment());
        }
      })
      .catch((err) => {});
  };

  const getUserWeeklyReviewCount = () => {
    if (userId) {
      const reviewPopupTime = getReviewPopupTime();
      const todayDate = moment();
      if (reviewPopupTime && todayDate.diff(reviewPopupTime, "days") < 3)
        return;

      getUserWeeklyReviews(userId);
    }
  };

  const handleReviewModalClose = () => {
    setNotificationModal(false);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      getUserWeeklyReviewCount();
    }, 1000);
    return () => clearTimeout(timerId);
  }, [userId]);
  return (
    <>
      <CustomModal
        title={false}
        visible={notificationModal}
        onCancel={() => handleReviewModalClose()}
        footer={null}
        customFooter
        modalProps={{ wrapClassName: "view_form_modal" }}
      >
        <div className="relative">
          <CloseOutlined
            className="text-primary absolute top-0 right-0 text-lg z-40"
            onClick={() => handleReviewModalClose()}
          />
          <div className="w-56 h-56 md:w-72 md:h-72 mx-auto relative">
            <Image
              src="/media/images/review.webp"
              layout="fill"
              alt="reivew img"
            />
          </div>

          <h3 className="text-lg md:text-xl text-center font-bold -tracking-wider">
            Did you tried to get a feedback from your peers
          </h3>
          <p className="text-base text-center font-medium -tracking-wider mb-0">
            It will help you to enhance your performance.
          </p>
          <p className="text-base text-center font-medium -tracking-wider mb-0">
            {`Let's`} get some feedback.
          </p>
          <div className="mt-4 text-center">
            <PrimaryButton
              withLink={true}
              linkHref="/review?create=true"
              className="mr-2 lg:mx-4 rounded my-1"
              title="Create a Review"
              onClick={() => handleReviewModalClose()}
            />
          </div>
        </div>
      </CustomModal>
    </>
  );
}
