import "./login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate(); // ✅ ТОЛЬКО внутри компонента

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // временно пускаем всегда (или можешь проверять поля)
    navigate("/home");
  };
  return (
    <div className="page">

      <div className="formWrapper">
        <div className="formCard">
          <label className="label">Login</label>
          <input className="input" placeholder="Value" />

          <label className="label">Password</label>
          <input type="password" className="input" placeholder="Value" />

          <button
            className="btn"
            onClick={() => navigate("/home")}
          >
            Sign In
          </button>

          <a href="#" className="forgot">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );

}