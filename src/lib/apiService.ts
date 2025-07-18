import { getBackendUrl } from "./config";
import * as api from "./apiPaths";

// USER
export async function createUser(data: { name: string; email: string }) {
  const backendUrl = await getBackendUrl();
  return fetch(`${backendUrl}${api.user()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateUser(id: number | string, data: { name: string; email: string }) {
  const backendUrl = await getBackendUrl();
  return fetch(`${backendUrl}${api.userById(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: number | string) {
  const backendUrl = await getBackendUrl();
  return fetch(`${backendUrl}${api.userById(id)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

// TEST SUITE
export async function createTestSuite(userId: number | string, data: any) {
  const backendUrl = await getBackendUrl();
  return fetch(`${backendUrl}${api.userTestSuites(userId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateTestSuite(userId: number | string, suiteId: number | string, data: any) {
  const backendUrl = await getBackendUrl();
  return fetch(`${backendUrl}${api.userTestSuites(userId)}${suiteId}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteTestSuite(userId: number | string, suiteId: number | string) {
  const backendUrl = await getBackendUrl();
  return fetch(`${backendUrl}${api.userTestSuites(userId)}${suiteId}/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

// TEST RUNS
export async function getTestRuns(suiteId: number | string) {
  const backendUrl = await getBackendUrl();
  return fetch(`${backendUrl}${api.testSuiteTestRuns(suiteId)}`);
}

export async function getTestRun(suiteId: number | string, runId: number | string) {
  const backendUrl = await getBackendUrl();
  return fetch(`${backendUrl}${api.testSuiteTestRun(suiteId, runId)}`);
}

export async function createTestRun(suiteId: number | string, data: any) {
  const backendUrl = await getBackendUrl();
  return fetch(`${backendUrl}${api.testSuiteCreateRun(suiteId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteTestRun(suiteId: number | string, runId: number | string) {
  const backendUrl = await getBackendUrl();
  return fetch(`${backendUrl}${api.testSuiteDeleteRun(suiteId, runId)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

// CONFIGURATIONS
export async function getConfigurations(suiteId: number | string) {
  const backendUrl = await getBackendUrl();
  return fetch(`${backendUrl}${api.testSuiteConfigurations(suiteId)}`);
}

export async function createConfiguration(suiteId: number | string, data: any) {
  const backendUrl = await getBackendUrl();
  return fetch(`${backendUrl}${api.testSuiteConfigurations(suiteId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateConfiguration(suiteId: number | string, configId: number | string, data: any) {
  const backendUrl = await getBackendUrl();
  return fetch(`${backendUrl}${api.testSuiteConfigurationById(suiteId, configId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
} 