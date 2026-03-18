//front end functions to support CRUD operations on the lists route
async function helper(method, endpoint, body= null) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn("No authentication token found");
        return null;
    }
    try {
        let requestInit = {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type' : 'application/json'
            }
        };
        if (body) {
            requestInit.body = JSON.stringify({body});
        }  
        const response = await fetch(endpoint, requestInit);
        const data = await response.json();
        if (!response.ok) {
            console.error("Session error: ", data.message);
            return null;
        }
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getUserLists() {
    const data = helper('GET', "/api/list/userlists");
    return data.lists ?? [];
}

export async function getList(listID) {
    const data = helper('GET', `/api/list/${listID}`);
    return data.list ?? null;
}

export async function createList(listName) {
    return helper('POST', '/api/list', listName) ? true : false;
}

export async function deleteList(listID) {
    return helper('DELETE', `/api/list/${listID}`) ? true : false;
}

export async function updateList(listID, newGameID) {
    return helper('PATCH', `/api/list/${listID}`, newGameID) ? true : false;
}