@echo off

wt -w 0 nt -d "./backend" uvicorn app.main:app --port 8080 --reload

timeout /t 3

cd "./frontend"
npm run dev
