
---

## 🛠️ Setup Instructions

1. **Clone the repository**
    ```bash
    git clone https://github.com/abirami2405/todo.git
    cd todo
    ```
2. **Backend**
    - Navigate to `backend/`
    - Install dependencies: `npm install`
    - Configure `.env` file with your credentials
    - Run locally: `npm start`
3. **Frontend**
    - Navigate to `frontend/`
    - Install dependencies: `npm install`
    - Configure `.env` file with your credentials
    - Run locally: `npm start`
4. **Deploy**
    - Frontend: render
    - Backend: Render

---

## 📺 Loom Video

🎥 [Watch the demo video on Loom](https://www.loom.com/share/your-demo-video-link)

---

## 📝 Assumptions

- Users must have a Google, GitHub, or Facebook account to use the app.
- For simplicity, all users have equal access (no role-based access).
- Only basic validation is implemented; advanced features like password reset and email verification are out of scope for this hackathon.
- JWT is chosen for authentication to simplify deployment on stateless platforms.

---

## 🔗 API Endpoints

| Method | Endpoint                 | Description                      |
|--------|--------------------------|----------------------------------|
| POST   | `/api/auth/google`       | Google login                     |
| POST   | `/api/auth/github`       | GitHub login                     |
| POST   | `/api/auth/facebook`     | Facebook login                   |
| GET    | `/api/tasks`             | Get all tasks for user           |
| POST   | `/api/tasks`             | Create a new task                |
| PUT    | `/api/tasks/:id`         | Update a task                    |
| DELETE | `/api/tasks/:id`         | Delete a task                    |

---

## 📃 License

This project is a part of a hackathon run by [https://www.katomaran.com](https://www.katomaran.com)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📧 Contact

If you have any questions, please reach out to me at abiramimuthukumar05@gmail.com.

---

