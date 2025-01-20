


Pro spuštění lokální verze stáhněte & nainstalujte tyto aplikace:
node.js - https://nodejs.org/en
visual studio code - https://code.visualstudio.com/
git - https://git-scm.com/
pgAdmin - https://www.enterprisedb.com/downloads/postgres-postgresql-downloads (stáhne to balíček, který by měl obsahovat pgadmina + již vytvořený server)

po stažení gitu si vytvořte složku na projekt -> spusťte příkazový řádek s cestou do složky (měla by vypadat nějak takto C:\Users\TvojeJmeno\Documents\projekt\)
do příkazového řádku napište následující příkaz git clone https://github.com/UsernameMartinn/Maturita.git (tento příkaz naklonuje projekt do vaší složky)

pokud se vše povedlo, přejděte v příkazové řádce do složky maturitni_prace a zde zadejte:
1. npm install (nainstaluje node modules, bez kterých aplikaci nepustíte)
2. npm start (spustí aplikaci defaultně na portu localhost:3000)

Teď na Vás asi vyskočilo spoustu chyb, které vyřešíte následujícími příkazy:
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install react-router-dom

teď Vám běží FRONTEND aplikace, blahopřeji a pokud neběží a někde nastala chyba, tak Vám snad poradí ChatGPT

pro spuštění backendu aplikace si otevřete visual studio code, ke kterému si stáhněte rozšíření pro python
zadejte do příkazové řádky následující příkazy:
pip install flask flask-cors sqlalchemy bcrypt supabase

následně spusťte jeden ze dvou app.py souborů v maturitni_prace/backend/pgAdmin (pro lokální verzi databáze) nebo supaBase (online databáze)

přejděte zpět na svou stránku a pokochejte se její krásou
