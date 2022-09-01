import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { userId } = req.query;

  if (req.method === "GET") {
    if (userId) {
      const givenData = await prisma.userApplaud.findMany({
        orderBy: [
          {
            created_date: "desc",
          },
        ],
        where: { created_by: userId },
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
        orderBy: [
          {
            created_date: "desc",
          },
        ],
        where: { user_id: userId },
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
      const receivedData = await prisma.userApplaud.findMany({
        where: { AND: [{ user_id: userId }, { created_date: currentMonth }] },
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
        orderBy: [
          {
            created_date: "desc",
          },
        ],
        where: {
          AND: [{ created_by: userId }, { created_date: currentMonth }],
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

export default (req, res) => RequestHandler(req, res, handle, ["POST", "GET"]);
