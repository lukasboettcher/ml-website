# Ki-Labor Projekt
Das Ki-Labor ist eine interaktive Lernplatform für alles rund um künstliche Intelligenz und Machine Learning.
Das Projekt verwendet Angular als Frontend Framework. Für den Großteil der Machine Learning Komponenten wird Tensorflow.js verwendet.

### Voraussetzungen
-   NodeJS Version >= 16
-   NPM Version >=6

### Grundlegender Umgang
Projekt Clonen und Dependencies installieren:
```
git clone https://git.informatik.uni-kiel.de/stu210239/ml-website
cd ml-website
npm install
```

Dev Server und Builds ausführen:
```
# Dev Server starten, ki-labor ist unter http://localhost:4200/ erreichbar.
npm start

# Angular Projekt kompilieren -> dist/
npm run build
```

Für die Installation externer NPM Pakete:
```
npm install <pkg>
```

Einrichten einer neuen Komponente:
```
ng generate component <path>

# Beispiel für eine neue text Komponente
ng generate component text/newcomponent

# Dies erstellt .ts, .html, .css einer neuen Angular Komponente 
# und importiert diese automatisch in app.module.ts

# Danach muss eine Route (URL im Browser) in app-routing.module.ts eingerichtet werden.
# Zuletzt muss auf die Komponente von der Navbar und der Startseite verlinkt werden.
src/app/navbar/navbar.component.html # Navbar anpassen
src/app/home/home.component.ts # Neue Card für die Komponente anlegen in 'cardsData'.
```

### Style Standard
Für das Projekt wird ein Standard Codestyle verwendet, der in .eslintrc.json definiert ist.
Dies hilft sicherzustellen, dass der Code einem konsistenten Stil entspricht, was das Lesen und Warten des Codes erleichtert.
Außerdem kann ESlint viele Probleme mit dem Stil und der Formatierung automatisch beheben, wodurch Zeit und Aufwand gespart werden.
Es ist also empfohlen einen Code Editor oder eine IDE zu verwenden, die ESlint unterstützt.
Zum Beispiel [Visual Studio Code](https://code.visualstudio.com/) zusammen mit der [Angular Language Service Extension](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template).

### Projekt Struktur
```
├── angular.json        Angular Config
├── dist                Output für Builds
├── e2e                 Unit Test Ordner (nicht verwended)
├── .gitlab-ci.yml      CI/CD Pipeline Config
├── node_modules        Installierte Pakete
├── package.json        NPM Metadaten, liste von Dependencies
├── src/                Ressourcen
│   ├── app                 Angular Code
│   │   ├── app.component.css       CSS einer Komponente
│   │   ├── app.component.html      HTML einer Komponente
│   │   ├── app.component.spec.ts   Tests einer Komponente
│   │   ├── app.component.ts        Code einer Komponente
│   │   ├── app.module.ts           App Root
│   │   ├── app-routing.module.ts   Globale Routing Config
│   │   ├── ...
│   │   └── classify            Unterordner für einzelne Komponenten
│   ├── assets              Statische Assets (Bilder, TF Modelle, Videos)
│   ├── .htaccess           Apache Config
│   ├── index.html          HTML Root
│   ├── main.ts             Entrypoint
│   ├── perceptron-root     Externes Projekt, wird bei Builds mit exportiert
│   └── styles.css          Globale Styles
└── tsconfig.json       Typescript Config
```

### Best Practice
Angular als Frontend Framework stellt eine Vielzahl von Hilfsmitteln bereit, um die Entwicklung zu erleichtern.
Es ist oft keine gute Idee weitere externe Tools, wie JQuery, herbeizuziehen, um Angular interne Funktionen zu ersetzen.
Gleiches gilt auch für externe Frameworks.
So gibt es zum Beispiel für das Bootstrap toolkit ein ```ng-bootstrap``` Paket, welches speziell dafür gedacht ist Bootstrap in Angular mit Komponenten zu integrieren.

## Weitere Hilfe

Weitere Hilfe und Details zu Angular gibt es in der [Angular Reference](https://angular.io/guide/architecture) Seite.

Des Weiteren hier einige Links zu den Dokumentationen einiger verwendeter Pakete:
- [TFjs Reference](https://js.tensorflow.org/api/latest/)
- [Bootstrap Reference](https://getbootstrap.com/docs/5.2/getting-started/introduction/)