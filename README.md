# CCNY ZERO (CSC 322 software engineering)
Group project for ***CSC 322 @CCNY***
This is CCNY Zero , a graduate program management system. 

## Live Website Link
[CCNY Zero Live](https://csc-322-project.web.app/)


## Website Demo (Video)
[![Watch the video](https://i.imgur.com/3XP8mBC.png)](https://www.youtube.com/watch?v=FFdOIdtwPKg)

## Group Members Team E
- Haroon Syed
- Christopher Lall
- Andrew Persaud
- Tufayel Ahmed
- Josue Flores

## Running Locally
First clone the github repo and go into the project directory. Then,
```bash
npm install
npm start dev # run the react.js project in development mode
```
Open http://localhost:3000 to view it in the browser.

*If package error appears run these before running* `npm start`.
```bash
npm install react-icons
npm install react-select --save
npm install @material-ui/core
npm install react scripts --save
```

## Technologies Used
 - Firebase Authentication
 - Firebase Hosting
 - Firebase Firestore Database
 - React.js
 - Node.js
 - Trello

## Repository Structure
- `src`
  - `signIn/` : A page that lets a user log into the website
  - `signUp/` : A page which allows people to sign up as a student or an instructor
  - `aboutUs/` : About us page js code
  - `forgotPassword/` : Allows the user to change the password if needed
  - `instructorView/` : The page for an instructor when logging in
  - `error/` : 404 error page .js code
  - `studentView/` : The page the student sees after logging in
  - `registrars/` : The registrar/super user page when logging in
  - `home/` : The main page for the logged in user 
  - `navbar/` : The code for the navigation bar and its may states
  - `reSubmitPass/` : The code that verifies the correct password when a user signs up
  - `components/` : tab files
  - `contexts/` : Has all the authorization & authentication implementation for creating an account, logging in and signing out.
  - `App.css/`: styling sheet for App.js
  - `Apptest.js/`: Render
  - `App.js/`: Routes to specific path
  - `firebase.js`: Connection from firebase to React.js
  - `index.css`:styling sheet for index.js
  - `index.js`: Browser router and ReactDOM render
  - `reportWebVitals.js`: Performance measure (if wanted)
  - `setupTest.js`: Import DOM nodes


## Default Users
 1. admin account - username lol69@gmail.com, password: test1234
 
## Project Documentation
1. [Phase 1 Report : Software Requirements & Description](https://github.com/NishanthPrajith/Csc-322-Final-Project/blob/a050d190daded7f6b248075960b23d0b98ee545a/Phase1report.docx.pdf)
2. [Phase 2 Report : Design report](https://github.com/NishanthPrajith/Csc-322-Final-Project/blob/cc86ebd76973b3b0b5832b8b7972f3d7d5ea4c88/CSC32200_GES_Phase2.pdf)
