# Kubernetes Deployment Guide

## Prerequisites

- Kubernetes cluster (1.20+)
- kubectl configured
- Docker images pushed to registry
- cert-manager installed (for SSL)
- Ingress controller installed (nginx)

---

## Quick Start

### 1. Create Namespace

```bash
kubectl apply -f kubernetes/deployment.yaml
# This creates the 'videx' namespace
```

### 2. Create Secrets

```bash
# Create MongoDB secret
kubectl create secret generic videx-secrets \
  --from-literal=mongodb-uri='mongodb+srv://user:pass@cluster.mongodb.net/videx' \
  --namespace=videx

# Verify secret
kubectl get secrets --namespace=videx
```

### 3. Update ConfigMap

Edit `kubernetes/deployment.yaml` and update ConfigMap:

```yaml
data:
  frontend-url: "https://yourdomain.com"
  api-url: "https://api.yourdomain.com"
```

### 4. Deploy Application

```bash
# Apply all manifests
kubectl apply -f kubernetes/deployment.yaml

# Check deployment status
kubectl get deployments --namespace=videx
kubectl get pods --namespace=videx
kubectl get services --namespace=videx
```

### 5. Configure Ingress

```bash
# Update ingress.yaml with your domain
nano kubernetes/ingress.yaml

# Apply ingress
kubectl apply -f kubernetes/ingress.yaml

# Check ingress
kubectl get ingress --namespace=videx
```

---

## Scaling

### Manual Scaling

```bash
# Scale API to 5 replicas
kubectl scale deployment videx-api --replicas=5 --namespace=videx

# Scale frontend to 3 replicas
kubectl scale deployment videx-frontend --replicas=3 --namespace=videx
```

### Auto-Scaling (HPA)

```bash
# Check HPA status
kubectl get hpa --namespace=videx

# Describe HPA
kubectl describe hpa videx-api-hpa --namespace=videx
kubectl describe hpa videx-frontend-hpa --namespace=videx
```

HPA will automatically scale based on:
- CPU usage > 70%
- Memory usage > 80%
- Min replicas: 2
- Max replicas: 10

---

## Monitoring

### View Logs

```bash
# API logs
kubectl logs -f deployment/videx-api --namespace=videx

# Frontend logs
kubectl logs -f deployment/videx-frontend --namespace=videx

# Specific pod logs
kubectl logs -f <pod-name> --namespace=videx
```

### Check Pod Status

```bash
# List all pods
kubectl get pods --namespace=videx

# Describe pod
kubectl describe pod <pod-name> --namespace=videx

# Get pod events
kubectl get events --namespace=videx --sort-by='.lastTimestamp'
```

### Resource Usage

```bash
# CPU and memory usage
kubectl top pods --namespace=videx
kubectl top nodes
```

---

## Troubleshooting

### Pod Not Starting

```bash
# Check pod status
kubectl get pods --namespace=videx

# Describe pod
kubectl describe pod <pod-name> --namespace=videx

# Check logs
kubectl logs <pod-name> --namespace=videx

# Check events
kubectl get events --namespace=videx
```

### Image Pull Errors

```bash
# Check image pull secrets
kubectl get secrets --namespace=videx

# Create image pull secret
kubectl create secret docker-registry regcred \
  --docker-server=<registry-url> \
  --docker-username=<username> \
  --docker-password=<password> \
  --namespace=videx

# Update deployment to use secret
# Add to deployment.yaml:
# spec:
#   imagePullSecrets:
#   - name: regcred
```

### Service Not Accessible

```bash
# Check service
kubectl get svc --namespace=videx

# Check endpoints
kubectl get endpoints --namespace=videx

# Port forward for testing
kubectl port-forward svc/videx-api-service 5002:5002 --namespace=videx
kubectl port-forward svc/videx-frontend-service 3000:80 --namespace=videx
```

---

## Updates & Rollbacks

### Rolling Update

```bash
# Update image
kubectl set image deployment/videx-api api=videx-api:v2 --namespace=videx

# Check rollout status
kubectl rollout status deployment/videx-api --namespace=videx

# Check rollout history
kubectl rollout history deployment/videx-api --namespace=videx
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/videx-api --namespace=videx

# Rollback to specific revision
kubectl rollout undo deployment/videx-api --to-revision=2 --namespace=videx
```

---

## Security Best Practices

1. **Use RBAC** - Limit access to resources
2. **Network Policies** - Restrict pod-to-pod communication
3. **Pod Security Policies** - Enforce security standards
4. **Secrets Management** - Use external secrets (AWS Secrets Manager, Vault)
5. **Image Scanning** - Scan images for vulnerabilities
6. **Resource Limits** - Set CPU/memory limits
7. **HTTPS Only** - Force SSL redirect
8. **Regular Updates** - Keep Kubernetes and images updated

---

## Production Checklist

- [ ] Secrets stored securely (not in git)
- [ ] SSL certificates configured
- [ ] Ingress controller installed
- [ ] Monitoring setup (Prometheus, Grafana)
- [ ] Logging setup (ELK, Loki)
- [ ] Backup strategy for MongoDB
- [ ] Disaster recovery plan
- [ ] Auto-scaling configured
- [ ] Resource limits set
- [ ] Health checks configured
- [ ] CI/CD pipeline setup
- [ ] Load testing completed
- [ ] Security audit completed

---

## Cost Optimization

### Right-Sizing

```bash
# Check actual resource usage
kubectl top pods --namespace=videx

# Adjust resource requests/limits based on actual usage
# Edit deployment.yaml and update:
# resources:
#   requests:
#     memory: "128Mi"  # Lower if usage is low
#     cpu: "100m"
#   limits:
#     memory: "256Mi"
#     cpu: "200m"
```

### Cluster Autoscaler

Enable cluster autoscaler to automatically add/remove nodes based on demand.

---

## Multi-Region Deployment

For global availability:

1. Deploy to multiple regions
2. Use global load balancer (AWS Global Accelerator, Cloudflare)
3. Replicate MongoDB across regions
4. Configure DNS failover
5. Implement CDN for static assets

---

## Disaster Recovery

### Backup

```bash
# Backup Kubernetes resources
kubectl get all --namespace=videx -o yaml > backup.yaml

# Backup secrets
kubectl get secrets --namespace=videx -o yaml > secrets-backup.yaml

# Backup MongoDB (see DOCKER_DEPLOYMENT_GUIDE.md)
```

### Restore

```bash
# Restore from backup
kubectl apply -f backup.yaml
kubectl apply -f secrets-backup.yaml
```

---

## Next Steps

1. ✅ Set up monitoring (Prometheus + Grafana)
2. ✅ Configure log aggregation (ELK stack)
3. ✅ Implement CI/CD (GitHub Actions, GitLab CI)
4. ✅ Set up alerting (PagerDuty, Slack)
5. ✅ Configure backup automation
6. ✅ Implement chaos engineering (Chaos Mesh)
7. ✅ Regular security audits
8. ✅ Load testing and optimization
