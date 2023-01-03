## In-Browser Jupyter instance

Hier befinden sich die Konfigurationsdateien für eine Wasm basierte Jupyter Umgebung die im Browser läuft.
Weitere python packages können in der requirements.txt hinzugefügt werden.
Der statische output kann dann mit 
```
npm run build:jupyter
``` 
neu generiert werden und wird im nächten build mit der angular app deployed.

Notebooks könnnen in dem _files_ ordner hinterlegt werden.