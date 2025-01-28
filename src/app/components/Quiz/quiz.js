"use client"
import React, { useState } from 'react';
import "../Quiz/quizApp.css";
import ShareResults from '../../ShareResults';
import quizzes from "../../jsonData/quizData.json";
import RadarChart from '../../radarChart';
import { CalculateScore } from '../ScoreCalculation/calculationFunctions';
import { GenerateProfile } from '../ProfileGeneration/profileGeneration';
import Image from 'next/image';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

export default function QuizApp() {
    const [responses, setResponses] = useState({});
    const [profile, setProfile] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [isClicked, setIsClicked] = useState(false);

    const handleOptionClick = (quizId, questionId, option) => {
        setResponses(prev => ({
            ...prev,
            [`${quizId}-${questionId}`]: {
                score: option?.score
            }
        }));

        setSelectedOptions(prev => ({
            ...prev,
            [`${quizId}-${questionId}`]: option
        }));
    };

    const handleSubmit = () => {
        const score = CalculateScore(Object.values(responses));
        const newProfile = GenerateProfile([score]);
        setProfile(newProfile);
        setIsClicked(true);
    };

    const isSelected = (quizId, questionId, option) => {
        return selectedOptions[`${quizId}-${questionId}`]?.id === option.id;
    };

    const handleReset = () => {
        setIsClicked(false);
        setProfile(null);
        setResponses({});
        setSelectedOptions({});
    }

    const generatePDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const element = document.getElementById('quiz-results');

        if (element) {
            const canvas = await html2canvas(element, { backgroundColor: null });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 160;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;
            const centerX = (pdf.internal.pageSize.width - imgWidth) / 2;

            pdf.addImage(imgData, 'PNG', centerX, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', centerX, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save('quiz-results.pdf');
        }
    };

    return (
        <div>
            {!isClicked ?
                (<div className="quiz-container">
                    {quizzes?.quizzes.map((quiz, id) => (
                        <div key={quiz?.id}>
                            <p className="title">{quiz?.title}</p>
                            {quiz?.questions.map((q) => (
                                <div key={q?.id}>
                                    <div className='flex'>
                                        <p className="question pr-2">{q?.id}.</p>
                                        <p className="question">{q?.question}</p>
                                    </div>
                                    <ul className="options">
                                        {Object.entries(q?.options).map(([key, option]) => (
                                            <li key={key}>
                                                <button
                                                    className={isSelected(quiz.id, q.id, option) ? 'selected' : ''}
                                                    onClick={() => handleOptionClick(quiz?.id, q?.id, option)}>
                                                    {option?.icon && (
                                                        <Image
                                                            src={option?.icon}
                                                            alt={option?.answer}
                                                            width={48}
                                                            height={48}
                                                            style={{ marginRight: '8px' }}
                                                        />
                                                    )}
                                                    {option?.answer}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button className="submit" onClick={handleSubmit}>Submit</button>
                </div>
                ) : (
                    < div className="chart-container">
                        {profile && (
                            <div id="quiz-results">
                                <RadarChart data={profile?.radarChartData} />
                                <div className="character-description mb-6">
                                    <ul>
                                        <li><span>Score Obtained: </span> {profile?.totalScore} / 20</li>
                                        <li><span>Dominant Traits: </span> {profile?.dominantTraits}</li>
                                    </ul>
                                </div>
                                <div className="character-description">
                                    <h1>CHARACTER DESCRIPTION:</h1>
                                    <ul>
                                        <li><span>Archetype:</span> {profile?.archetype}</li>
                                        <li><span>Name:</span> {profile?.suggestedCharacter?.name}</li>
                                        <li><span>Description:</span> {profile?.suggestedCharacter?.description}</li>
                                        <li><span>Personality:</span> {profile?.suggestedCharacter?.traits?.personality.join(', ')}</li>
                                        <li><span>Abilities:</span> {profile?.suggestedCharacter?.traits?.abilities.join(', ')}</li>
                                        <li><span>Flaws:</span> {profile?.suggestedCharacter?.traits?.flaws.join(', ')}</li>
                                        <li><span>Hair Color:</span> {profile?.suggestedCharacter?.appearance?.hairColor}</li>
                                        <li><span>Eye Color:</span> {profile?.suggestedCharacter?.appearance?.eyeColor}</li>
                                        <li><span>Clothing Style:</span> {profile?.suggestedCharacter?.appearance?.clothingStyle}</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        <button className="reset" onClick={generatePDF}>Download PDF</button>
                        <button className="reset" onClick={handleReset}>Reset</button>
                        <ShareResults profile={profile} />
                    </div>
                )}
        </div >
    );
}