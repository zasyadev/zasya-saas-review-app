import { mailService, mailTemplate } from "../../../lib/emailservice";
import {
  CustomizeSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { RequestHandler } from "../../../lib/RequestHandler";
import {
  activityTitle,
  ACTIVITY_TYPE_ENUM,
  USER_SELECT_FEILDS,
} from "../../../constants";
const BASE_URL = process.env.NEXT_APP_URL;

async function handle(req, res, prisma) {
  if (req.method === "POST") {
    try {
      const resData = req.body;
      let transactionData = {};

      if (resData.is_published === "published") {
        transactionData = await prisma.$transaction(async (transaction) => {
          let userOrgData = await transaction.user.findUnique({
            where: { id: resData.created_by },
          });

          const questionData = resData.templateData.map((item) => {
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
              options: { create: optionData },
            };
          });

          const formdata = await transaction.reviewAssignTemplate.create({
            data: {
              user: { connect: { id: resData.created_by } },
              form_title: resData.review_name,
              form_description: resData?.review_description ?? "",
              form_data: resData.templateData,
              status: true,
              questions: {
                create: questionData,
              },
            },
          });

          let dataObj = {
            review_name: resData.review_name,
            form: { connect: { id: formdata.id } },

            status: resData.status,
            frequency: resData.frequency,
            review_type: resData.review_type,
            organization: { connect: { id: userOrgData.organization_id } },
            role: { connect: { id: resData.role_id } },
            parent_id: resData.created_by,
            is_published: resData.is_published,
            template_data: resData.template_data,
          };

          if (resData.is_published === "published") {
            let assigneeData = resData.assigned_to_id.map((item) => {
              return {
                assigned_to_id: item,
              };
            });
            dataObj.created = { connect: { id: resData.created_by } };
            dataObj.ReviewAssignee = {
              create: assigneeData,
            };

            let savedData = await transaction.review.create({
              // where: { id: resData.review_id },
              data: dataObj,
            });

            return { savedData };
          } else {
            let newAssignData = [];
            let assignData = resData.assigned_to_id.forEach((item) => {
              newAssignData.push({
                ...dataObj,
                created: { connect: { id: item } },
              });
            });

            let savedData = newAssignData.map(async (item) => {
              return await prisma.review.create({
                data: item,
              });
            });
            return { savedData };
          }
        });

        if (transactionData.savedData.is_published === "published") {
          const assignedToData = await prisma.user.findMany({
            where: { id: { in: resData.assigned_to_id } },
            include: { UserDetails: true },
          });

          const assignedFromData = await prisma.user.findUnique({
            where: { id: transactionData.savedData.created_by },
          });

          assignedToData.forEach(async (user) => {
            const assigneeData = await prisma.reviewAssignee.findFirst({
              where: {
                review_id: transactionData.savedData.id,
                assigned_to_id: user.id,
              },
            });

            let notificationMessage = {
              message: `${assignedFromData.first_name} has assigned you New Review.`,
              link: `${BASE_URL}review/id/${assigneeData.id}`,
            };

            await prisma.userNotification.create({
              data: {
                user: { connect: { id: user.id } },
                data: notificationMessage,
                read_at: null,
                organization: {
                  connect: { id: assignedFromData.organization_id },
                },
              },
            });

            let activityData = {
              type: ACTIVITY_TYPE_ENUM.REVIEW,
              description: resData.review_name,
              link: `${BASE_URL}review`,
              type_id: transactionData.savedData.id,
              organization_id: assignedFromData.organization_id,
            };

            await prisma.userActivity.createMany({
              data: [
                {
                  ...activityData,
                  user_id: user.id,
                  title: activityTitle(
                    ACTIVITY_TYPE_ENUM.REVIEW,
                    assignedFromData.first_name
                  ),
                },
                {
                  ...activityData,
                  user_id: resData.created_by,
                  title: activityTitle(
                    ACTIVITY_TYPE_ENUM.REVIEWGIVEN,
                    user.first_name
                  ),
                },
              ],
            });

            if (Number(user?.UserDetails?.notification?.length) > 0) {
              if (user?.UserDetails?.notification.includes("mail")) {
                const mailData = {
                  from: process.env.SMTP_USER,
                  to: user.email,
                  subject: `New review assigned by ${assignedFromData.first_name}`,
                  html: mailTemplate({
                    body: `Will you take a moment to complete this review assigned by <b>${assignedFromData.first_name}</b>.`,
                    name: user.first_name,
                    btnLink: `${BASE_URL}review/id/${assigneeData.id}`,
                    btnText: "Get Started",
                  }),
                };

                await mailService.sendMail(mailData, function (err, info) {
                  // if (err) console.log("failed");
                  // else console.log("successfull");
                });
              }
              if (user?.UserDetails?.notification.includes("slack")) {
                if (user.UserDetails.slack_id) {
                  let customText = CustomizeSlackMessage({
                    header: "New Review Recieved",
                    user: assignedFromData.first_name ?? "",
                    link: `${BASE_URL}review/id/${assigneeData.id}`,
                    by: "Review Assigned By",
                  });
                  SlackPostMessage({
                    channel: user.UserDetails.slack_id,
                    text: `${assignedFromData.first_name} has assigned you New Review.`,
                    blocks: customText,
                  });
                }
              }
            }
          });
        }
      }
      // else {
      //   transactionData = await prisma.$transaction(async (transaction) => {
      //     let userOrgData = await transaction.user.findUnique({
      //       where: { id: resData.created_by },
      //     });

      //     let savedData = await transaction.review.create({
      //       data: {
      //         created: { connect: { id: resData.created_by } },
      //         review_name: resData.review_name,
      //         status: resData.status,

      //         review_type: resData.review_type,
      //         organization: { connect: { id: userOrgData.organization_id } },
      //         role: { connect: { id: resData.role_id } },
      //         parent_id: resData.created_by,
      //         is_published: resData.is_published,
      //         template_data: resData.template_data,
      //       },
      //     });
      //     return { savedData };
      //   });
      // }

      if (transactionData.savedData) {
        return res.status(201).json({
          message: "Review Assigned Successfully",
          data: transactionData.savedData,
          status: 200,
        });
      } else {
        return res.status(400).json({
          message: "Review Not Assign",

          status: 400,
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: "Internal Server Error",
      });
    }
  } else if (req.method === "GET") {
    try {
      const data = await prisma.review.findMany({
        include: {
          created: USER_SELECT_FEILDS,
          form: true,
          ReviewAssignee: USER_SELECT_FEILDS,
        },
      });

      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "All Data Retrieved",
        });
      }

      return res.status(404).json({ status: 404, message: "No Record Found" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      const reqBody = req.body;

      const updateReview = await prisma.review.update({
        where: { id: reqBody.id },
        data: {
          frequency: reqBody.frequency,
          modified_date: new Date(),
        },
      });

      if (!updateReview)
        return res.status(400).json({
          message: "Frequency Not Changed!",
        });

      if (updateReview?.review_parent_id) {
        await prisma.review.update({
          where: { id: updateReview.review_parent_id },
          data: {
            frequency: reqBody.frequency,
            modified_date: new Date(),
          },
        });
      }
      return res.status(200).json({
        message: "Review Frequency Changed!",
        status: 200,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    const reqBody = req.body;
    try {
      if (reqBody.id) {
        const deletaData = await prisma.review.delete({
          where: { id: reqBody.id },
        });

        prisma.$disconnect();
        if (deletaData) {
          return res.status(200).json({
            status: 200,
            message: "Assign Review Deleted Successfully.",
          });
        }
        return res.status(400).json({
          status: 400,
          message: "Failed To Delete Record.",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST", "GET", "PUT", "DELETE"],
    protectedRoute: true,
  });

export default functionHandle;
