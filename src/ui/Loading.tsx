import { useEffect, useState } from "react";
import logo from "/pictures/logo.png";
interface LoadingScreenProps {
  companyName?: string;
  progress?: number;
  message?: string;
  error?: string | null;
}

const LoadingScreen = ({
  companyName = "Henna Parlour",
  progress = 0,
  message = "Loading...",
  error = null,
}: LoadingScreenProps) => {
  const [breatheScale, setBreatheScale] = useState(1);
  const [dots, setDots] = useState(0);

  // Breathing logo effect
  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      setBreatheScale(1 + Math.sin(time * 0.8) * 0.05);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Animated dots (...)
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backgroundColor: "#f9f9f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          marginBottom: 24,
          transform: `scale(${breatheScale})`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      <h2 style={{ fontSize: 20, marginBottom: 16 }}>{companyName}</h2>

      {progress > 0 && (
        <div style={{ width: 200, marginBottom: 16 }}>
          <div
            style={{
              height: 6,
              backgroundColor: "#eee",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(progress, 100)}%`,
                height: "100%",
                backgroundColor: error ? "#f44336" : "#4caf50",
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <p style={{ fontSize: 12, marginTop: 6, color: "#888" }}>
            {error
              ? "Error occurred"
              : progress < 100
              ? `${Math.round(progress)}%`
              : "Almost ready..."}
          </p>
        </div>
      )}

      <p style={{ fontSize: 14, color: "#666", minHeight: 20 }}>
        {error ? "Please wait..." : message}
      </p>

      {!error && (
        <div style={{ marginTop: 10, display: "flex", gap: 4 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#999",
                opacity: dots > i ? 0.8 : 0.2,
                transform: dots > i ? "scale(1.2)" : "scale(1)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            border: "1px solid #f44336",
            backgroundColor: "#fdecea",
            color: "#c62828",
            borderRadius: 6,
            maxWidth: 300,
          }}
        >
          <p style={{ marginBottom: 6 }}>{error}</p>
          <p style={{ fontSize: 12, color: "#888" }}>
            Retrying automatically...
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
