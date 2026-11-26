-- CreateEnum
CREATE TYPE "PROMOTYPE" AS ENUM ('FIXED', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "PROMOTIONRULE" AS ENUM ('NEWMEMBER', 'WEEKDAY', 'DATE_RANGE');

-- CreateTable
CREATE TABLE "Promotions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PROMOTYPE" NOT NULL,
    "value" INTEGER NOT NULL,
    "rule" "PROMOTIONRULE" NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "newMembersAt" INTEGER,
    "maxDiscount" INTEGER,
    "minSubTotal" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Promotions_pkey" PRIMARY KEY ("id")
);
