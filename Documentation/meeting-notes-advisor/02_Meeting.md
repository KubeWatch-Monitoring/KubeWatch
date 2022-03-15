# Meeting SEProj
## Meeting Information
**Meeting Date/Time:** 01.03.2022, 12:00 - 13:00  
**Meeting Purpose:** Recurring Meeting with Advisor  
**Note Taker:** Benjamin  
**Attendees:**
- Petra Heeb
- Pascal Lehmann
- Oliver Lischer
- Benjamin Plattner
- Jan Untersander
- Laurent Metzger (Advisor)
- Yannick Zwicker (INS)

## Agenda Items

1. Current project status
    - Last week's achievements
      - GitLab Repo setup
      - Time Tracking
      - Availability
      - Initial project plan
      - Meeting notes template
    - Overall status vs Milestone 1 checklist

2. This weeks's deliverables
    - Project Plan
    - Backfill time tracking
    - Define Scrum roles
    - Create risk matrix
    - Define web project setup
    - Define Kubernetes Guidelines

3. Items to discuss  

    | Item | Decision |
    | ---- | ---- |
    | Deadline for documentation submission (confirm time and date) | Friday, 17:00 |
    | Ansprechpartnerin für Yannick | Petra |
    | K8s cluster setup progress | see notes below |

4. Any other business
    - All good :)

## Action Items
| Done? | Item | Responsible | Due Date |
| ---- | ---- | ---- | ---- |
| | Integrate GitLab with K8S | Yannick | tbd |
| | Define our preference for domain access and inform Yannick | Jan, Petra | tbd |


## Other Notes & Information
Kubernetes Cluster Setup
- Lokale Cluster (Mini Kube)
- mit GitLAb Agent verknüpfen
- GitLab mit Kubernetes intergiert? -> Yannick
- CI/CD möglich, aber GitOps nicht möglich mit Agent
  - GitOps mit ArgoCD als Alternative
  - Deployment files werden von ArgoCD gepollt und applied
  - Vollautomatisierung möglich, aber nicht klassiches CI/CD
  - Image Tag (z.B. Commit SHA) als Versionierung für Deployment
- DIY Variante: INS GitLab Runner verwenden, sind nur über INS VPN erreichbar, aber nicht OST
- Anforderung:
  - 3 Nodes
  - K8S Version >1.20, neuer wäre besser (~1.22)
  - Backend: Node.js
  - Frontend: Web Ap
  - Datenbank
    - Ev. Prometheus statt Eigenbau
    - Prometheus Stack: Datenauslesung, Grafana (Alerting)
- Applikation vom Deployment trennen (production, staging, ...)
- Domänenzugriff?
  - Clusterzugriff wird eingerichtet sein
  - wir geben Bescheid