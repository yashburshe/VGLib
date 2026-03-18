import { makeAuthReq } from "./frontEndUtils.js";

//front end functions to support CRUD operations on the user route

export async function getUser() {
    const data = await makeAuthReq('/api/user/me', 'GET');
    if (data) {
        return data.user;
    } else {
        console.log("Failed to retrieve user!");
    }
}

export async function login(username, password) {
    try {
        const response = await fetch("/api/user/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("Login failed: ", data.message);
            return false;
        }
        else {
            localStorage.setItem('token', data.token);
            return true;
        }
    } catch (error) {
        console.error("Network Error: ", error);
        return false;
    }
}

export async function register(username, password) {
    try {
        const response = await fetch("/api/user/signup", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("Registration failed: ", data.message);
            return false;
        }
        else {
            console.log("Registration successful!");
            localStorage.setItem('token', data.token);
            return true;
        }
    } catch (error) {
        console.error("Network Error: ", error);
        return false;
    }
}

export async function deleteUser() {
    const data = await makeAuthReq('/api/user/', 'DELETE');
    if (data) {
        localStorage.removeItem('token');
        console.log('Account deleted successfully!');
    }
    else {
        console.log("Account deletion failed!");
    }
}

export async function updateUser(user) {
    const {username, profile_banner_phrase, profile_picture_url} = user;
    const body = {
        username: username, 
        profile_banner_phrase: profile_banner_phrase, 
        profile_picture_url: profile_picture_url
    };
    const data = await makeAuthReq('/api/user/me', 'PATCH', body);
    if (data) {
        console.log("Account updated successfully! user:", data.user);
    }
    else {
        console.log("Account update failed!");
    }
}