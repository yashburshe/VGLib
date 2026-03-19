import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Form, InputGroup } from "react-bootstrap";

export default function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    const q = searchText.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const queryString = params.toString();
    navigate(queryString ? `/search?${queryString}` : "/search");
  };

  return (
    <section className="mb-5">
      <Form onSubmit={onSearch}>
        <InputGroup>
          <Form.Control
            type="search"
            placeholder="Search games by title, summary, or platform"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button type="submit" variant="primary">
            Search
          </Button>
        </InputGroup>
      </Form>
    </section>
  );
}
