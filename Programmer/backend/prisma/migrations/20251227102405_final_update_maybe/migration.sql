-- AlterTable
ALTER TABLE "Transaksi" ADD COLUMN     "saldoSebelum" DECIMAL(65,30),
ADD COLUMN     "saldoSesudah" DECIMAL(65,30),
ADD COLUMN     "validatedAt" TIMESTAMP(3);
