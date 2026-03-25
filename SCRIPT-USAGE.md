# 📋 Інструкція роботи зі скриптом розгортання

## 🚀 Повний процес розгортання Animatech

### Крок 1: Підготовка сервера

#### 1.1 Підключення до сервера
```bash
# Підключитись по SSH до свого сервера
ssh username@your-server-ip

# Перейти в домашню директорію
cd ~
```

#### 1.2 Перевірка системи
```bash
# Перевірити версію Ubuntu
lsb_release -a

# Перевірити чи є curl
which curl

# Перевірити чи є git
which git
```

### Крок 2: Завантаження скрипту

#### 2.1 Завантаження з GitHub
```bash
# Варіант 1: Клонувати весь репозиторій
git clone https://github.com/ovishchuk/ovishchuk.site.git
cd ovishchuk.site

# Варіант 2: Завантажити тільки скрипт
wget https://raw.githubusercontent.com/ovishchuk/ovishchuk.site/main/deploy-ubuntu25.sh
chmod +x deploy-ubuntu25.sh
```

#### 2.2 Перевірка скрипту
```bash
# Переглянути скрипт
cat deploy-ubuntu25.sh | head -20

# Перевірити права доступу
ls -la deploy-ubuntu25.sh
```

### Крок 3: Запуск скрипту розгортання

#### 3.1 Запуск з правами sudo
```bash
# Запустити скрипт з правами адміністратора
sudo ./deploy-ubuntu25.sh
```

#### 3.2 Введення пароля
- Скрипт попросить ввести пароль sudo
- Введіть пароль один раз
- Скрипт автоматично підтримуватиме сесію sudo

### Крок 4: Моніторинг процесу розгортання

#### 4.1 Що робить скрипт автоматично:
```
[✓] Перевірка Ubuntu версії
[✓] Встановлення системних залежностей
[✓] Встановлення Node.js 18.x LTS
[✓] Створення директорії проекту
[✓] Клонування/оновлення репозиторію
[✓] Встановлення npm залежностей
[✓] Налаштування змінних середовища
[✓] Налаштування Nginx
[✓] Налаштування брандмауера
[✓] Створення systemd сервісу
[✓] Тестування розгортання
[✓] Створення скрипту оновлення
```

#### 4.2 Логи розгортання
```bash
# Переглянути логи розгортання
sudo tail -f /var/log/animatech-deploy.log

# Або в реальному часі під час виконання
sudo ./deploy-ubuntu25.sh 2>&1 | tee deploy.log
```

### Крок 5: Перевірка результатів

#### 5.1 Перевірка сервісів
```bash
# Перевірити статус сервісів
sudo systemctl status animatech
sudo systemctl status nginx

# Перевірити порти
sudo ss -tlnp | grep -E ':(80|3000)\s'
```

#### 5.2 Тестування доступу
```bash
# Локальне тестування
curl http://localhost:80
curl http://localhost:3000

# Зовнішнє тестування (після налаштування DNS)
curl http://ovishchuk.duckdns.org
```

#### 5.3 Перевірка в браузері
- Відкрийте браузер
- Перейдіть за адресою: `http://your-server-ip`
- Або: `http://ovishchuk.duckdns.org` (якщо DNS налаштовано)

## 🎯 Очікувані результати

### Після успішного розгортання ви побачите:
```
=== DEPLOYMENT STATUS ===
🌐 Website: http://ovishchuk.duckdns.org
📱 Admin Panel: http://ovishchuk.duckdns.org/admin
📁 Project Directory: /var/www/ovishchuk.duckdns.org
📝 Logs: sudo journalctl -u animatech -f
🔄 Update: /var/www/ovishchuk.duckdns.org/update.sh

=== SERVICE STATUS ===
● animatech.service - Animatech Server
   Loaded: loaded (/etc/systemd/system/animatech.service; enabled; vendor preset: enabled)
   Active: active (running) since ...

=== PORT STATUS ===
LISTEN 0      128          0.0.0.0:80         0.0.0.0:*      users:(("nginx",pid=1234,fd=6))
LISTEN 0      511          0.0.0.0:3000       0.0.0.0:*      users:(("node",pid=5678,fd=24))
```

## 🔧 Наступні кроки після розгортання

### 1. Налаштування DNS
```bash
# Перевірити поточну IP адресу
curl ifconfig.me

# Налаштувати A запис в DNS панелі:
# ovishchuk.duckdns.org -> your-server-ip
# www.ovishchuk.duckdns.org -> your-server-ip
```

### 2. Встановлення SSL (HTTPS)
```bash
# Встановити Certbot
sudo apt install certbot python3-certbot-nginx

# Отримати SSL сертифікат
sudo certbot --nginx -d ovishchuk.duckdns.org -d www.ovishchuk.duckdns.org
```

### 3. Налаштування моніторингу
```bash
# Перегляд логів в реальному часі
sudo journalctl -u animatech -f

# Перевірка використання ресурсів
htop
df -h
```

## 🔄 Оновлення сайту

### Автоматичне оновлення
```bash
# Використати готовий скрипт оновлення
sudo /var/www/ovishchuk.duckdns.org/update.sh
```

### Ручне оновлення
```bash
# Перейти в директорію проекту
cd /var/www/ovishchuk.duckdns.org

# Оновити код
sudo -u www-data git fetch origin
sudo -u www-data git reset --hard origin/main

# Оновити залежності
cd server
sudo -u www-data npm install

# Перезапустити сервіс
sudo systemctl restart animatech
```

## 🚨 Вирішення проблем

### Помилка 502 Bad Gateway
```bash
# Перевірити чи працює Node.js
sudo systemctl status animatech

# Перевірити порт
sudo ss -tlnp | grep :3000

# Перезапустити сервіси
sudo systemctl restart animatech nginx
```

### Помилка 503 Service Unavailable
```bash
# Перевірити Nginx конфігурацію
sudo nginx -t

# Перевірити права доступу
sudo chown -R www-data:www-data /var/www/ovishchuk.duckdns.org
```

### Сайт не доступний зовні
```bash
# Перевірити брандмауер
sudo ufw status

# Перевірити Nginx
sudo systemctl status nginx

# Перевірити DNS
nslookup ovishchuk.duckdns.org
```

## 📱 Мобільний доступ

### Перевірка з телефону
1. Переконайтесь що телефон в тій самій WiFi мережі
2. Відкрийте браузер на телефоні
3. Введіть адресу: `http://your-server-ip`
4. Або: `http://ovishchuk.duckdns.org`

### Якщо не працює
- Перевірте чи телефон в тій самій мережі
- Спробуйте відключити мобільний інтернет
- Перевірте брандмауер роутера

## 🎉 Готово!

Після виконання цієї інструкції ваш сайт Animatech буде повністю розгорнутий та доступний за адресою `http://ovishchuk.duckdns.org`.

### Корисні команди:
```bash
# Статус сервісів
sudo systemctl status animatech nginx

# Логи в реальному часі
sudo journalctl -u animatech -f

# Оновлення сайту
sudo /var/www/ovishchuk.duckdns.org/update.sh

# Перезапуск сервісів
sudo systemctl restart animatech nginx
```

---

**🚀 Сайт готовий до роботи!**
