import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'react-bootstrap-icons';

import {deleteList} from '../js/list.js';

export default function ListCard({list}) {
  const navigate = useNavigate();
  const requiredLists = ["Favorites", "Wishlist", "Owned"];
  const isDefaultList = requiredLists.includes(list.name);

  const onDelete = (e) => {
    e.stopPropagation(); 
    deleteList(list.listID);
    alert("List deleted!");
  };


  const DeleteButton = () => {
    return (<>
      <Button variant="outline-danger" size="sm">
        <Trash size={20} onClick={onDelete}/>
      </Button>
    </>);
  };

  return (
    <Card 
      className="list-grid-card h-100 w-100"
      onClick={() => navigate(`/lists/${list.listID}`)} 
      style={{ cursor: 'pointer' }}>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex justify-content-between align-items-start gap-2 mb-2"> 
          <span>{list.name}</span>
          {list.count !== undefined && <span className="list-count-pill">{list.count} items</span>}
        </Card.Title>
        <Card.Text className="text-muted mb-3 list-description">{list.description?? "No Description"}</Card.Text>
        {!isDefaultList ? (<div className="mt-auto"><DeleteButton/></div>) : null}
      </Card.Body>
    </Card>
  );
}