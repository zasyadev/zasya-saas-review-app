import { validateEmail } from "../../../../helpers/validateEmail";
import { BadRequestException } from "../../../../lib/BadRequestExcpetion";
import { mailService, mailTemplate } from "../../../../lib/emailservice";
import { RequestHandler } from "../../../../lib/RequestHandler";
const BASE_URL = process.env.NEXT_APP_URL;

async function handle(req, res, prisma, user) {
  const reqBody = req.body;
  const { id: createdBy } = user;
  if (req.method === "POST") {
    try {
      let transactionData = {};
      transactionData = await prisma.$transaction(async (transaction) => {
        let userOrgData = await transaction.user.findUnique({
          where: { id: createdBy },
        });

        const questionData = reqBody.templateData.map((item) => {
          const optionData = item.options.map((opitem) => {
            if (item.type === "scale") {
              return {
                optionText: opitem.optionText,
                lowerLabel: item.lowerLabel.toString(),
                higherLabel: item.higherLabel.toString(),
              };
            } else {
              return {
                optionText: opitem.optionText,
                lowerLabel: "",
                higherLabel: "",
              };
            }
          });

          return {
            questionText: item.questionText,
            type: item.type,
            open: item.open,
            SurveyQuestionOption: { create: optionData },
          };
        });

        const channelData = {
          type: reqBody.channelType,
          isDefault: true,
          name: reqBody.survey_name,
          submission_count: 1,
          status: true,
        };

        const formdata = await transaction.survey.create({
          data: {
            created: { connect: { id: createdBy } },
            survey_name: reqBody.survey_name,
            organization: { connect: { id: userOrgData.organization_id } },
            role: { connect: { id: reqBody.role_id } },
            SurveyQuestions: {
              create: questionData,
            },
            SurveyChannels: {
              create: channelData,
            },
          },
        });

        return { formdata };
      });

      if (!transactionData || !transactionData.formdata)
        throw BadRequestException("Survey not created");

      return res.status(201).json({
        message: "Survey Created Successfully",
        data: transactionData.formdata,
      });
    } catch (error) {
      throw BadRequestException("Survey not created");
    }
  }

  if (req.method === "PUT") {
    try {
      let transactionData = {};
      transactionData = await prisma.$transaction(async (transaction) => {
        let surveyData = await transaction.survey.findUnique({
          where: { id: reqBody.surveyId },
        });

        if (reqBody.channelType === "Email") {
          let channelUserData = [];
          if (Number(reqBody.email.length) > 0) {
            channelUserData = reqBody.email.map((item) => {
              return { name: item, status: reqBody.status };
            });
          }
          const channeldata = await transaction.surveyChannels.create({
            data: {
              survey: { connect: { id: reqBody.surveyId } },
              type: reqBody.channelType,
              isDefault: false,
              name: surveyData.survey_name,
              submission_count: 1,
              url: "",
              status: true,
              SurveyChannelUser: {
                create: channelUserData,
              },
            },
          });

          const channelUsers = await transaction.surveyChannelUser.findMany({
            where: { channel_id: channeldata.id },
          });

          channelUsers.forEach(async (item) => {
            if (validateEmail(item.name)) {
              let userName =
                Number(item?.name.split("@").length) > 0
                  ? item?.name.split("@")[0]
                  : "";

              const mailData = {
                from: process.env.SMTP_USER,
                to: item.name,
                subject: `Could you spare some time for my survey?`,

                html: mailTemplate({
                  body: ` Will you take a moment to complete this survey that I have shared to you. It won't take long.`,
                  name: userName ?? "",
                  btnLink: `${BASE_URL}survey/rvc-${item.customer_url}`,
                  btnText: "Get Started",
                }),
              };

              await mailService.sendMail(mailData);
            }
          });

          return { channeldata };
        } else {
          const channeldata = await transaction.surveyChannels.create({
            data: {
              survey: { connect: { id: reqBody.surveyId } },
              type: reqBody.channelType,
              isDefault: false,
              name: surveyData.survey_name,
              submission_count: 1,
              status: true,
            },
          });
          return { channeldata };
        }
      });

      if (!transactionData.channeldata)
        throw BadRequestException("Survey channel not created");
      return res.status(201).json({
        message: "Survey Channel Created Successfully",
        data: transactionData.channeldata,
      });
    } catch (error) {
      throw BadRequestException("Survey channel not created");
    }
  }
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST", "PUT"],
    protectedRoute: true,
  });

export default functionHandle;
