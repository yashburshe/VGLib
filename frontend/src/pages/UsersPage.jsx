import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Pagination from "react-bootstrap/Pagination";
import ProfileCard from "../components/ProfileCard";
import { Spinner } from "react-bootstrap";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;

  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + usersPerPage);
  const pageWindow = [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
    .filter((page, index, pages) => {
      const inRange = page >= 1 && page <= totalPages;
      const isUnique = pages.indexOf(page) === index;
      return inRange && isUnique;
    });

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/user/all");
      const data = await res.json();
      console.log(data.users);

      setUsers(data.users);
      setCurrentPage(1);
    };

    fetchUsers();
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Users</h1>
      {users.length > 0 ? (
        <>
          <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
            {paginatedUsers.map((user) => (
              <Col key={user.userID}>
                <ProfileCard user={user} />
              </Col>
            ))}
          </Row>
          {totalPages > 1 ? (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                />
                {pageWindow.map((page) => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          ) : null}
        </>
      ) : (
        <div className="d-flex align-items-center gap-2 text-muted">
          <Spinner animation="border" size="sm" />
          Loading top games...
        </div>
      )}
    </Container>
  );
}
