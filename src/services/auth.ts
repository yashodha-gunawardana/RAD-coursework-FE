// This allows us to send HTTP requests to the backend easily
import api from "./api";


type RegisterDataType = {
    fullname: string
    email: string
    password: string
    address?: string
    phone?: string
}