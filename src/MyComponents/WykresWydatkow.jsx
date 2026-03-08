import { Box, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const formatujWalute = (kwota) =>
  new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
  }).format(Number(kwota));

function WykresWydatkow({ daneWykresu = [] }) {
  if (!daneWykresu.length) {
    return <Typography color="text.secondary">Brak danych do wyświetlenia na wykresie.</Typography>;
  }

  return (
    <Box sx={{ width: '100%', height: 380 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={daneWykresu}
          margin={{ top: 16, right: 24, left: 8, bottom: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="kategoria" label={{ value: 'Kategorie', position: 'insideBottom', offset: -10 }} />
          <YAxis tickFormatter={(wartosc) => `${wartosc} zł`} label={{ value: 'Suma wydatków', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(wartosc) => [formatujWalute(wartosc), 'Suma wydatków']}
            labelFormatter={(etykieta) => `Kategoria: ${etykieta}`}
          />
          <Legend formatter={() => 'Suma wydatków'} />
          <Bar dataKey="suma" name="Suma wydatków" fill="var(--mui-palette-primary-main)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default WykresWydatkow;
