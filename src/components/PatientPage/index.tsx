import { PatientEntry, Entry, DiagnosesEntry } from "../../types";
import { useParams } from "react-router-dom";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import diagnosesService from "../../services/diagnoses";
import { useEffect, useState } from "react";

interface Props {
  patients : PatientEntry[],
}

const PatientPage = ({ patients } : Props ) => {
  const id = useParams().id;
  const patient = patients.find(n => n.id === String(id));

  const [diagnosesDetails, setDiagnosesDetails] = useState<{ [key: string]: DiagnosesEntry }>({});

  useEffect(() => {
    const loadDiagnoses = async () => {
      const details: { [key: string]: DiagnosesEntry } = {};
      if(patient) {
        for (const dCode of patient.entries.flatMap(e => e.diagnosisCodes || [])) {
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
      {patient.entries.map((e: Entry, index: number) => {
        return (
          <div key={index}>
            <div> {e.date} {e.description} </div>
            {(e.diagnosisCodes || []).length > 0 ? 
             <ul>
              {Object.values(diagnosesDetails).map(d => 
                <li key={d.code}>
                  {d.code} {d.name}
                </li>
              )}
             </ul>
             :
             <h3>No entries found</h3>
            }
          </div> 
        );
      })} 
    </div>
  );
};

export default PatientPage;
