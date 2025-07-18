//export const API_PREFIX = "/v1";

export const user = () => `/user/`;
export const userById = (id: number | string) => `/user/${id}/`;
export const userTestSuites = (id: number | string) => `/user/${id}/test-suite/`;
export const testSuite = (id: number | string) => `/test-suite/${id}/`;
export const testSuiteTestRuns = (id: number | string) => `/test-suite/${id}/test-run/filter/`;
export const testSuiteTestRun = (suiteId: number | string, runId: number | string) => `/test-suite/${suiteId}/test-run/${runId}/`;
export const testSuiteConfigurations = (id: number | string) => `/test-suite/${id}/configurations/`;
export const testSuiteConfigurationById = (suiteId: number | string, configId: number | string) => `/test-suite/${suiteId}/configurations/${configId}/`;
export const testSuiteCreateRun = (id: number | string) => `/test-suite/${id}/test-run/`;
export const testSuiteDeleteRun = (suiteId: number | string, runId: number | string) => `/test-suite/${suiteId}/test_run/${runId}/`; 