# 🚀 Инструкция по развертыванию

## ✅ Приложение развернуто!

**URL приложения:** https://techminiapp.ru

---

## 📱 Как открыть в Telegram

### 1. Через BotFather

1. Откройте [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте команду `/myapps`
3. Выберите ваш Mini App
4. Убедитесь что URL установлен: `https://techminiapp.ru`

### 2. Через вашего бота

Откройте вашего бота в Telegram и запустите Mini App через меню или кнопку.

### 3. Прямая ссылка

Используйте direct link от Telegram (получите в BotFather).

---

## 🔄 Как обновить приложение

### Автоматический деплой (рекомендуется)

```bash
cd /home/enclude/furnitureAR
./deploy.sh
```

Скрипт автоматически:
- ✅ Установит зависимости
- ✅ Соберет production версию
- ✅ Проверит код линтером
- ✅ Скопирует файлы в nginx директорию
- ✅ Перезагрузит nginx

### Ручной деплой

```bash
# 1. Перейти в директорию проекта
cd /home/enclude/furnitureAR

# 2. Собрать production версию
npm run build

# 3. Скопировать в директорию nginx
sudo rm -rf /home/enclude/furnitureAR/frontend/*
sudo cp -r dist/* /home/enclude/furnitureAR/frontend/
sudo chown -R www-data:www-data /home/enclude/furnitureAR/frontend

# 4. Перезагрузить nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📂 Структура деплоя

```
/home/enclude/furnitureAR/
├── dist/                 # Собранное приложение (временное)
├── frontend/             # Активная версия для nginx
│   ├── index.html
│   └── assets/
│       ├── index-*.js    # JavaScript bundle
│       └── index-*.css   # CSS bundle
├── src/                  # Исходный код
├── ssl/                  # SSL сертификаты
├── deploy.sh            # Скрипт деплоя
└── ...
```

---

## 🔧 Конфигурация Nginx

**Файл:** `/etc/nginx/sites-available/techminiapp-ssl.conf`

**Основные настройки:**
- Слушает порт 443 (HTTPS)
- Использует SSL сертификаты из `/etc/ssl/techminiapp/`
- Отдает статику из `/home/enclude/furnitureAR/frontend/`
- SPA routing (все запросы → index.html)

**Управление nginx:**

```bash
# Проверка конфигурации
sudo nginx -t

# Перезагрузка (плавная, без разрыва соединений)
sudo systemctl reload nginx

# Полный рестарт
sudo systemctl restart nginx

# Проверка статуса
sudo systemctl status nginx

# Просмотр логов
sudo tail -f /var/log/nginx/techminiapp-access.log
sudo tail -f /var/log/nginx/techminiapp-error.log
```

---

## 🧪 Проверка деплоя

### 1. Локальная проверка

```bash
# Проверить доступность
curl -I https://techminiapp.ru

# Проверить JavaScript
curl -I https://techminiapp.ru/assets/index-*.js

# Проверить CSS
curl -I https://techminiapp.ru/assets/index-*.css
```

### 2. В браузере

Откройте https://techminiapp.ru в браузере:
- ✅ Должен загрузиться Splash Screen
- ✅ Через 2 секунды переход на Home Screen
- ✅ Должны работать все кнопки Quick Actions
- ✅ Статистика должна подгружаться

### 3. В Telegram

Откройте Mini App через вашего бота:
- ✅ Должна применяться тема Telegram
- ✅ Должен работать haptic feedback (вибрация при нажатиях)
- ✅ Должно отображаться ваше имя из Telegram

---

## 🐛 Решение проблем

### Проблема: Белый экран

**Решение:**
```bash
# Проверить логи nginx
sudo tail -50 /var/log/nginx/techminiapp-error.log

# Проверить что файлы скопированы
ls -la /home/enclude/furnitureAR/frontend/

# Проверить права доступа
sudo chown -R www-data:www-data /home/enclude/furnitureAR/frontend
```

### Проблема: 404 на JavaScript файлах

**Решение:**
```bash
# Проверить что assets собрались
ls -la /home/enclude/furnitureAR/dist/assets/

# Пересобрать и передеплоить
npm run build
./deploy.sh
```

### Проблема: Старая версия кэшируется

**Решение:**
```bash
# Очистить кэш в браузере (Ctrl+Shift+R)
# Или добавить query string к URL
# https://techminiapp.ru/?v=2
```

### Проблема: SSL ошибки

**Решение:**
```bash
# Проверить сертификаты
sudo ls -la /etc/ssl/techminiapp/

# Проверить срок действия
sudo openssl x509 -in /etc/ssl/techminiapp/fullchain.crt -noout -dates

# Перезагрузить nginx
sudo systemctl reload nginx
```

---

## 📊 Мониторинг

### Размер bundle

```bash
ls -lh /home/enclude/furnitureAR/frontend/assets/
```

Текущий размер:
- **JavaScript:** ~172 KB (~55 KB gzipped)
- **CSS:** ~13 KB (~3 KB gzipped)
- **Total:** ~185 KB (~58 KB gzipped)

### Логи доступа

```bash
# Последние 50 запросов
sudo tail -50 /var/log/nginx/techminiapp-access.log

# В реальном времени
sudo tail -f /var/log/nginx/techminiapp-access.log

# Статистика по статус кодам
sudo cat /var/log/nginx/techminiapp-access.log | awk '{print $9}' | sort | uniq -c
```

### Производительность

```bash
# Время загрузки главной страницы
curl -o /dev/null -s -w 'Time: %{time_total}s\n' https://techminiapp.ru

# Размер ответа
curl -I https://techminiapp.ru | grep Content-Length
```

---

## 🔐 Безопасность

### SSL/TLS

- ✅ Используется TLS 1.2 и 1.3
- ✅ Сертификаты в `/etc/ssl/techminiapp/`
- ✅ Автоматический редирект с HTTP на HTTPS

### Headers

Nginx автоматически добавляет:
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`

### Обновление сертификатов

Проверяйте срок действия сертификата:

```bash
sudo openssl x509 -in /etc/ssl/techminiapp/fullchain.crt -noout -dates
```

При необходимости обновите сертификат и перезагрузите nginx.

---

## 📝 Changelog

### Version 1.0.0 (MVP) - 13.01.2026

**Реализовано:**
- ✅ Splash Screen с анимациями
- ✅ Home Screen с статистикой
- ✅ Quick Actions (4 кнопки)
- ✅ Recent Activity
- ✅ Telegram SDK integration
- ✅ Haptic feedback
- ✅ Theme support (Light/Dark)
- ✅ Mock data service
- ✅ Responsive design
- ✅ Error boundaries

**Следующие версии:**
- 🚧 Catalog Screen
- 🚧 Item Detail Screen
- 🚧 Favorites
- 🚧 Profile
- 🚧 Settings
- 🚧 Supabase integration

---

## 🔄 CI/CD (в будущем)

Для автоматизации деплоя при push в git:

```bash
# Создать git hook
cat > .git/hooks/post-receive << 'EOF'
#!/bin/bash
cd /home/enclude/furnitureAR
git pull
./deploy.sh
EOF

chmod +x .git/hooks/post-receive
```

---

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи nginx
2. Проверьте console в браузере
3. Используйте `deploy.sh` для повторного деплоя
4. Проверьте что все файлы на месте

---

**Приложение готово к использованию!** 🎉

Откройте https://techminiapp.ru или запустите через вашего Telegram бота.
