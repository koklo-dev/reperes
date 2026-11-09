# AGENTS

Lire `BRIEF.md` (source de vérité) et `DESIGN.md` avant toute modification.

Règles éditoriales non négociables (BRIEF §3) : aucun score global ; aucune couleur associée à un camp ; décalage des effets paramétrable ; contexte extérieur affiché ; définition de « au pouvoir » explicite (président / gouvernement / majorité) ; chaque chiffre renvoie à sa source ; ruptures de série signalées (courbe interrompue) ; pas de corrélation sur un même graphe sans lien causal établi ; sources partisanes jamais seules.

Design : `border-radius: 0`, rouge `--accent` réservé à l'élément actif, tableau de données équivalent à chaque graphe.

Déploiement : `.deploy/manifest.yaml` (standard infra). Ne pas utiliser koklo-infra. Pas de secret plateforme dans ce repo.
