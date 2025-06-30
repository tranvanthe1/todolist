// import axios from "axios";

// const tenantName = "1work";
// const siteName = "intern-data";

// export const getSiteId = async (
//   accessToken: string
// ): Promise<string> => {
//   const res = await axios.get(
//     `https://graph.microsoft.com/v1.0/sites/${tenantName}.sharepoint.com:/sites/${siteName}`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`
//       }
//     }
//   );
//   return res.data.id;
// };

// export const getDriveId = async (
//   siteId: string,
//   accessToken: string
// ): Promise<string> => {
//   const res = await axios.get(
//     `https://graph.microsoft.com/v1.0/sites/${siteId}/drives`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`
//       }
//     }
//   );

//   const drive = res.data.value.find(
//     (d: any) => d.name === "thetv"
//   );

//   if (!drive) throw new Error("Document Library 'thetv' not found");

//   return drive.id;
// };

// export const createFolderIfNotExist = async (
//   siteId: string,
//   driveId: string,
//   folderName: string,
//   accessToken: string
// ) => {
//   try {
//     await axios.post(
//       `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root/children`,
//       {
//         name: folderName,
//         folder: {},
//         "@microsoft.graph.conflictBehavior": "replace"
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );
//   } catch (error: any) {
//     if (error.response?.status !== 409) {
//       throw error;
//     }
//   }
// };

// export const uploadFileToSharePoint = async (
//   siteId: string,
//   driveId: string,
//   folderName: string,
//   file: File,
//   accessToken: string
// ): Promise<{ id: string, url: string, name: string }> => {
//   const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${folderName}/${file.name}:/content`;

//   const res = await axios.put(uploadUrl, file, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": file.type
//     }
//   });

//   return {
//     id: res.data.id,
//     name: res.data.name,
//     url: res.data.webUrl
//   };
// };


// export const deleteFolderOnSharePoint = async (
//   siteId: string,
//   driveId: string,
//   folderName: string,
//   accessToken: string
// ) => {
//   const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${folderName}`;

//   await axios.delete(url, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
// };


// export const deleteFileOnSharePoint = async (
//   siteId: string,
//   driveId: string,
//   itemId: string,
//   accessToken: string
// ) => {
//   const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/items/${itemId}`;

//   await axios.delete(url, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
// };





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


