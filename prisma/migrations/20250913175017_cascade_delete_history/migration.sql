-- DropForeignKey
ALTER TABLE "public"."BuyerHistory" DROP CONSTRAINT "BuyerHistory_buyerId_fkey";

-- AddForeignKey
ALTER TABLE "public"."BuyerHistory" ADD CONSTRAINT "BuyerHistory_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "public"."Buyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
