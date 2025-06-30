import axios from "axios";

const API_BASE_URL = "http://localhost:3001";


export const fetchDataFromApi = async <T>(url: string): Promise<T> => {
  try {
    const { data } = await axios.get<T>(`${API_BASE_URL}${url}`);
    return data;
  } catch (error: any) {
    console.error("Fetch data error:", error);
    throw error;
  }
};


export const getDataById = async <T>(url: string): Promise<T> => {
  try {
    const { data } = await axios.get<T>(`${API_BASE_URL}${url}`);
    return data;
  } catch (error: any) {
    console.error("Get data by id error:", error);
    throw error;
  }
};


export const postData = async <T>(
  url: string,
  formData: any
): Promise<T> => {
  try {
    const { data } = await axios.post<T>(`${API_BASE_URL}${url}`, formData);
    return data;
  } catch (error: any) {
    console.error("Post data error:", error);
    throw error;
  }
};


export const editCompleted = async <T>(
  url: string,
  updatedData: any
): Promise<T> => {
  try {
    const { data } = await axios.put<T>(`${API_BASE_URL}${url}`, updatedData);
    return data;
  } catch (error: any) {
    console.error("Edit data error:", error);
    throw error;
  }
};


export const deleteData = async <T>(url: string): Promise<T> => {
  try {
    const { data } = await axios.delete<T>(`${API_BASE_URL}${url}`);
    return data;
  } catch (error: any) {
    console.error("Delete data error:", error);
    throw error;
  }
};

export const editData = async <T>(
  url: string,
  updatedData: any
): Promise<T> => {
  try {
    const { data } = await axios.put<T>(`${API_BASE_URL}${url}`, updatedData);
    return data;
  } catch (error: any) {
    console.error("Edit data error:", error);
    throw error;
  }
};
