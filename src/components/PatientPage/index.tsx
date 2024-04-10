import { PatientEntry, Entry } from "../../types";
import { useParams } from "react-router-dom";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

interface Props {
  patients : PatientEntry[]
}

const PatientPage = ({ patients } : Props ) => {
  const id = useParams().id;
  const patient = patients.find(n => n.id === String(id));
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
      {patient.entries.map((e: Entry) => {
        return (
          <div>
            <div> {e.date} {e.description} </div>
            {(e.diagnosisCodes || []).length > 0 ? 
             <ul>
             {e.diagnosisCodes?.map(d => <li> {d} </li>)}
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
