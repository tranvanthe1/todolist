
import axios from 'axios';

const API_BASE_URL = "http://localhost:3001";

export const createFolderIfNotExist = (todoId: string) => {
  return axios.post(`${API_BASE_URL}/sharepoint/folder/${todoId}`);
};

export const uploadFileToSharePoint = (todoId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_BASE_URL}/sharepoint/upload/${todoId}`, formData);
};

export const deleteFileOnSharePoint = (todoId: string, fileName: string) => {
  return axios.delete(`${API_BASE_URL}/sharepoint/file/${todoId}/${fileName}`);
};

export const deleteFolderOnSharePoint = (todoId: string) => {
  return axios.delete(`${API_BASE_URL}/sharepoint/folder/${todoId}`);
};


