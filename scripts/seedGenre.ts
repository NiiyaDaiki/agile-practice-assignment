import { prisma } from "@/lib/prisma";

async function main() {
  await prisma.genre.createMany({
    data: [
      { name: "データベース", order: 1 },
      { name: "アーキテクチャ", order: 2 },
      { name: "バックエンド", order: 3 },
      { name: "フロントエンド", order: 4 },
      { name: "テスト", order: 5 },
    ],
    skipDuplicates: true,   // 二重実行でも安全
  });

  console.log("✓ Genres seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());