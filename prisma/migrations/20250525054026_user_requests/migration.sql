-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'PAUSED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('PAUSE', 'WITHDRAW');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "UserRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "RequestType" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actedAt" TIMESTAMP(3),
    "actedBy" TEXT,

    CONSTRAINT "UserRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserRequest" ADD CONSTRAINT "UserRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
