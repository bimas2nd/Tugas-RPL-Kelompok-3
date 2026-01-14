/*
  Warnings:

  - You are about to alter the column `saldoSebelum` on the `Transaksi` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `saldoSesudah` on the `Transaksi` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE "Transaksi" ALTER COLUMN "saldoSebelum" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "saldoSesudah" SET DATA TYPE DECIMAL(12,2);
