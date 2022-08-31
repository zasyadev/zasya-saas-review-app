const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.role.createMany({
    data: [
      {
        name: "SuperAdmin",
      },
      {
        name: "Admin",
      },
      {
        name: "Manager",
      },
      {
        name: "Member",
      },
    ],
  });

  const applaud = await prisma.applaudCategory.createMany({
    data: [
      {
        name: "Initiator",
        about: "The one who proposes, suggests, defines.",
      },
      {
        name: "Informer",
        about:
          "The one who offers facts, expresses feelings and gives opinions.",
      },
      {
        name: "Clarifier",
        about: "The one who interprets, defines and clarifies everything.",
      },
      {
        name: "Summarizer",
        about: "The one who links, restates, concludes, and summarizes.",
      },
      {
        name: "Reality Tester",
        about: "The one which provides critical analysis.",
      },
      {
        name: "Information seekers",
        about: "The one who gives information and data.",
      },
      {
        name: "Harmonizers ",
        about: "The one who limits tension and reconciles disagreements.",
      },
      {
        name: "Gatekeeper ",
        about: "The one who ensures participation by all.",
      },
      {
        name: "Consensus Tester",
        about: "The one who analyzes the decision-making process.",
      },
      {
        name: "Encourager ",
        about: " The one who is warm, responsive, active, shows acceptance.",
      },
      {
        name: "Compromiser ",
        about: " The one who admits error, limits conflict.",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
