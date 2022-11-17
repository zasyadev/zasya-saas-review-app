import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import CustomModal from "./CustomModal";

export default function WelcomeModal({
  notificationModal,
  handleNotificationModalClose,
  userId,
}) {
  const [userDetails, setUserDetails] = useState({});
  const welcomeModalDataRequest = async () => {
    await httpService
      .post(`/api/report`, {
        userId: userId,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setUserDetails(response.data);
        }
      })
      .catch((err) => {
        console.error(err.response.data?.message);
      });
  };

  useEffect(() => {
    if (userId) welcomeModalDataRequest();
  }, []);

  return (
    <>
      <CustomModal
        title={false}
        visible={notificationModal}
        onCancel={() => handleNotificationModalClose()}
        footer={null}
        customFooter
        modalProps={{ wrapClassName: "view_form_modal" }}
      >
        <p>Hello </p>
      </CustomModal>
    </>
  );
}
