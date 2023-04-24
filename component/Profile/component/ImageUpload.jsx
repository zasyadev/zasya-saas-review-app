import { PlusOutlined } from "@ant-design/icons";
import { Form, message, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import React, { useState } from "react";

const ActionURL = process.env.NEXT_PUBLIC_APP_URL + "api/profile/noop";

const getSrcFromFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => resolve(reader.result);
  });
};

const ImageUpload = ({
  category,
  fileList,
  setFileList,
  formName,
  limit = true,
  limitSize = 1,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImageButton = !isUploading ? (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload </div>
    </div>
  ) : (
    <div className="ant-upload-text">Loading... </div>
  );

  function beforeUpload(file) {
    const checkJpgOrPng =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg";
    if (!checkJpgOrPng) {
      message.error("You can only upload jpg, jpeg and png file!");
    }

    const checkFileSize = file.size < 1126400;
    if (!checkFileSize) {
      message.error(" Image must be smaller than 1Mb!");
    }

    return checkJpgOrPng && checkFileSize;
  }

  function handleChange(info) {
    if (info.file.status === "uploading") {
      setFileList(info.fileList);
      setIsUploading(false);
    }
    if (info.file.status === "removed") {
      setIsUploading(false);
      setFileList(info.fileList);
    }
    if (info.file.status === "error") {
      setIsUploading(false);
      return;
    }
    if (info.file.status === "done") {
      setFileList(info.fileList);
      setIsUploading(false);
    }
  }

  const onPreview = async (file) => {
    try {
      const src = file.url || (await getSrcFromFile(file));
      window.open(src);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form.Item className="text-center" name={formName}>
      <ImgCrop
        zoom
        rotate={false}
        shape="round"
        modalClassName="image_crop_modal"
      >
        <Upload
          name="image"
          listType="picture-card"
          fileList={fileList}
          action={ActionURL}
          onChange={handleChange}
          onPreview={onPreview}
          data={{ category: category }}
          beforeUpload={beforeUpload}
        >
          {limit
            ? fileList.length >= limitSize
              ? null
              : uploadImageButton
            : uploadImageButton}
        </Upload>
      </ImgCrop>
    </Form.Item>
  );
};

export default ImageUpload;
