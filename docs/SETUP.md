\# Project Setup Guide – Group 4 To-Do Application



This guide explains how to download, configure, and run the To-Do application on a Windows computer.



Each team member must complete these steps on their own computer.



\## 1. Prerequisites



Install the following software:



\- \*\*Git\*\* – for cloning and managing the project.

\- \*\*Node.js\*\* – a version compatible with Angular 20 (npm is included).

\- \*\*PostgreSQL\*\* – for database management.



Verify the installations in PowerShell:



```powershell

git --version

node -v

npm -v

psql --version

```



\## 2. Clone the Repository



Open PowerShell and run:



```powershell

git clone https://github.com/arohi06/To-do-project-GRP-4.git

cd To-do-project-GRP-4

```



This downloads the project to your computer.



\## 3. Set Up the Backend



Open a terminal inside the project folder:



```powershell

cd backend

npm install

```



This installs the backend dependencies.



\### Configure Environment Variables



Create your own `.env` file using the example:



```powershell

Copy-Item .env.example .env

```



Open it:



```powershell

notepad .env

```



Add your own PostgreSQL password and a private JWT secret.



Example:



```env

PORT=5000

DB\_HOST=localhost

DB\_PORT=5432

DB\_NAME=todo\_app

DB\_USER=postgres

DB\_PASSWORD=your\_postgres\_password

JWT\_SECRET=your\_private\_secret

```



Save the file.



\*\*Important:\*\* Never upload your `.env` file or share your database password. Each team member must use their own local credentials.



\## 4. Set Up PostgreSQL



Make sure PostgreSQL is installed and running.



Open PowerShell and connect to PostgreSQL:



```powershell

psql -U postgres -h localhost

```



Create the project database:



```sql

CREATE DATABASE todo\_app;

```



Exit PostgreSQL:



```sql

\\q

```



Each team member must create their own local `todo\_app` database.



\## 5. Start the Backend Server



In the backend terminal, run:



```powershell

npm run dev

```



The backend server should start on:



`http://localhost:5000`



To check the API, open:



`http://localhost:5000/api/health`



A successful response should indicate that the API is running and the database is connected.



\## 6. Set Up the Frontend



Open a \*\*second PowerShell terminal\*\*.



Navigate to the frontend folder from the project root:



```powershell

cd frontend

npm install

```



This installs the frontend dependencies.



Start the Angular application:



```powershell

npm start

```



Open the application at:



`http://localhost:4200`



\## 7. Running the Project



Keep both terminals open while working:



| Terminal | Command | Purpose |

|---|---|---|

| Backend | `npm run dev` | Starts the API server |

| Frontend | `npm start` | Starts the Angular application |



\## 8. Important Notes



\- Every team member must install the required software and dependencies locally.

\- Each member must create their own `.env` file.

\- Each member must create their own PostgreSQL database.

\- Never commit passwords, secrets, or `.env` files to GitHub.

\- Whenever new code is pushed to GitHub, use `git pull` to get the latest changes before starting work.

\- Run `npm install` again if the project dependencies have changed.





\---





