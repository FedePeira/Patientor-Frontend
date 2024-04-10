export interface DiagnosesEntry {
  code: string;
  name: string;
  latin?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseEntry{
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<DiagnosesEntry['code']>;
}

export interface PatientEntry {
  id: string,
  name: string,
  dateOfBirth: string,
  ssn: string,
  gender: Gender,
  occupation: string, 
  entries: Entry[]
}

export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other'
}

export type NonDiagnosesEntry = Omit<DiagnosesEntry,  'latin'>;

export type NonPatientsEntry = Omit<PatientEntry, 'ssn'>;

export type NewPatientEntry = Omit<PatientEntry, 'id' | 'entries'>;

interface OccupationalHealthCareEntry extends BaseEntry{
  type: "OccupationalHealthcare";
  employerName: string,
  sickLeave?: SickLeave
}

interface SickLeave {
  startDate: string,
  endDate: string
}

interface HospitalEntry extends BaseEntry{
  type: "Hospital",
  discharge: Discharge
} 

interface Discharge {
  date: string,
  criteria: string
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthCareEntry;

export type PatientFormValues = Omit<PatientEntry, "id" | "entries">;