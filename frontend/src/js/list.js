import { makeAuthReq } from "./frontEndUtils";

export async function getUserLists() {
  const data = await makeAuthReq("/api/list/userlists", "GET");
  return data?.lists ?? [];
}

export async function getList(listID) {
  const data = await makeAuthReq(`/api/list/${listID}`, "GET");
  return data?.list ?? null;
}

export async function createList(listName) {
  const data = await makeAuthReq("/api/list", "POST", { listName: listName });
  return data?.listID ?? null;
}

export async function deleteList(listID) {
  return await makeAuthReq(`/api/list/${listID}`, "DELETE");
}

export async function toggleGameInList(listID, newGameID) {
  return await makeAuthReq(`/api/list/${listID}`, "PATCH", {
    gameID: newGameID,
  });
}
