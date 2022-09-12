import { Modal } from "antd";
import React from "react";
import { PrimaryButton, SecondaryButton } from "./CustomButton";

const CustomModal = ({
  title,
  visible,
  className = "",
  onSubmit,
  onCancel,
  children,
  cancelText = "Cancel",
  submitText = "Submit",
  submitBtnProps,
  modalProps,
  footer = null,
  customFooter = false,
  hideSubmitBtn = false,
}) => {
  return (
    <Modal
      title={
        title ? (
          <p className="text-white text-base xl:text-lg">{title}</p>
        ) : null
      }
      className={`${className}`}
      visible={visible}
      onCancel={() => onCancel()}
      footer={
        customFooter
          ? footer
          : [
              <SecondaryButton
                title={cancelText}
                className=""
                onClick={() => onCancel()}
                key="cancel-btn"
              />,

              !hideSubmitBtn && (
                <PrimaryButton
                  key="submit-btn"
                  title={submitText}
                  className="ml-4"
                  onClick={() => onSubmit()}
                  type="submit"
                  {...submitBtnProps}
                />
              ),
            ]
      }
      {...modalProps}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
