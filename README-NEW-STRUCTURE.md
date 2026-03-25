# 🚀 Нова структура репозиторіїв Animatech

## 📋 Перейменування репозиторіїв

### **Основний сайт**: `animatech.site`
- Код сайту Animatech
- HTML, CSS, JavaScript
- Серверний код (Node.js)
- **URL**: https://github.com/ovishchuk/animatech.site.git

### **Скрипти розгортання**: `animatech.site.deploy`
- Автоматизація розгортання
- Конфігурації Nginx та systemd
- Документація та інструкції
- **URL**: https://github.com/ovishchuk/animatech.site.deploy.git

## 🎯 Переваги нової структури

### **Чистий розділ коду**
- 📁 Тільки код сайту без скриптів розгортання
- 🔄 Просте оновлення через git pull
- 📦 Менший розмір репозиторію
- 🎨 Чиста історія комітів

### **Спеціалізований репозиторій розгортання**
- 🛠️ Тільки інфраструктура розгортання
- 📋 Детальна документація та інструкції
- 🔧 Конфігурації для різних ОС
- 📊 Скрипти моніторингу та перевірки
- 🔄 Незалежне оновлення скриптів

## 📁 Структура проекту

### **animatech.site (основний репозиторій)**
```
animatech.site/
├── html/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       └── animations.js
├── server/
│   ├── app.js
│   ├── database.js
│   └── package.json
├── admin/
│   └── index.html
├── README.md
├── .gitignore
└── LICENSE
```

### **animatech.site.deploy (репозиторій розгортання)**
```
animatech.site.deploy/
├── deploy-ubuntu25.sh          # Скрипт розгортання Ubuntu 25.04
├── deploy-ubuntu24.sh          # Скрипт розгортання Ubuntu 24.04
├── deploy-centos.sh             # Скрипт розгортання CentOS
├── README-DEPLOYMENT.md       # Документація розгортання
├── SCRIPT-USAGE.md           # Інструкція використання
├── configs/                  # Конфігураційні файли
│   ├── nginx/
│   │   └── animatech.conf
│   └── systemd/
│       └── animatech.service
├── scripts/                  # Допоміжні скрипти
│   ├── health-check.sh
│   └── update.sh
├── docs/                     # Документація
│   ├── troubleshooting.md
│   └── ssl-setup.md
├── .gitignore                # Git ignore файл
└── README.md                  # Основна документація
```

## 🔄 Процес роботи

### **Розробка:**
```bash
# Робота з кодом сайту
git clone https://github.com/ovishchuk/animatech.site.git
cd animatech.site
# ... розробка ...
git add .
git commit -m "feat: new feature"
git push origin main
```

### **Розгортання:**
```bash
# Клонування скриптів розгортання
git clone https://github.com/ovishchuk/animatech.site.deploy.git
cd animatech.site.deploy

# Розгортання сайту
sudo ./deploy-ubuntu25.sh
```

### **Оновлення сайту:**
```bash
# Оновлення коду сайту
cd animatech.site
git pull origin main

# Оновлення на сервері
sudo /var/www/animatech/update.sh
```

### **Оновлення скриптів розгортання:**
```bash
# Оновлення скриптів
cd animatech.site.deploy
git pull origin main

# Відправити на сервер
git push origin main
```

## 🎯 Конфігурація

### **Домен**: `animatech.duckdns.org`
### **Директорія сайту**: `/var/www/animatech`
### **Nginx конфіг**: `/etc/nginx/sites-available/animatech`
### **Systemd сервіс**: `animatech.service`

## 📋 Команди

### **Розгортання:**
```bash
# Для Ubuntu 25.04
sudo ./deploy-ubuntu25.sh

# Перевірка статусу
./scripts/health-check.sh
```

### **Оновлення:**
```bash
# Оновлення сайту
sudo /var/www/animatech/update.sh

# Перевірка здоров'я
./scripts/health-check.sh
```

## 🌐 Доступ

- **Сайт**: http://animatech.duckdns.org
- **Адмін панель**: http://animatech.duckdns.org/admin
- **API**: http://animatech.duckdns.org/api

## 🎉 Переваги

### **Для розробки:**
- 🎨 Чистий репозиторій без зайвих файлів
- 📝 Чиста історія комітів
- 🔄 Просте оновлення
- 📦 Менший розмір

### **Для розгортання:**
- 🛠️ Професійні скрипти розгортання
- 📋 Детальна документація
- 🔧 Підтримка різних ОС
- 📊 Моніторинг та перевірка
- 🔄 Автоматичне оновлення

### **Для підтримки:**
- 🎯 Чіткий розділ відповідальності
- 📈 Легке масштабування
- 🔧 Гнучкість налаштувань
- 📊 Покращений моніторинг

---

**🚀 Нова структура репозиторіїв готова до використання!**

**Сайт**: https://github.com/ovishchuk/animatech.site.git
**Скрипти**: https://github.com/ovishchuk/animatech.site.deploy.git
