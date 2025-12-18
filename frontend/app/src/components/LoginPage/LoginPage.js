import "./login.css";

const LoginPage = () => {
  return (
    <div className="page">

      <div className="formWrapper">
        <div className="formCard">
          <label className="label">Login</label>
          <input className="input" placeholder="Value" />

          <label className="label">Password</label>
          <input type="password" className="input" placeholder="Value" />

          <button className="btn">Sign In</button>

          <a href="#" className="forgot">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
