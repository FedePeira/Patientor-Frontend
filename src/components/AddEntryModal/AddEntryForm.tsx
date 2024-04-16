import { useState, SyntheticEvent, useEffect } from "react";

import {  TextField, InputLabel, MenuItem, Select, Grid, Button, SelectChangeEvent, Autocomplete  } from '@mui/material';

import { Diagnoses, DiagnosesCode, HospitalFormValues, OccupationalHealthCareFormValues, TypeEntry } from "../../types";

import diagnosesService from '../../services/diagnoses';

interface Props {
  onCancel: () => void;
  onSubmit: (values: HospitalFormValues | OccupationalHealthCareFormValues) => void;
}

interface TypeOption{
  value: TypeEntry;
  label: string;
}

const typeOptions: TypeOption[] = Object.values(TypeEntry).map(v => ({
  value: v, label: v.toString()
}));

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<DiagnosesCode[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnoses[]>([]);
  const [type, setType] = useState<string>('OccupationalHealthcare');
  const [formOccupationalHealthCare, setFormOccupationalHealthCare] = useState<OccupationalHealthCareFormValues>({
    description: '',
    date: '',
    specialist: '',
    diagnosisCode: [],
    employerName: '',
    sickLeave: {
      startDate: '',
      endDate: ''
    },
    type: "OccupationalHealthcare",
  });

  const [formHospital, setFormHospital] = useState<HospitalFormValues>({
    description: '',
    date: '',
    specialist: '',
    diagnosisCode: [],
    discharge: {
      date: '',
      criteria: ''
    },
    type: "Hospital",
  });

  useEffect(() => {
    const fetchDiagnosesList = async () => {
      const diagnoses = await diagnosesService.getAll();
      setDiagnoses(diagnoses);
    };

    void fetchDiagnosesList();
  }, []);

  const handleOccupationalHealthCareChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormOccupationalHealthCare(prevState => ({
       ...prevState,
       sickLeave: {
        ...prevState.sickLeave,
        [name]: value
       }
    }));
  };

  const handleHospitalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormHospital(prevState => ({
      ...prevState,
      discharge: {
        ...prevState.discharge,
        [name]: value
      }
    }));
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormOccupationalHealthCare(prevState => ({
       ...prevState,
       [name]: value
    }));

    setFormHospital(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTextOccupationalHealthCareChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormOccupationalHealthCare(prevState => ({
       ...prevState,
       [name]: value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    console.log(value);
    setType(value);
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    console.log('Entre al submit');

    switch (type) {
      case 'Hospital':
        onSubmit({
          ...formHospital
        });
        break; 
      case 'OccupationalHealthcare':
        onSubmit({
         ...formOccupationalHealthCare
        });
        break; 
      default:
    }      
     
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <TextField
          label="Date"
          placeholder="YYYY-MM-DD"
          fullWidth 
          name="date"
          value={formHospital.date && formOccupationalHealthCare.date}
          onChange={handleTextChange}
        />
        <TextField
          label="Description"
          fullWidth
          name="description"
          value={formHospital.description && formOccupationalHealthCare.description}
          onChange={handleTextChange}
        />
        <TextField
          label="Specialist"
          fullWidth
          name="specialist"
          value={formHospital.specialist && formOccupationalHealthCare.specialist}
          onChange={handleTextChange}
        />

        <Autocomplete
          multiple
          id="diagnoses-autocomplete"
          options={diagnoses}
          getOptionLabel={(option) => option.code}
          value={selectedDiagnoses}
          onChange={(event, newValue) => {
            setSelectedDiagnoses(newValue); 
            setFormOccupationalHealthCare(prevValues => ({
              ...prevValues,
              diagnosisCodes: newValue.map(diagnoses => diagnoses.code)
           }));
       
           setFormHospital(prevValues => ({
             ...prevValues,
             diagnosisCodes: newValue.map(diagnoses => diagnoses.code)
            }));        
          }}
          renderInput={(params) => <TextField {...params} label="Diagnoses" />}
        >
        </Autocomplete>

        <InputLabel style={{ marginTop: 20 }}>Type Entry</InputLabel>
        <Select
          label="Type"
          fullWidth
          value={type}
          onChange={handleSelectChange}
        >
        {typeOptions.map(option =>
          <MenuItem
            key={option.label}
            value={option.value}
          >
            {option.label
          }</MenuItem>
        )}
        </Select>
        
        {type === 'OccupationalHealthcare' && (
          <>
            <TextField
              label="Start Date"
              placeholder="YYYY-MM-DD"
              fullWidth
              name="startDate"
              value={formOccupationalHealthCare.sickLeave.startDate}
              onChange={handleOccupationalHealthCareChange}
            />
            <TextField
              label="End Date"
              placeholder="YYYY-MM-DD"
              fullWidth
              name="endDate"
              value={formOccupationalHealthCare.sickLeave.endDate}
              onChange={handleOccupationalHealthCareChange}
            />
            <TextField
              label="Employer Name"
              fullWidth
              name="employerName"
              value={formOccupationalHealthCare.employerName}
              onChange={handleTextOccupationalHealthCareChange}
            />
          </>
        )}
        {type === 'Hospital' && (
          <>
            <TextField
              label="Date of Discharge"
              fullWidth
              name="date"
              value={formHospital.discharge.date}
              onChange={handleHospitalChange}
            />
            <TextField
              label="Criteria of Discharge"
              fullWidth
              name="criteria"
              value={formHospital.discharge.criteria}
              onChange={handleHospitalChange}
            />
          </>
        )}

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;