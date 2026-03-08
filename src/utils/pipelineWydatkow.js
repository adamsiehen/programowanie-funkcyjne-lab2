// ------------------------------
// Funkcje pomocnicze (czyste)
// ------------------------------

// Bezpiecznie zamienia wartość na liczbę.
const jakoLiczba = (wartosc, domyslna = 0) => {
  const liczba = Number(wartosc);
  return Number.isFinite(liczba) ? liczba : domyslna;
};

// Tworzy znacznik czasu z daty; dla błędnych dat zwraca null.
const jakoCzas = (data) => {
  const czas = new Date(data).getTime();
  return Number.isFinite(czas) ? czas : null;
};

// ------------------------------
// 1) Filtry
// ------------------------------

// Filtruje wydatki po fragmencie nazwy (bez rozróżniania wielkości liter).
// Funkcja jest czysta: nie modyfikuje danych wejściowych.
export const filtrujPoNazwie = (wydatki, fraza = '') => {
  const szukanaFraza = fraza.trim().toLowerCase();

  if (!szukanaFraza) {
    return [...wydatki];
  }

  return wydatki.filter((wydatek) => String(wydatek.nazwa ?? '').toLowerCase().includes(szukanaFraza));
};

// Filtruje wydatki po kategorii.
// Dla pustej wartości lub "Wszystkie" zwraca kopię tablicy wejściowej.
export const filtrujPoKategorii = (wydatki, kategoria = 'Wszystkie') => {
  if (!kategoria || kategoria === 'Wszystkie') {
    return [...wydatki];
  }

  return wydatki.filter((wydatek) => wydatek.kategoria === kategoria);
};

// Filtruje wydatki po metodzie płatności.
// Dla pustej wartości lub "Wszystkie" zwraca kopię tablicy wejściowej.
export const filtrujPoMetodziePlatnosci = (wydatki, metodaPlatnosci = 'Wszystkie') => {
  if (!metodaPlatnosci || metodaPlatnosci === 'Wszystkie') {
    return [...wydatki];
  }

  return wydatki.filter((wydatek) => wydatek.metodaPlatnosci === metodaPlatnosci);
};

// Filtruje wydatki po zakresie kwot (min / max).
// Jeżeli min lub max nie są podane, traktujemy je jako brak ograniczenia.
export const filtrujPoZakresieKwot = (wydatki, minimalnaKwota = null, maksymalnaKwota = null) => {
  const min = minimalnaKwota === null || minimalnaKwota === undefined ? -Infinity : jakoLiczba(minimalnaKwota, -Infinity);
  const max = maksymalnaKwota === null || maksymalnaKwota === undefined ? Infinity : jakoLiczba(maksymalnaKwota, Infinity);

  return wydatki.filter((wydatek) => {
    const kwota = jakoLiczba(wydatek.kwota, 0);
    return kwota >= min && kwota <= max;
  });
};

// Filtruje wydatki po zakresie dat (od / do).
// Jeżeli granice nie są podane, traktujemy je jako brak ograniczenia.
export const filtrujPoZakresieDat = (wydatki, dataOd = null, dataDo = null) => {
  const od = dataOd ? jakoCzas(dataOd) : -Infinity;
  const doDaty = dataDo ? jakoCzas(dataDo) : Infinity;

  return wydatki.filter((wydatek) => {
    const czasWydatku = jakoCzas(wydatek.data);

    if (czasWydatku === null) {
      return false;
    }

    return czasWydatku >= od && czasWydatku <= doDaty;
  });
};

// ------------------------------
// 2) Transformacje i sortowanie
// ------------------------------

// Sortuje wydatki po wskazanym polu i kierunku.
// Zawsze pracuje na kopii danych i zwraca nową tablicę.
export const sortujWydatki = (wydatki, pole = 'data', kierunek = 'malejąco') => {
  const mnoznik = kierunek === 'rosnąco' ? 1 : -1;

  return [...wydatki].sort((a, b) => {
    if (pole === 'kwota') {
      return (jakoLiczba(a.kwota, 0) - jakoLiczba(b.kwota, 0)) * mnoznik;
    }

    if (pole === 'nazwa') {
      return String(a.nazwa ?? '').localeCompare(String(b.nazwa ?? ''), 'pl') * mnoznik;
    }

    // Domyślnie sortujemy po dacie.
    return ((jakoCzas(a.data) ?? 0) - (jakoCzas(b.data) ?? 0)) * mnoznik;
  });
};

// Mapuje wydatki do formatu gotowego do prezentacji w widoku.
// Oryginalne obiekty pozostają bez zmian.
export const mapujDoWidoku = (wydatki) => {
  return wydatki.map((wydatek) => ({
    id: wydatek.id,
    nazwa: wydatek.nazwa,
    kategoria: wydatek.kategoria,
    kwota: jakoLiczba(wydatek.kwota, 0),
    metodaPlatnosci: wydatek.metodaPlatnosci,
    data: wydatek.data,
    etykieta: `${wydatek.nazwa} (${wydatek.kategoria})`,
  }));
};

// ------------------------------
// 3) Agregacje i statystyki
// ------------------------------

// Agreguje sumę wydatków w podziale na kategorie.
// Zwraca nowy obiekt, bez modyfikacji danych wejściowych.
export const agregujPoKategorii = (wydatki) => {
  return wydatki.reduce((akumulator, wydatek) => {
    const kategoria = wydatek.kategoria ?? 'Bez kategorii';
    const aktualnaSuma = akumulator[kategoria] ?? 0;

    return {
      ...akumulator,
      [kategoria]: aktualnaSuma + jakoLiczba(wydatek.kwota, 0),
    };
  }, {});
};

// Oblicza podstawowe statystyki dla przefiltrowanego zbioru wydatków.
export const obliczStatystyki = (wydatki) => {
  if (!wydatki.length) {
    return {
      liczbaPozycji: 0,
      sumaWydatkow: 0,
      sredniaKwota: 0,
      minimalnaKwota: 0,
      maksymalnaKwota: 0,
    };
  }

  const podsumowanie = wydatki.reduce(
    (akumulator, wydatek) => {
      const kwota = jakoLiczba(wydatek.kwota, 0);

      return {
        liczbaPozycji: akumulator.liczbaPozycji + 1,
        sumaWydatkow: akumulator.sumaWydatkow + kwota,
        minimalnaKwota: Math.min(akumulator.minimalnaKwota, kwota),
        maksymalnaKwota: Math.max(akumulator.maksymalnaKwota, kwota),
      };
    },
    {
      liczbaPozycji: 0,
      sumaWydatkow: 0,
      minimalnaKwota: Infinity,
      maksymalnaKwota: -Infinity,
    }
  );

  return {
    ...podsumowanie,
    sredniaKwota: podsumowanie.sumaWydatkow / podsumowanie.liczbaPozycji,
  };
};

// Zwraca liczbę kategorii na podstawie agregatów.
export const obliczLiczbeKategorii = (agregatyKategorii = {}) => {
  return Object.keys(agregatyKategorii).length;
};

// Zwraca największą kategorię (po sumie wydatków).
export const obliczNajwiekszaKategorie = (agregatyKategorii = {}) => {
  const wpisy = Object.entries(agregatyKategorii);

  if (!wpisy.length) {
    return {
      nazwa: 'Brak danych',
      suma: 0,
    };
  }

  const [nazwa, suma] = wpisy.reduce((najwieksza, aktualna) => {
    return aktualna[1] > najwieksza[1] ? aktualna : najwieksza;
  });

  return {
    nazwa,
    suma,
  };
};

// Przygotowuje mini podgląd wykresu (top N kategorii).
export const przygotujMiniWykresKategorii = (daneWykresu = [], limit = 5) => {
  return [...daneWykresu].sort((a, b) => b.suma - a.suma).slice(0, limit);
};

// Buduje dane dashboardu wyłącznie na bazie danych z pipeline.
export const obliczDaneDashboardu = (statystyki = {}, agregatyKategorii = {}, daneWykresu = []) => {
  return {
    liczbaRekordow: statystyki.liczbaPozycji ?? 0,
    sumaWydatkow: statystyki.sumaWydatkow ?? 0,
    najwiekszaKategoria: obliczNajwiekszaKategorie(agregatyKategorii),
    daneMiniWykresu: przygotujMiniWykresKategorii(daneWykresu, 5),
  };
};

// Przygotowuje dane do wykresu słupkowego w formacie:
// [{ kategoria: 'Jedzenie', suma: 123.45 }, ...]
// Implementacja oparta o reduce i bez modyfikacji danych wejściowych.
export const przygotujDaneDoWykresu = (wydatki) => {
  const sumaWKategoriach = wydatki.reduce((akumulator, wydatek) => {
    const kategoria = wydatek.kategoria ?? 'Bez kategorii';
    const aktualnaSuma = akumulator[kategoria] ?? 0;

    return {
      ...akumulator,
      [kategoria]: aktualnaSuma + jakoLiczba(wydatek.kwota, 0),
    };
  }, {});

  return Object.entries(sumaWKategoriach).map(([kategoria, suma]) => ({
    kategoria,
    suma,
  }));
};

// ------------------------------
// 4) Pipeline funkcyjny
// ------------------------------

// Uruchamia pipeline krok po kroku:
// 1) filtry
// 2) sortowanie
// 3) mapowanie do widoku
// 4) agregacje i statystyki
//
// Przyjmuje:
// - dane: tablica wydatków
// - filtry: obiekt sterujący pipeline
//
// Zwraca obiekt z wynikami, który można bezpośrednio użyć w React.
export const uruchomPipelineWydatkow = (dane = [], filtry = {}) => {
  const {
    fraza = '',
    kategoria = 'Wszystkie',
    metodaPlatnosci = 'Wszystkie',
    minimalnaKwota = null,
    maksymalnaKwota = null,
    dataOd = null,
    dataDo = null,
    sortujPo = 'data',
    kierunekSortowania = 'malejąco',
  } = filtry;

  const krok1 = filtrujPoNazwie(dane, fraza);
  const krok2 = filtrujPoKategorii(krok1, kategoria);
  const krok3 = filtrujPoMetodziePlatnosci(krok2, metodaPlatnosci);
  const krok4 = filtrujPoZakresieKwot(krok3, minimalnaKwota, maksymalnaKwota);
  const krok5 = filtrujPoZakresieDat(krok4, dataOd, dataDo);
  const krok6 = sortujWydatki(krok5, sortujPo, kierunekSortowania);
  const krok7 = mapujDoWidoku(krok6);
  const agregatyKategorii = agregujPoKategorii(krok6);
  const statystykiBazowe = obliczStatystyki(krok6);
  const daneWykresu = przygotujDaneDoWykresu(krok6);
  const liczbaKategorii = obliczLiczbeKategorii(agregatyKategorii);
  const statystyki = {
    ...statystykiBazowe,
    liczbaKategorii,
  };
  const dashboard = obliczDaneDashboardu(statystyki, agregatyKategorii, daneWykresu);

  return {
    wydatki: krok6,
    wydatkiDoWidoku: krok7,
    agregatyKategorii,
    statystyki,
    daneWykresu,
    dashboard,
  };
};
