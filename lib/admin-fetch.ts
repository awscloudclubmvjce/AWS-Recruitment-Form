"use client";

import { demoAdminToken } from "@/lib/demo-admin";

export function isClientDemoAdminEnabled() {
  return true;
}

export function setDemoAdminSession() {
  window.localStorage.setItem("demo-admin-token", demoAdminToken);
}

export function clearDemoAdminSession() {
  window.localStorage.removeItem("demo-admin-token");
}

export function hasDemoAdminSession() {
  return isClientDemoAdminEnabled() && window.localStorage.getItem("demo-admin-token") === demoAdminToken;
}

export async function getAdminHeaders() {
  return { Authorization: `Bearer ${demoAdminToken}` };
}
