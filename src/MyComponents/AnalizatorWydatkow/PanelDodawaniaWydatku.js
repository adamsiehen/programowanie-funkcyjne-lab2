import { Box, Button, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';

const formularzPoczatkowy = {
  nazwa: '',
  kategoria: 'Jedzenie',
  kwota: '',
  metodaPlatnosci: 'Karta',
  data: new Date().toISOString().slice(0, 10),
};

function PanelDodawaniaWydatku({ onDodajWydatek }) {
  const [formularz, setFormularz] = useState(formularzPoczatkowy);

  const aktualizujPole = (pole) => (event) => {
    setFormularz((poprzedniFormularz) => ({
      ...poprzedniFormularz,
      [pole]: event.target.value,
    }));
  };

  const obsluzDodanie = (event) => {
    event.preventDefault();

    if (!formularz.nazwa.trim() || Number(formularz.kwota) <= 0 || !formularz.data) {
      return;
    }

    onDodajWydatek({
      nazwa: formularz.nazwa.trim(),
      kategoria: formularz.kategoria,
      kwota: Number(formularz.kwota),
      metodaPlatnosci: formularz.metodaPlatnosci,
      data: formularz.data,
    });

    setFormularz((poprzedniFormularz) => ({
      ...formularzPoczatkowy,
      data: poprzedniFormularz.data,
    }));
  };

  return (
    <Box component="form" onSubmit={obsluzDodanie} sx={{ display: 'grid', gap: 2.5 }}>
      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' } }}>
        <TextField label="Nazwa" value={formularz.nazwa} onChange={aktualizujPole('nazwa')} fullWidth required />

        <Select value={formularz.kategoria} onChange={aktualizujPole('kategoria')} fullWidth>
          <MenuItem value="Jedzenie">Jedzenie</MenuItem>
          <MenuItem value="Transport">Transport</MenuItem>
          <MenuItem value="Rozrywka">Rozrywka</MenuItem>
          <MenuItem value="Rachunki">Rachunki</MenuItem>
          <MenuItem value="Zakupy">Zakupy</MenuItem>
          <MenuItem value="Zdrowie">Zdrowie</MenuItem>
        </Select>

        <TextField
          type="number"
          label="Kwota"
          value={formularz.kwota}
          onChange={aktualizujPole('kwota')}
          inputProps={{ min: 0.01, step: 0.01 }}
          fullWidth
          required
        />

        <Select value={formularz.metodaPlatnosci} onChange={aktualizujPole('metodaPlatnosci')} fullWidth>
          <MenuItem value="Gotówka">Gotówka</MenuItem>
          <MenuItem value="Karta">Karta</MenuItem>
          <MenuItem value="Online">Online</MenuItem>
        </Select>

        <TextField
          type="date"
          label="Data"
          value={formularz.data}
          onChange={aktualizujPole('data')}
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained">
          Dodaj wydatek
        </Button>
      </Box>
    </Box>
  );
}

export default PanelDodawaniaWydatku;
