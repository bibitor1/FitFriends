/*
  Warnings:

  - You are about to drop the column `trainerId` on the `trainings` table. All the data in the column will be lost.
  - Added the required column `trainer_id` to the `trainings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trainings" DROP COLUMN "trainerId",
ADD COLUMN     "trainer_id" INTEGER NOT NULL;
