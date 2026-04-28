import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40 }}>
      <h2>Login Page</h2>

      <button onClick={() => navigate("/dashboard")}>
        Simulate Login
      </button>
    </div>
  );
}