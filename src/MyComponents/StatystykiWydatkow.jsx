import { Box, Card, CardContent, Typography } from '@mui/material';

const formatujWalute = (kwota) =>
  new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
  }).format(Number(kwota));

function StatystykiWydatkow({ statystyki = {} }) {
  const {
    liczbaPozycji = 0,
    sumaWydatkow = 0,
    sredniaKwota = 0,
    maksymalnaKwota = 0,
    liczbaKategorii = 0,
  } = statystyki;

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
          Statystyki wydatków
        </Typography>

        <Box sx={{ display: 'grid', gap: 1.25 }}>
          <Typography>Liczba wyników: {liczbaPozycji}</Typography>
          <Typography>Suma wydatków: {formatujWalute(sumaWydatkow)}</Typography>
          <Typography>Średnia kwota: {formatujWalute(sredniaKwota)}</Typography>
          <Typography>Największy wydatek: {formatujWalute(maksymalnaKwota)}</Typography>
          <Typography>Liczba kategorii: {liczbaKategorii}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StatystykiWydatkow;
