# 🚀 Quick Start - Deploy in 5 Minutes

## Prerequisites
- Docker installed
- Docker Compose installed
- MongoDB Atlas account

---

## Step 1: Setup Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env

# Edit with your MongoDB credentials
nano .env
```

**Update these values in `.env`:**
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/videx?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5002
```

---

## Step 2: Build Images (2 minutes)

```bash
# Build all images
docker-compose build

# Expected output:
# ✅ Building backend... (1-2 minutes)
# ✅ Building frontend... (1-2 minutes)
```

---

## Step 3: Start Services (1 minute)

```bash
# Start all services in background
docker-compose up -d

# Check status
docker-compose ps

# Expected output:
# NAME                STATUS              PORTS
# videx-api          Up (healthy)        0.0.0.0:5002->5002/tcp
# videx-frontend     Up (healthy)        0.0.0.0:3000->3000/tcp
```

---

## Step 4: Verify Deployment (1 minute)

```bash
# Check backend health
curl http://localhost:5002/api/health
# Expected: {"status":"ok","timestamp":"..."}

# Check frontend
curl http://localhost:3000
# Expected: HTML response

# View logs
docker-compose logs -f
```

---

## Step 5: Access Application

Open in browser:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5002
- **Health Check:** http://localhost:5002/api/health

---

## Common Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f frontend
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart api
```

### Stop Services
```bash
# Stop all
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Scale Services
```bash
# Scale API to 3 instances
docker-compose up -d --scale api=3

# Scale frontend to 2 instances
docker-compose up -d --scale frontend=2
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs api
docker-compose logs frontend

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

### Port already in use
```bash
# Change port in .env
PORT=5003

# Restart
docker-compose down
docker-compose up -d
```

### MongoDB connection failed
```bash
# Test connection
docker-compose exec api node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected'))
  .catch(err => console.error('❌ Error:', err));
"
```

---

## Next Steps

1. ✅ Application running locally
2. 🔲 Test all features
3. 🔲 Deploy to staging
4. 🔲 Configure SSL
5. 🔲 Deploy to production

---

## Production Deployment

For production, use:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

See `DOCKER_DEPLOYMENT_GUIDE.md` for full production setup.

---

## Need Help?

- **Architecture:** `DOCKER_ARCHITECTURE_ANALYSIS.md`
- **Deployment:** `DOCKER_DEPLOYMENT_GUIDE.md`
- **Kubernetes:** `KUBERNETES_DEPLOYMENT_GUIDE.md`
- **Scaling:** `SCALING_GUIDE.md`
- **Summary:** `DOCKER_FINAL_SUMMARY.md`

---

**That's it! Your application is now running in Docker!** 🎉
