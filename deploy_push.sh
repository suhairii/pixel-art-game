#!/bin/bash
# Script untuk push branch fitur ke GitHub agar bisa di-merge di web GitHub
set -e

cd /home/suhairi/Projects/web/nextjs/pixel-art-game

echo "========================================================"
echo "🚀 MENDORONG PERUBAHAN KE GITHUB UNTUK MERGE PULL REQUEST"
echo "========================================================"

echo "Memeriksa status git..."
git status

echo ""
echo "Mendorong branch 'feature/narrative-dani-jihan-losari' ke GitHub..."
git push origin feature/narrative-dani-jihan-losari

echo ""
echo "========================================================"
echo "✅ BERHASIL DI-PUSH KE GITHUB!"
echo "Silakan buka tautan berikut untuk membuat dan merge Pull Request:"
echo "👉 https://github.com/suhairii/pixel-art-game/pull/new/feature/narrative-dani-jihan-losari"
echo "========================================================"
