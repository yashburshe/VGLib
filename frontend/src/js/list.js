import { makeAuthReq } from "./frontEndUtils";

export async function getUserLists() {
    const data = await makeAuthReq('/api/list/userlists', 'GET');
    if (data) return data.lists;
}

export async function getList(listID) {
    const data = await makeAuthReq(`/api/list/${listID}`, 'GET');
    if (data) return data.list;
}

export async function createList(listName) {
    const data = await makeAuthReq('/api/list', 'POST', {listName: listName});
    return data !== null;
}

export async function deleteList(listID) {
    const data = await makeAuthReq(`/api/list/${listID}`, 'DELETE');
    return data !== null;
}

export async function addGameToList(listID, newGameID) {
    const data = await makeAuthReq(
        `/api/list/${listID}`,
        'PATCH',
        {gameID: newGameID}
    );
    return data !== null;
}