
# **Tableau : AI-Powered Predictive Maintenance**

*Tableau Cloud \+ Semantic Modeling \+ Agentforce \+ Solana ledger*

**Status:** Production-ready (assumed) — this README documents the finished system, deployment, APIs, architecture, developer workflows, monitoring, and troubleshooting. Use as the technical reference for contributors, SREs, and reviewers.

---

## **Table of contents**

1. [Project Summary](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#project-summary)  
2. [High-level architecture (visual)](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#high-level-architecture-visual)  
3. [Core components & responsibilities](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#core-components--responsibilities)  
4. [Data model & semantic model (Tableau Next)](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#data-model--semantic-model-tableau-next)  
5. [Realtime ingestion & pipeline](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#realtime-ingestion--pipeline)  
6. [Predictive models & ML lifecycle](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#predictive-models--ml-lifecycle)  
7. [APIs & Extension points (Hyper, REST, Webhooks)](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#apis--extension-points-hyper-rest-webhooks)  
8. [Agentforce automation workflows](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#agentforce-automation-workflows)  
9. [Solana immutable ledger integration](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#solana-immutable-ledger-integration)  
10. [Tableau dashboards, embeds, and Extensions](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#tableau-dashboards-embeds-and-extensions)  
11. [Deployment & infrastructure (Docker, k8s, CI/CD)](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#deployment--infrastructure-docker-k8s-cicd)  
12. [Observability, testing, and SLOs](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#observability-testing-and-slos)  
13. [Security, authN/authZ, and secrets handling](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#security-authauthz-and-secrets-handling)  
14. [Developer guide & local dev quickstart](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#developer-guide--local-dev-quickstart)  
15. [Troubleshooting & runbook](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#troubleshooting--runbook)  
16. [Roadmap & known limitations](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#roadmap--known-limitations)  
17. [Contributing, license, credits](https://chatgpt.com/c/6955eb82-261c-8330-a034-4c7ce9406984#contributing-license-credits)

---

# **Project summary**

 is an end-to-end predictive maintenance platform built to demonstrate and operate with **Tableau Cloud / Tableau Next** semantics, real-time IoT ingestion, explainable ML (failure probability \+ RUL), automated workflows using Agentforce, and an immutable audit trail persisted to **Solana** for compliance. The solution:

* Unifies time-series \+ master data with a semantic layer for consistent analytics.  
* Produces explainable failure probability and Remaining Useful Life (RUL) predictions (7–30 day horizon).  
* Drives automation: auto-create Salesforce Field Service cases, auto-reserve parts in ERP, push tasks to technician mobile apps.  
* Embeds live Tableau dashboards and custom Viz Extensions (scheduling Gantt, parts reservation).  
* Appends key events (prediction\_id, model\_version, decision) to a Solana ledger for immutable auditability.

This README documents architecture, implementation choices, APIs, deployment steps, and developer workflows as if the project is complete and maintained.

---

# **High-level architecture (visual)**

Below is the canonical architecture and sequence diagrams (Mermaid). These diagrams are included as **editable** Mermaid blocks you can paste into a renderer (GitHub supports Mermaid for README rendering).

## **System architecture (Mermaid)**

flowchart LR  
  subgraph Left\[Data Sources\]  
    IOT\[IoT Sensors\]  
    PLC\[Legacy PLC / SCADA\]  
    ERP\[ERP / Inventory\]  
    MES\[MES\]  
    CSV\[CSV / Vendor APIs\]  
  end

  IOT \--\>|MQTT/HTTP| Edge\[Edge Gateway / IoT Bridge\]  
  PLC \--\>|OPC/HTTP| Edge  
  CSV \--\>|API| Ingest\[Ingest Service\]

  Edge \--\>|Kafka / PubSub| Ingest  
  Ingest \--\>|Raw Time-series| TSDB\[(Time-series DB)\]  
  Ingest \--\>|Events| StreamingProcessor\[Streaming Processor\]

  TSDB \--\>|features| FeatureStore\[(Feature Store / HyperTS)\]  
  StreamingProcessor \--\> PredictiveEngine  
  FeatureStore \--\> PredictiveEngine  
  Semantic\[(Semantic Layer: Tableau Next)\] \--\> PredictiveEngine

  PredictiveEngine \--\>|predictions| Semantic  
  PredictiveEngine \--\>|events| ActionOrchestrator\[Agentforce Automation\]  
  PredictiveEngine \--\>|audit| SolanaChain\[Solana Ledger\]

  Semantic \--\>|pre-aggregates| HyperAPI\[Hyper API / Pre-aggregates\]  
  HyperAPI \--\>|live| TableauCloud\[Tableau Cloud / Embedded Viz\]  
  TableauCloud \--\>|Viz Extension| Extensions\[(Viz Extensions / Scheduler)\]  
  Extensions \--\> ActionOrchestrator

  ActionOrchestrator \--\>|create case| Salesforce\[Salesforce Field Service\]  
  ActionOrchestrator \--\>|reserve parts| ERP  
  ActionOrchestrator \--\>|notify| Slack\[Slack / Mobile Push\]

  subgraph Right\[Dashboards & Outcomes\]  
    TableauCloud  
    Extensions  
  end

## **Sequence: prediction → action**

sequenceDiagram  
  participant Sensor  
  participant Ingest  
  participant FeatureStore  
  participant Model as PredictiveEngine  
  participant Semantic  
  participant Agent as Agentforce  
  participant Tableau  
  participant Sol as Solana

  Sensor-\>\>Ingest: publish reading  
  Ingest-\>\>FeatureStore: update windows  
  FeatureStore-\>\>Model: pull features  
  Model-\>\>Semantic: write prediction (failure\_prob, RUL)  
  Model-\>\>Sol: append(prediction\_id, model\_version, hash)  
  Semantic-\>\>Tableau: refresh pre-aggregates  
  Tableau-\>\>User: show alert  
  User-\>\>Tableau: click "create case"  
  Tableau-\>\>Agent: webhook(action:create\_case, payload)  
  Agent-\>\>Salesforce: create case & assign tech  
  Agent-\>\>ERP: reserve parts / auto-PO

---

# **Core components & responsibilities**

This section lists the major services, their responsibilities, and implementation notes.

### **1\. IoT Edge & Ingest**

* **Responsibilities:** collect telemetry via MQTT/HTTP, perform lightweight filtering, buffer and forward to streaming layer (Kafka or managed PubSub).  
* **Implementation:** Dockerized `edge-proxy` (Node/Python with MQTT client). TLS \+ client certs used for device authentication.

### **2\. Streaming Processor**

* **Responsibilities:** stream enrichment, windowed aggregation, anomaly detection (fast path), route alerts to PredictiveEngine.  
* **Implementation:** Apache Flink / Kafka Streams or Python Faust for lightweight hackathon-style stacks.

### **3\. Feature Store / Time-series DB**

* **Responsibilities:** store raw time-series, maintain rolling window aggregates, serve features to models and Hyper pre-aggregates.  
* **Implementation:** InfluxDB / TimescaleDB for TS, with materialized views exported to Hyper tables (for fast Tableau queries).

### **4\. Predictive Engine (ML model server)**

* **Responsibilities:** compute failure probability and RUL, return explainability (feature importance, SHAP-like contributions), maintain model version metadata.  
* **Implementation:** REST model server (FastAPI) exposing `/predict` and `/batch_predict`. Model runtime: scikit-learn / XGBoost for tabular \+ LSTM for sequential patterns; explanation via SHAP or TreeSHAP.

### **5\. Semantic Layer — Tableau Next / Semantic Model**

* **Responsibilities:** canonical model (Equipment, SensorReadings, MaintenanceEvents, Predictions), hosting semantic relationships for dashboards & APIs.  
* **Implementation:** Tableau Next semantic model definitions (JSON/YAML), published to Tableau Cloud.

### **6\. Hyper API / Pre-aggregates**

* **Responsibilities:** serve precomputed Hyper extracts for high-speed interactive viz.  
* **Implementation:** schedule pre-aggregations in the pipeline to Hyper files or use Hyper API to stream pre-aggregates.

### **7\. Tableau Cloud & Viz Extensions**

* **Responsibilities:** interactive dashboards; viz extensions provide scheduler interface and one-click actions.  
* **Implementation:** Tableau Cloud embedding (iframe) and Extensions SDK for custom scheduling UI.

### **8\. Agentforce Automation & Orchestrator**

* **Responsibilities:** implement playbooks (if failure\_prob \> threshold) — create Salesforce cases, reserve parts, notify teams.  
* **Implementation:** Agentforce client \+ serverless functions (AWS Lambda) or managed Agentforce orchestration from Tableau Next.

### **9\. Solana Immutable Ledger**

* **Responsibilities:** append audit entries (prediction\_id, model\_version, decision, timestamp, signer) to a Solana program for immutable audit trail.  
* **Implementation:** lightweight on-chain program that stores hashes and metadata; off-chain metadata stored in secure indexer.

### **10\. UI & Mobile**

* **Responsibilities:** technicians receive mobile tasks, confirm work, update case; dashboards for operators and managers.  
* **Implementation:** Mobile push via Firebase / SNS; dashboards embedded in web intranet portal.

---

# **Data model & semantic model (Tableau Next)**

This section describes the canonical entities and the Tableau semantic model layout. The semantic model is the “single truth” used by dashboards and the PredictiveEngine.

## **Core entities (logical)**

* `Equipment` — id, name, type, manufacturer, installation\_date, criticality\_score, location\_id  
* `SensorReading` — id, equipment\_id, timestamp, sensor\_type, value, raw\_quality\_flag  
* `MaintenanceEvent` — id, equipment\_id, workorder\_id, technician\_id, event\_type, start\_time, end\_time, parts\_used  
* `Prediction` — id, equipment\_id, model\_version, timestamp, failure\_probability, RUL\_days, confidence, explanation\_blob  
* `InventoryItem` — part\_id, part\_name, location, qty\_on\_hand, reorder\_point  
* `Technician` — id, name, skills, current\_location, available\_from

## **Example SQL-ish schema (for Timescale/Postgres)**

CREATE TABLE equipment (  
  id UUID PRIMARY KEY,  
  name TEXT,  
  type TEXT,  
  manufacturer TEXT,  
  installation\_date DATE,  
  criticality SMALLINT,  
  location TEXT  
);

CREATE TABLE sensor\_readings (  
  id BIGSERIAL PRIMARY KEY,  
  equipment\_id UUID REFERENCES equipment(id),  
  ts TIMESTAMPTZ NOT NULL,  
  sensor\_type TEXT,  
  value DOUBLE PRECISION,  
  raw\_quality\_flag BOOLEAN DEFAULT FALSE  
);

CREATE TABLE predictions (  
  id UUID PRIMARY KEY,  
  equipment\_id UUID REFERENCES equipment(id),  
  model\_version TEXT,  
  ts TIMESTAMPTZ NOT NULL,  
  failure\_probability DOUBLE PRECISION,  
  rul\_days DOUBLE PRECISION,  
  confidence DOUBLE PRECISION,  
  explanation JSONB  
);

## **Semantic Model definition (conceptual YAML)**

semantic\_model:  
  name: Predictive\_Maintenance\_Semantic\_Model  
  tables:  
    \- name: Equipment  
      source: equipment  
      fields: \[id, name, type, manufacturer, installation\_date, criticality, location\]  
    \- name: SensorReadings  
      source: sensor\_readings  
      fields: \[id, equipment\_id, ts, sensor\_type, value, raw\_quality\_flag\]  
    \- name: Predictions  
      source: predictions  
      fields: \[id, equipment\_id, ts, model\_version, failure\_probability, rul\_days, confidence, explanation\]  
  relationships:  
    \- from: Equipment.id  
      to: SensorReadings.equipment\_id  
      type: one\_to\_many  
    \- from: Equipment.id  
      to: Predictions.equipment\_id  
      type: one\_to\_many

**Notes:** publish the semantic model to Tableau Next so dashboards and Hyper API queries operate against named fields (Equipment.health\_status, Predictions.failure\_probability, etc.). This avoids repeated ETL mapping in frontend code.

---

# **Realtime ingestion & pipeline**

## **Data flow summary**

1. Devices publish telemetry → Edge Gateway (MQTT/HTTP)  
2. Edge forwards to Kafka (topic: `sensor_readings`)  
3. Streaming processor performs de-noising, computes windowed aggregations (e.g., 1h avg, 24h trend), detects anomalies and writes to TSDB \+ Feature Store.  
4. Feature Store materialized views are persisted to the Hyper pre-aggregate pipeline for Tableau consumption.  
5. Streaming events also call PredictiveEngine for fast scoring (or Model server pulls features for scheduled scoring).

## **Example ingestion (Python snippet)**

\# simplified: mqtt \-\> kafka producer  
import paho.mqtt.client as mqtt  
from kafka import KafkaProducer  
import json, os

KAFKA\_BOOTSTRAP \= os.getenv("KAFKA\_BOOTSTRAP", "kafka:9092")  
TOPIC \= "sensor\_readings"

producer \= KafkaProducer(bootstrap\_servers=KAFKA\_BOOTSTRAP, value\_serializer=lambda v: json.dumps(v).encode('utf-8'))

def on\_message(client, userdata, msg):  
    payload \= json.loads(msg.payload.decode())  
    \# payload: { equipment\_id, sensor\_type, value, ts }  
    producer.send(TOPIC, payload)

client \= mqtt.Client()  
client.on\_message \= on\_message  
client.connect("edge.local", 1883\)  
client.subscribe("factory/+/reading")  
client.loop\_forever()

## **Feature engineering (stream)**

* Windowed features (last 1h avg, 24h variance)  
* Trend features (slope of vibration over last N samples)  
* Categorical enrichment (equipment type, criticality)  
* Time features (hour of day, shift)

## **Materialization to Hyper**

Create scheduled job that pulls aggregated features and writes `predictions_ready.hyper` file for Hyper API ingestion. Use `tableauhyperapi` to write Hyper files.

---

# **Predictive models & ML lifecycle**

## **Model objectives**

* **Primary**: predict probability of failure within a horizon (7–30 days)  
* **Secondary**: estimate RUL (remaining useful life in days)  
* **Explainability**: provide per-prediction feature importances (top 5 contributors)

## **Model architecture (production)**

* Tabular classifier (XGBoost / LightGBM) for failure probability  
* Regression (or survival model) for RUL  
* LSTM/1D-CNN optional for complex temporal patterns; used in ensemble where necessary  
* Explainability via SHAP TreeExplainer (for tree models) or DeepExplainer for NN.

## **Training & evaluation**

* Backtest over historical labeled failures (binary labels with timestamp)  
* Stratify by equipment type, operating regimes  
* Metrics: ROC-AUC, Precision@K, Calibration Brier score, RUL RMSE  
* Validation: time-split CV (temporal validation) to avoid leakage

## **Model registry & deployment**

* Push model artifact into model registry (MLflow or simple S3 storage with semantic metadata: model\_version, auc, training\_date, dataset\_hash)  
* Model server exposes endpoints:  
  * `POST /predict` — single, returns { failure\_probability, rul, confidence, explanation }  
  * `POST /predict/batch` — batch predictions for many equipment\_ids  
* Each prediction writes an audit stub to Solana (hash of payload \+ metadata) and stores full record in `predictions` table.

## **Example predict API (FastAPI)**

from fastapi import FastAPI  
from pydantic import BaseModel  
import joblib, uuid, datetime

app \= FastAPI()  
model \= joblib.load("/models/failure\_predictor\_v1.2.pkl")

class PredictRequest(BaseModel):  
    equipment\_id: str  
    features: dict

@app.post("/predict")  
def predict(req: PredictRequest):  
    X \= \[req.features\[k\] for k in FEATURE\_ORDER\]  
    prob \= model.predict\_proba(\[X\])\[0,1\]  
    rul \= estimate\_rul(prob, req.features)  
    pred\_id \= str(uuid.uuid4())  
    \# save to DB ...  
    return {"prediction\_id": pred\_id, "failure\_probability": float(prob), "rul\_days": float(rul)}

## **Explainability**

Return top N features and their contribution. Store explanation in `predictions.explanation` JSON.

---

# **APIs & Extension points (Hyper, REST, Webhooks)**

## **Hyper API / Pre-aggregates**

* **Objective:** supply interactive viz with fast queries.  
* **Flow:** regularly materialize aggregates (hourly/daily) into Hyper files and push to Tableau Cloud via the REST / Hyper API.  
* **Strategy:** push only the necessary pre-aggregates (sensor\_1h\_avgs, predicted\_failure\_by\_equipment\_day) to minimize size.

## **REST API (service endpoints)**

* `POST /predict` — single prediction  
* `POST /predict/batch` — batch predictions  
* `GET /equipment/{id}/health` — latest health \+ RUL  
* `GET /predictions/{id}` — full prediction record & explanation  
* `POST /actions/create_case` — (internal) wrapper to Agentforce  
* `POST /webhooks/tableau` — incoming events from Tableau extensions (user clicks)

## **Webhooks & Extensions**

* Tableau Viz Extensions call our extension webhook with action payloads. Validate JWT signed by Tableau for authenticity.  
* Example extension actions: `create_case`, `reserve_parts`, `simulate_whatif`.

---

# **Agentforce automation workflows**

Agentforce orchestrates actionable playbooks. Playbooks are implemented as JSON/YAML definitions with triggers and steps.

## **Typical playbook: high-risk failure**

name: high\_risk\_failure\_playbook  
trigger:  
  \- when: prediction.failure\_probability \>= 0.85  
actions:  
  \- type: create\_case  
    target: Salesforce.FieldService  
    payload\_template: |  
      {  
        "subject": "Predicted failure: {{equipment\_id}}",  
        "priority": "High",  
        "description": "Predicted failure probability {{failure\_probability}} (RUL: {{rul\_days}})"  
      }  
  \- type: reserve\_parts  
    target: ERP  
    payload\_template: |  
      { "part\_id": "{{critical\_part}}", "qty": 1 }  
  \- type: notify  
    target: Slack  
    payload\_template: |  
      {"channel": "\#maintenance-alerts", "text": "Auto-case created: {{case\_id}}"}

## **Implementation details**

* Playbooks executed in idempotent fashion (playbook run idempotency keys).  
* Retries and exponential backoff for external calls.  
* Audit each step; store step outcomes to a `workflow_runs` table.

---

# **Solana immutable ledger integration**

We persist an audit record for each decision that requires immutable traceability. The ledger stores a compact hash referencing the full payload.

## **Design**

* On prediction, compose `audit_record = { prediction_id, model_version, ts, failure_prob, rul, decision }`.  
* Compute `sha256 = hash(audit_record_json)` and call Solana program to append `(sha256, short_meta)` to an on-chain log account.  
* Off-chain indexer stores `audit_record_json` keyed by `sha256`. On audits, hash is compared to on-chain entry.

## **Minimal Solana write example (pseudocode)**

from solana.rpc.api import Client  
from solana.transaction import Transaction  
\# use custom on-chain program to append hashes  
client \= Client("https://api.mainnet-beta.solana.com")  
tx \= Transaction()  
\# build instruction (program\_id, accounts, data=sha256\_bytes)  
res \= client.send\_transaction(tx, signer)

**Cost considerations:** On-chain storage is expensive; only store hash and minimal metadata on-chain. Full payloads live in encrypted off-chain storage (S3) with link referenced by the hash.

---

# **Tableau dashboards, embeds, and Extensions**

## **Dashboards**

* **Real-time Equipment Health:** map/floor visualization; equipment glyphs colored by health band (Critical / Warning / Healthy). Tooltip shows top contributing factors and predicted RUL.  
* **Predictive Failure Timeline:** sparkline \+ prediction bands to show probability over time; sliders to adjust prediction horizon.  
* **Maintenance Scheduler:** Gantt view with auto-assignment suggestions derived from Agentforce.  
* **Parts Reservation Panel:** quick reserve, shows on-hand, reorder lead time, auto-PO button.

## **Embedding & Extensions**

* Dashboards embedded in internal portal via Tableau Cloud embed tokens.  
* Custom Viz Extension built with Tableau Extensions API:  
  * Scheduler (drag/drop Gantt to move tasks)  
  * One-click action buttons (`create case`, `reserve parts`) → call our webhook.

## **Security**

* Embed tokens rotated and scoped to user.  
* Extensions authenticate back to our webhooks via signed JWTs.

---

# **Deployment & infrastructure (Docker, k8s, CI/CD)**

## **Example deployment topology**

* k8s cluster (EKS/GKE/AKS)  
  * Namespace `-prod`  
  * Deployments: `edge-proxy`, `kafka`, `streaming-processor`, `feature-store`, `model-server`, `api-gateway`, `agentforce-wrk`, `hyper-worker`  
  * StatefulSets for TSDB, Postgres/Timescale, Redis  
  * Jobs for Hyper pre-aggregation (cronjobs)  
* Cloud resources: S3 for artifacts, KMS for secrets, Prometheus/Grafana for metrics, ELK / Loki for logs

## **Example `docker-compose.yml` (local)**

version: '3.7'  
services:  
  edge-proxy:  
    build: ./edge  
    ports: \["1883:1883"\]  
  kafka:  
    image: wurstmeister/kafka  
    environment:  
      KAFKA\_ADVERTISED\_HOST\_NAME: kafka  
  zookeeper:  
    image: wurstmeister/zookeeper  
  model-server:  
    build: ./predictive\_engine  
    ports: \["8000:8000"\]  
  api:  
    build: ./api  
    ports: \["8080:8080"\]  
  timescaledb:  
    image: timescale/timescaledb:latest-pg12  
    environment:  
      POSTGRES\_PASSWORD: example

## **CI/CD**

* **CI:** GitHub Actions pipeline runs unit tests, flake8, builds Docker images, runs model validation job for PRs.  
* **CD:** On successful merge to `main`, GitHub Actions pushes images to container registry and triggers k8s rolling deployment via `kubectl`/`helm`.  
* Model promotions require manual approval (to ensure governance).

## **Helm charts**

Use Helm for parameterized deployments. Values for `replicas`, `resources`, `autoscaling` should be in `values.yaml`.

---

# **Observability, testing, and SLOs**

## **Key metrics (Prometheus)**

* ingestion: `sensor_messages_total`, `ingest_latency_seconds`  
* model: `predictions_total`, `prediction_latency_seconds`, `model_version_gauge`  
* system: `api_errors_total`, `cpu_usage`, `memory_usage`  
* SLOs:  
  * 99% of `/predict` responses \< 300ms  
  * 99.9% ingestion availability  
  * Mean time to detect anomaly \< 2 minutes

## **Tracing & logs**

* Use OpenTelemetry to propagate traces across services (Edge → Ingest → Model → Agentforce).  
* Centralized logs in ELK; use structured JSON logs with `request_id` correlation.

## **Testing**

* Unit tests for feature engineering, model metrics (pytest)  
* Integration tests: synthetic sensor data into Kafka, assert end-to-end path to Tableau pre-aggregate  
* Model tests: data drift checks, model performance checks run nightly

---

# **Security, authN/authZ, and secrets handling**

## **Authentication & Authorization**

* Internal API gateway enforces mTLS between services.  
* External endpoints secured with OAuth2 / JWT (short-lived tokens). Tableau extensions use signed JWTs to call our webhooks.  
* Role-based access control (RBAC) for operator dashboards (admin, operator, technician).

## **Secrets**

* Store secrets in KMS (AWS KMS / GCP KMS) or Vault. Kubernetes secrets encrypted with provider KMS.  
* Never log secrets. Use dedicated env var injection during deploy.

## **Data protection**

* Encrypt data at rest (TSDB, S3) and transit (TLS 1.2+).  
* Anonymize PII in logs and predictions payloads.

## **Auditability**

* Prediction audit to Solana (hash only).  
* Access logs stored for 1 year; model change logs stored in model registry.

---

# **Developer guide & local dev quickstart**

## **Prereqs**

* Docker, docker-compose  
* Python 3.10  
* Node 16+ (for extensions)  
* Access to Tableau Cloud development site / dev tokens  
* Kafka local (or use Confluent cloud dev instance)

## **Quickstart (local)**

git clone git@github.com:your-org/.git  
cd   
\# build images  
docker-compose build  
\# start local stack  
docker-compose up \-d  
\# run migrations (example)  
docker-compose exec api alembic upgrade head  
\# create sample data  
python scripts/seed\_sample\_data.py  
\# start model server (if not in docker)  
cd predictive\_engine && uvicorn app:app \--reload \--port 8000

## **Running tests**

\# unit tests  
pytest tests/unit  
\# integration tests (requires local kafka & db)  
pytest tests/integration

## **Developing Viz extension**

cd viz-extensions/scheduler  
npm install  
npm start \# local extension dev server  
\# Load extension manifest in Tableau Developer sandbox

---

# **Troubleshooting & runbook**

**Prediction latency spikes**

* Check model server CPU/heap usage: `kubectl top pods`  
* Verify feature store availability (cache misses can cause heavy recompute)  
* If model version has high latency, rollback via model registry

**Too many false positives**

* Check data quality (missing timestamps, sensor drift)  
* Inspect feature importance for affected predictions; retrain with better windowing  
* Adjust conservative thresholds and enable human-in-the-loop verification

**Agentforce action failures**

* Check external endpoints (Salesforce/ERP) connectivity and credentials  
* Inspect playbook run logs in `workflow_runs` for step-level errors  
* Validate idempotency keys to avoid duplicates

**Solana append failures**

* Check RPC endpoint rate limits  
* Confirm on-chain program public key and signer keys are provisioned correctly  
* Retry with exponential backoff; if failed, mark audit entry as `pending_onchain`

**Tableau refresh issues**

* Ensure Hyper pre-aggregates exported successfully and uploaded to Tableau Cloud  
* Validate embedding tokens not expired  
* Check Tableau Cloud capacity/limits (concurrent viz loads)

---

# **Roadmap & known limitations**

## **Short-term**

* Add continuous learning loop to automatically retrain on confirmed failures.  
* UI: technician mobile app native integration (offline mode).  
* Improve LSTM ensemble for long-term patterns.

## **Medium-term**

* Multi-factory horizontal scaling, cross-factory semantic federation.  
* Add differential privacy mode for regulated environments.

## **Known limitations**

* Solana on-chain costs make full payload storage infeasible — we store only hashes on-chain.  
* Some SCADA vendors have locked protocols; prebuilt adapters cover the most common ones but not every proprietary system.

---

# **Contributing, license, credits**

## **How to contribute**

1. Fork the repo, create branch `feature/xxx`  
2. Run tests locally; ensure lint passing  
3. Open PR with clear description and update the changelog  
4. CI will run tests & model checks; reviewers will validate architecture implications

## **Coding standards**

* Python: Black \+ isort \+ mypy  
* JavaScript: Prettier \+ ESLint  
* Infrastructure: Helm lint \+ tfsec for Terraform

## **License**

This project is licensed under the **MIT License** — see `LICENSE` file.

---

# **Appendices**

## **Appendix A — Sample config (`.env.example`)**

POSTGRES\_HOST=timescaledb  
POSTGRES\_USER=  
POSTGRES\_PASSWORD=secret  
KAFKA\_BOOTSTRAP=kafka:9092  
MODEL\_REGISTRY\_BUCKET=s3://-models  
TABLEAU\_CLOUD\_SITE=your-site  
TABLEAU\_CLOUD\_TOKEN=XXXX  
SOLANA\_RPC=https://api.mainnet-beta.solana.com  
SOLANA\_SIGNER\_KEY=base58key

## **Appendix B — Example playbook (JSON)**

{  
  "id": "pb\_high\_risk\_001",  
  "name": "High Risk Failure Playbook",  
  "trigger": {  
    "type": "threshold",  
    "field": "failure\_probability",  
    "op": "\>=",  
    "value": 0.85  
  },  
  "steps": \[  
    { "type": "create\_case", "args": { "priority": "High" } },  
    { "type": "reserve\_parts", "args": { "strategy": "min\_stock" } },  
    { "type": "notify", "args": { "channels": \["slack", "mobile"\] } }  
  \]  
}

## **Appendix C — Example model evaluation summary (for v1.2)**

* ROC-AUC: 0.92  
* Precision@10%: 0.81  
* RUL RMSE: 4.2 days  
* Dataset: 4 years of labeled failures, 2 factories, 120 equipment types

---

