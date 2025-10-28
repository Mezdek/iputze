/*
  Warnings:

  - You are about to drop the `WeeklyActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "WeeklyActivity_userId_weekStart_hotelId_key";

-- DropIndex
DROP INDEX "WeeklyActivity_userId_weekStart_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WeeklyActivity";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AssignmentImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assignmentId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "deletedBy" TEXT,
    "exif" JSONB,
    CONSTRAINT "AssignmentImage_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssignmentImage_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AssignmentImage_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AssignmentImage" ("assignmentId", "id", "uploadedAt", "uploadedBy", "url") SELECT "assignmentId", "id", "uploadedAt", "uploadedBy", "url" FROM "AssignmentImage";
DROP TABLE "AssignmentImage";
ALTER TABLE "new_AssignmentImage" RENAME TO "AssignmentImage";
CREATE INDEX "AssignmentImage_assignmentId_idx" ON "AssignmentImage"("assignmentId");
CREATE INDEX "AssignmentImage_deletedAt_idx" ON "AssignmentImage"("deletedAt");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "timezone" TEXT NOT NULL DEFAULT 'UTC'
);
INSERT INTO "new_User" ("avatarUrl", "createdAt", "deletedAt", "email", "id", "name", "notes", "passwordHash", "timezone", "updatedAt") SELECT "avatarUrl", "createdAt", "deletedAt", "email", "id", "name", "notes", "passwordHash", "timezone", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
