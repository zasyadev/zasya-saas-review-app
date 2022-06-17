import React from "react";

import { Button, Upload, message } from "antd";
import { useState } from "react";

function UploadButton({ onSuccess }) {
  const [src, setSrc] = useState(false);
  const uploadProps = {
    name: "file",
    action: "/api/noob",
    headers: {
      authorization: "authorization-text",
    },

    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }

      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        onSuccess(info.file.name);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Upload {...uploadProps}>
      <Button shape="round">Click to Upload</Button>
    </Upload>
  );
}

export default UploadButton;
