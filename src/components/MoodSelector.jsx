/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { MOODS } from "../constants/moods.js";
import "./MoodSelector.css";

const MoodSelector = ({ selectedMood, onMoodSelect }) => {
  return (
   <section className="mood-section">
  <div className="wrapper">
    <h2 className="mood-heading">How are you feeling today?</h2>

    <ul className="mood-grid">
      {MOODS.map((mood) => (
        <li key={mood.id}>
          <button
            className={`mood-card ${
              selectedMood?.id === mood.id ? "active" : ""
            }`}
            onClick={() => onMoodSelect(mood)}
          >
            {mood.label}
          </button>
        </li>
      ))}
    </ul>
  </div>
</section>

  );
};

export default MoodSelector;
