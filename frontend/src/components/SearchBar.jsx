import { useEffect } from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    console.log(searchTerm)

    useEffect(() => {
        const searchGames = async () => {
            const res = await fetch("/api/search");
            if (!res.ok) {
                console.error("Failed to fetch search results", res.status)
                return;
            }
            const data = await res.json();
            setSearchResults(data);
        }

        searchGames();
    }, [searchTerm])

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Control onChange={(e) => { setSearchTerm(e.value) }} placeholder="Search Games" />
            </Form.Group>
            {
                searchResults
            }
        </>
    )
}