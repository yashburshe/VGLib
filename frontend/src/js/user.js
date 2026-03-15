//front end functions to support CRUD operations on the user route

import { redirect } from "react-router";

export async function getUser() {
  const token = "123445";
  //const token = localStorage.getItem('token');
  if (!token) {
    console.warn("No authentication token found");
    return null;
  }
  try {
    const response = await fetch('api/user/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type' : 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Session invalid: ", data.message);
      localStorage.removeItem('token');
      return null;
    }
    return data.user;
  } catch (error) {
    console.error(error);
    return null;
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
        }
        else {
            console.log("Login successful!");
            localStorage.setItem('token', data.token);
        }
        
    } catch (error) {
        console.error("Network Error: ", error);
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
        }
        else {
            console.log("Registration successful!");
            localStorage.setItem('token', data.token);
        }
    } catch (error) {
        console.error("Network Error: ", error);
    }
}

export async function deleteUser() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn("No authentication token found");
        return;
    }
    try {        
        const response = await fetch("/api/user/delete", {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }        
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("Account deletion failed: ", data.message);
        } else {
            console.log("Account deleted successfully");
            localStorage.removeItem('token');
        }
    } catch (error) {
        console.error("Network Error: ", error);
    }
}

export async function updateUser(profile_phrase) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn("No authentication token found");
        return;
    }
    try {        
        const response = await fetch("/api/user/me", {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }        
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("Account update failed: ", data.message);
        } else {
            console.log("Account updated successfully! user:", data.user);
        }
    } catch (error) {
        console.error("Network Error: ", error);
    }
}