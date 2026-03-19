import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'react-bootstrap-icons';

import {deleteList} from '../js/list.js';

export default function listCard({list}) {
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
      <Button variant="danger">
        <Trash size={20} onClick={onDelete}/>
      </Button>
    </>);
  };

  return (
    // Add cursor pointer style to indicate clickability
    <Card 
      onClick={() => navigate(`/lists/${list.listID}`)} 
      style={{ cursor: 'pointer', width: '18rem' }}>
      <Card.Body>
        <Card.Title> 
          {list.name}
          {list.count !== undefined && <span>{list.count} items</span>}
        </Card.Title>
        <Card.Text>  {list.description?? "No Description"} </Card.Text>
        {isDefaultList ? (<></>) : (<DeleteButton/>)}
      </Card.Body>
    </Card>
  );
}