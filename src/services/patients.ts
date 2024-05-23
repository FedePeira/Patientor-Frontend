import axios from "axios";
import { Entry, HospitalFormValues, OccupationalHealthCareFormValues, Patient, PatientFormValues } from "../types";

const apiUrl = import.meta.env.VITE_API_URL;
const baseUrl = `${apiUrl}/api`;

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${baseUrl}/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${baseUrl}/patients`,
    object
  );

  return data;
};

const createEntry = async (patientId: string, object: HospitalFormValues | OccupationalHealthCareFormValues) => {
  const { data } = await axios.post<Entry>(
    `${baseUrl}/patients/${patientId}/entries`,
    object
  );

  return data;
};

export default {
  getAll, create, createEntry
};

