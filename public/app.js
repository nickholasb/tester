* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #0f172a, #111827 60%, #1e293b);
  color: #e2e8f0;
}

.container {
  width: min(900px, 90vw);
  margin: 60px auto;
}

.hero {
  text-align: center;
  margin-bottom: 30px;
}

.hero h1 {
  margin-bottom: 10px;
  font-size: clamp(2rem, 4vw, 3rem);
}

.hero p {
  color: #cbd5e1;
}

.card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 15px 40px rgba(15, 23, 42, 0.45);
}

label {
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
}

.input-row {
  display: flex;
  gap: 12px;
}

input {
  flex: 1;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #475569;
  background: #0f172a;
  color: #f8fafc;
  font-size: 1rem;
}

button {
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-weight: 700;
  padding: 0 22px;
  cursor: pointer;
}

button:hover {
  opacity: 0.95;
}

.status {
  margin-top: 18px;
  padding: 12px 14px;
  border-radius: 10px;
  font-weight: 600;
}

.status.error {
  background: rgba(248, 113, 113, 0.12);
  color: #fecaca;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.status.success {
  background: rgba(34, 197, 94, 0.12);
  color: #bbf7d0;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.hidden {
  display: none;
}

.results {
  margin-top: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.panel {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 14px;
  padding: 18px;
}

.panel h3 {
  margin-top: 0;
}

.ai-panel {
  margin-top: 16px;
}

@media (max-width: 640px) {
  .input-row {
    flex-direction: column;
  }

  button {
    padding: 14px 18px;
  }
}
