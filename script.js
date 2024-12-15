// Questions array with weights
const questions = [
    { id: 1, text: "Do you experience chest pain or discomfort?", type: "choice", weight: 3 },
    { id: 2, text: "Do you often feel short of breath?", type: "choice", weight: 2 },
    { id: 3, text: "Do you have high blood pressure?", type: "choice", weight: 2 },
    { id: 4, text: "What is your age?", type: "number", min: 18, max: 120, weight: 1 },
    { id: 5, text: "What is your BMI?", type: "number", min: 10, max: 50, weight: 1 },
    { id: 6, text: "Do you smoke?", type: "choice", weight: 2 },
    { id: 7, text: "Do you have diabetes?", type: "choice", weight: 2 },
    { id: 8, text: "Do you have a family history of heart disease?", type: "choice", weight: 2 },
    { id: 9, text: "How often do you exercise?", type: "choice", options: ["Never", "Occasionally", "Regularly"], weight: 1 },
    { id: 10, text: "How would you describe your diet?", type: "choice", options: ["Poor", "Average", "Healthy"], weight: 1 },
    { id: 11, text: "Do you experience palpitations or irregular heartbeats?", type: "choice", weight: 2 },
    { id: 12, text: "Do you have high cholesterol?", type: "choice", weight: 2 },
    { id: 13, text: "How would you rate your stress level?", type: "choice", options: ["Low", "Moderate", "High"], weight: 1 },
    { id: 14, text: "Do you consume alcohol?", type: "choice", options: ["Never", "Occasionally", "Regularly"], weight: 1 },
    { id: 15, text: "How many hours of sleep do you get on average?", type: "number", min: 1, max: 24, weight: 1 },
    { id: 16, text: "Do you have a sedentary lifestyle?", type: "choice", weight: 2 },
    { id: 17, text: "Have you ever had a stroke?", type: "choice", weight: 3 },
    { id: 18, text: "Do you have any autoimmune diseases?", type: "choice", weight: 1 },
    { id: 19, text: "Are you overweight or obese?", type: "choice", weight: 2 },
    { id: 20, text: "Do you experience swelling in your legs or ankles?", type: "choice", weight: 1 },
    { id: 21, text: "How would you rate your overall health?", type: "choice", options: ["Poor", "Fair", "Good", "Excellent"], weight: 1 },
    { id: 22, text: "Do you have a history of heart attacks?", type: "choice", weight: 3 },
    { id: 23, text: "Are you taking any medications for heart-related issues?", type: "choice", weight: 2 },
    { id: 24, text: "Do you experience fatigue or weakness during physical activities?", type: "choice", weight: 1 },
    { id: 25, text: "How would you rate your knowledge about heart health?", type: "choice", options: ["Poor", "Average", "Good", "Excellent"], weight: 1 }
];

let currentQuestion = 0;
let userResponses = {};
let userName = "";

// DOM Elements
const landingSection = document.getElementById('landing');
const questionnaireSection = document.getElementById('questionnaire');
const resultsSection = document.getElementById('results');
const nameForm = document.getElementById('name-form');
const questionContainer = document.getElementById('question-container');
const prevButton = document.getElementById('prev-question');
const nextButton = document.getElementById('next-question');
const progressBar = document.getElementById('progress');
const questionNumber = document.getElementById('question-number');
const restartButton = document.getElementById('restart');

// Event Listeners
nameForm.addEventListener('submit', startQuestionnaire);
prevButton.addEventListener('click', showPreviousQuestion);
nextButton.addEventListener('click', showNextQuestion);
restartButton.addEventListener('click', restartQuestionnaire);

function startQuestionnaire(e) {
    e.preventDefault();
    userName = document.getElementById('user-name').value.trim();
    if (userName) {
        landingSection.classList.remove('active');
        landingSection.classList.add('hidden');
        questionnaireSection.classList.remove('hidden');
        questionnaireSection.classList.add('active');
        showQuestion(currentQuestion);
    } else {
        alert('Please enter your name before starting the questionnaire.');
    }
}

function showQuestion(index) {
    const question = questions[index];
    let html = `<h3>${question.text}</h3>`;

    if (question.type === 'choice') {
        if (question.options) {
            html += `<select id="q${question.id}" required>
                <option value="">Select an option</option>
                ${question.options.map(option => `<option value="${option}">${option}</option>`).join('')}
            </select>`;
        } else {
            html += `
                <label><input type="radio" name="q${question.id}" value="Yes" required> Yes</label>
                <label><input type="radio" name="q${question.id}" value="No" required> No</label>
                <label><input type="radio" name="q${question.id}" value="Sometimes" required> Sometimes</label>
            `;
        }
    } else if (question.type === 'number') {
        html += `<input type="number" id="q${question.id}" min="${question.min}" max="${question.max}" required>`;
    }

    questionContainer.innerHTML = html;
    questionContainer.classList.remove('active');
    setTimeout(() => {
        questionContainer.classList.add('active');
    }, 10);
    updateProgressBar();
    updateQuestionNumber();
}

function showNextQuestion() {
    if (validateCurrentQuestion()) {
        saveResponse();
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion(currentQuestion);
        } else {
            showResults();
        }
        updateNavButtons();
    }
}

function showPreviousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
        updateNavButtons();
    }
}

function validateCurrentQuestion() {
    const question = questions[currentQuestion];
    const input = document.querySelector(`#q${question.id}, input[name="q${question.id}"]:checked`);
    
    if (!input || (input.type === 'number' && (input.value < question.min || input.value > question.max))) {
        alert('Please provide a valid answer before proceeding.');
        return false;
    }
    return true;
}

function saveResponse() {
    const question = questions[currentQuestion];
    const input = document.querySelector(`#q${question.id}, input[name="q${question.id}"]:checked`);
    userResponses[question.id] = input.value;
}

function updateNavButtons() {
    prevButton.disabled = currentQuestion === 0;
    nextButton.textContent = currentQuestion === questions.length - 1 ? 'Finish' : 'Next';
}

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function updateQuestionNumber() {
    questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
}

function showResults() {
    questionnaireSection.classList.remove('active');
    questionnaireSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    resultsSection.classList.add('active');

    const { riskLevel, confidenceScore, contributingFactors } = calculateResults();

    document.getElementById('user-greeting').innerHTML = `<h3>Hello, ${userName}!</h3>`;
    document.getElementById('risk-level').innerHTML = `<h3>Risk Level: ${riskLevel}</h3>`;
    document.getElementById('confidence-score').innerHTML = `<p>Confidence Score: ${confidenceScore}%</p>`;
    document.getElementById('contributing-factors').innerHTML = `
        <h3>Contributing Factors:</h3>
        <ul>${contributingFactors.map(factor => `<li>${factor}</li>`).join('')}</ul>
    `;
    document.getElementById('recommendations').innerHTML = `
        <h3>Recommendations:</h3>
        ${getRecommendations(riskLevel, contributingFactors)}
    `;
}

function calculateResults() {
    let totalScore = 0;
    let maxPossibleScore = 0;
    let contributingFactors = [];

    questions.forEach(question => {
        const response = userResponses[question.id];
        const weight = question.weight;
        maxPossibleScore += weight * 2;

        if (question.type === 'choice') {
            if (response === 'Yes' || response === 'High' || response === 'Poor') {
                totalScore += weight * 2;
                contributingFactors.push(question.text);
            } else if (response === 'Sometimes' || response === 'Moderate' || response === 'Average') {
                totalScore += weight;
            }
        } else if (question.type === 'number') {
            const value = parseInt(response);
            if (question.id === 4) { // Age
                totalScore += value > 50 ? weight * 2 : (value > 40 ? weight : 0);
            } else if (question.id === 5) { // BMI
                totalScore += value > 30 ? weight * 2 : (value > 25 ? weight : 0);
            } else if (question.id === 15) { // Sleep
                totalScore += value < 6 ? weight * 2 : (value < 7 ? weight : 0);
            }
        }
    });

    const riskPercentage = (totalScore / maxPossibleScore) * 100;
    let riskLevel;
    if (riskPercentage < 30) {
        riskLevel = 'Low';
    } else if (riskPercentage < 60) {
        riskLevel = 'Moderate';
    } else {
        riskLevel = 'High';
    }

    const confidenceScore = Math.min(100, Math.round((contributingFactors.length / questions.length) * 100));

    return { riskLevel, confidenceScore, contributingFactors };
}

function getRecommendations(riskLevel, contributingFactors) {
    let recommendations = '';

    switch (riskLevel) {
        case 'Low':
            recommendations += "<p>Your heart health risk appears to be low. However, it's important to maintain a healthy lifestyle:</p>";
            recommendations += "<ul>";
            recommendations += "<li>Continue with regular exercise, aiming for at least 150 minutes of moderate-intensity activity per week.</li>";
            recommendations += "<li>Maintain a balanced diet rich in fruits, vegetables, whole grains, and lean proteins.</li>";
            recommendations += "<li>Schedule routine check-ups with your healthcare provider.</li>";
            recommendations += "<li>Stay informed about heart health and continue monitoring your risk factors.</li>";
            recommendations += "</ul>";
            break;
        case 'Moderate':
            recommendations += "<p>Your heart health risk is moderate. Consider the following steps to improve your heart health:</p>";
            recommendations += "<ul>";
            recommendations += "<li>Consult with a healthcare professional to discuss your risk factors and develop a personalized plan.</li>";
            recommendations += "<li>Increase your physical activity if you're not meeting the recommended 150 minutes per week.</li>";
            recommendations += "<li>Focus on heart-healthy eating habits, including reducing sodium and saturated fat intake.</li>";
            recommendations += "<li>If you smoke, consider a smoking cessation program.</li>";
            recommendations += "<li>Monitor your blood pressure, cholesterol, and blood sugar levels regularly.</li>";
            recommendations += "</ul>";
            break;
        case 'High':
            recommendations += "<p>Your heart health risk is high. It is strongly recommended that you take immediate action:</p>";
            recommendations += "<ul>";
            recommendations += "<li>Schedule an appointment with a cardiologist as soon as possible for a comprehensive evaluation.</li>";
            recommendations += "<li>Follow your healthcare provider's advice regarding medications, lifestyle changes, and follow-up appointments.</li>";
            recommendations += "<li>Make significant changes to your diet, focusing on heart-healthy options and portion control.</li>";
            recommendations += "<li>Engage in regular physical activity as recommended by your doctor.</li>";
            recommendations += "<li>Manage stress through relaxation techniques, meditation, or counseling.</li>";
            recommendations += "<li>If you smoke, quit immediately and seek support if needed.</li>";
            recommendations += "</ul>";
            break;
    }

    if (contributingFactors.length > 0) {
        recommendations += "<p>Based on your responses, pay special attention to these areas:</p>";
        recommendations += "<ul>";
        contributingFactors.forEach(factor => {
            recommendations += `<li>${factor}</li>`;
        });
        recommendations += "</ul>";
    }

    recommendations += "<p>Remember, this assessment is not a substitute for professional medical advice. Always consult with a healthcare provider for personalized recommendations and treatment plans.</p>";

    return recommendations;
}

function restartQuestionnaire() {
    currentQuestion = 0;
    userResponses = {};
    resultsSection.classList.remove('active');
    resultsSection.classList.add('hidden');
    landingSection.classList.remove('hidden');
    landingSection.classList.add('active');
    document.getElementById('user-name').value = '';
}

