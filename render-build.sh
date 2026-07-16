set -o errexit

echo "===== Node Version ====="
node -v

echo "===== NPM Version ====="
npm -v

echo "===== NODE_ENV ====="
echo $NODE_ENV

echo "===== Installing Dependencies ====="
npm install

echo "===== Express ====="
npm ls express

echo "===== @types/express ====="
npm ls @types/express

echo "===== TypeScript ====="
npm ls typescript

echo "===== Building Project ====="
npm run build

echo "===== Prisma Generate ====="
npx prisma generate

echo "===== Prisma Migrate ====="
npx prisma migrate deploy