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