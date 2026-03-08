import { Box, Typography } from '@mui/material';
import WykresWydatkow from '../MyComponents/WykresWydatkow';

function WidokWykres({ daneWykresu = [] }) {
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Typography variant="h5" component="h2">
        Wizualizacja danych
      </Typography>

      <WykresWydatkow daneWykresu={daneWykresu} />
    </Box>
  );
}

export default WidokWykres;
