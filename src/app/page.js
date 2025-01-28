"use client"
import React, { useState } from 'react';
import QuizApp from './components/Quiz/quiz';
// import { generateCharacterPrompt } from "./characterGenerator";

export default function Home() {
  const [character, setCharacter] = useState(null);

  const handleGenerateCharacter = () => {
    const newCharacter = generateCharacterPrompt();
    setCharacter(newCharacter);
  };

  return (
    <div>
      <div>
        {/* <h1>Quiz App</h1> */}
        <QuizApp />
      </div>
      {/* <div>
        <h1>Character Prompt Generator</h1>
        <button onClick={handleGenerateCharacter}>Generate Character</button>
        {character && (
          <div style={{ marginTop: '20px' }}>
            <h2>Character Details:</h2>
            <p><strong>Name:</strong> {character.name}</p>
            <p><strong>Age:</strong> {character.age}</p>
            <p><strong>Occupation:</strong> {character.occupation}</p>
            <p><strong>Personality Trait:</strong> {character.trait}</p>
            <p><strong>Prompt:</strong> {character.prompt}</p>
          </div>
        )}
      </div> */}
    </div>
  );
}
