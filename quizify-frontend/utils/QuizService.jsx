import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:9595/api/quizes"
})

export const createQuestion = async (quizQuestion) => {
    try {
        const response = await api.post("/create-new-question", quizQuestion);
        console.log("post");
        return response.data;

    } catch (error) {
        console.error(error);
    }
}

export const getAllQuestions = async () => {
    try {
        const response = await api.get(`/all-questions`);
        return response.data;

    } catch (error) {
        console.error(error);
        return []
    }
}

export const fetchQuizForUser = async (number, subject) => {
    try {
        const response = await api.get(`/quiz/fetch-questions-for-user?numOfQuestions=${number}&subject=${subject}`)
        return response.data

    } catch (error) {
        console.error(error)
        return [];
    }
}

//get all subject from the database
export const getSubjects = async () => {
    try {
        const response = await api.get("/subjects");
        return response.data;

    } catch (error) {
        console.error(error);
    }
}

//update questions
export const updateQuestion = async (id, question) => {
    try {
        const response = await api.put(`/question/${id}/update`, question);
        return response.data;

    } catch (error) {
        console.error(error);
    }
}

//get a question by id
export const getQuestionById = async (id) => {
    try {
        const response = await api.get(`/question/${id}`);
        return response.data;

    } catch (error) {
        console.error(error);
    }
}

//delete a question
export const deleteQuestion = async (id) => {
    try {
        const response = await api.delete(`/question/${id}/delete`);
        return response.data;

    } catch (error) {
        console.error(error);
    }
}