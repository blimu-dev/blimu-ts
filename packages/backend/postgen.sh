echo "export * from './token-verifier';" >> src/index.ts
npx prettier . --write > /dev/null 2>&1 || { echo "Error: Prettier formatting failed."; exit 1; }
yarn build && echo "Build successful." || { echo "Error: Build failed."; exit 1; }
