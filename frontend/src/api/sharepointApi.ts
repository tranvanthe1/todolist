import axios from 'axios';

export const createFolderIfNotExist = (todoId: string) => {
  return axios.post(`${process.env.REACT_APP_API_BASE_URL}/sharepoint/folder/${todoId}`);
};

export const uploadFilesToSharePoint = (todoId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  return axios.post(`${process.env.REACT_APP_API_BASE_URL}/sharepoint/upload/${todoId}`, formData);
};

export const deleteFileOnSharePoint = (todoId: string, fileName: string) => {
  return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/sharepoint/file/${todoId}/${fileName}`);
};

export const deleteFolderOnSharePoint = (todoId: string) => {
  return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/sharepoint/folder/${todoId}`);
};


