import { useState, useEffect } from "react";
import { generateMovieSummary, generateActorSummary } from "../utils/aiSummaryGenerator";
import "./AISummary.css";
import { marked } from "marked";
import DOMPurify from "dompurify";

const AISummary = ({ data, type = "movie" }) => {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!data) return;

    let isMounted = true;

    const fetchSummary = async () => {
      setIsLoading(true);
      setError(false);

      try {
        const generatedSummary =
          type === "movie"
            ? await generateMovieSummary(data)
            : await generateActorSummary(data);

        if (isMounted) {
          setSummary(generatedSummary);
        }
      } catch (err) {
        console.error("Error generating AI summary:", err);
        if (isMounted) {
          setError(true);
          setSummary(
            type === "movie"
              ? "This film highlights the power of storytelling through compelling visuals and narrative depth."
              : "This artist has built a remarkable career through dedication, versatility, and memorable performances."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSummary();

    return () => {
      isMounted = false;
    };
  }, [data, type]);

  if (isLoading) {
    return (
      <div className="ai-summary-container loading">
        <div className="ai-summary-header">
          <div className="ai-icon">
            <svg width="24" height="24" viewBox="0 0 50 50" className="spinning">
              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="white"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="31.4 31.4"
              />
            </svg>
          </div>
          <span className="ai-label">MovieMitra AI Insight</span>
        </div>

        <div className="loading-dots bounce-wrapper">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-summary-container">
      <div className="ai-summary-header">
        <div className="ai-icon fancy-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 6.5C15 5 13 4.5 11 5c-3 .8-5 3.7-4.7 6.9.3 3.4 3 6.1 6.3 6.1 1.6 0 3.1-.6 4.3-1.7.4-.4.4-1 0-1.4l-.8-.8c-.4-.4-1-.4-1.4 0-1.9 1.8-5.1 1.1-6.1-1.4-.7-1.6-.1-3.5 1.4-4.5 1.4-.9 3.2-.7 4.3.4.4.4 1 .4 1.4 0l.8-.8c.4-.4.4-1 0-1.4z" />
          </svg>
        </div>
        <span className="ai-label">MovieMitra AI Insight</span>
      </div>

      <div
        className="ai-summary-text"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(marked.parse(summary || "")),
        }}
      />
    </div>
  );
};

export default AISummary;
