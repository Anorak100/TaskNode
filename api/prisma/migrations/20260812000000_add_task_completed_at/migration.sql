-- Track the date a task was completed so analytics can show completion activity.
ALTER TABLE "Task" ADD COLUMN "completedAt" TIMESTAMP(3);
