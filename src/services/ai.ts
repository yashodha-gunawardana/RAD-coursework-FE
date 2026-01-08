import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/ai"; 


export const getAIRecommendation = async (eventType: string, prompt: string) = > {
    try {

        const token = localStorage.getItem("token")

        const response = await axios.post(
            `${API_URL}/event-consultant`,
            {
                eventType,
                eventName: prompt,
                question: prompt
            },
            { headers: { Authorization: `Bearer ${token}`} }
        )
    } catch (err) {

    }
}