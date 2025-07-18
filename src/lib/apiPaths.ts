export const API_PREFIX = "/v1";

export const user = () => `${API_PREFIX}/user/`;
export const userById = (id: number | string) => `${API_PREFIX}/user/${id}/`;
export const userTestSuites = (id: number | string) => `${API_PREFIX}/user/${id}/test-suite/`;
export const testSuite = (id: number | string) => `${API_PREFIX}/test-suite/${id}/`;
export const testSuiteTestRuns = (id: number | string) => `${API_PREFIX}/test-suite/${id}/test-run/filter/`;
export const testSuiteTestRun = (suiteId: number | string, runId: number | string) => `${API_PREFIX}/test-suite/${suiteId}/test-run/${runId}/`;
export const testSuiteConfigurations = (id: number | string) => `${API_PREFIX}/test-suite/${id}/configurations/`;
export const testSuiteConfigurationById = (suiteId: number | string, configId: number | string) => `${API_PREFIX}/test-suite/${suiteId}/configurations/${configId}/`;
export const testSuiteCreateRun = (id: number | string) => `${API_PREFIX}/test-suite/${id}/test-run/`;
export const testSuiteDeleteRun = (suiteId: number | string, runId: number | string) => `${API_PREFIX}/test-suite/${suiteId}/test_run/${runId}/`; 