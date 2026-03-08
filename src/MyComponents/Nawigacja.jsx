import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';

const elementyNawigacji = [
  { etykieta: 'Dashboard', sciezka: '/' },
  { etykieta: 'Wydatki', sciezka: '/wydatki' },
  { etykieta: 'Statystyki', sciezka: '/statystyki' },
  { etykieta: 'Wykres', sciezka: '/wykres' },
];

function Nawigacja() {
  const lokalizacja = useLocation();

  const czyAktywny = (sciezka) => {
    if (sciezka === '/') {
      return lokalizacja.pathname === '/';
    }

    return lokalizacja.pathname.startsWith(sciezka);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        p: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
          Nawigacja
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {elementyNawigacji.map((element) => {
            const aktywny = czyAktywny(element.sciezka);

            return (
              <Button
                key={element.sciezka}
                component={NavLink}
                to={element.sciezka}
                variant={aktywny ? 'contained' : 'outlined'}
                color={aktywny ? 'primary' : 'inherit'}
                sx={{ minWidth: 130 }}
              >
                {element.etykieta}
              </Button>
            );
          })}
        </Box>
      </Stack>
    </Paper>
  );
}

export default Nawigacja;
