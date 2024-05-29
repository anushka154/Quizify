import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSubjects } from '../../../utils/QuizService'

const QuizStepper = () => {

    const [currentStep, setCurrentStep] = useState(1)
    const [selectedSubject, setSelectedSubject] = useState("")
    const [selectedNumOfQuestions, setSelectedNumOfQuestions] = useState("")
    const [subjects, setSubjects] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchSubjects()
    }, []);

    const fetchSubjects = async () => {
        try {
            const allSubjects = await getSubjects()
            setSubjects(allSubjects)
        } catch (error) {
            console.error(error)
        }
    }

    const handleNext = () => {
        if (currentStep === 3) {
            if (selectedSubject && selectedNumOfQuestions) {
                navigate("/take-quiz", { state: { selectedNumOfQuestions, selectedSubject } })
            }
            else {
                alert("Please select a subject and number of questions to be answered")
            }
        }
        else {
            setCurrentStep((prevStep) => prevStep + 1)
        }
    }

    const handlePreviousStep = () => {
        setCurrentStep((prevStep) => prevStep - 1)
    }

    const handleSelectedSubject = (e) => {
        setSelectedSubject(e.target.value)
    }

    const handleNumOfQuestionsChange = (e) => {
        setSelectedNumOfQuestions(e.target.value)
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <h3 className='text-info mb-2'>I want to take a quiz on : </h3>
                        <select
                            className='form-select'
                            value={selectedSubject}
                            onChange={handleSelectedSubject}>

                            <option>Select a subject...</option>
                            {subjects.map((subject) => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>
                )

            case 2:
                return (
                    <div>
                        <h4 className='text-info mb-2'>How many questions would you like to attempt?</h4>

                        <input
                            type="number"
                            className='form-control'
                            value={selectedNumOfQuestions}
                            onChange={handleNumOfQuestionsChange}
                            placeholder='Enter number of questions' />
                    </div>
                )

            case 3:
                return (
                    <div>
                        <h2>Comfirmation</h2>
                        <p>Subject: {selectedSubject}</p>
                        <p>Number of questions: {selectedNumOfQuestions}</p>
                    </div>
                )

            default:
                return null;
        }
    }

    const renderProgressBar = () => {
        const progress = currentStep === 3 ? 100 : ((currentStep - 1) / 2) * 100;

        return (
            <div className='progress'>
                <div
                    className='progress-bar bg-info'
                    role='progressbar'
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}>
                    Step {currentStep}
                </div>
            </div>
        )
    }

    return (
        <section className='mt-5'>
            <h3 style={{ color: "GrayText" }}>Welcome to Quiz Online</h3>
            {renderProgressBar()}
            <div className='card'>
                <div className="card-body">
                    {renderStepContent()}
                    <div className="d-flex justify-content-between mt-4">
                        {currentStep > 1 && (
                            <button
                                className='btn btn-primary'
                                onClick={handlePreviousStep}>
                                Previous
                            </button>
                        )}

                        {currentStep < 3 && (
                            <button
                                className='btn btn-primary'
                                onClick={handleNext}
                                disabled={(currentStep === 1 && !selectedSubject) || (currentStep === 2 && !selectedNumOfQuestions)}>
                                Next
                            </button>
                        )}
                        
                        {currentStep === 3 && (
                            <button className='btn btn-success' onClick={handleNext}>Start Quiz</button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default QuizStepper;