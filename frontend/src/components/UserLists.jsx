import { Col, Container, Row } from "react-bootstrap";
import ListCard from "./ListCard";

export default function UserLists({ lists, fetchLists }) {
export default function UserLists({ lists, onListDeleted }) {
  if (!lists || lists.length === 0) {
    return (
      <section className="lists-row">
        <p className="empty-state">No lists yet. Create one to get started.</p>
      </section>
    );
  }

  return (
    <Container className="mt-3 lists-row">
      <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
        {lists.map((list) => (
          <Col key={list.listID} className="d-flex">
            <ListCard list={list} onListDelete={fetchLists} />
            <ListCard list={list} onListDeleted={onListDeleted} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
