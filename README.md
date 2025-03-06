
# React Taschenrechner App mit GitHub Actions CI/CD

Dieses Projekt ist eine einfache **React-App**, die als **Grundrechenarten-Taschenrechner** fungiert und **GitHub Actions** für kontinuierliche Integration (CI) und kontinuierliche Bereitstellung (CD) nutzt. Es automatisiert den Test- und Bereitstellungsprozess für React-Anwendungen.

## Funktionen

- **Einfacher Taschenrechner:** Die App ermöglicht es Benutzern, grundlegende arithmetische Operationen wie Addition, Subtraktion, Multiplikation und Division durchzuführen.
- **CI mit GitHub Actions:** Die App enthält einen GitHub Actions Workflow, der automatisch Tests ausführt, wenn ein Pull Request in den `main`-Branch gestellt wird.
- **CD mit GitHub Actions:** Die App wird automatisch auf eine EC2-Instanz mit Nginx bereitgestellt, mit automatisiertem Build, Upload von Artefakten und Deployment.

## Struktur

### **App.jsx**

Die App ist mit React und funktionalen Komponenten sowie Hooks aufgebaut. Sie enthält:

- Zwei Eingabefelder für die Zahlen (`num1` und `num2`).
- Ein Dropdown-Menü zur Auswahl der arithmetischen Operation (`+`, `-`, `*`, `/`).
- Einen Button, um die Berechnung auszulösen.

Der Code führt die Berechnung durch und zeigt das Ergebnis an oder gibt eine Fehlermeldung aus, wenn ungültige Eingaben gemacht wurden (z.B. durch 0 teilen).

### **App.test.jsx**

Die Tests für die App werden mit **Jest** und **React Testing Library** durchgeführt. Ein Beispieltest prüft, ob die Addition korrekt funktioniert:

- Zwei Zahlen werden eingegeben und die Addition durchgeführt.
- Das Ergebnis wird überprüft und mit dem erwarteten Wert verglichen.

### **GitHub Actions Workflows**

#### **CI - Test React App**

Dieser Workflow wird bei jedem **Pull Request** auf den `main`-Branch ausgelöst. Er führt folgende Schritte aus:

1. Checkout des Repositories.
2. Einrichtung von Node.js.
3. Installation der Abhängigkeiten.
4. Ausführung der Tests.

```yaml
name: CI - Test React App

on:
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install Dependencies
        run: cd app && npm install
      - name: Run Tests
        run: cd app && npm test
```

#### **CD - Deploy to EC2**

Dieser Workflow wird bei jedem **Push** in den `main`-Branch ausgelöst. Er besteht aus zwei Schritten:

1. **Build und Artefakt-Upload:** 
   - Der Build der React-App wird erstellt.
   - Das erstellte Artefakt wird in einem GitHub-Artifact gespeichert.

2. **Deployment auf EC2:**
   - Das Artefakt wird auf eine EC2-Instanz heruntergeladen.
   - Nginx wird installiert (falls nicht vorhanden) und konfiguriert.
   - Der Inhalt des Build-Ordners wird in das Nginx-Verzeichnis kopiert.
   - Nginx wird neu gestartet, um die App bereitzustellen.

```yaml
name: CD - Deploy to EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install Dependencies
        run: cd app && npm install
      - name: Build React App
        run: cd app && npm run build
      - name: Upload Build Artifact
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: app/dist

  deploy-to-ec2:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
      - name: Download Build Artifact
        uses: actions/download-artifact@v4
        with:
          name: build
          path: dist
      - name: Setup ssh keys
        uses: webfactory/ssh-agent@v0.5.3
        with:
          ssh-private-key: ${{ secrets.EC2_SSH_KEY }}
      - name: Deploy to EC2
        env:
          EC2_HOST: ${{ secrets.EC2_HOST }}
          EC2_USER: ubuntu
        run: |
          scp -o StrictHostKeyChecking=no -r dist/* $EC2_USER@$EC2_HOST:~/app
          ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST << 'EOF'
            if ! command -v nginx &> /dev/null; then
              sudo apt update
              sudo apt install -y nginx
            fi
            sudo rm -rf /var/www/html/*
            sudo cp -r ~/app/* /var/www/html/
            echo 'server {
              listen 80;
              server_name _;
              root /var/www/html;
              index index.html;
              location / {
                try_files $uri /index.html;
              }
            }' | sudo tee /etc/nginx/sites-available/default
            sudo ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
            sudo systemctl restart nginx
          EOF
```

## Voraussetzungen

- **Node.js** (Version 18 oder höher)
- **React** und **npm** für die Entwicklung und den Build.
- **GitHub Actions** für CI/CD.
- Eine **EC2-Instanz** mit **Nginx** für das Deployment.

## Nutzung

1. Klone das Repository und installiere die Abhängigkeiten:
   ```bash
   git clone <repo-url>
   cd <repo-directory>
   npm install
   ```

2. Starte die App lokal:
   ```bash
   npm run dev
   ```

3. Mache einen **Pull Request** für den Test-Workflow oder pushe Änderungen zum `main`-Branch, um den Deployment-Workflow zu starten.

---

Viel Spaß beim Ausprobieren und Testen! 🚀
