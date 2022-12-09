# Ki-Labor Projekt
Das Ki-Labor ist eine interaktive Lernplatform für alles rund ums künstliche Intelligenz und Machine Learning.
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
Es ist also empfohlen eine Code Editor oder eine IDE zu verwenden, die ESlint unterstützt.
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

# MlWebsite

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
