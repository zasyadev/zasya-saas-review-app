import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { userId } = req.query;

  if (req.method === "GET") {
    if (userId) {
      const userData = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      const givenData = await prisma.userApplaud.findMany({
        orderBy: {
          created_date: "desc",
        },

        where: {
          AND: [
            { created_by: userId },
            { organization_id: userData.organization_id },
          ],
        },
        include: {
          user: {
            select: {
              first_name: true,
              UserDetails: {
                select: {
                  image: true,
                },
              },
            },
          },
          created: {
            select: {
              first_name: true,
              UserDetails: {
                select: {
                  image: true,
                },
              },
            },
          },
        },
      });

      const receivedData = await prisma.userApplaud.findMany({
        orderBy: {
          created_date: "desc",
        },

        where: {
          AND: [
            { user_id: userId },
            { organization_id: userData.organization_id },
          ],
        },
        include: {
          user: {
            select: {
              first_name: true,
              UserDetails: {
                select: {
                  image: true,
                },
              },
            },
          },
          created: {
            select: {
              first_name: true,
              UserDetails: {
                select: {
                  image: true,
                },
              },
            },
          },
        },
      });

      if (receivedData && givenData) {
        return res.status(200).json({
          status: 200,
          data: {
            receivedApplaud: receivedData,
            givenApplaud: givenData,
          },
          message: "Applaud Data Received",
        });
      }

      return res.status(404).json({ status: 404, message: "No Record Found" });
    }
  } else if (req.method === "POST") {
    const { currentMonth } = req.body;
    if (userId) {
      const userData = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      const receivedData = await prisma.userApplaud.findMany({
        where: {
          AND: [
            { user_id: userId },
            { created_date: currentMonth },
            { organization_id: userData.organization_id },
          ],
        },
        include: {
          user: {
            select: {
              first_name: true,
              UserDetails: {
                select: {
                  image: true,
                },
              },
            },
          },
          created: {
            select: {
              first_name: true,
              UserDetails: {
                select: {
                  image: true,
                },
              },
            },
          },
        },
      });

      const givenData = await prisma.userApplaud.findMany({
        orderBy: {
          created_date: "desc",
        },

        where: {
          AND: [
            { created_by: userId },
            { created_date: currentMonth },
            { organization_id: userData.organization_id },
          ],
        },
        include: {
          user: {
            select: {
              first_name: true,
              UserDetails: {
                select: {
                  image: true,
                },
              },
            },
          },
          created: {
            select: {
              first_name: true,
              UserDetails: {
                select: {
                  image: true,
                },
              },
            },
          },
        },
      });

      if (receivedData && givenData) {
        return res.status(200).json({
          status: 200,
          data: {
            receivedApplaud: receivedData,
            givenApplaud: givenData,
          },
          message: "Data Received",
        });
      }

      return res.status(404).json({ status: 404, message: "No Record Found" });
    }
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
}
const functionHandle = (req, res) =>
  RequestHandler(req, res, handle, ["POST", "GET"]);

export default functionHandle;
