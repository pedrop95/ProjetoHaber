@echo off
REM Inicia backend e frontend em janelas separadas (Windows)

REM 1) Backend (Django)
start "Backend" cmd /k "cd /d %~dp0backend && .venv\Scripts\Activate && python manage.py runserver"

REM 2) Frontend (React)
start "Frontend" cmd /k "cd /d %~dp0frontend\projeto-haber-frontend && npm start"

echo Servidores backend e frontend em inicialização. Feche esta janela se quiser. pause
