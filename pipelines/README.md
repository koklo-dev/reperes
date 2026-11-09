# pipelines

Ingestion Python orchestrée par Apache Airflow : un DAG par source ou par secteur, qui normalise et charge dans Postgres (schéma de `packages/db`).

Sprint 0 : squelette seulement. Le premier DAG (Insee chômage, Eurostat zone euro) arrive au Sprint 1 ; Airflow sera alors ajouté au `docker-compose.yml` (local). Son déploiement reste à décider.
