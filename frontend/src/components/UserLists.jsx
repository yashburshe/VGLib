import React from "react";

function ListCard({ list }) {
  return (
    <article className="list-card">
      <header>
        <h3>{list.name}</h3>
        {list.count !== undefined && (
          <span className="list-count">{list.count} items</span>
        )}
      </header>
      {list.description && <p className="list-description">{list.description}</p>}
      <footer className="list-actions">
        <button className="btn btn-danger" onClick={() => alert(`Delete list: ${list.name}`)}>
            Delete
        </button>
        <button className="btn btn-info" onClick={() => alert(`Edit list: ${list.name}`)}>
            Edit
        </button>
      </footer>
    </article>
  );
}

export default function UserLists({ lists }) {
  if (!lists || lists.length === 0) {
    return (
      <section className="lists-row">
        <p className="empty-state">No lists yet. Create one to get started.</p>
      </section>
    );
  }

  return (
    <section className="lists-row">
      {lists.map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
    </section>
  );
}
