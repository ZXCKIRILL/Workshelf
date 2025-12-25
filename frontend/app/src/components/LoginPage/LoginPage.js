import "./login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // В реальном приложении здесь будет эндпоинт для аутентификации
      // Предположим, что у нас есть эндпоинт /api/auth/login
      
      // Пока используем проверку через список пользователей
      const response = await api.get('/users');
      const users = response.data;
      
      const user = users.find(u => 
        (u.login === login || u.email === login) && u.password === password
      );

      if (user) {
        // Сохраняем токен и данные пользователя
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.fullName);
        
        // Создаем запись в аудит логе
        await api.post('/auditlogs', {
          userId: user.id,
          action: "Login",
          entityType: "User",
          entityId: user.id,
          details: `User logged in at ${new Date().toISOString()}`,
          timestamp: new Date().toISOString()
        });

        navigate("/home");
      } else {
        setError("Неверный логин или пароль");
      }
    } catch (err) {
      console.error("Ошибка входа:", err);
      setError("Ошибка сервера. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!login) {
      setError("Введите email для восстановления пароля");
      return;
    }

    try {
      // Запрос на восстановление пароля
      const response = await api.post('/notifications', {
        userId: 1, // ID администратора
        message: `Пользователь с логином ${login} запросил восстановление пароля`,
        isRead: false
      });

      alert("Запрос на восстановление пароля отправлен администратору");
    } catch (error) {
      console.error("Ошибка:", error);
      setError("Ошибка при отправке запроса");
    }
  };

  return (
    <div className="page">
      <div className="formWrapper">
        <div className="formCard">
          <h2 className="formTitle">Вход в систему</h2>
          
          <form onSubmit={onSubmit}>
            <label className="label">Логин или Email</label>
            <input 
              className="input" 
              placeholder="Введите логин или email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />

            <label className="label">Пароль</label>
            <input 
              type="password" 
              className="input" 
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <div className="errorMessage">{error}</div>}

            <button
              className="btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Вход..." : "Войти"}
            </button>

            <button
              type="button"
              className="forgot"
              onClick={handleForgotPassword}
            >
              Забыли пароль?
            </button>
          </form>

          <div className="demoCredentials">
            <p>Демо данные:</p>
            <p>Логин: admin</p>
            <p>Пароль: password</p>
          </div>
        </div>
      </div>
    </div>
  );
}