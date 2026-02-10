#!/usr/bin/env sh
echo "Installation des packages NPM"
# Installation avec npm install au lieu de npm ci
npm install --legacy-peer-deps
echo "Done..."
echo "Angular initialisé..."

npm run serve