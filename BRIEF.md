# BRIEF — REPÈRES (nom de travail)

Site de données publiques qui compare l'état de la France selon les périodes de pouvoir. Ce document est la source de vérité pour construire le projet. Le design est décrit dans `DESIGN.md`, les écrans dans `mockups/` (sources) et `html/` (export statique).

## 1. Idée

Les discours politiques à la télévision s'appuient trop souvent sur des idéologies plutôt que sur des faits. Le site récupère des données officielles (Insee, Eurostat, Dares, SDES, SSMSI…) et les affiche en les superposant à la chronologie du pouvoir, secteur par secteur : chômage, logement, pouvoir d'achat, dette, sécurité, immigration.

## 2. Objectif

- Permettre à n'importe qui de voir ce que disent les séries officielles, période de pouvoir après période de pouvoir.
- Être crédible auprès de lecteurs de tous bords : méthode affichée, sources liées, limites explicites.
- Ne pas chercher à donner raison à un camp. L'objectif est la vérité, y compris quand elle est nuancée ou contredit une intuition.

## 3. Règles éditoriales (non négociables)

1. **Aucun score global**, aucune note « meilleur / pire ».
2. **Aucune couleur associée à un camp** : les périodes de pouvoir sont des bandes grises alternées, avec le nom du président en monospace. Pas de bleu/rouge gauche/droite.
3. **Décalage des effets paramétrable** (0 à 5 ans) : une politique met 2 à 5 ans à produire ses effets.
4. **Contexte extérieur affiché** : comparaison à la zone euro ou à l'Allemagne, repères pour les crises (2008, Covid, Ukraine).
5. **Définition de « au pouvoir » explicite** : trois lectures, au choix du lecteur : président, gouvernement (Premier ministre), majorité. Les cohabitations sont signalées (hachures).
6. **Chaque chiffre renvoie à sa source** (organisme, série, date de récupération) et à sa définition officielle.
7. **Ruptures de série** (changement de méthode de mesure) signalées : on ne relie pas les points de part et d'autre.
8. **Pas de corrélation sur un même graphe** entre deux séries sans lien causal établi (par exemple part d'immigrés et chômage).
9. **Sources partisanes** (think tanks de tout bord) : affichées à côté des sources institutionnelles, avec leur méthode et les critiques connues, jamais seules.

## 4. Périmètre v1

Pages (voir `html/`) :

| Page | Fichier | Contenu |
|---|---|---|
| Accueil / synthèse | `index.html` | Indicateurs clés, graphe chômage avec frise, grille des secteurs, aperçu immigration, méthode |
| Secteur Chômage | `chomage.html` | Contrôles (série, lecture, comparaison, décalage), graphe principal, tableau par exécutif, repères (décisions, contexte), limites |
| Secteur Immigration | `immigration.html` | Définitions (immigré, étranger, descendant), graphe avec rupture de série, 4 questions à deux colonnes |
| Méthode et sources | `methode.html` | Principes, chaîne de traitement, modèle de données, catalogue d'indicateurs, glossaire |

Pages secteur supplémentaires, déjà maquettées sur le même modèle que Chômage (même gabarit, même sélecteur « Autres secteurs » en haut de page) :

| Page | Fichier | Particularités |
|---|---|---|
| Secteur 02 Logement | `logement.html` | Mises en chantier, repères SRU 2000, Alur 2014, Élan 2018 |
| Secteur 03 Pouvoir d'achat | `pouvoirachat.html` | Axe avec ligne zéro, colonne « Cumul », mesures de 2016 à 2018 |
| Secteur 04 Dette et déficit | `dette.html` | Séries dette, déficit, dépenses, prélèvements ; Maastricht 1992, LOLF 2001, TSCG 2012 |
| Secteur 05 Sécurité | `securite.html` | Faits constatés et enquête de victimation en second tracé ; limites propres à la statistique administrative |

Sur l'accueil, chaque carte de secteur est un lien vers sa page. Tous les tracés et chiffres de ces pages sont des espaces réservés.

Hors périmètre v1 : comptes utilisateurs, commentaires, prédictions, tout classement.

## 5. Stack technique

- **Monorepo** (workspaces).
- **Base** : PostgreSQL.
- **Front** : Next.js (App Router), composants serveur qui interrogent directement Postgres (pas d'API dédiée). Rendu statique/ISR quand c'est possible : les données changent au mieux chaque mois.
- **Ingestion** : Python, orchestré par Apache Airflow (un DAG par source ou par secteur) qui normalise et charge dans Postgres.
  - Remarque : pour quelques dizaines de séries à rythme mensuel ou annuel, Airflow est surdimensionné (scheduler, webserver, base de métadonnées). C'est un choix assumé pour visualiser les flux et monter en compétence ; Dagster, Prefect ou un simple cron restent des alternatives plus légères si la maintenance pèse.
- **Graphiques** : Observable Plot ou ECharts, avec bandes de pouvoir en arrière-plan.
- **Design** : voir `DESIGN.md` (blueprint technique, tricolore sobre, monospace, repères d'angle).

Structure suggérée :

```
/apps/web            Next.js
/packages/db         schéma SQL, migrations, requêtes typées
/packages/ui         composants (Frame, KeyFigure, TimelineChart…)
/pipelines           Python + Airflow (dags/, plugins/, tests/)
/mockups             sources des maquettes (.dc.html)
/html                export statique des maquettes (référence visuelle)
```

## 6. Modèle de données

Schéma de départ (à affiner) :

```sql
CREATE TABLE source (
  id serial PRIMARY KEY,
  name text NOT NULL,
  url text NOT NULL,
  licence text,
  fetched_at timestamptz
);

CREATE TABLE regime (            -- frise du pouvoir
  id serial PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('president','gouvernement','majorite')),
  label text NOT NULL,
  start_date date NOT NULL,
  end_date date,                 -- NULL = en cours
  cohabitation boolean NOT NULL DEFAULT false
);

CREATE TABLE indicator (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  unit text NOT NULL,
  sector text NOT NULL,
  frequency text NOT NULL,
  definition_url text,
  source_id int REFERENCES source(id)
);

CREATE TABLE observation (
  indicator_id int REFERENCES indicator(id),
  period date NOT NULL,
  geo text NOT NULL DEFAULT 'FR',
  value numeric NOT NULL,
  series_break boolean NOT NULL DEFAULT false,
  PRIMARY KEY (indicator_id, period, geo)
);

CREATE TABLE decision (          -- lois, ordonnances, repères de contexte
  id serial PRIMARY KEY,
  decided_on date NOT NULL,
  kind text NOT NULL CHECK (kind IN ('decision','contexte')),
  title text NOT NULL,
  sector text,
  legifrance_ref text,
  source_id int REFERENCES source(id)
);
```

## 7. Chronologie du pouvoir (jeu de départ, à valider au jour près)

Présidents : Giscard d'Estaing (mai 1974), Mitterrand (mai 1981), Chirac (mai 1995), Sarkozy (mai 2007), Hollande (mai 2012), Macron (mai 2017). Cohabitations : 1986—1988, 1993—1995, 1997—2002. Les dates exactes (investiture, nomination des Premiers ministres, changements de majorité) sont à saisir depuis des sources officielles et à citer.

## 8. Sources et catalogue

| Indicateur | Source | Fréquence |
|---|---|---|
| Taux de chômage (BIT) | Insee, BDM | Trimestrielle |
| Chômage, zone euro | Eurostat | Mensuelle |
| Logements autorisés | SDES, Sit@del2 | Mensuelle |
| Revenu disponible par unité de consommation | Insee, comptes nationaux | Annuelle |
| Dette publique, % du PIB | Insee, Eurostat | Trimestrielle |
| Part des immigrés et des étrangers | Insee | Annuelle |
| Personnes mises en cause, par nationalité | SSMSI | Annuelle |
| Lois et ordonnances | Légifrance (API PISTE) | Continue |
| Textes et votes | data.assemblee-nationale.fr | Continue |

Les identifiants de séries (idbank Insee, codes Eurostat) sont à renseigner à l'ingestion.

## 9. Section Immigration : cadrage

Formulée par questions, pas par thèse. Chaque question affiche deux colonnes (ce que disent les études ou statistiques, et leurs réserves ou résultats divergents) et une ligne « Pourquoi les résultats diffèrent ».

Faits de départ relevés dans les sources (à re-vérifier à l'ingestion) :

- **Population (Insee, 2025, données provisoires)** : 8,0 millions d'immigrés (11,6 %), 6,3 millions d'étrangers (9,1 %). Part d'immigrés de 7,4 % en 1975, stable jusqu'à la fin des années 1990. **Rupture de série en 2024** : 10,7 % → 11,3 % entre les recensements 2023 et 2024 (+0,6 point), soit +0,3 point (+198 000) à méthode constante (note méthodologique Insee du 4 juin 2026).
- **Finances publiques** : le CEPII (Chojnicki, Ragot, Sokhna) conclut que l'immigration n'a jamais déterminé l'évolution du solde primaire sur 1979—2011 ; l'OCDE juge l'impact net proche de zéro ; l'OID avance 40 Md€ nets par an, chiffre contesté (dépenses collectives incluses). Afficher les trois avec leur méthode.
- **Emploi et salaires** : la plupart des études ne trouvent pas d'effet moyen ; pour la France, le CEPII (Edo et Toubal, 2014) estime qu'une hausse de 10 % de la part d'immigrés dans une classe de compétence réduit d'environ 3 % le taux d'emploi des natifs comparables.
- **Délinquance** : en 2021, 7,7 % de la population et 19 % des mis en cause pour délinquance générale (ministère de l'Intérieur). Réserves : mis en cause n'est pas condamné ; définitions de « étranger » différentes entre Insee et SSMSI ; infractions liées au séjour ; statistiques par nationalité, pas par statut d'immigré.

Pièges à afficher : immigré ≠ étranger ≠ descendant ; rupture de série 2024 ; pas de graphe croisant part d'immigrés et chômage ou dette.

## 10. Plan de livraison

1. **Sprint 0** : monorepo, Postgres local (Docker), migrations du schéma, table `regime` remplie, `source` renseignée.
2. **Sprint 1 (Chômage de bout en bout)** : DAG Insee (chômage) + Eurostat (zone euro), page `/chomage` fidèle à la maquette avec bandes de pouvoir, décalage et tableau par exécutif.
3. **Sprint 2** : page d'accueil (indicateurs clés, synthèse), composant `Frame`, design system finalisé dans `packages/ui`.
4. **Sprint 3** : Logement et Pouvoir d'achat (même modèle).
5. **Sprint 4** : Immigration (définitions, rupture de série, 4 questions), relue par une personne extérieure au projet.
6. **Sprint 5** : Dette, Sécurité, table `decision` alimentée depuis Légifrance, page Méthode connectée au catalogue réel.

## 11. Critères d'acceptation (par page secteur)

- Chaque série affichée a une source, une définition et une date de récupération visibles.
- Le décalage et le mode de lecture (président, gouvernement, majorité) modifient réellement le calcul.
- Les cohabitations et ruptures de série sont visibles sur le graphe.
- Aucun élément visuel n'associe une couleur à un camp.
- Accessible : navigation clavier, contrastes ≥ 4,5:1, alternative textuelle aux graphes (tableau de données).

## 12. Points ouverts

- Nom définitif du site (REPÈRES est un nom de travail).
- Licence du code et des données dérivées.
- Hébergement et fréquence de rafraîchissement.
- Dates exactes des mandats et des majorités.
- Relecture méthodologique par des personnes de sensibilités différentes avant publication.

## 13. Contenu du dossier

- `BRIEF.md` : ce document.
- `DESIGN.md` : design system (tokens, composants, règles graphiques).
- `mockups/*.dc.html` : sources des maquettes (accueil, chômage, immigration, méthode).
- `html/*.html` : export statique autonome, ouvrable dans un navigateur, à utiliser comme référence visuelle.
- `scripts/export-html.mjs` : régénère `html/` depuis `mockups/` (`node scripts/export-html.mjs`).

Les chiffres des maquettes sont des espaces réservés (« X,X % ») et les courbes sont factices, sauf les valeurs Insee citées ci-dessus.
