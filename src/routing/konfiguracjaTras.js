import WidokDashboard from '../widoki/WidokDashboard';
import WidokWydatki from '../widoki/WidokWydatki';
import WidokStatystyki from '../widoki/WidokStatystyki';
import WidokWykres from '../widoki/WidokWykres';

export const konfiguracjaTras = [
  {
    sciezka: '/',
    element: WidokDashboard,
  },
  {
    sciezka: '/wydatki',
    element: WidokWydatki,
  },
  {
    sciezka: '/kategoria/:kategoria',
    element: WidokWydatki,
  },
  {
    sciezka: '/statystyki',
    element: WidokStatystyki,
  },
  {
    sciezka: '/wykres',
    element: WidokWykres,
  },
];
