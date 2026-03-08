import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { BrowserRouter, Route, Routes, useLocation, useMatch, useSearchParams } from 'react-router-dom';
import './App.css';
import PanelFiltrow from './MyComponents/AnalizatorWydatkow/PanelFiltrow';
import PanelDodawaniaWydatku from './MyComponents/AnalizatorWydatkow/PanelDodawaniaWydatku';
import { uruchomPipelineWydatkow } from './utils/pipelineWydatkow';
import Nawigacja from './MyComponents/Nawigacja';
import { konfiguracjaTras } from './routing/konfiguracjaTras';

const SCIEZKA_PLIKU_WYDATKOW = '/wydatki.json';
const KLUCZ_LOCAL_STORAGE = 'analizator_wydatkow_lista';
const FILTRY_POCZATKOWE = {
  nazwa: '',
  kategoria: 'Wszystkie',
  metodaPlatnosci: 'Wszystkie',
  minimalnaKwota: '',
  maksymalnaKwota: '',
  sortowanie: 'data',
};

const mapujSortowanieUrlNaStan = (sortowanieUrl) => {
  if (sortowanieUrl === 'kwotaMalejaco') {
    return 'kwota';
  }

  if (sortowanieUrl === 'nazwaMalejaco') {
    return 'nazwa';
  }

  if (sortowanieUrl === 'dataMalejaco' || !sortowanieUrl) {
    return 'data';
  }

  return null;
};

const mapujSortowanieStanNaUrl = (sortowanieStan) => {
  if (sortowanieStan === 'kwota') {
    return 'kwotaMalejaco';
  }

  if (sortowanieStan === 'nazwa') {
    return 'nazwaMalejaco';
  }

  return 'dataMalejaco';
};

function SynchronizacjaFiltrowURL({ filtry, onUstawFiltryZUrl }) {
  const lokalizacja = useLocation();
  const dopasowanieKategorii = useMatch('/kategoria/:kategoria');
  const [parametryWyszukiwania, setParametryWyszukiwania] = useSearchParams();
  const filtryRef = useRef(filtry);
  const pierwszyRender = useRef(true);

  filtryRef.current = filtry;

  useEffect(() => {
    if (!dopasowanieKategorii?.params?.kategoria) {
      return;
    }

    const kategoriaZParametru = dopasowanieKategorii.params.kategoria;

    if (filtryRef.current.kategoria !== kategoriaZParametru) {
      onUstawFiltryZUrl({ kategoria: kategoriaZParametru });
    }
  }, [dopasowanieKategorii, onUstawFiltryZUrl]);

  // URL → State: reaguje WYŁĄCZNIE na zmiany URL, nie na zmiany filtrów
  useEffect(() => {
    if (lokalizacja.pathname !== '/wydatki') {
      return;
    }

    const aktualizacje = {};

    const kategoriaZUrl = parametryWyszukiwania.get('kategoria') ?? parametryWyszukiwania.get('Kategoria');
    const sortowanieZUrl = mapujSortowanieUrlNaStan(parametryWyszukiwania.get('sortowanie'));
    const nazwaZUrl = parametryWyszukiwania.get('nazwa');
    const metodaZUrl = parametryWyszukiwania.get('metodaPlatnosci');
    const minKwotaZUrl = parametryWyszukiwania.get('minKwota');
    const maxKwotaZUrl = parametryWyszukiwania.get('maxKwota');

    const docelowaKategoria = kategoriaZUrl ?? FILTRY_POCZATKOWE.kategoria;
    const doceloweSortowanie = sortowanieZUrl ?? FILTRY_POCZATKOWE.sortowanie;
    const docelowaNazwa = nazwaZUrl ?? FILTRY_POCZATKOWE.nazwa;
    const docelowaMetoda = metodaZUrl ?? FILTRY_POCZATKOWE.metodaPlatnosci;
    const docelowaMinKwota = minKwotaZUrl ?? FILTRY_POCZATKOWE.minimalnaKwota;
    const docelowaMaxKwota = maxKwotaZUrl ?? FILTRY_POCZATKOWE.maksymalnaKwota;

    if (filtryRef.current.kategoria !== docelowaKategoria) {
      aktualizacje.kategoria = docelowaKategoria;
    }
    if (filtryRef.current.sortowanie !== doceloweSortowanie) {
      aktualizacje.sortowanie = doceloweSortowanie;
    }
    if (filtryRef.current.nazwa !== docelowaNazwa) {
      aktualizacje.nazwa = docelowaNazwa;
    }
    if (filtryRef.current.metodaPlatnosci !== docelowaMetoda) {
      aktualizacje.metodaPlatnosci = docelowaMetoda;
    }
    if (filtryRef.current.minimalnaKwota !== docelowaMinKwota) {
      aktualizacje.minimalnaKwota = docelowaMinKwota;
    }
    if (filtryRef.current.maksymalnaKwota !== docelowaMaxKwota) {
      aktualizacje.maksymalnaKwota = docelowaMaxKwota;
    }

    if (Object.keys(aktualizacje).length > 0) {
      onUstawFiltryZUrl(aktualizacje);
    }
  }, [lokalizacja.pathname, parametryWyszukiwania, onUstawFiltryZUrl]);

  // State → URL: reaguje WYŁĄCZNIE na zmiany filtrów, nie na zmiany URL
  useEffect(() => {
    if (pierwszyRender.current) {
      pierwszyRender.current = false;
      return;
    }

    if (lokalizacja.pathname !== '/wydatki') {
      return;
    }

    const noweParametry = new URLSearchParams();

    if (filtry.nazwa && filtry.nazwa !== FILTRY_POCZATKOWE.nazwa) {
      noweParametry.set('nazwa', filtry.nazwa);
    }

    if (filtry.kategoria && filtry.kategoria !== FILTRY_POCZATKOWE.kategoria) {
      noweParametry.set('kategoria', filtry.kategoria);
    }

    if (filtry.metodaPlatnosci && filtry.metodaPlatnosci !== FILTRY_POCZATKOWE.metodaPlatnosci) {
      noweParametry.set('metodaPlatnosci', filtry.metodaPlatnosci);
    }

    if (filtry.minimalnaKwota && filtry.minimalnaKwota !== FILTRY_POCZATKOWE.minimalnaKwota) {
      noweParametry.set('minKwota', filtry.minimalnaKwota);
    }

    if (filtry.maksymalnaKwota && filtry.maksymalnaKwota !== FILTRY_POCZATKOWE.maksymalnaKwota) {
      noweParametry.set('maxKwota', filtry.maksymalnaKwota);
    }

    if (filtry.sortowanie && filtry.sortowanie !== FILTRY_POCZATKOWE.sortowanie) {
      noweParametry.set('sortowanie', mapujSortowanieStanNaUrl(filtry.sortowanie));
    }

    setParametryWyszukiwania(noweParametry, { replace: true });
  }, [
    lokalizacja.pathname,
    setParametryWyszukiwania,
    filtry.nazwa,
    filtry.kategoria,
    filtry.metodaPlatnosci,
    filtry.minimalnaKwota,
    filtry.maksymalnaKwota,
    filtry.sortowanie,
  ]);

  return null;
}

// Normalizuje pojedynczy wydatek, aby zapewnić poprawny format danych w stanie aplikacji.
const normalizujWydatek = (wydatek, indeks) => ({
  id: wydatek?.id ?? indeks + 1,
  nazwa: String(wydatek?.nazwa ?? ''),
  kategoria: String(wydatek?.kategoria ?? 'Bez kategorii'),
  kwota: Number(wydatek?.kwota ?? 0),
  metodaPlatnosci: String(wydatek?.metodaPlatnosci ?? 'Nieznana'),
  data: String(wydatek?.data ?? ''),
});

function App() {
  const [listaWydatkow, setListaWydatkow] = useState([]);
  const [daneFabryczne, setDaneFabryczne] = useState([]);
  const [czyLadowanie, setCzyLadowanie] = useState(true);
  const [bladLadowania, setBladLadowania] = useState('');
  const [czyDaneZaladowane, setCzyDaneZaladowane] = useState(false);
  const [filtry, setFiltry] = useState(FILTRY_POCZATKOWE);

  useEffect(() => {
    // Pobiera dane wydatków z lokalnego pliku JSON po uruchomieniu aplikacji.
    const kontrolerAnulowania = new AbortController();

    const pobierzWydatki = async () => {
      setCzyLadowanie(true);
      setBladLadowania('');
      setCzyDaneZaladowane(false);

      try {
        const odpowiedz = await fetch(SCIEZKA_PLIKU_WYDATKOW, {
          signal: kontrolerAnulowania.signal,
        });

        if (!odpowiedz.ok) {
          throw new Error('Nie udało się odczytać pliku z danymi wydatków.');
        }

        const suroweDane = await odpowiedz.json();

        if (!Array.isArray(suroweDane)) {
          throw new Error('Plik JSON ma nieprawidłowy format. Oczekiwano tablicy wydatków.');
        }

        const danePoNormalizacji = suroweDane.map(normalizujWydatek);
        const daneZLocalStorage = localStorage.getItem(KLUCZ_LOCAL_STORAGE);

        let daneStartowe = danePoNormalizacji;

        if (daneZLocalStorage) {
          try {
            const sparsowane = JSON.parse(daneZLocalStorage);
            if (Array.isArray(sparsowane)) {
              daneStartowe = sparsowane.map(normalizujWydatek);
            }
          } catch {
            daneStartowe = danePoNormalizacji;
          }
        }

        if (!kontrolerAnulowania.signal.aborted) {
          setDaneFabryczne(danePoNormalizacji);
          setListaWydatkow(daneStartowe);
          setCzyDaneZaladowane(true);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        if (!kontrolerAnulowania.signal.aborted) {
          setListaWydatkow([]);
          setBladLadowania(error.message || 'Wystąpił błąd podczas ładowania danych.');
        }
      } finally {
        if (!kontrolerAnulowania.signal.aborted) {
          setCzyLadowanie(false);
        }
      }
    };

    pobierzWydatki();

    return () => {
      kontrolerAnulowania.abort();
    };
  }, []);

  useEffect(() => {
    if (czyLadowanie || bladLadowania) {
      return;
    }

    localStorage.setItem(KLUCZ_LOCAL_STORAGE, JSON.stringify(listaWydatkow));
  }, [listaWydatkow, czyLadowanie, bladLadowania]);

  const obsluzZmianeFiltru = useCallback((nazwaPola, wartosc) => {
    setFiltry((poprzednieFiltry) => ({
      ...poprzednieFiltry,
      [nazwaPola]: wartosc,
    }));
  }, []);

  const ustawFiltryZUrl = useCallback((aktualizacje) => {
    setFiltry((poprzednieFiltry) => ({
      ...poprzednieFiltry,
      ...aktualizacje,
    }));
  }, []);

  const dostepneKategorie = useMemo(
    () => [...new Set(listaWydatkow.map((wydatek) => wydatek.kategoria))],
    [listaWydatkow]
  );

  const dostepneMetodyPlatnosci = useMemo(
    () => [...new Set(listaWydatkow.map((wydatek) => wydatek.metodaPlatnosci))],
    [listaWydatkow]
  );

  const wynikiPrzetwarzania = useMemo(() => {
    const wynikPipeline = uruchomPipelineWydatkow(listaWydatkow, {
      fraza: filtry.nazwa,
      kategoria: filtry.kategoria,
      metodaPlatnosci: filtry.metodaPlatnosci,
      minimalnaKwota: filtry.minimalnaKwota === '' ? null : Number(filtry.minimalnaKwota),
      maksymalnaKwota: filtry.maksymalnaKwota === '' ? null : Number(filtry.maksymalnaKwota),
      sortujPo: filtry.sortowanie,
      kierunekSortowania: 'malejąco',
    });

    return {
      wydatki: wynikPipeline.wydatki,
      statystyki: wynikPipeline.statystyki,
      daneWykresu: wynikPipeline.daneWykresu,
      agregatyKategorii: wynikPipeline.agregatyKategorii,
      dashboard: wynikPipeline.dashboard,
    };
  }, [
    listaWydatkow,
    filtry.nazwa,
    filtry.kategoria,
    filtry.metodaPlatnosci,
    filtry.minimalnaKwota,
    filtry.maksymalnaKwota,
    filtry.sortowanie,
  ]);

  useEffect(() => {
    document.title = `Analizator wydatków (${wynikiPrzetwarzania.wydatki.length} wyników)`;
  }, [wynikiPrzetwarzania.wydatki.length]);

  const resetujFiltry = useCallback(() => {
    setFiltry(FILTRY_POCZATKOWE);
  }, []);

  const dodajWydatek = useCallback((nowyWydatek) => {
    setListaWydatkow((poprzedniaLista) => {
      const kolejneId =
        poprzedniaLista.length === 0 ? 1 : Math.max(...poprzedniaLista.map((wydatek) => wydatek.id)) + 1;

      return [...poprzedniaLista, { id: kolejneId, ...nowyWydatek }];
    });
  }, []);

  const resetujDoDanychFabrycznych = useCallback(() => {
    const kopiaDanychFabrycznych = daneFabryczne.map((wydatek) => ({ ...wydatek }));

    setListaWydatkow(kopiaDanychFabrycznych);
    setFiltry(FILTRY_POCZATKOWE);
    localStorage.removeItem(KLUCZ_LOCAL_STORAGE);
  }, [daneFabryczne]);

  const propsPaneluFiltrow = useMemo(
    () => ({
      filtry,
      onZmianaFiltru: obsluzZmianeFiltru,
      onResetujFiltry: resetujFiltry,
      kategorie: dostepneKategorie,
      metodyPlatnosci: dostepneMetodyPlatnosci,
    }),
    [
      filtry,
      obsluzZmianeFiltru,
      resetujFiltry,
      dostepneKategorie,
      dostepneMetodyPlatnosci,
    ]
  );

  const propsWidokow = useMemo(
    () => ({
      wydatki: wynikiPrzetwarzania.wydatki,
      statystyki: wynikiPrzetwarzania.statystyki,
      agregatyKategorii: wynikiPrzetwarzania.agregatyKategorii,
      daneWykresu: wynikiPrzetwarzania.daneWykresu,
      dashboard: wynikiPrzetwarzania.dashboard,
    }),
    [wynikiPrzetwarzania]
  );

  const trasyWidokow = useMemo(
    () =>
      konfiguracjaTras.map((trasa) => {
        const KomponentWidoku = trasa.element;

        return (
          <Route key={trasa.sciezka} path={trasa.sciezka} element={<KomponentWidoku {...propsWidokow} />} />
        );
      }),
    [propsWidokow]
  );

  return (
    <BrowserRouter>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Analizator wydatków osobistych
        </Typography>

        {czyLadowanie && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
              mb: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}
          >
            <CircularProgress size={22} />
            <Typography>Trwa ładowanie danych wydatków z pliku JSON...</Typography>
          </Box>
        )}

        {!czyLadowanie && bladLadowania && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Błąd ładowania danych: {bladLadowania}
          </Alert>
        )}

        {!czyLadowanie && !bladLadowania && czyDaneZaladowane && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Dane wydatków zostały poprawnie załadowane z lokalnego pliku JSON.
          </Alert>
        )}

        <SynchronizacjaFiltrowURL filtry={filtry} onUstawFiltryZUrl={ustawFiltryZUrl} />

        <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Dodawanie wydatku
          </Typography>

          <PanelDodawaniaWydatku onDodajWydatek={dodajWydatek} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" color="error" onClick={resetujDoDanychFabrycznych}>
              Resetuj do danych fabrycznych
            </Button>
          </Box>
        </Box>

        <Nawigacja />

        <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Panel filtrów
          </Typography>

          <PanelFiltrow {...propsPaneluFiltrow} />
        </Box>

        <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
          <Routes>{trasyWidokow}</Routes>
        </Box>
      </Container>
    </BrowserRouter>
  );
}

export default App;
