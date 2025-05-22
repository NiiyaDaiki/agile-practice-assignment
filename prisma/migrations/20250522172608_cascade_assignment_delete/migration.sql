-- DropForeignKey
ALTER TABLE "AssignmentProgress" DROP CONSTRAINT "AssignmentProgress_assignmentId_fkey";

-- AddForeignKey
ALTER TABLE "AssignmentProgress" ADD CONSTRAINT "AssignmentProgress_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
