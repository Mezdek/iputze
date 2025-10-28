-- AlterTable
ALTER TABLE "User" ADD COLUMN "bio" TEXT;

-- CreateTable
CREATE TABLE "WeeklyActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "weekStart" DATETIME NOT NULL,
    "weekEnd" DATETIME NOT NULL,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "hotelId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WeeklyActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "WeeklyActivity_userId_weekStart_idx" ON "WeeklyActivity"("userId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyActivity_userId_weekStart_hotelId_key" ON "WeeklyActivity"("userId", "weekStart", "hotelId");
