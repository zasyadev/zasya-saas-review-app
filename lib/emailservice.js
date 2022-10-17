const nodemailer = require("nodemailer");

export const mailService = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  secure: true,
});

export const mailTemplate = ({ body, name, btnLink = "", btnText = "" }) => {
  let emailHtml = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&display=swap"
      rel="stylesheet"
    />
    <style type="text/css" rel="stylesheet" media="all">
      body {
        width: 100% !important;
        height: 100%;
        margin: 0;
        -webkit-text-size-adjust: none;
    
        color: #000000;
        font-family: "Montserrat", sans-serif;
      }
      .body-wrapper{
        background-color: #f3f3fc !important;
        height:100%;
      }
      a {
        color: #3869d4;
      }
      a img {
        border: none;
      }

      p {
        color: #000000;
        margin: 0 0 1.1875em;
        font-size: 16px;
        line-height: 1.625;
      }

      .w-full {
        width: 100% !important;
      }

      .text-center {
        text-align: center;
      }

      .img-wrapper {
        width: 100%;
        text-align: center;
      }
      .img-wrapper img {
        width: 100px;
        margin: 2rem 0;
      }
      .text-wrapper {
        margin:0 auto !important;
      }
      .text-wrapper p {
        font-size: 14px;
      }

      .unsubscribe-p {
        padding: 15px 25px;
        cursor: pointer;
        color: #10123f;
        text-decoration: underline;
      }
      .h-full {
        height: 100%;
      }
      .text-base {
        font-size: 16px;
      }
      .box-wrapper {
        width: 570px;
        margin: 0 auto;
        padding: 0;
        background-color: #ffffff;
      }
      .p-45 {
        padding: 45px;
      }
      .text-black {
        color: #000000;
      }
      .footer-wrapper {
        width: 570px;
        margin: 0 auto;
        padding: 25px 10px;
        text-align: center;
        color: #000000;
     
      }
      .reserve-p {   
        font-size: 14px;
        line-height: 1.625;
        color: #a8aaaf;
        text-align: center;
      }
      .link-btn{
            padding: 8px 16px;
    background-color: #10123f;
    color: #fff !important;
    border-radius: 5px;
    text-decoration:none;
    font-size:14px;
    display: inline-block;
      }
      .btn-wrapper{
        text-align:center;
        width:100%;
      }
    </style>
  </head>
  <body>
  <div class="body-wrapper">
    <div class="img-wrapper">
      <img src=""${process.env.NEXT_APP_URL}media/images/mail/mail.png"" />
    </div>
    <div class="box-wrapper">
      <div class="w-100 p-45">
        <div class="text-wrapper">
          <p class="text-black">
            <b> Hello ${name} </b>
          </p>
          <p class="">${body}</p>
          ${
            btnText
              ? `<div class="btn-wrapper">
              <a href="${btnLink}" class="link-btn">${btnText}</a>
            </div>`
              : ""
          }
        </div>
      </div>
    </div>
    <div class="footer-wrapper">
      <div class="text-center">
        <p class="reserve-p">© 2022 Review App. All rights reserved.</p>
      </div>
    </div>
    </div>
  </body>
</html>
`;
  return emailHtml;
};
