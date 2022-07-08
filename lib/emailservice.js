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

export const mailTemplate = (body) => {
  const BASE = process.env.NEXT_APP_URL;

  let emailHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />



    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&display=swap"
      rel="stylesheet"
    />
    <style>
      body,
      * {
        font-family: "Montserrat", sans-serif;
      }
      .container{
        max-width: 1140px;
        width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
      }
      .row{
        display: flex;
        display: -webkit-box;
        flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
      }
      .col-md-8{
        -webkit-box-flex: 0;
    -ms-flex: 0 0 66.666667%;
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
    position: relative;
    width: 100%;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
      }
      .w-100 {
        width: 100%!important;
    }

      .heading {
        height: 50px;
        background-color: #0f123f;
        width: 100%;
        padding: 20px 0;
      }
      .icon-footer-wrapper{
        height: 50px;
        background-color: #0f123f;
        padding: 20px 0;
        width: 100%;
      }
      .icon-footer {          
        width:90px;  
        margin-left: auto!important;
        margin-right: auto!important;
        display: flex;
        justify-content: center;
        align-items: center; 
      }
      .icon-footer p {
        width:14px;
        color: #8f98b1;
        margin: 0 10px;
        font-size: 20px;
      }
      .heading p {
        font-size: 20px;
        font-weight: 600;
        color: #f8f9fa;
        text-align: center
      }
      .text-center {
        text-align: center;
      }
      .color-blue {
        color: #0f123f;
      }
      .color-black {
        color: #000;
      }
      .img-wrapper{
        width:244px;
        margin-bottom: 1.5rem;
        margin-top: 1.5rem;
        margin-left: auto!important;
        margin-right: auto!important;
        -webkit-box-pack: center!important;
        -ms-flex-pack: center!important;
        justify-content: center!important;
        display: -webkit-box!important;
    display: -ms-flexbox!important;
    display: flex!important;
      }
      .img-wrapper img{
        width:244px;}
      .text-wrapper{
        margin-left: auto!important;
        margin-right: auto!important;
        margin-bottom: 1.5rem!important;
        width: 75%!important;
      }
      .text-wrapper p{


        font-size: 14px;
        
      }
      .text-justify{
        text-align: justify;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="w-100">
            <div class="heading">
              <p class="text-light text-center">Review App</p>
            </div>
            <div class="img-wrapper">
              <img src="${BASE}media/images/mail.png" />
            </div>
            <div class="text-wrapper">
              <p class="text-justify">
              ${body}
              </p>
            </div>
            <div class="text-wrapper">
              <p class="color-blue  text-center">
                © Email Generator. All rights reserved.
              </p>
              <p class="color-blue  text-center">
                If you have any questions please contact us
                [hello@zasyasolutions.com]
              </p>
              
              <p class="color-blue  text-center">
                Unsubscribe
              </p>
            </div>
            <div class="icon-footer-wrapper">
            <div class="icon-footer">
           
            <p>
            <img src="${BASE}media/images/facebook-f.png" />
          </p>
          <p>
          <img src="${BASE}media/images/twitter.png" />
          </p>
          <p>
          <img src="${BASE}media/images/linkedin.png" />
          </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
  return emailHtml;
};
