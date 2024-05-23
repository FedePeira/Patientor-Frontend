import axios from "axios";
import { Diagnoses } from "../types";

const apiUrl = import.meta.env.VITE_API_URL;
const baseUrl = `${apiUrl}/api`;

const getAll = async () => {
  const { data } = await axios.get<Diagnoses[]>(
    `${baseUrl}/diagnoses`
  );

  return data;
};

const findById = async (code: string) => {
  try {
    const { data } = await axios.get<Diagnoses>(`${baseUrl}/diagnoses/${code}`);
    return data;
  } catch (error) {
    console.error(`Error fetching diagnosis with ID ${code}:`, error);
    throw error;
  } 
};

export default {
  getAll,
  findById
};

