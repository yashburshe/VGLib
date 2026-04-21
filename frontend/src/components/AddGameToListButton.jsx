import { useEffect, useMemo, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { HeartFill, BookmarkFill, Bookshelf } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toggleGameInList, getUserLists } from "../js/list";

export default function AddGameToListButton({ game, compact = false }) {
  const [show, setShow] = useState(false);
  const [usersLists, setUsersLists] = useState(new Map());
  const navigate = useNavigate();

  const defaultListConfigs = useMemo(
    () => [
      {
        name: "Favorites",
        label: "Favorites",
        icon: HeartFill,
        variant: "danger",
      },
      {
        name: "Wishlist",
        label: "Wishlist",
        icon: BookmarkFill,
        variant: "warning",
      },
      {
        name: "Owned",
        label: "Owned",
        icon: Bookshelf,
        variant: "primary",
      },
    ],
    [],
  );

  useEffect(() => {
    if (!game?.id) {
      return;
    }

    async function fetchLists() {
      const lists = await getUserLists();
      const kvPairs = lists.map((list) => [
        list.listID,
        {
          name: list.name,
          containsGame: list.games?.includes(game.id) || false,
        },
      ]);
      setUsersLists(new Map(kvPairs));
    }

    fetchLists();
  }, [game?.id]);

  const handleToggleDefaultList = async (listID) => {
    if (!game?.id) {
      return;
    }

    const currentList = usersLists.get(listID);
    const response = await toggleGameInList(listID, game.id);
    if (!response) {
      alert("Update failed, try again");
      return;
    }

    setUsersLists((prev) => {
      const next = new Map(prev);
      next.set(listID, {
        ...currentList,
        containsGame: !currentList?.containsGame,
      });
      return next;
    });
  };

  const getListButtonState = (listName) => {
    for (const [listID, listInfo] of usersLists.entries()) {
      if (listInfo.name === listName) {
        return { listID, ...listInfo };
      }
    }

    return null;
  };

  const customLists = useMemo(
    () =>
      [...usersLists].filter(
        ([, listInfo]) =>
          !defaultListConfigs.some(({ name }) => name === listInfo.name),
      ),
    [defaultListConfigs, usersLists],
  );

  return (
    <div className="d-flex flex-column gap-2">
      <div className={compact ? "d-flex gap-2" : "d-grid gap-2"}>
        {defaultListConfigs.map(({ name, label, icon: Icon, variant }) => {
          const listState = getListButtonState(name);
          const isAdded = Boolean(listState?.containsGame);
          const isAvailable = Boolean(listState?.listID);
          const buttonVariant = isAdded ? variant : `outline-${variant}`;

          return (
            <Button
              key={name}
              variant={buttonVariant}
              disabled={!game?.id || !isAvailable}
              aria-pressed={isAdded}
              onClick={() => handleToggleDefaultList(listState.listID)}
              className={`d-inline-flex align-items-center justify-content-center gap-2 ${
                compact ? "flex-fill" : ""
              }`}
              size="sm"
              title={isAdded ? `${label} added` : `Add to ${label}`}
            >
              <Icon size={18} />
              {compact ? (
                <span className="visually-hidden">
                  {isAdded ? `${label} Added` : `Add to ${label}`}
                </span>
              ) : (
                <span>{isAdded ? `${label} Added` : label}</span>
              )}
            </Button>
          );
        })}
      </div>

      <Button
        variant="primary"
        onClick={() => setShow(true)}
        disabled={!game?.id}
      >
        Add to List(s)
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add {game.name} to Custom List(s)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {customLists.length > 0 ? (
            <Form>
              {customLists.map(([listID, { name, containsGame }]) => (
                <Form.Check
                  key={listID}
                  type="checkbox"
                  label={name}
                  value={listID}
                  checked={containsGame}
                  onChange={() => handleToggleDefaultList(listID)}
                />
              ))}
            </Form>
          ) : (
            <div className="d-flex flex-column gap-3">
              <p className="mb-0 text-muted">
                You do not have any custom lists yet.
              </p>
              <Button
                variant="outline-primary"
                onClick={() => {
                  setShow(false);
                  navigate("/profile");
                }}
              >
                Create a Custom List
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
