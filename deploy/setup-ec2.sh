#!/bin/bash
# =============================================================
# setup-ec2.sh — Run ONCE on a fresh Ubuntu 22.04 EC2 instance
# =============================================================
# Usage:
#   chmod +x setup-ec2.sh && sudo ./setup-ec2.sh
# =============================================================

set -euo pipefail

echo "================================================="
echo " URL Shortener — EC2 Bootstrap Script"
echo " Ubuntu 22.04 | Docker + Docker Compose"
echo "================================================="

# 1. Update system packages
echo "[1/6] Updating system packages..."
apt-get update -y && apt-get upgrade -y

# 2. Install required utilities
echo "[2/6] Installing utilities..."
apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  git \
  unzip

# 3. Install Docker Engine
echo "[3/6] Installing Docker Engine..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. Enable and start Docker
echo "[4/6] Enabling Docker service..."
systemctl enable docker
systemctl start docker

# 5. Add ubuntu user to docker group (no sudo needed for docker commands)
echo "[5/6] Adding ubuntu user to docker group..."
usermod -aG docker ubuntu

# 6. Verify installation
echo "[6/6] Verifying installation..."
docker --version
docker compose version

echo ""
echo "================================================="
echo " Bootstrap complete! Log out and back in for"
echo " docker group permissions to take effect."
echo "================================================="
echo ""
echo " Next steps:"
echo "   1. Log out: exit"
echo "   2. SSH back in"
echo "   3. Clone your repo: git clone <your-repo-url> /home/ubuntu/url-shortener"
echo "   4. cd /home/ubuntu/url-shortener"
echo "   5. Create your .env file (see deploy/README.md)"
echo "   6. Run: ./deploy/deploy.sh"
echo "================================================="
