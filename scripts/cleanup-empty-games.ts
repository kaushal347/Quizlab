import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Checking for broken games (games with 0 questions)...");

    // Find games with 0 questions
    const brokenGames = await prisma.game.findMany({
        where: {
            questions: {
                none: {},
            },
        },
        include: {
            _count: {
                select: { questions: true },
            },
        },
    });

    console.log(`Found ${brokenGames.length} broken games.`);

    if (brokenGames.length === 0) {
        console.log("✅ No broken games found!");
        return;
    }

    // Delete them
    console.log("🗑 Deleting broken games...");
    const { count } = await prisma.game.deleteMany({
        where: {
            id: {
                in: brokenGames.map((g) => g.id),
            },
        },
    });

    console.log(`✅ Successfully deleted ${count} broken games.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
