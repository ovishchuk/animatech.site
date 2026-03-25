# 🚀 Animatech Deployment Guide

## 📋 Швидкий старт

### 1. Завантаження та запуск скрипту
```bash
# Клонувати репозиторій
git clone https://github.com/ovishchuk/ovishchuk.site.git
cd ovishchuk.site

# Запустити скрипт розгортання
sudo ./deploy-ubuntu25.sh
```

### 2. Автоматичне розгортання
Скрипт автоматично виконає:
- ✅ Перевірку Ubuntu 25.04
- ✅ Встановлення Node.js 18.x LTS
- ✅ Налаштування Nginx
- ✅ Клонування проекту
- ✅ Встановлення залежностей
- ✅ Налаштування сервісів
- ✅ Автозапуск
- ✅ Тестування

## 🔧 Ручне налаштування

### Якщо автоматичний скрипт не спрацював:

#### 1. Встановлення Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. Налаштування проекту
```bash
sudo mkdir -p /var/www/ovishchuk.duckdns.org
cd /var/www/ovishchuk.duckdns.org
sudo chown www-data:www-data .
sudo -u www-data git clone https://github.com/ovishchuk/ovishchuk.site.git .
cd server
sudo -u www-data npm install
```

#### 3. Налаштування середовища
```bash
cd /var/www/ovishchuk.duckdns.org/server
sudo -u www-data cat > .env << EOF
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
JWT_SECRET=$(openssl rand -base64 32)
EOF
```

#### 4. Створення systemd сервісу
```bash
sudo cat > /etc/systemd/system/animatech.service << EOF
[Unit]
Description=Animatech Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/ovishchuk.duckdns.org/server
ExecStart=/usr/bin/node app.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable animatech
sudo systemctl start animatech
```

#### 5. Налаштування Nginx
```bash
# Активувати існуючий сайт
sudo ln -sf /etc/nginx/sites-available/ovishchuk /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Налаштування брандмауера
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 3000/tcp
sudo ufw --force enable
```

## 🌐 Доступ до сайту

### Основні адреси:
- **Сайт**: `http://ovishchuk.duckdns.org`
- **Адмін панель**: `http://ovishchuk.duckdns.org/admin`
- **API**: `http://ovishchuk.duckdns.org/api`

### Локальні адреси:
- **Node.js**: `http://localhost:3000`
- **Nginx**: `http://localhost:80`

## 🔍 Перевірка роботи

### 1. Перевірка сервісів
```bash
# Статус Animatech сервісу
sudo systemctl status animatech

# Статус Nginx
sudo systemctl status nginx

# Перевірка портів
sudo ss -tlnp | grep -E ':(80|3000)\s'
```

### 2. Тестування з'єднання
```bash
# Тест локального з'єднання
curl http://localhost:3000
curl http://localhost:80

# Тест зовнішнього з'єднання
curl http://ovishchuk.duckdns.org
```

### 3. Перевірка логів
```bash
# Логи Animatech сервісу
sudo journalctl -u animatech -f

# Логи Nginx
sudo tail -f /var/log/nginx/ovishchuk_access.log
sudo tail -f /var/log/nginx/ovishchuk_error.log

# Логи розгортання
sudo tail -f /var/log/animatech-deploy.log
```

## 🔄 Оновлення

### Автоматичне оновлення
```bash
# Використати готовий скрипт
sudo /var/www/ovishchuk.duckdns.org/update.sh
```

### Ручне оновлення
```bash
cd /var/www/ovishchuk.duckdns.org
sudo -u www-data git fetch origin
sudo -u www-data git reset --hard origin/main
sudo -u www-data git clean -fd
cd server
sudo -u www-data npm install
sudo systemctl restart animatech
```

## 🔒 SSL (HTTPS)

### Встановлення Let's Encrypt
```bash
# Встановити Certbot
sudo apt install certbot python3-certbot-nginx

# Отримати SSL сертифікат
sudo certbot --nginx -d ovishchuk.duckdns.org -d www.ovishchuk.duckdns.org

# Автоматичне оновлення сертифікату
sudo crontab -e
# Додати рядок:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚨 Вирішення проблем

### Помилка 502 Bad Gateway
```bash
# Перевірити чи працює Node.js
sudo systemctl status animatech

# Перевірити порт
sudo ss -tlnp | grep :3000

# Перезапустити сервіси
sudo systemctl restart animatech
sudo systemctl restart nginx
```

### Помилка 503 Service Unavailable
```bash
# Перевірити завантажку системи
sudo systemctl status nginx
sudo nginx -t

# Перевірити права доступу
sudo chown -R www-data:www-data /var/www/ovishchuk.duckdns.org
```

### Сайт не доступний зовні
```bash
# Перевірити брандмауер
sudo ufw status

# Перевірити DNS
nslookup ovishchuk.duckdns.org

# Перевірити Nginx конфігурацію
sudo nginx -t
```

## 📊 Моніторинг

### Системні ресурси
```bash
# Завантаження CPU та пам'яті
htop

# Дисковий простір
df -h

# Мережеві з'єднання
sudo netstat -tlnp
```

### Логи в реальному часі
```bash
# Комбінований лог
sudo journalctl -u animatech -u nginx -f

# Логи помилок
sudo journalctl -p err -f
```

## 🛠️ Розробка

### Локальна розробка
```bash
# Клонувати проект
git clone https://github.com/ovishchuk/ovishchuk.site.git
cd ovishchuk.site/server

# Встановити залежності
npm install

# Запустити в режимі розробки
npm run dev
```

### Зміни в production
```bash
# Зробити зміни
git add .
git commit -m "Your changes"
git push

# Оновити на сервері
sudo /var/www/ovishchuk.duckdns.org/update.sh
```

## 📞 Підтримка

Якщо виникли проблеми:
1. Перевірте логи: `sudo journalctl -u animatech -f`
2. Перевірте статус сервісів: `sudo systemctl status animatech nginx`
3. Перезапустіть сервіси: `sudo systemctl restart animatech nginx`
4. Запустіть скрипт розгортання повторно: `sudo ./deploy-ubuntu25.sh`

---

**🎉 Готово! Сайт Animatech розгорнуто та готовий до роботи!**
