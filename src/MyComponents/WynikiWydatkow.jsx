import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

const formatujWalute = (kwota) =>
  new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
  }).format(Number(kwota));

const formatujDate = (data) =>
  new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(data));

const kolorKategorii = (kategoria) => {
  if (kategoria === 'Jedzenie') {
    return 'success';
  }

  if (kategoria === 'Transport') {
    return 'info';
  }

  if (kategoria === 'Rozrywka') {
    return 'secondary';
  }

  if (kategoria === 'Rachunki') {
    return 'warning';
  }

  if (kategoria === 'Zdrowie') {
    return 'error';
  }

  return 'primary';
};

function WynikiWydatkow({ wydatki = [] }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Nazwa</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Kategoria</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Kwota
            </TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Metoda płatności</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Data</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {wydatki.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">Brak wyników dla wybranych filtrów.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            wydatki.map((wydatek) => (
              <TableRow
                key={wydatek.id}
                hover
                sx={{
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <TableCell>{wydatek.nazwa}</TableCell>
                <TableCell>
                  <Chip label={wydatek.kategoria} color={kolorKategorii(wydatek.kategoria)} size="small" />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatujWalute(wydatek.kwota)}
                </TableCell>
                <TableCell>{wydatek.metodaPlatnosci}</TableCell>
                <TableCell>{formatujDate(wydatek.data)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default WynikiWydatkow;
