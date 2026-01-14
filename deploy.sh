#!/bin/bash

# Скрипт для деплоя Telegram Mini App на techminiapp.ru
# Использование: ./deploy.sh

set -e  # Остановка при ошибке

echo "🚀 Начало деплоя Telegram Mini App..."

# Переходим в директорию проекта
cd "$(dirname "$0")"

echo "📦 Установка зависимостей..."
npm install

echo "🔨 Сборка production версии..."
npm run build

echo "📋 Проверка ESLint..."
npm run lint

echo "📂 Очистка старой версии..."
sudo rm -rf /home/enclude/furnitureAR/frontend/*

echo "📤 Копирование новой версии..."
sudo cp -r dist/* /home/enclude/furnitureAR/frontend/

echo "🔐 Установка прав доступа..."
sudo chown -R www-data:www-data /home/enclude/furnitureAR/frontend

echo "🔍 Проверка конфигурации nginx..."
sudo nginx -t

echo "🔄 Перезагрузка nginx..."
sudo systemctl reload nginx

echo "✅ Деплой завершен успешно!"
echo ""
echo "🌐 Приложение доступно по адресу: https://techminiapp.ru"
echo ""
echo "📊 Размер bundle:"
ls -lh dist/assets/*.js | awk '{print $5, $9}'
ls -lh dist/assets/*.css | awk '{print $5, $9}'
