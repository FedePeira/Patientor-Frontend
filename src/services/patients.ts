import axios from "axios";
import { PatientEntry, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<PatientEntry[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<PatientEntry>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

export default {
  getAll, create
};

