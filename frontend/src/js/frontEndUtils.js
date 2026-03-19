//general util functions to simplify API fetch handling

export async function makeAuthReq(endpoint, method = "GET", body = null) {
    //Handle Authorization
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('No authentication token found');
        return null;
    }
    const headers = {'Authorization': `Bearer ${token}`};
    const fetchOptions = {method, headers};
    if (body) {
        headers["Content-Type"] = 'application/json';
        fetchOptions.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(endpoint, fetchOptions);
        const data = await response.json();
        if (!response.ok) {
            console.error("Session invalid: ", data.message);
            return null;
        }
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}