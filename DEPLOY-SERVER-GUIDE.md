# 🚀 Інструкція розгортання сайту на віддаленому сервері

## 📋 Передумови

### **1. SSH доступ до сервера**
```bash
# Підключитись до віддаленого сервера
ssh username@server-ip

# Перевірити IP адресу сервера
hostname -I
```

### **2. Перевірка системи на сервері**
```bash
# Перевірити версію ОС
lsb_release -a

# Перевірити чи встановлено Node.js
node --version

# Перевірити чи встановлено Nginx
nginx -v
```

## 🎯 Кроки розгортання

### **Крок 1: Клонування репозиторіїв**

#### **1.1 Клонування сайту**
```bash
# Перейти в домашню директорію
cd ~

# Клонувати сайт
git clone https://github.com/ovishchuk/animatech.site.git
cd animatech.site
```

#### **1.2 Клонування скриптів розгортання**
```bash
# Клонувати скрипти розгортання
git clone https://github.com/ovishchuk/animatech.site.deploy.git
cd animatech.site.deploy
```

### **Крок 2: Налаштування середовища**

#### **2.1 Створення .env файлу**
```bash
# Перейти в папку сервера
cd animatech.site/server

# Створити .env файл
cat > .env << EOF
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
JWT_SECRET=$(openssl rand -base64 32)
EOF

# Встановити права
chmod 600 .env
```

#### **2.2 Перевірка конфігурації**
```bash
# Перевірити чи правильно створено .env
cat .env
```

### **Крок 3: Встановлення залежностей**

#### **3.1 Встановлення Node.js залежностей**
```bash
# Встановити залежності
npm install

# Перевірити чи все встановлено
npm list
```

### **Крок 4: Налаштування Nginx**

#### **4.1 Перевірка існуючої конфігурації**
```bash
# Перевірити чи існує конфігурація
ls -la /etc/nginx/sites-available/

# Перевірити поточну конфігурацію
cat /etc/nginx/sites-available/animatech
```

#### **4.2 Копіювання конфігурації**
```bash
# Копіювати конфігурацію з репозиторію
sudo cp ~/animatech.site.deploy/configs/nginx/animatech.conf /etc/nginx/sites-available/

# Активувати сайт
sudo ln -sf /etc/nginx/sites-available/animatech /etc/nginx/sites-enabled/

# Видалити сайт за замовчуванням
sudo rm -f /etc/nginx/sites-enabled/default

# Тестування конфігурації
sudo nginx -t

# Перезапустити Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### **Крок 5: Налаштування systemd сервісу**

#### **5.1 Створення systemd сервісу**
```bash
# Копіювати конфігурацію сервісу
sudo cp ~/animatech.site.deploy/configs/systemd/animatech.service /etc/systemd/system/

# Перезавантажити systemd
sudo systemctl daemon-reload

# Активувати сервіс
sudo systemctl enable animatech
sudo systemctl start animatech
```

### **Крок 6: Налаштування брандмауера**

#### **6.1 Відкриття портів**
```bash
# Дозволити SSH
sudo ufw allow OpenSSH

# Дозволити HTTP
sudo ufw allow 80/tcp

# Дозволити Node.js порт
sudo ufw allow 3000/tcp

# Активувати брандмауер
sudo ufw --force enable

# Перевірити статус
sudo ufw status
```

### **Крок 7: Тестування розгортання**

#### **7.1 Перевірка сервісів**
```bash
# Перевірити статус сервісів
sudo systemctl status animatech
sudo systemctl status nginx

# Перевірити порти
sudo ss -tlnp | grep -E ':(80|3000)\s'
```

#### **7.2 Тестування з'єднань**
```bash
# Тестування локального з'єднання
curl http://localhost:3000
curl http://localhost:80

# Тестування зовнішнього з'єднання
curl http://your-server-ip
curl http://animatech.duckdns.org
```

## 🔧 Конфігураційні файли

### **.env файл**
```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
JWT_SECRET=your-secret-key-here
```

### **Nginx конфігурація**
- **Шлях**: `/etc/nginx/sites-available/animatech`
- **Домен**: `animatech.duckdns.org`
- **Проксі**: `http://localhost:3000`

### **Systemd сервіс**
- **Шлях**: `/etc/systemd/system/animatech.service`
- **Користувач**: `shur`
- **Директорія**: `/var/www/animatech/server`

## 🚀 Запуск розгортання

### **Автоматичний запуск**
```bash
# Запустити скрипт розгортання
cd ~/animatech.site.deploy
sudo ./deploy-ubuntu25.sh
```

### **Ручне налаштування**
```bash
# Запустити сайт
cd /var/www/animatech/server
npm start

# Перевірити логи
sudo journalctl -u animatech -f
```

## 📱 Мобільний доступ

### **Перевірка з телефону**
1. Переконайтеся що телефон в тій самій WiFi мережі
2. Відкрийте браузер на телефоні
3. Введіть адресу: `http://your-server-ip`
4. Або: `http://animatech.duckdns.org`

## 🔍 Вирішення проблем

### **Помилка 502 Bad Gateway**
```bash
# Перевірити чи працює Node.js
sudo systemctl status animatech

# Перевірити порт
sudo ss -tlnp | grep :3000

# Перезапустити сервіси
sudo systemctl restart animatech
sudo systemctl restart nginx
```

### **Помилка 503 Service Unavailable**
```bash
# Перевірити Nginx конфігурацію
sudo nginx -t

# Перевірити права доступу
sudo chown -R shur:shur /var/www/animatech
sudo chmod -R 755 /var/www/animatech
```

### **Сайт не доступний зовні**
```bash
# Перевірити брандмауер
sudo ufw status

# Перевірити DNS
nslookup animatech.duckdns.org

# Перевірити Nginx
sudo systemctl status nginx
```

## 📊 Моніторинг

### **Перевірка логів**
```bash
# Логи сервісу
sudo journalctl -u animatech -f

# Логи Nginx
sudo tail -f /var/log/nginx/animatech_access.log
sudo tail -f /var/log/nginx/animatech_error.log

# Логи розгортання
sudo tail -f /var/log/animatech-deploy.log
```

### **Перевірка ресурсів**
```bash
# Завантаження системи
htop

# Дисковий простір
df -h

# Мережеві з'єднання
sudo netstat -tlnp
```

## 🔄 Оновлення

### **Оновлення сайту**
```bash
# Оновити код
cd /var/www/animatech
git pull origin main

# Оновити залежності
cd server
npm install

# Перезапустити сервіс
sudo systemctl restart animatech
```

### **Оновлення скриптів розгортання**
```bash
# Оновити скрипти
cd ~/animatech.site.deploy
git pull origin main

# Відправити на сервер
git push origin main
```

## 🎉 Готово!

Після виконання цієї інструкції ваш сайт Animatech буде повністю розгорнутий на віддаленому сервері!

### **Очікувані результати:**
- ✅ **Сайт доступний** за `http://animatech.duckdns.org`
- ✅ **Неонові вивіски** працюють в секції "Про себе"
- ✅ **Навігація** відображається правильно
- ✅ **Автозапуск** сервісів налаштований
- ✅ **Мобільний доступ** з будь-якого пристрою

---

**🚀 Сайт готовий до роботи на віддаленому сервері!**
