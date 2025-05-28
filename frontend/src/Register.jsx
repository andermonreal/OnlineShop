import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "./services/authService";

export default function Register({ onRegister }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { token, user } = await register(form);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onRegister(user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>Register</button>
      </form>
      {error && <p style={styles.errorText}>{error}</p>}

      <p style={styles.paragraph}>
        You already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          style={styles.linkButton}
        >
          Login here
        </button>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '60px auto',
    padding: '40px 30px',
    background: '#fff',
    backgroundColor: "rgb(255, 249, 218)",
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontWeight: 700,
    fontSize: '28px',
    color: '#2c3e50',
    letterSpacing: '1.2px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  input: {
    padding: '12px 15px',
    fontSize: '16px',
    border: '2px solid #ccc',
    backgroundColor: "rgb(255, 250, 225)",
    borderRadius: '6px',
    transition: 'border-color 0.3s ease',
  },
  submitButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    fontWeight: 600,
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'background-color 0.3s ease',
  },
  errorText: {
    color: '#e74c3c',
    fontWeight: 600,
    textAlign: 'center',
    marginTop: '-10px',
    marginBottom: '20px',
  },
  paragraph: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
    marginTop: '10px',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#27ae60',
    cursor: 'pointer',
    fontWeight: 600,
    textDecoration: 'underline',
    padding: '0',
    fontSize: '14px',
    transition: 'color 0.3s ease',
  },
};
