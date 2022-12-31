export default {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: ["./src/**/*.ts"],
  coverageThreshold: {
    global: {
      branches: 90,
      lines: 85,
      statements: 85,
    },
  },
};
