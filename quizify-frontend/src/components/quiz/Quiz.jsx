import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchQuizForUser } from '../../../utils/QuizService';
import AnswerOptions from '../../../utils/AnswerOptions';

const Quiz = () => {

    const [quizQuestions, setQuizQuestions] = useState([{
        id: "",
        correctAnswers: "",
        question: "",
        questionType: ""
    }]);
    const [selectedAnswers, setSelectedAnswers] = useState([{
        id: "",
        answer: ""
    }]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalScores, setTotalScores] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedSubject, selectedNumOfQuestions } = location.state;

    console.log(selectedNumOfQuestions);
    console.log(selectedSubject);

    useEffect(() => {
        console.log('Location state:', location.state);
        fetchQuizData()
    }, []);

    const fetchQuizData = async () => {
        console.log(`Selected Number of Questions: ${selectedNumOfQuestions}, Selected Subject: ${selectedSubject}`);
        if (selectedNumOfQuestions && selectedSubject) {
            const questions = await fetchQuizForUser(selectedNumOfQuestions, selectedSubject)
            console.log(questions);
            setQuizQuestions(questions)
        }
    }

    const handleAnswerChange = (questionId, answer) => {
        setSelectedAnswers((prevAnswers) => {
            const existingAnswerIndex = prevAnswers.findIndex((answerObj) => answerObj.id === questionId)
            const selectedAnswer = Array.isArray(answer) ? answer.map((a) => a.charAt(0)) : answer.charAt(0)

            if (existingAnswerIndex !== -1) {
                const updatedAnswers = [...prevAnswers];
                updatedAnswers[existingAnswerIndex] = { id: questionId, answer: selectedAnswer };
                return updatedAnswers;
            }
            else {
                const newAnswer = { id: questionId, answer: selectedAnswer };
                return [...prevAnswers, newAnswer];
            }
        })
    }

    const isChecked = (questionId, choice) => {
        const selectedAnswer = selectedAnswers.find((answer) => answer.id === questionId);
        if (!selectedAnswer) {
            return false;
        }

        if (Array.isArray(selectedAnswer.answer)) {
            return selectedAnswer.answer.includes(choice.charAt(0));
        }

        return selectedAnswer.answer === choice.charAt(0);
    }

    const handleCheckBoxChange = (questionId, choice) => {
        setSelectedAnswers((prevAnswers) => {
            const existingAnswerIndex = prevAnswers.findIndex((answerObj) => answerObj.id === questionId)
            const selectedAnswer = Array.isArray(choice) ? choice.map((c) => c.charAt(0)) : choice.charAt(0)

            if (existingAnswerIndex !== -1) {
                const updatedAnswers = [...prevAnswers]
                const existingAnswers = updatedAnswers[existingAnswerIndex].answer
                let newAnswer
                if (Array.isArray(existingAnswers)) {
                    newAnswer = existingAnswers.includes(selectedAnswer)
                        ? existingAnswers.filter((a) => a !== selectedAnswer)
                        : [...existingAnswers, selectedAnswer];
                }
                else {
                    newAnswer = [existingAnswers, selectedAnswer]
                }

                updatedAnswers[existingAnswerIndex] = { id: questionId, answer: newAnswer }

                return updatedAnswers;
            }
            else {
                const newAnswer = { id: questionId, answer: [selectedAnswer] }

                return [...prevAnswers, newAnswer];
            }
        })
    }

    const handleSubmit = () => {
        let scores = 0;
        quizQuestions.forEach((question) => {
            const selectedAnswer = selectedAnswers.find((answer) => answer.id === question.id)

            if (selectedAnswer) {
                const selectedOptions = Array.isArray(selectedAnswer.answer)
                    ? selectedAnswer.answer
                    : [selectedAnswer.answer];

                const correctOptions = Array.isArray(question.correctAnswers)
                    ? question.correctAnswers
                    : [question.correctAnswers];

                const isCorrect = selectedOptions.every((option) => correctOptions.includes(option))

                if (isCorrect) {
                    scores++;
                }
            }
        })

        setTotalScores(scores)
        setSelectedAnswers([{ id: "", answer: [""] }])
        setCurrentQuestionIndex(0)
        navigate("/quiz-result", { state: { quizQuestions, totalScores: scores } })
    }

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
        }
        else {
            handleSubmit();
        }
    }

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
        }
    }

    return (
        <div className='p-5'>
            <h3 className='text-info'>
                Question {quizQuestions.length > 0 ? currentQuestionIndex + 1 : 0} of {quizQuestions.length}
            </h3>

            <h4 className="mb-4">
				<pre>{quizQuestions[currentQuestionIndex]?.question}</pre>
			</h4>

			<AnswerOptions
				question={quizQuestions[currentQuestionIndex]}
				isChecked={isChecked}
				handleAnswerChange={handleAnswerChange}
				handleCheckboxChange={handleCheckBoxChange}
			/>

                <div className='mt-4'>
                    <button
                        className='btn btn-sm btn-primary me-2'
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0} >
                        Previous
                    </button>

                    <button
                        className={`btn btn-info btn-sm ${currentQuestionIndex === quizQuestions.length - 1
                    && "btn btn-warning btn-sm"}`}
                        disabled={!selectedAnswers.find((answer) => answer.id === quizQuestions[currentQuestionIndex]?.id || answer.answer.length > 0)}
                        onClick={handleNextQuestion} >
                        {currentQuestionIndex === quizQuestions.length - 1 ? "Submit Quiz" : "Next Question"}
                    </button>

                </div>
            
        </div>
    )
}

export default Quiz;