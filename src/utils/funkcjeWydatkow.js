// Filtruje wydatki po fragmencie nazwy (bez rozróżniania wielkości liter).
// Zwraca nową tablicę i nie modyfikuje danych wejściowych.
export const filtrujPoNazwie = (wydatki, fraza = '') => {
  const szukanaFraza = fraza.trim().toLowerCase();

  if (!szukanaFraza) {
    return [...wydatki];
  }

  return wydatki.filter((wydatek) => wydatek.nazwa.toLowerCase().includes(szukanaFraza));
};

// Filtruje wydatki po kategorii.
// Dla wartości "Wszystkie" (lub pustej) zwraca kopię całej tablicy.
export const filtrujPoKategorii = (wydatki, kategoria = 'Wszystkie') => {
  if (!kategoria || kategoria === 'Wszystkie') {
    return [...wydatki];
  }

  return wydatki.filter((wydatek) => wydatek.kategoria === kategoria);
};

// Filtruje wydatki po metodzie płatności.
// Dla wartości "Wszystkie" (lub pustej) zwraca kopię całej tablicy.
export const filtrujPoMetodziePlatnosci = (wydatki, metodaPlatnosci = 'Wszystkie') => {
  if (!metodaPlatnosci || metodaPlatnosci === 'Wszystkie') {
    return [...wydatki];
  }

  return wydatki.filter((wydatek) => wydatek.metodaPlatnosci === metodaPlatnosci);
};

// Filtruje wydatki po minimalnej kwocie tylko wtedy, gdy filtr jest aktywny.
// Dzięki temu checkbox może dynamicznie zawężać listę bez modyfikacji oryginalnych danych.
export const filtrujPoMinimalnejKwocie = (wydatki, minimalnaKwota = 0, aktywnyFiltr = false) => {
  if (!aktywnyFiltr) {
    return [...wydatki];
  }

  return wydatki.filter((wydatek) => wydatek.kwota >= minimalnaKwota);
};

// Sortuje wydatki po wybranym polu i kierunku.
// Ważne: najpierw tworzy kopię tablicy, aby nie modyfikować oryginału.
export const sortujWydatki = (wydatki, pole = 'data', kierunek = 'malejąco') => {
  const posortowane = [...wydatki].sort((a, b) => {
    let porownanie = 0;

    if (pole === 'kwota') {
      porownanie = a.kwota - b.kwota;
    } else if (pole === 'nazwa') {
      porownanie = a.nazwa.localeCompare(b.nazwa, 'pl');
    } else {
      porownanie = new Date(a.data).getTime() - new Date(b.data).getTime();
    }

    return kierunek === 'rosnąco' ? porownanie : -porownanie;
  });

  return posortowane;
};

// Oblicza podstawowe statystyki na bazie reduce.
// Zwraca m.in. sumę, średnią, minimum, maksimum i sumy per kategoria.
export const obliczStatystyki = (wydatki) => {
  const statystykiPoczatkowe = {
    liczbaPozycji: 0,
    sumaWydatkow: 0,
    sredniaKwota: 0,
    minimalnaKwota: 0,
    maksymalnaKwota: 0,
    sumaWKategoriach: {},
  };

  if (!wydatki.length) {
    return statystykiPoczatkowe;
  }

  const wynik = wydatki.reduce(
    (akumulator, wydatek) => {
      const sumaWKategorii = (akumulator.sumaWKategoriach[wydatek.kategoria] ?? 0) + wydatek.kwota;

      return {
        liczbaPozycji: akumulator.liczbaPozycji + 1,
        sumaWydatkow: akumulator.sumaWydatkow + wydatek.kwota,
        minimalnaKwota: Math.min(akumulator.minimalnaKwota, wydatek.kwota),
        maksymalnaKwota: Math.max(akumulator.maksymalnaKwota, wydatek.kwota),
        sumaWKategoriach: {
          ...akumulator.sumaWKategoriach,
          [wydatek.kategoria]: sumaWKategorii,
        },
      };
    },
    {
      liczbaPozycji: 0,
      sumaWydatkow: 0,
      minimalnaKwota: Infinity,
      maksymalnaKwota: -Infinity,
      sumaWKategoriach: {},
    }
  );

  return {
    ...wynik,
    sredniaKwota: wynik.sumaWydatkow / wynik.liczbaPozycji,
  };
};
