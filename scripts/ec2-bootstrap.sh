#!/bin/bash
# Run this script ONCE on a fresh EC2 instance to bootstrap the environment.
# Usage: sudo bash scripts/ec2-bootstrap.sh
set -e

echo "==> Installing Java 21"
sudo dnf install -y java-21-amazon-corretto-headless

echo "==> Installing AWS CLI v2"
curl -fsSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o /tmp/awscliv2.zip
unzip -q /tmp/awscliv2.zip -d /tmp
sudo /tmp/aws/install

echo "==> Creating app directory"
sudo mkdir -p /opt/customer-app
sudo chown ec2-user:ec2-user /opt/customer-app

echo "==> Registering systemd service"
sudo cp /opt/customer-app/customer-app.service /etc/systemd/system/customer-app.service
sudo systemctl daemon-reload
sudo systemctl enable customer-app

echo "Bootstrap complete. Deploy the JAR via CI/CD pipeline."

