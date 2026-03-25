# 🔄 Відновлення репозиторію сайту

## 🚨 Проблема: Репозиторій `animatech.site` видалено

### **Що сталося:**
- ❌ Репозиторій `https://github.com/ovishchuk/animatech.site` повертає 404
- 📁 Всі коміти та функціональність втрачено
- 🔄 Потрібно відновити репозиторій з нуля

## 🎯 План відновлення

### **Крок 1: Створення нового репозиторію**
```bash
# Створити новий репозиторій
gh repo create animatech.site --public --description "Animatech - Living AI & Robotics Platform"

# Або через веб-інтерфейс
# 1. Перейти на https://github.com
# 2. Натиснути "+" → "New repository"
# 3. Назва: animatech.site
# 4. Опис: Animatech - Living AI & Robotics Platform
# 5. Публічний: ✅
# 6. Створити репозиторій
```

### **Крок 2: Налаштування локального репозиторію**
```bash
# Перейти в папку проекту
cd /home/shur/projects/ovishchuk.site

# Додати новий remote
git remote set-url origin https://github.com/ovishchuk/animatech.site.git

# Перевірити remote
git remote -v
```

### **Крок 3: Відправлення коду**
```bash
# Додати всі файли
git add .

# Перевірити статус
git status

# Відправити коміт
git commit -m "feat: restore Animatech website with neon signs

- Restore full website functionality
- Add interactive neon signs for About section
- Implement NeonSignsController with automatic cycling
- Add IT code, 3D printer, Linux terminal signs
- Include hover interactions and morphing animations
- Fix navigation visibility and mobile responsiveness
- Add comprehensive deployment documentation"

# Відправити на GitHub
git push -u origin main
```

### **Крок 4: Оновлення скриптів розгортання**
```bash
# Перейти в папку скриптів
cd /home/shur/deploy-repos/animatech.site.deploy

# Оновити URL репозиторію сайту
sed -i 's|REPO_URL="https://github.com/ovishchuk/old-repo.git"|REPO_URL="https://github.com/ovishchuk/animatech.site.git"|' deploy-ubuntu25.sh

# Відправити зміни
git add .
git commit -m "fix: update site repository URL to new animatech.site"
git push origin main
```

## 📋 Важливі нотатки

### **1. Збереження бекапів**
```bash
# Створити бекап перед змінами
cp -r /home/shur/projects/ovishchuk.site /home/shur/projects/ovishchuk.site.backup.$(date +%Y%m%d_%H%M%S)
```

### **2. Перевірка після відновлення**
```bash
# Перевірити чи всі файли на місці
git status

# Перевірити чи віддалений репозиторій доступний
curl -s https://api.github.com/repos/ovishchuk/animatech.site
```

### **3. Оновлення всіх посилань**
```bash
# Оновити посилання в README файлах
find . -name "*.md" -exec sed -i 's|old-repo|animatech.site|g' {} \;

# Оновити посилання в скриптах
find . -name "*.sh" -exec sed -i 's|old-repo|animatech.site|g' {} \;
```

## 🎯 Рекомендований порядок дій

### **1. Створення репозиторію** (5 хвилин)
- Використати GitHub CLI або веб-інтерфейс
- Перевірити що репозиторій створено

### **2. Відновлення локального репозиторію** (2 хвилини)
- Налаштувати новий remote URL
- Відправити код з повною історією

### **3. Оновлення скриптів розгортання** (2 хвилини)
- Оновити URL сайту в скриптах
- Відправити зміни на GitHub

### **4. Тестування** (5 хвилин)
- Перевірити чи всі посилання працюють
- Тестувати клонування нового репозиторію
- Перевірити доступність GitHub API

## 📊 Очікувані результати

### **Після відновлення:**
- ✅ **Сайт доступний** за новою адресою
- ✅ **Скрипти розгортання** працюють з правильним репозиторієм
- ✅ **Повна історія** збережена
- ✅ **Документація** актуальна

---

**🚀 Відновіть репозиторій `animatech.site` і продовжуйте роботу!**

**Поточний статус:**
- 🌐 **Сайт**: https://github.com/ovishchuk/animatech.site (404 - Not Found)
- 🛠️ **Скрипти**: https://github.com/ovishchuk/animatech.site.deploy (працює)
- 📁 **Локальна копія**: `/home/shur/projects/ovishchuk.site` (повна)

**Не гайте час - відновлюйте репозиторій!**
