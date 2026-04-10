# AWS EC2 Deployment Guide — URL Shortener

> **Stack**: React + Nginx + Node.js microservices  
> **Cloud DBs**: MongoDB Atlas ✅ + Upstash Redis ✅ (already configured)  
> **Host**: AWS EC2 — Ubuntu 22.04

---

## Part 1 — Create an AWS Account (skip if you have one)

1. Go to [https://aws.amazon.com](https://aws.amazon.com) → **Create an AWS Account**
2. Enter email, password, account name
3. Add a credit card (you won't be charged for Free Tier usage)
4. Complete phone verification
5. Choose **Basic Support (Free)**
6. Sign in to the [AWS Console](https://console.aws.amazon.com)

---

## Part 2 — Configure MongoDB Atlas Network Access

Your EC2 IP must be whitelisted in Atlas before the app can connect.

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and sign in
2. Click your project → **Network Access** (left sidebar)
3. Click **Add IP Address**
4. For now, type `0.0.0.0/0` and click **Confirm**  
   *(This allows all IPs — you can restrict it to your EC2 IP later)*

---

## Part 3 — Launch an EC2 Instance

### 3a. Open EC2 Dashboard

1. In AWS Console, search for **EC2** → click it
2. Click the orange **Launch Instance** button

### 3b. Configure the Instance

Fill in these settings:

| Setting | Value |
|---|---|
| **Name** | `url-shortener` |
| **AMI** | Ubuntu Server 22.04 LTS (Free tier eligible) |
| **Architecture** | 64-bit (x86) |
| **Instance type** | `t2.micro` (Free Tier) or `t3.small` for better performance |
| **Key pair** | → Create new (see below) |

### 3c. Create a Key Pair (SSH access)

1. Click **Create new key pair**
2. Name it: `url-shortener-key`
3. Key pair type: **RSA**
4. Private key format: **`.pem`** (for Linux/Mac/WSL) or **`.ppk`** (for PuTTY on Windows)
5. Click **Create key pair** — it downloads automatically
6. **Save it somewhere safe** — you cannot download it again!

> **Windows users**: Save the `.pem` file to `C:\Users\danis\.ssh\url-shortener-key.pem`

### 3d. Configure Network (Security Group)

Under **Network settings** → click **Edit** → add these rules:

| Type | Protocol | Port | Source |
|---|---|---|---|
| SSH | TCP | 22 | My IP (auto-fills your current IP) |
| HTTP | TCP | 80 | Anywhere (0.0.0.0/0) |

### 3e. Configure Storage

- Set to **20 GB** (gp3) — enough for Docker images and logs

### 3f. Launch

Click **Launch Instance** → **View All Instances**

Wait ~1 minute until **Instance State = running** and **Status Checks = 2/2**.

Note down your **Public IPv4 address** (e.g., `54.123.45.67`).

---

## Part 4 — SSH into Your EC2 Instance

### On Windows (using PowerShell or WSL)

```powershell
# Fix key permissions first (required)
icacls C:\Users\danis\.ssh\url-shortener-key.pem /inheritance:r
icacls C:\Users\danis\.ssh\url-shortener-key.pem /grant:r "%USERNAME%:R"

# Connect
ssh -i C:\Users\danis\.ssh\url-shortener-key.pem ubuntu@54.123.45.67
```
*(Replace `54.123.45.67` with your actual EC2 public IP)*

Type `yes` when asked to confirm the fingerprint.

---

## Part 5 — Bootstrap Docker on EC2

Once inside the EC2 terminal, run:

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
```

Then **log out and back in**:
```bash
exit
ssh -i C:\Users\danis\.ssh\url-shortener-key.pem ubuntu@54.123.45.67
```

Verify Docker works:
```bash
docker --version
docker compose version
```

---

## Part 6 — Push Your Code to GitHub (if not already)

On your **local machine** (Windows, in the project folder):

```bash
cd C:\URL_SHORTNER

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit — AWS deployment ready"

# Create a repo on github.com, then:
git remote add origin https://github.com/danishanwarofficial/url-shortener.git
git push -u origin main
```

> **Important**: The `.gitignore` protects your `.env` files — they will NOT be pushed to GitHub.

---

## Part 7 — Clone & Configure on EC2

Back in your EC2 SSH session:

```bash
git clone https://github.com/danishanwarofficial/url-shortener.git /home/ubuntu/url-shortener
cd /home/ubuntu/url-shortener
```

Create the `.env` file on EC2:

```bash
nano .env
```

Paste this (replace `YOUR_EC2_IP` with your actual EC2 public IPv4):

```env
BASE_URL=http://YOUR_EC2_IP

# Get from: cloud.mongodb.com → your cluster → Connect → Drivers
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/urlshortener?retryWrites=true&w=majority

# Get from: console.upstash.io → your database → Connect tab
REDIS_URL=rediss://default:<token>@<host>.upstash.io:6379

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
CACHE_TTL=86400
```

Save: `Ctrl+X` → `Y` → `Enter`

---

## Part 8 — Deploy!

```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

Wait ~2 minutes for Docker to build all images.

---

## Part 9 — Verify Everything Works

```bash
# All 4 containers should show "Up"
docker compose ps

# Test shorten API
curl -X POST http://YOUR_EC2_IP/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com"}'

# Expected response:
# {"shortUrl":"http://YOUR_EC2_IP/abc123"}
```

Open **http://YOUR_EC2_IP** in your browser — the full React app should load! 🎉

---

## Useful Commands on EC2

```bash
# Live logs from all services
docker compose logs -f

# Restart after code update
git pull && ./deploy/deploy.sh

# Check status
docker compose ps

# Stop everything
docker compose down
```

---

## Architecture

```
Your Browser
     │
     ▼
EC2 Public IP:80
     │
  [Nginx]
     ├─── /api/shorten ──► shortener-service:3001 ──► MongoDB Atlas
     ├─── /{short-code} ─► redirector-service:3002 ──► MongoDB Atlas
     │                             │                        │
     │                      Upstash Redis ◄────────────────┘
     └─── / ──────────────► frontend:3000 (React SPA)
```
