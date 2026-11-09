// Catalogue des sources (BRIEF §8). fetched_at reste NULL jusqu'à la première ingestion.
export const sources = [
  {
    name: 'Insee — BDM (séries chronologiques)',
    url: 'https://www.insee.fr/fr/statistiques/series/',
    licence: 'Licence Ouverte 2.0',
  },
  {
    name: 'Insee — Comptes nationaux',
    url: 'https://www.insee.fr/fr/information/2018178',
    licence: 'Licence Ouverte 2.0',
  },
  { name: 'Eurostat', url: 'https://ec.europa.eu/eurostat/web/main/data/database', licence: 'CC BY 4.0' },
  {
    name: 'SDES — Sit@del2',
    url: 'https://www.statistiques.developpement-durable.gouv.fr/logements-autorises-et-commences',
    licence: 'Licence Ouverte 2.0',
  },
  {
    name: 'SSMSI — Statistiques de la délinquance',
    url: 'https://www.interieur.gouv.fr/Interstats',
    licence: 'Licence Ouverte 2.0',
  },
  { name: 'Légifrance — API PISTE', url: 'https://piste.gouv.fr/', licence: 'Licence Ouverte 2.0' },
  {
    name: 'Assemblée nationale — données ouvertes',
    url: 'https://data.assemblee-nationale.fr/',
    licence: 'Licence Ouverte 2.0',
  },
  {
    name: 'Présidence de la République — historique des présidents',
    url: 'https://www.elysee.fr/la-presidence/les-presidents-de-la-ve-republique',
    licence: null,
  },
  {
    name: 'Gouvernement — historique des Premiers ministres',
    url: 'https://www.info.gouv.fr/composition-du-gouvernement',
    licence: null,
  },
];
