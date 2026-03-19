import { AuthenticateUser } from "./userAuth.js";

//default function logic to handle user and general HTTP requests

export async function handleUserRequest(req, res, method) {
    const user = await AuthenticateUser(req, res);
    if (!user) return;
    try {
        return method(user);
    } catch (error) {
        return res
            .status(500)
            .json({success: false, message: `Internal Server Error: ${error}`});
    }
}

export async function handleGenRequest(req, res, method) {
    try {
        return method();
    } catch (error) {
        return res
            .status(500)
            .json({success: false, message: `Internal Servier Error: ${error}`});
    }
}