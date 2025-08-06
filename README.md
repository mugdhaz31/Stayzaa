# 🏡 Stayzaa – Airbnb-Style Property Listing Platform

Stayzaa is a full-stack web application inspired by Airbnb, built with **Node.js**, **Express**, **MongoDB**, and **Bootstrap**. It allows users to **list properties**, **review listings**, and **book stays** in a simplified and visually appealing interface.



## 🚀 Features

- 🔐 **User Authentication** – Sign up, login, and logout functionality using Passport.js.
- 🏘️ **List Properties** – Authenticated users can create, edit, and delete property listings.
- 💬 **Review System** – Users can post reviews on listings with a clean UI.
- 🗺️ **Interactive Map** – Listings display on a Leaflet.js-powered map centered on New Delhi.
- ✨ **Flash Messages** – For success and error notifications using `connect-flash`.
- 🧭 **Smart Redirects** – After login, users are redirected to the page they were trying to access.
- 🎨 **Responsive Design** – Clean and responsive UI built with Bootstrap 5.

---

## 🛠 Tech Stack

| Category      | Technology                  |
|---------------|-----------------------------|
| Frontend      | HTML, EJS, Bootstrap        |
| Backend       | Node.js, Express.js         |
| Database      | MongoDB (Mongoose ODM)      |
| Authentication| Passport.js (Local Strategy)|
| Mapping       | Leaflet.js + OpenStreetMap  |
| Others        | Method-Override, Express-Session, connect-flash |

---

## 📸 Screenshots

![Home page](<Screenshot 2025-07-22 175644.png>)
![login page](<Screenshot 2025-07-22 180616.png>)
![listing](<Screenshot 2025-07-22 180514.png>)
![map feature](<Screenshot 2025-07-22 180558.png>)
![New listing](<Screenshot 2025-07-22 180459.png>)

---

## 🧾 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/stayzaa.git
   cd stayzaa

2. **Install dependencies**
   ```bash
   npm install

3. **Environment Variables**
: Create a .env file and add:
   ```bash
   CLOUDNAME=xyz
   CLOUDAPIKEY=xyz
   CLOUDAPISECRET=xyz
   DB_URL=mongodburl
   SECRET=sessionsecret

4. **Run the application**
    ```bash
    npm start


4. **Visit the website**
    ```bash
    http://localhost:3000
