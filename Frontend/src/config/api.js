"use client";

export const API_BASE_URL = "http://localhost:8080/api/v1";

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,

  // Surat Keluar endpoints
  SURAT_KELUAR_ADD: `${API_BASE_URL}/surat-keluar`,
  SURAT_KELUAR_GET_ALL: `${API_BASE_URL}/surat-keluar`,
  SURAT_KELUAR_GET_BY_ID: (id) => `${API_BASE_URL}/surat-keluar/${id}`,
  SURAT_KELUAR_UPDATE: (id) => `${API_BASE_URL}/surat-keluar/${id}`,
  SURAT_KELUAR_DELETE: (id) => `${API_BASE_URL}/surat-keluar/${id}`,
  SURAT_KELUAR_TEMPLATES: `${API_BASE_URL}/surat-keluar/templates`,
  SURAT_KELUAR_BY_STATUS: `${API_BASE_URL}/surat-keluar/status`,

  // Surat Masuk endpoints
  SURAT_MASUK_ADD: `${API_BASE_URL}/surat-masuk`,
  SURAT_MASUK_GET_ALL: `${API_BASE_URL}/surat-masuk`,
  SURAT_MASUK_GET_BY_ID: (id) => `${API_BASE_URL}/surat-masuk/${id}`,
  SURAT_MASUK_UPDATE: (id) => `${API_BASE_URL}/surat-masuk/${id}`,
  SURAT_MASUK_DELETE: (id) => `${API_BASE_URL}/surat-masuk/${id}`,
  SURAT_MASUK_BY_STATUS: `${API_BASE_URL}/surat-masuk/status`,

  // Arsip Surat endpoints
  ARSIP_SURAT_ADD: `${API_BASE_URL}/arsip-surat`,
  ARSIP_SURAT_GET_ALL: `${API_BASE_URL}/arsip-surat`,
  ARSIP_SURAT_GET_BY_ID: (id) => `${API_BASE_URL}/arsip-surat/${id}`,
  ARSIP_SURAT_UPDATE: (id) => `${API_BASE_URL}/arsip-surat/${id}`,
  ARSIP_SURAT_DELETE: (id) => `${API_BASE_URL}/arsip-surat/${id}`,
  ARSIP_SURAT_BY_TYPE: `${API_BASE_URL}/arsip-surat/tipe`,
  // Sekretaris specific endpoints (for role-based features)
  SEKRETARIS: {
    PERMOHONAN_SURAT_GET_ALL: `${API_BASE_URL}/surat-keluar`,
    PERMOHONAN_SURAT_UPDATE_STATUS: (id) => `${API_BASE_URL}/surat-keluar/${id}`,
    PERMOHONAN_SURAT_GET_BY_ID: (id) => `${API_BASE_URL}/surat-keluar/${id}`,
    PERMOHONAN_SURAT_DELETE: (id) => `${API_BASE_URL}/surat-keluar/${id}`,
    SURAT_KELUAR_CREATE: `${API_BASE_URL}/surat-keluar`,
    SURAT_KELUAR_GET_ALL: `${API_BASE_URL}/surat-keluar`,
    SURAT_KELUAR_UPDATE: (id) => `${API_BASE_URL}/surat-keluar/${id}`,
    SURAT_KELUAR_DELETE: (id) => `${API_BASE_URL}/surat-keluar/${id}`,
  }
};

export const getHeaders = (isFormData = false) => {
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  
  headers["Accept"] = "application/json";

  // Add JWT token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};
