/*
  Warnings:

  - You are about to drop the column `uploadedBy` on the `Image` table. All the data in the column will be lost.
  - Added the required column `uploaderId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "deletedBy" TEXT,
    "exif" JSONB,
    CONSTRAINT "Image_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Image_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Image_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("deletedAt", "deletedBy", "exif", "id", "taskId", "uploadedAt", "url") SELECT "deletedAt", "deletedBy", "exif", "id", "taskId", "uploadedAt", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE INDEX "Image_taskId_idx" ON "Image"("taskId");
CREATE INDEX "Image_deletedAt_idx" ON "Image"("deletedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
