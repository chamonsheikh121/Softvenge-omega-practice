-- CreateEnum
CREATE TYPE "SignInProvider" AS ENUM ('GOLLE', 'FACEBOOK', 'JWT');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "provider" "SignInProvider" NOT NULL DEFAULT 'JWT',
    "providerId" TEXT NOT NULL DEFAULT 'newuser',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_id_key" ON "Post"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
