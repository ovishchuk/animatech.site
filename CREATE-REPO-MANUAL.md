# 🚀 Створення репозиторію Animatech.site - Покрокова інструкція

## 📋 Крок 1: Вхід в GitHub

### **1.1 Відкрити GitHub**
1. Перейдіть на [https://github.com](https://github.com)
2. Увійдіть у свій акаунт
3. Натисніть "+" у верхньому правому кутку

### **1.2 Створення нового репозиторію**
1. Натисніть кнопку **"New repository"**
2. Заповніть форму:
   - **Repository name**: `animatech.site`
   - **Description**: `Animatech - Living AI & Robotics Platform`
   - **Public**: ✅ (поставте галочку)
   - **Add README**: ❌ (поки не ставте)
   - **Add .gitignore**: ❌ (поки не ставте)
   - **License**: `MIT`
3. Натисніть **"Create repository"**

## 📋 Крок 2: Налаштування локального репозиторію

### **2.1 Перевірка поточного стану**
```bash
# Перевірити поточний remote
cd /home/shur/projects/ovishchuk.site
git remote -v

# Очікуваний результат:
# origin  https://github.com/ovishchuk/old-repo.git (fetch)
# origin  https://github.com/ovishchuk/old-repo.git (push)
```

### **2.2 Оновлення remote URL**
```bash
# Видалити старий remote
git remote remove origin

# Додати новий remote
git remote add origin https://github.com/ovishchuk/animatech.site.git

# Перевірити новий remote
git remote -v

# Очікуваний результат:
# origin  https://github.com/ovishchuk/animatech.site.git (fetch)
# origin  https://github.com/ovishchuk/animatech.site.git (push)
```

### **2.3 Відправка коду**
```bash
# Додати всі файли
git add .

# Перевірити статус
git status

# Створити коміт
git commit -m "feat: restore Animatech website with neon signs

- Restore full website functionality after repository deletion
- Add interactive neon signs for About section
- Implement NeonSignsController with automatic cycling
- Add IT code, 3D printer (Prusa Mini style), Linux terminal signs
- Include hover interactions and morphing animations
- Fix navigation visibility and mobile responsiveness
- Add comprehensive deployment documentation
- Restore all lost commits and functionality"

# Відправити на GitHub
git push -u origin main
```

## 📋 Крок 3: Оновлення скриптів розгортання

### **3.1 Перейти в папку скриптів**
```bash
cd /home/shur/deploy-repos/animatech.site.deploy
```

### **3.2 Оновлення URL репозиторію**
```bash
# Редагувати скрипт розгортання
nano deploy-ubuntu25.sh

# Знайти рядок з REPO_URL
/REPO_URL="https://github.com/ovishchuk/old-repo.git"

# Замінити на новий URL
REPO_URL="https://github.com/ovishchuk/animatech.site.git"

# Зберегти зміни (Ctrl+X, Y, Enter)
```

### **3.3 Відправка змін**
```bash
# Додати зміни
git add deploy-ubuntu25.sh

# Створити коміт
git commit -m "fix: update site repository URL to new animatech.site"

# Відправити на GitHub
git push origin main
```

## 📋 Крок 4: Перевірка

### **4.1 Перевірка сайту**
```bash
# Перевірити чи репозиторій доступний
curl -s https://api.github.com/repos/ovishchuk/animatech.site

# Перевірити чи сайт клонується
git clone https://github.com/ovishchuk/animatech.site.git /tmp/test-clone
ls /tmp/test-clone
rm -rf /tmp/test-clone
```

### **4.2 Перевірка скриптів**
```bash
# Перевірити чи скрипти оновлені
git pull origin main

# Перевірити зміни
git diff HEAD~1 deploy-ubuntu25.sh
```

## 📋 Крок 5: Тестування розгортання

### **5.1 Запуск розгортання**
```bash
# Запустити скрипт розгортання
cd /home/shur/deploy-repos/animatech.site.deploy
sudo ./deploy-ubuntu25.sh
```

### **5.2 Перевірка результату**
```bash
# Перевірити статус сервісів
sudo systemctl status animatech
sudo systemctl status nginx

# Перевірити доступність сайту
curl http://localhost:80
curl http://animatech.duckdns.org
```

## 🎯 Після успішного створення

### **Очікувані результати:**
- ✅ **Новий репозиторій** створено
- ✅ **Сайт відновлено** на GitHub
- ✅ **Скрипти розгортання** оновлені
- ✅ **Розгортання** готове до тестування

## 🔧 Варіанти створення репозиторію

### **Варіант 1: Веб-інтерфейс** (рекомендовано)
- Простий та візуальний
- Не потребує встановлення додаткових інструментів

### **Варіант 2: GitHub CLI** (потрібно встановити)
```bash
# Встановити GitHub CLI
curl -fsSL https://cli.github.com/packages/github-cli.sh | bash

# Створити репозиторій
gh repo create animatech.site --public --description "Animatech - Living AI & Robotics Platform"
```

### **Варіант 3: API** (для автоматизації)
```bash
# Використовувати Personal Access Token
curl -X POST -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{"name":"animatech.site","description":"Animatech - Living AI & Robotics Platform","private":false}' \
  https://api.github.com/user/repos
```

## 🎉 Готово до створення репозиторію!

**Виконуйте ці кроки по черзі і незабаром відновите репозиторій `animatech.site`!**

**📝 Усі команди готові до копіювання та виконання.**

---

**🚀 Після створення репозиторію - поверніться до кроку 2 для налаштування локального репозиторію!**
