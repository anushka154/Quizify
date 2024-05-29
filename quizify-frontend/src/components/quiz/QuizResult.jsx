import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const QuizResult = () => {

    const location = useLocation()
    const { quizQuestions, totalScores } = location.state
    const numOfQuestions = quizQuestions.length
    const percentage = Math.round((totalScores / numOfQuestions) * 100)
    const navigate = useNavigate()

    const handleRetake = () => {
        alert("Oops! this functionality was not implemented")
    }

    return (
        <section className='container mt-5'>
            <h3>Your Quiz Result Summary</h3>
            <hr />

            <h5>You answered {totalScores} out of {numOfQuestions} questions correctly</h5>
            <p>Your total score is {percentage}%</p>

            <Link to="/quiz-stepper" className='btn btn-primary btn-sm' >Retake this quiz</Link>
        </section>
    )
}

export default QuizResult;