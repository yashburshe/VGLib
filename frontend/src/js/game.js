//fetch functions for games route CRUD operations support

import { makeAuthReq } from "./frontEndUtils";


export async function createGame(game) {
    //TODO: confirm backend is complete!
    console.error("Backend does not return any indication of success!")
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn("No authentication token found");
        return null;
    }
    try {
        const response = await fetch("/api/games", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ game })
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("Session error: ", data.message);
            return [];
        }
        console.log("Game Created successfully: ", data);
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
export async function getGame(gameID) {
    const data = await makeAuthReq(`/api/games/${gameID}`, 'GET');
    if (data) return data.game;
}