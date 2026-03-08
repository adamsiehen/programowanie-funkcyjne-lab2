import { Box, Typography } from '@mui/material';
import WynikiWydatkow from '../MyComponents/WynikiWydatkow';

function WidokWydatki({ wydatki }) {
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Typography variant="h5" component="h2">
        Lista wydatków
      </Typography>

      <WynikiWydatkow wydatki={wydatki} />
    </Box>
  );
}

export default WidokWydatki;
