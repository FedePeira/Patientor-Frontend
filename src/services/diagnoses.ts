import axios from "axios";
import { DiagnosesEntry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<DiagnosesEntry[]>(
    `${apiBaseUrl}/diagnoses`
  );

  return data;
};

const findById = async (code: string) => {
  try {
    const { data } = await axios.get<DiagnosesEntry>(`${apiBaseUrl}/diagnoses/${code}`);
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

