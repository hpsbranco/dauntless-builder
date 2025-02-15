export default {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
    moduleFileExtensions: ["js", "ts", "tsx"],
    moduleNameMapper: {
        "^@json(.*)$": "<rootDir>/src/json$1",
        "^@src(.*)$": "<rootDir>/src$1",
    },
    preset: "ts-jest",
    testEnvironment: "jsdom",
    transform: {},
};
