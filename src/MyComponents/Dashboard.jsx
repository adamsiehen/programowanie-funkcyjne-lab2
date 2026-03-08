import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
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

function Dashboard({ dashboard = {} }) {
  const liczbaRekordow = dashboard.liczbaRekordow ?? 0;
  const sumaWydatkow = dashboard.sumaWydatkow ?? 0;
  const najwiekszaKategoria = dashboard.najwiekszaKategoria ?? { nazwa: 'Brak danych', suma: 0 };
  const daneMiniWykresu = dashboard.daneMiniWykresu ?? [];

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Typography variant="h5" component="h2">
        Dashboard
      </Typography>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
        <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Liczba wszystkich rekordów
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {liczbaRekordow}
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Suma wydatków
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {formatujWalute(sumaWydatkow)}
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Największa kategoria
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {najwiekszaKategoria.nazwa}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatujWalute(najwiekszaKategoria.suma)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
            Mini podgląd wykresu (top 5 kategorii)
          </Typography>

          {daneMiniWykresu.length === 0 ? (
            <Typography color="text.secondary">Brak danych do podglądu wykresu.</Typography>
          ) : (
            <Box sx={{ width: '100%', height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={daneMiniWykresu} margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="kategoria" />
                  <YAxis tickFormatter={(wartosc) => `${wartosc} zł`} />
                  <Tooltip
                    formatter={(wartosc) => [formatujWalute(wartosc), 'Suma wydatków']}
                    labelFormatter={(etykieta) => `Kategoria: ${etykieta}`}
                  />
                  <Bar dataKey="suma" fill="var(--mui-palette-primary-main)" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </CardContent>
      </Card>

    </Box>
  );
}

export default Dashboard;
