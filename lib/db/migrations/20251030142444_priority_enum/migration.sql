-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'LOW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" DATETIME NOT NULL,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "cancelledAt" DATETIME,
    "cancellationNote" TEXT,
    "estimatedMinutes" INTEGER,
    "actualMinutes" INTEGER,
    "assignedById" TEXT,
    CONSTRAINT "Task_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("actualMinutes", "assignedById", "cancellationNote", "cancelledAt", "completedAt", "createdAt", "dueAt", "estimatedMinutes", "id", "priority", "roomId", "startedAt", "status") SELECT "actualMinutes", "assignedById", "cancellationNote", "cancelledAt", "completedAt", "createdAt", "dueAt", "estimatedMinutes", "id", "priority", "roomId", "startedAt", "status" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE INDEX "Task_roomId_status_dueAt_idx" ON "Task"("roomId", "status", "dueAt");
CREATE INDEX "Task_assignedById_status_idx" ON "Task"("assignedById", "status");
CREATE INDEX "Task_dueAt_priority_idx" ON "Task"("dueAt", "priority");
CREATE INDEX "Task_status_createdAt_idx" ON "Task"("status", "createdAt");
CREATE INDEX "Task_dueAt_status_idx" ON "Task"("dueAt", "status");
CREATE INDEX "Task_roomId_dueAt_idx" ON "Task"("roomId", "dueAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
