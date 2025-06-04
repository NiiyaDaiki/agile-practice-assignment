-- CreateTable
CREATE TABLE "GenreAccess" (
    "userId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GenreAccess_pkey" PRIMARY KEY ("userId", "genreId")
);

-- AddForeignKey
ALTER TABLE "GenreAccess" ADD CONSTRAINT "GenreAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GenreAccess" ADD CONSTRAINT "GenreAccess_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
