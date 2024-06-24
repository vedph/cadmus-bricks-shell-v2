module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setupJest.ts"],
  moduleNameMapper: {
    "@myrmidon/mnemosyne-(.*)":
      "<rootDir>/projects/myrmidon/mnemosyne-$1/src/public-api.ts",
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
