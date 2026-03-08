import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import StatystykiWydatkow from '../MyComponents/StatystykiWydatkow';

const formatujWalute = (kwota) =>
  new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
  }).format(Number(kwota));

function WidokStatystyki({ statystyki, agregatyKategorii = {} }) {
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Typography variant="h5" component="h2">
        Statystyki i agregacje
      </Typography>

      <StatystykiWydatkow statystyki={statystyki} />

      <Box>
        <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
          Agregacje po kategorii
        </Typography>

        <List dense>
          {Object.entries(agregatyKategorii).map(([kategoria, suma]) => (
            <ListItem key={kategoria} disableGutters>
              <ListItemText primary={`${kategoria}: ${formatujWalute(suma)}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default WidokStatystyki;
