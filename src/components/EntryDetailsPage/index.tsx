import { Box, Typography } from "@mui/material";
import { Diagnoses, Entry } from "../../types";
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import MedicationIcon from '@mui/icons-material/Medication';

interface Props {
  entry: Entry,
  diagnosesDetails: { [key: string]: Diagnoses }
}

const EntryDetail =({ entry, diagnosesDetails }: Props ) => { 

  const renderEntryDetails = () => {
    switch (entry.type) {
      case 'Hospital':
        return (
          <Box>
            <MedicalInformationIcon />
            <Typography variant="h5">Detalles de la revisión de salud</Typography>
            <Typography variant="h6">Diagnosis: </Typography>
            {(entry.diagnosisCodes || []).length > 0 ? 
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
          </Box>
        );
      case 'OccupationalHealthcare':
        return (
          <Box>
            <MedicationIcon />
            <Typography variant="h5">Detalles de la medicación</Typography>
            <Typography>EmployerName: {entry.employerName} </Typography>
            <Typography variant="h6">Diagnosis: </Typography>
            {(entry.diagnosisCodes || []).length > 0 ? 
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
          </Box>
        );
      default:
        return <Typography>Tipo de entrada desconocido</Typography>;
    }
 };

 return (
    <div>
      <div style={{ border: '1px solid', borderColor: 'divider', borderRadius: '4px', padding: '16px', marginBottom: '16px' }}>
        <Typography variant="h5">{entry.date}</Typography>
        <Typography>Description: {entry.description}</Typography>
        <Typography>Specialist: {entry.specialist}</Typography>
        {renderEntryDetails()}
      </div>
    </div>
 );
};

export default EntryDetail;
