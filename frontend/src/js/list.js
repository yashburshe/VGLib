//front end functions to support CRUD operations on the lists route

export async function getUserLists() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn("No authentication token found");
        return null;
    }
    try {
        const response = await fetch("/api/list/userlists", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type' : 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("Session error: ", data.message);
            return [];
        }
        console.log("Lists fetched successfully: ", data.lists);
        return data.lists;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getList(listID) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn("No authentication token found");
        return null;
    }
    try {
        const response = await fetch(`/api/list/${listID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type' : 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("Session error: ", data.message);
            return [];
        }
        return data.list;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function createList(listName) {

}


export async function deleteList(listID) {

}

export async function updateList(listID) {

}