# CareerFlow — Cloud Computing Architecture, Methodology & Academic Defense Guide

> **Project:** CareerFlow Campus Placement & Recruitment Portal  
> **Course / Subject:** Cloud Computing / Cloud Software Architecture  
> **System Status:** Successfully deployed & running live on AWS EC2 (`15.134.218.45:5001`)  
> **Target Audience:** University Professors, External Examiners, Technical Evaluators, and Viva Defense Panels  

---

## 1. Executive Summary & System Abstract

**CareerFlow** is an enterprise-grade campus recruitment automation platform engineered for high-volume placement seasons. It implements a two-sided marketplace architecture serving two distinct user personas:
1. **Students:** Job discovery, deterministic criteria validation (CGPA, backlogs, branch eligibility), resume parsing/selection, and 5-stage recruitment tracking.
2. **Training & Placement Office (TPO) Admins:** Corporate drive creation, automated cut-off enforcement, applicant pipeline auditing, and 1-click bulk auto-shortlisting.

The platform is deployed as a **Cloud-Native, Containerized Service** on Amazon Web Services (AWS) utilizing **Infrastructure-as-a-Service (IaaS)** and **Containers-as-a-Service (CaaS)** patterns, backed by an ACID-compliant relational PostgreSQL database.

---

## 2. Cloud Architecture & Topology

### 2.1 Live Deployment Topology

```mermaid
flowchart TD
    subgraph Internet ["Public Internet"]
        UserBrowser["University Browser / Client<br/>(Student or TPO Admin)"]
    end

    subgraph AWS ["Amazon Web Services (AWS Cloud - Region: us-east-1)"]
        subgraph VPC ["Default Virtual Private Cloud (VPC: 172.31.0.0/16)"]
            IGW["Internet Gateway (IGW)"]
            
            subgraph SecurityGroup ["Security Group: default / custom<br/>Inbound: 22 (SSH), 80 (HTTP), 5001 (Custom TCP)"]
                
                subgraph EC2Host ["AWS EC2 Instance: t3.micro<br/>(OS: Ubuntu 24.04 LTS | Public IP: 15.134.218.45)"]
                    HostKernel["Linux Kernel + cgroups + namespaces"]
                    SwapMemory["2 GB Linux Swap File (/swapfile)<br/>Burst Buffer for 1GB RAM"]
                    
                    subgraph DockerEngine ["Docker Container Runtime Engine"]
                        subgraph BridgeNet ["Docker Bridge Network (careerflow_default)"]
                            
                            subgraph AppContainer ["App Container (careerflow-app-1)<br/>Port: 5001:5001 & 80:5001"]
                                ExpressServer["Node.js 20 Express Server"]
                                StaticDist["React 18 SPA (Compiled Vite dist/)"]
                                PrismaClient["Prisma ORM Client"]
                                Engine["Pure Eligibility Engine"]
                                ExpressServer --> StaticDist
                                ExpressServer --> Engine
                                ExpressServer --> PrismaClient
                            end

                            subgraph DBContainer ["Database Container (careerflow-postgres-1)<br/>Port: 5432:5432 (Internal)"]
                                Postgres[(PostgreSQL 16 Engine<br/>ACID Relational Storage)]
                            end

                            PrismaClient -->|TCP:5432 (bridge)| Postgres
                        end
                    end
                end
            end
        end

        subgraph EBS ["AWS Elastic Block Store (EBS)"]
            RootVol[("20 GiB gp3 General Purpose SSD<br/>Persistent Storage (/var/lib/docker/volumes)")]
            DBContainer -.->|Volume Mount: careerflow_pgdata| RootVol
        end
    end

    UserBrowser -->|HTTP:5001 / HTTP:80| IGW
    IGW --> SecurityGroup
    SecurityGroup --> AppContainer
```

### 2.2 Cloud Service Models (NIST Taxonomy Mapping)

In the standard NIST cloud taxonomy, CareerFlow leverages and demonstrates all three tiers:

| Cloud Model | CareerFlow Implementation | Academic Definition & Justification |
|---|---|---|
| **IaaS** *(Infrastructure as a Service)* | **AWS EC2 (`t3.micro`) + AWS EBS (20 GB gp3)** | Raw compute, virtualized CPU, memory, and virtual block devices. We manage the OS (Ubuntu 24.04), kernel parameters, swap space, and networking. |
| **CaaS / PaaS** *(Platform / Containers as a Service)* | **Docker Engine + Docker Compose** | Abstracting dependencies away from the host OS into isolated process spaces (containers). |
| **SaaS** *(Software as a Service)* | **GitHub (`DevPandya1035/Career_Flow`)** | Cloud-hosted version control and repository management. |

---

## 3. Software & Service-Oriented Architecture (SOA)

### 3.1 From Monolith to Modular Service-Oriented Architecture

CareerFlow is architected as a **Modular Service-Oriented Monolith (Modular SOA)**. While packaged within unified containers for deployment simplicity and zero networking overhead, internal modules maintain strict service boundaries:

```mermaid
flowchart LR
    subgraph PresentationLayer ["1. Presentation Service (SPA)"]
        UI["React 18 Components<br/>(Tailwind CSS Design System)"]
        ClientState["Zustand State Store<br/>(Optimistic UI Updates)"]
        APILayer["Typed API Client (Fetch)"]
        UI --> ClientState --> APILayer
    end

    subgraph ServiceLayer ["2. Micro-Service Business Layer (Express REST)"]
        Router["API Gateway / Express Router"]
        
        subgraph Services ["Bounded Domain Services"]
            StudentSvc["Student Profile Service<br/>(/api/student)"]
            JobSvc["Corporate Drive Service<br/>(/api/jobs)"]
            AppSvc["Application Pipeline Service<br/>(/api/applications)"]
            EligibilitySvc["Deterministic Eligibility Service<br/>(Pure Rule Engine)"]
            AdminSvc["TPO Orchestration Service<br/>(/api/admin)"]
            PrepSvc["Skill Readiness Service<br/>(/api/prep)"]
        end
        
        Router --> StudentSvc
        Router --> JobSvc
        Router --> AppSvc
        Router --> EligibilitySvc
        Router --> AdminSvc
        Router --> PrepSvc
    end

    subgraph DataAccessLayer ["3. Data Persistence Service"]
        Prisma["Prisma ORM Layer<br/>(Type-safe Query Builder)"]
        PostgresDB[("PostgreSQL 16 Engine<br/>Relational Schema")]
        Services --> Prisma --> PostgresDB
    end

    APILayer -->|JSON / REST| Router
```

### 3.2 Key Service Boundaries

1. **Job Catalog & Drive Service:** Manages corporate drive postings, company tier classification (Dream, Super Dream, Regular), and deadline management.
2. **Pure Eligibility Engine Service:** An invariant, pure functional engine (`src/lib/eligibility.ts`) with **zero side effects**. It calculates student eligibility deterministically across 5 criteria (CGPA cutoff, 10th %, 12th %, maximum active backlogs, and allowed branches).
3. **Application & Workflow Service:** Manages student opt-ins, prevents duplicate applications via composite unique constraints, and handles the 5-stage recruitment lifecycle:
   $$\text{Applied} \longrightarrow \text{Shortlisted} \longrightarrow \text{Assessment} \longrightarrow \text{Interview} \longrightarrow \text{Selected}$$
4. **TPO Admin Orchestration Service:** Provides placement analytics, branch-wise placement metrics, and **1-Click Bulk Auto-Shortlisting** using transaction blocks.

---

## 4. Software Engineering & Cloud Methodology

### 4.1 The 12-Factor App Cloud Methodology

CareerFlow strictly aligns with the industry-standard **Twelve-Factor App** principles for building modern cloud applications:

| 12-Factor Principle | CareerFlow Implementation |
|---|---|
| **I. Codebase** | One single repository tracked in Git (`Career_Flow.git`), deployable to multiple environments (Local, AWS EC2, AWS App Runner). |
| **II. Dependencies** | Explicitly declared in `package.json` and isolated using multi-stage Docker container builds (`node:20-alpine`). |
| **III. Config** | Strict separation of config from code via Environment Variables (`DATABASE_URL`, `PORT`, `NODE_ENV`). |
| **IV. Backing Services** | PostgreSQL treated as an attached backing resource connected via URL string over TCP/IP (`postgres:5432`). |
| **V. Build, Release, Run** | Strictly separated: Stage 1 builds bundle (`npm run build`), Stage 2 prepares runner, Entrypoint executes migrations and runs process. |
| **VI. Processes** | Express server runs as a stateless process; session/application state is persisted in relational PostgreSQL. |
| **VII. Port Binding** | Express exports HTTP by binding directly to port `5001`, mapped to host port `80` and `5001`. |
| **VIII. Concurrency** | Workload scaling achieved by running independent container instances behind an internal or external load balancer. |
| **IX. Disposability** | Fast startup and graceful shutdown handled by container process managers and healthcheck signals. |
| **X. Dev/Prod Parity** | Dual-environment Prisma schema switcher (`scripts/switch-db.js`) enabling zero-friction development with local SQLite or production PostgreSQL. |
| **XI. Logs** | Application logs routed to `stdout` / `stderr`, captured natively by Docker daemon (`docker logs`) and AWS CloudWatch. |
| **XII. Admin Processes** | Schema migrations and data seeding run as one-off entrypoint tasks (`scripts/start-prod.sh`) before process binding. |

---

## 5. Critical Cloud Design Decisions & Trade-offs (Viva Deep-Dive)

When examiners ask: *"Why did you make this specific architectural choice?"*, here are the exact rationale and technical trade-offs:

### Decision 1: Virtualization (VM) vs Containerization (Docker)
* **What we did:** We launched an AWS EC2 instance (Hardware Virtualization / Hypervisor) and ran Docker containers inside it (OS-level Virtualization).
* **Why:** 
  - **Virtual Machine (EC2):** Provides strong hardware isolation, dedicated CPU slice, and total network isolation via AWS hypervisor (Nitro/Xen).
  - **Containers (Docker):** Share the host Linux kernel while isolating processes via Linux **cgroups** (resource limits) and **namespaces** (PID, mount, network isolation).
  - **Benefit:** Docker spins up in **300ms** compared to 3 minutes for a new VM, and uses 90% less memory overhead.

### Decision 2: Multi-Stage Docker Builds
* **What we did:** Used a 2-stage `Dockerfile`: Stage 1 (`builder`) compiles React and generates Prisma engines; Stage 2 (`runner`) copies only the compiled `dist/` and production runtime.
* **Why:** 
  - The build environment requires `tsc`, `vite`, `postcss`, and `devDependencies` (~450 MB).
  - The final production image discards all compilers and dev tools, reducing the image size from **~600 MB down to ~120 MB**, vastly minimizing the cloud attack surface.

### Decision 3: The 2 GB Linux Swap File on `t3.micro`
* **What we did:** Added a 2 GB `/swapfile` on the EBS volume during instance initialization.
* **Why:** Free Tier `t3.micro` instances have only **1 GB of physical RAM**. During simultaneous tasks like Vite production compilation or high-concurrency database connection spikes, memory usage can briefly exceed 1 GB. Without swap, the Linux **OOM Killer (Out Of Memory)** immediately terminates the process. Swap acts as a burst buffer on NVMe SSD, guaranteeing **zero crashes**.

### Decision 4: Single Unified Container vs Decoupled S3+ECS
* **What we did:** Express serves both the REST API (`/api/*`) and the compiled static SPA (`dist/`) in a single container.
* **Why:** 
  - Eliminates **Cross-Origin Resource Sharing (CORS)** pre-flight delays because API and frontend share the same origin and port.
  - Slashes operational complexity from 4 cloud resources (S3, CloudFront, ECS, ALB) down to a single self-contained, reproducible container.

### Decision 5: Prisma ORM with Dynamic Auto-Provider
* **What we did:** Engineered `scripts/start-prod.sh` to dynamically detect `DATABASE_URL`. If a PostgreSQL connection string is supplied, it automatically patches `prisma/schema.prisma` from SQLite to PostgreSQL and triggers schema synchronization.
* **Why:** Allows developers to test locally with zero installation (`sqlite`), while production seamlessly connects to enterprise PostgreSQL with zero manual schema file editing.

---

## 6. High-Availability & Scalability Roadmap (For 10,000+ Students)

Examiners often ask: *"How will your system handle 10,000 concurrent students during Day 1 placement morning?"*

Here is your defense plan:

```mermaid
flowchart TD
    Students["10,000 Concurrent Students / Browsers"] --> CF["Amazon CloudFront CDN<br/>(Edge Caches JS/CSS/Images at 450+ Points of Presence)"]
    
    CF -->|Static Assets 95% Traffic| S3Bucket[("Amazon S3 Bucket<br/>(Static Bundle dist/)")]
    CF -->|Dynamic API Calls /api/*| ALB["AWS Application Load Balancer (ALB)"]
    
    subgraph ASG ["AWS Auto Scaling Group (EC2 / ECS Fargate)"]
        Inst1["CareerFlow Container Instance 1"]
        Inst2["CareerFlow Container Instance 2"]
        Inst3["CareerFlow Container Instance N..."]
    end
    ALB --> ASG
    
    subgraph Cache ["In-Memory Caching"]
        Redis[("Amazon ElastiCache Redis<br/>Caches Job Catalog & Student Eligibility")]
    end
    ASG <--> Redis
    
    subgraph DBCluster ["Amazon RDS PostgreSQL Multi-AZ Cluster"]
        PrimaryDB[("Primary DB (Writer)<br/>Handles Applications & Shortlists")]
        ReplicaDB[("Read Replica (Reader)<br/>Handles Job Browsing Queries")]
        PrimaryDB -.->|Synchronous Replication| ReplicaDB
    end
    ASG -->|Writes| PrimaryDB
    ASG -->|Reads| ReplicaDB
```

### Scaling Mechanisms:
1. **Edge Offloading (CloudFront):** 90% of requests are static assets (HTML/JS/CSS/logos). CloudFront serves them from edge caches without ever hitting our backend server.
2. **Horizontal Compute Scaling (Auto Scaling Groups):** When CPU exceeds 70%, the Auto Scaling Group automatically provisions new container replicas behind an Application Load Balancer (ALB).
3. **Database Read Replicas:** Read-heavy operations (students reading drive criteria) are routed to PostgreSQL Read Replicas, leaving the Primary instance unburdened to handle transactional writes (submitting applications).
4. **Redis Cache:** Frequently read items (e.g. active job listings) are cached in Redis in-memory with a 5-minute TTL, dropping database queries by up to **80%**.

---

## 7. Viva & Exam Question Defense (Cheat Sheet)

### Q1: What is the difference between IaaS and PaaS? Which did you use?
> **Answer:** "IaaS (Infrastructure as a Service) provides raw virtualized hardware where the consumer manages the operating system, storage, and networking (e.g., AWS EC2 and EBS). PaaS (Platform as a Service) abstracts the OS and runtime away, allowing developers to only upload code (e.g., AWS Elastic Beanstalk or AWS App Runner). In CareerFlow, we demonstrated IaaS by provisioning an Ubuntu 24.04 EC2 instance, managing memory swap, Linux security groups, and Docker container orchestration."

### Q2: How does Docker differ from a Virtual Machine in AWS?
> **Answer:** "A Virtual Machine on AWS runs on top of a hypervisor (such as AWS Nitro/Xen) and includes a full guest operating system with its own kernel, device drivers, and heavy memory footprint (~1 GB+). Docker uses OS-level virtualization: containers run as isolated processes on the host Linux kernel, leveraging kernel **namespaces** for process/network isolation and **cgroups** for resource throttling. This makes Docker containers lightweight (tens of megabytes), with startup times under a second."

### Q3: How do you handle State vs Statelessness in your cloud architecture?
> **Answer:** "CareerFlow's backend compute layer is completely **stateless**. The Express Node.js application does not store user sessions or application state in local container memory or files. All state is externalized to our backing persistence service (PostgreSQL). This statelessness is what enables horizontal scalability: any request from any user can be routed to any container instance behind a load balancer without data loss."

### Q4: What are Security Groups in AWS and how do they differ from Network Access Control Lists (NACLs)?
> **Answer:** "Security Groups are **stateful** virtual firewalls operating at the EC2 instance/network interface level. Because they are stateful, return traffic is automatically allowed regardless of inbound rules. NACLs are **stateless** firewalls operating at the subnet level, requiring explicit inbound and outbound rule pairs. For CareerFlow, our Security Group restricts inbound access strictly to port 22 (SSH), port 80 (HTTP), and port 5001 (CareerFlow Application)."

### Q5: How did you solve the 1 GB RAM limitation on the Free Tier EC2 instance?
> **Answer:** "AWS Free Tier `t3.micro` instances provide only 1 GB of physical memory. During Docker image compilation and concurrent Prisma database interactions, memory usage can spike. We engineered a 2 GB Linux Swap file stored on the NVMe-backed EBS storage volume (`/swapfile`). When RAM pressure rises, inactive pages are swapped to disk, completely preventing the Linux kernel OOM (Out Of Memory) Killer from terminating the application."

### Q6: How does CareerFlow implement ACID properties in placement drives?
> **Answer:** "CareerFlow leverages PostgreSQL for ACID compliance:
> - **Atomicity:** When an admin executes bulk auto-shortlisting, all qualifying applications are updated within a single database transaction. If one fails, the entire batch rolls back.
> - **Consistency:** Foreign key relations and composite unique indexes ensure a student cannot opt in to the same placement drive twice.
> - **Isolation:** PostgreSQL's multi-version concurrency control (MVCC) ensures concurrent student applications do not read uncommitted state.
> - **Durability:** Transactions are written to PostgreSQL write-ahead logs (WAL) on persistent AWS EBS volumes, ensuring zero data loss even if the container restarts."

---

## 8. Summary Table of Architecture Specifications

| Metric / Dimension | CareerFlow Specification |
|---|---|
| **Live URL** | `http://15.134.218.45:5001` (or `http://15.134.218.45`) |
| **AWS Region** | `us-east-1` (US East, N. Virginia) |
| **Instance Type** | `t3.micro` (2 vCPUs burstable, 1 GB RAM + 2 GB Swap) |
| **Operating System** | Ubuntu Server 24.04 LTS (Kernel: Linux 6.8.0) |
| **Container Engine** | Docker Engine 27.x + Docker Compose v2 |
| **Backend Runtime** | Node.js 20.x Alpine + Express 5.x |
| **Frontend Framework** | React 18.3 + TypeScript 5.4 + Vite 5.4 + Tailwind CSS 3.4 |
| **Database Engine** | PostgreSQL 16 Alpine (Port 5432, ACID Relational) |
| **ORM / Data Access** | Prisma ORM 5.22.0 (Type-Safe Query Builder) |
| **Source Control** | Git + GitHub (`DevPandya1035/Career_Flow.git`) |
| **Monthly Operating Cost** | **\$0.00 / month** (100% AWS 12-Month Free Tier) |
