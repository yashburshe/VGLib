import ListCard from "./ListCard";

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
        <ListCard key={list.listID} list={list} />
      ))}
    </section>
  );
}
