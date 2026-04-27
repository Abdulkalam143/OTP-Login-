# 🔐 Verifi — OTP Login System

A sleek and fully responsive **OTP (One-Time Password) Login System** built using **HTML, CSS, and Vanilla JavaScript**.

This project simulates a real-world authentication flow with smooth UI, animations, and interactive OTP verification — all without using any backend.

---

## 🚀 Features

* ✨ Modern UI with animated background
* 📧 Email-based OTP login system
* 🔢 6-digit OTP generation
* ⌨️ Auto-focus input boxes
* ⬅️ Backspace navigation between OTP fields
* 📋 Paste full OTP support
* ⏳ 30-second resend timer
* 🔄 Resend OTP functionality
* ❌ Error handling with shake animation
* 🔄 Loading spinner for better UX
* 📱 Fully responsive design

---

## 📂 Project Structure

```
OTP-Login/
│── index.html
│── style.css
│── script.js
```

---

## ⚙️ How It Works

### 1️⃣ Email Validation

* User enters an email address
* Validated using regex pattern

### 2️⃣ OTP Generation

* A random 6-digit OTP is generated:

```js
Math.floor(100000 + Math.random() * 900000)
```

* Stored in memory (`currentOTP`)
* Displayed in **browser console (DevTools)** for testing

---

### 3️⃣ OTP Input System

* 6 separate input fields
* Automatically moves to next box after typing
* Backspace moves to previous input
* Only numeric values allowed
* Supports full OTP paste

---

### 4️⃣ OTP Verification

* Combines all input digits
* Compares with generated OTP

**Result:**

* ✅ Correct → Success screen
* ❌ Incorrect → Error message + shake animation

---

### 5️⃣ Resend OTP

* Starts a 30-second countdown
* After timer → "Resend OTP" button appears
* Generates a new OTP

---

## 🖥️ How to Run

1. Clone the repository:

```bash
git clone https://github.com/your-username/OTP-Login.git
```

2. Navigate to the project folder:

```bash
cd OTP-Login
```

3. Open `index.html` in your browser

4. Open **DevTools Console** to view the OTP

---

## ⚠️ Important Note

This project is **frontend-only**:

* OTP is generated using JavaScript
* No real email or SMS is sent
* Intended for learning/demo purposes only

---

## 🔮 Future Improvements

* 🔗 Backend integration (Node.js / Express)
* 📱 SMS OTP (Twilio / Firebase)
* ✉️ Email OTP integration
* 🔐 Secure authentication with JWT
* 🌐 Deploy with full-stack integration

---

## 🛠️ Tech Stack

* HTML5
* CSS3 (Animations + Responsive UI)
* Vanilla JavaScript

---

## 📸 Preview

A modern OTP login interface with:

* Clean card UI
* Animated transitions
* Interactive OTP input
* Success verification animation

---

## 👨‍💻 Author

**Shaik Abdul Kalam**

---

## ⭐ Support

If you like this project:

* ⭐ Star the repository
* 🍴 Fork it
* 📢 Share it

---

