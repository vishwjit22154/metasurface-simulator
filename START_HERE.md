# 🚀 SIMPLE STARTUP INSTRUCTIONS

## Terminal 1 - Start Backend

```bash
cd "/Users/hvishwajit/1 bit/metasurface-simulator/backend"
/usr/bin/python3 server.py
```

Wait until you see:
```
* Running on http://127.0.0.1:5002
```

## Terminal 2 - Start Frontend

Open a NEW terminal window and run:

```bash
cd "/Users/hvishwajit/1 bit/metasurface-simulator"
npm start
```

Wait for it to open in your browser automatically at http://localhost:3000

---

## That's it!

The app will open automatically in your browser.

If you see "Cannot connect to backend", make sure Terminal 1 is still running.

To stop: Press `Ctrl+C` in both terminal windows.

---

## If Port is In Use

If you see "Port 5002 is in use", run this first:
```bash
lsof -ti:5002 | xargs kill -9
```
Then try starting the backend again.
