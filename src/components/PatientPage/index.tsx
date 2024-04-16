import { Patient, Entry, Diagnoses, HospitalFormValues, OccupationalHealthCareFormValues } from "../../types";
import { useParams } from "react-router-dom";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import diagnosesService from "../../services/diagnoses";
import { useEffect, useState } from "react";
import EntryDetail from "../EntryDetailsPage";
import { Button } from "@mui/material";
import AddEntryModal from "../AddEntryModal";
import patientService from '../../services/patients';
import axios from "axios";

interface Props {
  patients : Patient[],
}

const PatientPage = ({ patients } : Props ) => {
  const id = useParams().id;
  const patient = patients.find(n => n.id === String(id));

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [entries, setEntries] = useState<Entry[]>([]);

  const openModal = (): void => setModalOpen(true);

  const [diagnosesDetails, setDiagnosesDetails] = useState<{ [key: string]: Diagnoses }>({});

  useEffect(() => {
    const loadDiagnoses = async () => {
      const details: { [key: string]: Diagnoses } = {};
      if(patient) {
        for (const dCode of patient.entries.flatMap(e => e.diagnosisCode || [])) {
          const diagnosis = await diagnosesService.findById(dCode);
          if (diagnosis) {
            details[dCode] = diagnosis;
          }
        }
        setDiagnosesDetails(details);
      }
    };

    if (patient) {
      loadDiagnoses();
    }
  }, [patient]); 

  if(!patient) {
    return null;
  }

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: HospitalFormValues | OccupationalHealthCareFormValues) => {
    try {
      console.log('Agregando un nuevo entry al patient: ' + patient.id);
      const entry = await patientService.createEntry(patient.id, values);
      setEntries(entries.concat(entry));
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return(
    <div>
      <h2> {patient.name}  
        {(() => {
            switch (patient.gender) {
              case 'female':
                return <FemaleIcon />;
              case 'male':
                return <MaleIcon />;
              case 'other':
                return null; 
              default:
                return null;
            }
        })()} 
      </h2>
      <div>Date Birth: {patient.dateOfBirth} </div>
      <div>Ocuppation: {patient.occupation} </div>
      <h2>Entries</h2>
      {patient.entries.map((e: Entry) => {
        return <EntryDetail key={e.id} entry={e} diagnosesDetails={diagnosesDetails} />;
      })} 

      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />

      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default PatientPage;
