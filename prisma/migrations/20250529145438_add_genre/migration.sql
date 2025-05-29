-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "genreId" TEXT;

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;
