// Frise du pouvoir (BRIEF §7). Dates d'entrée en fonction / de fin de mandat :
// À VALIDER AU JOUR PRÈS depuis des sources officielles avant publication (point ouvert du brief).
// Les lignes 'gouvernement' complètes et 'majorite' arrivent au Sprint 1 ; ne figurent ici
// que les Premiers ministres des trois cohabitations (cohabitation = true).
export type RegimeSeed = {
  kind: 'president' | 'gouvernement' | 'majorite';
  label: string;
  start_date: string;
  end_date: string | null;
  cohabitation: boolean;
};

export const regimes: RegimeSeed[] = [
  {
    kind: 'president',
    label: 'Giscard d’Estaing',
    start_date: '1974-05-27',
    end_date: '1981-05-21',
    cohabitation: false,
  },
  { kind: 'president', label: 'Mitterrand', start_date: '1981-05-21', end_date: '1995-05-17', cohabitation: false },
  { kind: 'president', label: 'Chirac', start_date: '1995-05-17', end_date: '2007-05-16', cohabitation: false },
  { kind: 'president', label: 'Sarkozy', start_date: '2007-05-16', end_date: '2012-05-15', cohabitation: false },
  { kind: 'president', label: 'Hollande', start_date: '2012-05-15', end_date: '2017-05-14', cohabitation: false },
  { kind: 'president', label: 'Macron', start_date: '2017-05-14', end_date: null, cohabitation: false },
  // Cohabitations : Premiers ministres de la couleur opposée à celle du président
  {
    kind: 'gouvernement',
    label: 'Chirac (cohabitation 1986—1988)',
    start_date: '1986-03-20',
    end_date: '1988-05-10',
    cohabitation: true,
  },
  {
    kind: 'gouvernement',
    label: 'Balladur (cohabitation 1993—1995)',
    start_date: '1993-03-29',
    end_date: '1995-05-18',
    cohabitation: true,
  },
  {
    kind: 'gouvernement',
    label: 'Jospin (cohabitation 1997—2002)',
    start_date: '1997-06-02',
    end_date: '2002-05-06',
    cohabitation: true,
  },
];
