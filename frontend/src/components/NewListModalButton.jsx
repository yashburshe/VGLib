//Button and Modal for users to create a new list

import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

export default function AddListModalButton({ onAddList, existingNames }) {
    const [show, setShow] = useState(false);
    const [listName, setListName] = useState('');
    const [error, setError] = useState('');

    const handleAdd = () => {
        if (!listName.trim()) {
            setError('List name cannot be empty');
            return;
        }

        if (existingNames.includes(listName.trim())) {
            setError('A list with this name already exists');
            return;
        }

        onAddList(listName.trim());
        setListName('');
        setError('');
        setShow(false);
    };

    const handleClose = () => {
        setListName('');
        setError('');
        setShow(false);
    };

    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Create New List
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                        <Form.Group>
                            <Form.Label>List Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter list name"
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAdd}>
                        Create List
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}