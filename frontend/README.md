# Incredible Graphics

Incredible Graphics is a React/Vite portfolio and project-inquiry website
connected to the existing Express/MongoDB API.

## Run locally

1. Configure the backend environment in `backend/.env` (including the MongoDB
   connection and the existing authentication/Cloudinary settings).
2. In one terminal, start the API from the project root:

   ```powershell
   Set-Location backend
   npm install
   node server.js
   ```

3. In another terminal, start the frontend:

   ```powershell
   Set-Location frontend
   npm install
   npm run dev
   ```

The frontend expects the API at `http://localhost:5000/api`. The public site
uses published projects, active services, and active reels returned by the API.

## Checks

From `frontend`, run `npm run build` to create a production build or
`npm run lint` to run Oxlint.
