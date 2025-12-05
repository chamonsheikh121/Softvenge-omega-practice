/*
  Warnings:

  - The values [GOLLE] on the enum `SignInProvider` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SignInProvider_new" AS ENUM ('GOOGLE', 'FACEBOOK', 'JWT');
ALTER TABLE "public"."User" ALTER COLUMN "provider" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "provider" TYPE "SignInProvider_new" USING ("provider"::text::"SignInProvider_new");
ALTER TYPE "SignInProvider" RENAME TO "SignInProvider_old";
ALTER TYPE "SignInProvider_new" RENAME TO "SignInProvider";
DROP TYPE "public"."SignInProvider_old";
ALTER TABLE "User" ALTER COLUMN "provider" SET DEFAULT 'JWT';
COMMIT;
