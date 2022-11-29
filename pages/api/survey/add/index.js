import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  try {
    const reqBody = req.body;
    let transactionData = {};
    transactionData = await prisma.$transaction(async (transaction) => {
      let userOrgData = await transaction.user.findUnique({
        where: { id: reqBody.created_by },
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

      const formdata = await transaction.survey.create({
        data: {
          created: { connect: { id: reqBody.created_by } },
          survey_name: reqBody.survey_name,
          organization: { connect: { id: userOrgData.organization_id } },
          role: { connect: { id: reqBody.role_id } },
          status: reqBody.status,
          SurveyQuestions: {
            create: questionData,
          },
        },
      });

      return { formdata };
    });

    if (transactionData.formdata) {
      return res.status(201).json({
        message: "Survey Created Successfully",
        data: transactionData.formdata,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Survey Not Created",

        status: 400,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error,
      message: "Internal Server Error",
    });
  }
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);
export default functionHandle;
