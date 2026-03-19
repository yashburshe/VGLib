//fetch functions for games route CRUD operations support

import { makeAuthReq } from "./frontEndUtils";


export async function createGame(game) {
    const data = await makeAuthReq('/api/games', 'POST', {game});
    return data;
}

export async function getGame(gameID) {
    const data = await makeAuthReq(`/api/games/${gameID}`, 'GET');
    if (data) return data.game;
}

export async function deleteGame(gameID) {
    return await makeAuthReq(`/api/games/${gameID}`, 'DELETE');
}

export async function getGamesByUser(userID) {
    const res = await fetch(`/api/user/${userID}/games`);
    const data = await res.json();
    if (data?.success) return data.games;
    return [];
}