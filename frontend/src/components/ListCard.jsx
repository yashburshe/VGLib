import React from "react";

export default function listCard({list}) {
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