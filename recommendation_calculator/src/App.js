import React, { useEffect, useState } from "react";
import { FaMusic, FaUser } from "react-icons/fa";
import './App.css';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Будь ласка, заповніть всі поля");
      return;
    }
    setError("");
    onLogin({ email, password });
  }

  return (
    <div
      className="card shadow-sm p-4 mb-4"
      style={{ maxWidth: 400, width: "100%" }}
    >
      <h3 className="mb-3 text-center">
        <FaUser className="me-2" />
        Вхід користувача
      </h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Увійти
        </button>
      </form>
    </div>
  );
}

function QuestionCard({ questionData, selected, onSelect }) {
  return (
    <div className="card shadow-sm p-4 mb-4 bg-secondary bg-opacity-10 text-white fade-in">
      <h4 className="mb-3">{questionData.question}</h4>
      <form>
        {questionData.options.map((opt) => (
          <div className="form-check mb-2" key={opt.id}>
            <input
              className="form-check-input"
              type="radio"
              id={opt.id}
              name="option"
              value={opt.id}
              checked={selected === opt.id}
              onChange={() => onSelect(opt.id)}
            />
            <label className="form-check-label text-white" htmlFor={opt.id}>
              <span style={{ marginRight: "6px" }}>{opt.emoji}</span>
              {opt.text}{" "}
              {opt.link && (
                <a
                  href={opt.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info text-decoration-underline"
                >
                  [{opt.link.label}]
                </a>
              )}
            </label>
          </div>
        ))}
      </form>
    </div>
  );
}

function ResultCard({ result, onRestart }) {
  return (
    <div
      className="card shadow p-5 text-center bg-dark text-white"
      style={{ maxWidth: 600 }}
    >
      <h2>
        {result.emoji} Рекомендація музичного стилю:
      </h2>
      <h3 className="my-3">{result.style}</h3>
      <p className="lead">{result.description}</p>
      <button className="btn btn-outline-light mt-4" onClick={onRestart}>
        Пройти ще раз
      </button>
    </div>
  );
}

function getRecommendation(answers) {
  const mood = answers[1];
  const genre = answers[2];
  const atmosphere = answers[3];
  const tempo = answers[4];
  const instrument = answers[5];

  if (mood === "calm" && genre === "instrumental" && atmosphere === "jazz_cafe") {
    return {
      style: "Джаз / Lo-fi",
      emoji: "🎷",
      description:
        "Ти любиш спокійні та атмосферні мелодії — джаз та lo-fi створять ідеальний настрій.",
    };
  }

  if (mood === "energetic" && genre === "electronic" && atmosphere === "party") {
    return {
      style: "EDM / Techno",
      emoji: "🎧",
      description:
        "Ти енергійний і любиш драйв — електронна музика зарядить тебе на повну.",
    };
  }

  if (mood === "melancholy" && genre === "rock" && atmosphere === "live_concert") {
    return {
      style: "Альтернативний рок / Indie",
      emoji: "🎸",
      description:
        "Ти глибокий і емоційний, рок-музика підкреслить твою індивідуальність.",
    };
  }

  if (mood === "cheerful" && genre === "pop" && atmosphere === "headphones") {
    return {
      style: "Поп / K-pop",
      emoji: "🎤",
      description:
        "Ти життєрадісний і відкритий до нового — поп та K-pop піднімуть настрій.",
    };
  }

  if (tempo === "slow" && instrument === "piano") {
    return {
      style: "Класична музика",
      emoji: "🎻",
      description:
        "Ти цінуєш витонченість і спокій — класика для тебе ідеальна.",
    };
  }

  if (tempo === "fast" && instrument === "drums") {
    return {
      style: "Рок та Метал",
      emoji: "🤘",
      description: "Ти любиш потужні ритми та емоції — рок і метал саме для тебе.",
    };
  }

  return {
    style: "Змішаний стиль",
    emoji: "🎼",
    description: "У тебе різноманітний музичний смак, який поєднує кілька жанрів.",
  };
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetch("/questions.json")
      .then((res) => res.json())
      .then(setQuestions)
      .catch(() => alert("Не вдалося завантажити питання"));
  }, []);

  function handleLogin(userData) {
    setUser(userData);
    setLoggedIn(true);
  }

  function handleOptionSelect(optionId) {
    if (!questions.length) return;
    setAnswers({ ...answers, [questions[step].id]: optionId });
  }

  function handleNext() {
    if (!answers[questions[step].id]) {
      alert("Будь ласка, оберіть відповідь перед тим, як рухатися далі.");
      return;
    }
    setStep(step + 1);
  }

  function handleRestart() {
    setAnswers({});
    setStep(0);
  }

  if (!loggedIn) {
    return (
      <div
        className="animated-gradient-bg text-light min-vh-100 d-flex justify-content-center align-items-center p-3"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="text-center text-light mt-5">
        Завантаження питань...
      </div>
    );
  }

  if (step >= questions.length) {
    const result = getRecommendation(answers);
    return (
      <div
        className="animated-gradient-bg text-light min-vh-100 d-flex flex-column justify-content-center align-items-center p-4"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <ResultCard result={result} onRestart={handleRestart} />
      </div>
    );
  }

  const currentQuestion = questions[step];

  // Обчислюємо прогрес у %
  const progressPercent = questions.length
    ? Math.round(((step + 1) / questions.length) * 100)
    : 0;

  return (
    <div
      className="animated-gradient-bg text-light min-vh-100 p-4 d-flex flex-column justify-content-center align-items-center"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <header className="mb-4 d-flex align-items-center">
        <FaMusic size={36} className="me-3 text-info" />
        <h1>Калькулятор музичного стилю</h1>
      </header>

      <div className="w-100" style={{ maxWidth: 600 }}>
        {/* Прогрес-бар */}
        <div className="progress mb-4" style={{ height: "20px" }}>
          <div
            className="progress-bar bg-info"
            role="progressbar"
            style={{ width: `${progressPercent}%` }}
            aria-valuenow={progressPercent}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progressPercent}%
          </div>
        </div>

        <QuestionCard
          questionData={currentQuestion}
          selected={answers[currentQuestion.id]}
          onSelect={handleOptionSelect}
        />
        <button className="btn btn-info w-100" onClick={handleNext}>
          {step === questions.length - 1 ? "Отримати результат" : "Далі"}
        </button>
      </div>
    </div>
  );
}
