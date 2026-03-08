import { Box, Button, MenuItem, Select, TextField } from '@mui/material';

function PanelFiltrow({
  filtry,
  onZmianaFiltru,
  onResetujFiltry,
  kategorie = [],
  metodyPlatnosci = [],
}) {
  const {
    nazwa = '',
    kategoria = 'Wszystkie',
    metodaPlatnosci = 'Wszystkie',
    minimalnaKwota = '',
    maksymalnaKwota = '',
    sortowanie = 'data',
  } = filtry;

  return (
    <Box sx={{ display: 'grid', gap: 2.5 }}>
      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
        <TextField
          label="Wyszukiwanie po nazwie"
          value={nazwa}
          onChange={(event) => onZmianaFiltru('nazwa', event.target.value)}
          fullWidth
        />

        <Select
          value={kategoria}
          onChange={(event) => onZmianaFiltru('kategoria', event.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="Wszystkie">Wszystkie kategorie</MenuItem>
          {kategorie.map((elementKategorii) => (
            <MenuItem key={elementKategorii} value={elementKategorii}>
              {elementKategorii}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={metodaPlatnosci}
          onChange={(event) => onZmianaFiltru('metodaPlatnosci', event.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="Wszystkie">Wszystkie metody płatności</MenuItem>
          {metodyPlatnosci.map((elementMetody) => (
            <MenuItem key={elementMetody} value={elementMetody}>
              {elementMetody}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={sortowanie}
          onChange={(event) => onZmianaFiltru('sortowanie', event.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="data">Sortuj po dacie</MenuItem>
          <MenuItem value="kwota">Sortuj po kwocie</MenuItem>
          <MenuItem value="nazwa">Sortuj po nazwie</MenuItem>
        </Select>

        <TextField
          type="number"
          label="Minimalna kwota"
          value={minimalnaKwota}
          onChange={(event) => onZmianaFiltru('minimalnaKwota', event.target.value)}
          inputProps={{ min: 0, step: 0.01 }}
          fullWidth
        />

        <TextField
          type="number"
          label="Maksymalna kwota"
          value={maksymalnaKwota}
          onChange={(event) => onZmianaFiltru('maksymalnaKwota', event.target.value)}
          inputProps={{ min: 0, step: 0.01 }}
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onResetujFiltry} sx={{ minHeight: 40, minWidth: 170 }}>
          Resetuj filtry
        </Button>
      </Box>
    </Box>
  );
}

export default PanelFiltrow;
