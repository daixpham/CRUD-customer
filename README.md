# CRUD Customer 👥

Ein Fullstack-Projekt zur Verwaltung von Kundendaten (Create, Read, Update, Delete). 

Dieses Repository enthält den Quellcode für die Frontend- und Backend-Komponenten der Anwendung. Das Projekt nutzt **Togglz** für das Feature-Flag-Management.

## 🌐 Live Demo

Die Anwendung ist live und kann unter den folgenden Links erreicht werden:

* **Frontend-Anwendung:** [http://crud-customer.s3-website.eu-central-1.amazonaws.com/](http://crud-customer.s3-website.eu-central-1.amazonaws.com/) (Gehostet auf AWS S3)
* **Togglz Console (Feature Flags):** [https://crud-customer.onrender.com/togglz-console/index](https://crud-customer.onrender.com/togglz-console/index)

> ⚠️ **WICHTIGER HINWEIS ZUR LADEZEIT (Backend):**
> Das Backend wird über den *Free Tier* von Render gehostet. Wenn die API für eine Weile inaktiv war, geht der Server in einen Ruhezustand (Spin-down). **Beim ersten Aufruf der Seite kann es daher bis zu 50 Sekunden dauern**, bis das Backend wieder hochgefahren ist . Bitte habe beim ersten Start etwas Geduld!

## 🚀 Architektur & Hosting

* **Frontend:** Gehostet als statische Website auf einem AWS S3 Bucket in der Region `eu-central-1`.
* **Backend:** Gehostet als Web Service auf Render.
* **Feature Toggles:** Implementiert mit Togglz. Über die Konsole lassen sich Features zur Laufzeit ein- und ausschalten.

## 📝 Bekannte Einschränkungen 

Aufgrund von Zeitmangel wurden einige Features, die für eine vollständig produktionsreife Anwendung notwendig wären.

* 🔒 **Authentifizierung & Security:** Aktuell ist keine Authentifizierung für die API implementiert (kein Token-Handling, JWT, OAuth etc.). Die Endpunkte sind derzeit ungeschützt.
* 🧪 **Frontend E2E-Testing:** Es fehlen End-to-End- oder Screenshot-Tests für die Benutzeroberfläche (z. B. mit Playwright oder Cypress), um visuelle Regressionen zu vermeiden.
* 🌍 **Umgebungs-Trennung (Environments):** Es gibt momentan keine strikte Trennung zwischen Entwicklungs- (`dev`) und Produktionsumgebung (`prod`).

### Backend starten

Stelle sicher, dass du dich im Hauptverzeichnis des Projekts befindest, und starte das Spring Boot Backend über den Gradle-Wrapper:

```bash
./gradlew bootRun
```
Das Backend läuft nun lokal und ist erreichbar (standardmäßig meist unter `http://localhost:8080`).

### Frontend starten

Öffne ein neues Terminal-Fenster, wechsle in das Frontend-Verzeichnis, installiere die Abhängigkeiten und starte den Entwicklungsserver:

```bash
cd frontend
npm install  # Nur beim allerersten Mal nötig
npm run dev
```
Das Frontend ist nun lokal erreichbar (den genauen Port, z.B. `http://localhost:5173`, zeigt dir das Terminal an).
