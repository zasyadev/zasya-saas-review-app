import { URLS } from "../../constants/urls";
import { PrimaryButton } from "../common/CustomButton";
import CustomModal from "../common/CustomModal";
import { REVIEW_TYPE, SURVEY_TYPE } from "../Template/constants";

export function TempateSelectWrapper({
  setCreateReviewModal,
  createReviewModal,
  type = REVIEW_TYPE,
}) {
  return (
    <CustomModal
      title={`Create a ${type === SURVEY_TYPE ? "Survey" : "Review"}`}
      visible={createReviewModal}
      onCancel={() => setCreateReviewModal(false)}
      footer={false}
      customFooter
      modalProps={{
        width: 600,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4  space-x-3 ">
        <div className="flex flex-col items-center space-y-3 bg-brandGray-100 px-4 py-6 rounded-md shadow-md">
          <p className=" text-xl font-bold ">From scratch</p>
          <p className=" text-md font-semibold text-center">
            Write your own questions with the style and format you like.
          </p>
          <PrimaryButton
            withLink={true}
            linkHref={
              type === SURVEY_TYPE ? URLS.SURVEY_CREATE : URLS.REVIEW_CREATE
            }
            title={"From Scratch"}
          />
        </div>
        <div className="flex flex-col items-center space-y-3 bg-brandGray-100 px-4 py-6 rounded-md shadow-md">
          <p className=" text-xl font-bold ">From a template</p>
          <p className=" text-md font-semibold text-center">
            Save time with pre-made questions
          </p>
          <PrimaryButton
            withLink={true}
            linkHref={`${URLS.TEMPLATE_SELECT}${
              type === SURVEY_TYPE ? URLS.SURVEY : URLS.REVIEW_CREATED
            }`}
            title={"From Template"}
          />
        </div>
      </div>
    </CustomModal>
  );
}
