import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Col, Row } from 'react-bootstrap';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { getDocs, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function ShowDocs({ filteredDocs, searchQuery }) {
  const [docsList, setDocsList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const CollectionRef = collection(db, 'edocuments');

  const getDocsList = async () => {
    const data = await getDocs(CollectionRef);

    const filteredData = data.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      .filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

    setDocsList(filteredData);
  };

  const deleteDocument = async (id) => {
    const channelDoc = doc(db, 'edocuments', id);
    await deleteDoc(channelDoc);
    getDocsList();
  };

  const updateChannel = async (id) => {
    try {
      const updatedDocs = docsList.map((doc) => {
        if (doc.id === id) {
          const updatedTitle = document.getElementById(`editTitle-${id}`).value;
          return { ...doc, title: updatedTitle };
        } else {
          return doc;
        }
      });

      setDocsList(updatedDocs);
      setEditingId(null);

      const channelDoc = doc(db, 'edocuments', id);
      await updateDoc(channelDoc, {
        title: updatedDocs.find((doc) => doc.id === id).title,
      });
    } catch (error) {
      console.error('Error updating document title:', error);
    }
  };

  const enterEditMode = (id) => {
    setEditingId(id);
  };

  useEffect(() => {
    getDocsList();
  }, [searchQuery]);

  return (
    <Row className='w-100'>
      {docsList.map((item) => (
        <Col key={item.id} xs={12} md={6} lg={4} className='mb-3'>
          <Card style={{ backgroundColor: '#CEA2FD' }} className='h-100'>
            <Card.Body>
              <Card.Title className='text-decoration-bolder'>
                {editingId === item.id ? (
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={item.title}
                    id={`editTitle-${item.id}`}
                  />
                ) : (
                  <span>{item.title}</span>
                )}
              </Card.Title>
              <div className='d-flex justify-content-end'>
                <div className='d-flex flex-column'>
                  <Button
                    style={{ background: 'transparent', border: 'none', marginTop: '-40px', marginBottom: '70px', color: 'green' }}
                    onClick={() =>
                      editingId === item.id
                        ? updateChannel(item.id)
                        : enterEditMode(item.id)
                    }
                  >
                    {editingId === item.id ? <DoneIcon /> : <EditNoteIcon />}
                  </Button>
                  <Button
                    style={{ background: 'transparent', border: 'none', marginBottom: '-35px', color: 'red' }}
                    size='sm'
                    onClick={() => deleteDocument(item.id)}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              </div>
              <Link
                to={`/documents/${item.id}`}
                className='text-decoration-none text-dark'
              >
                <div>
                  <p>{item.docbody}.....</p>
                </div>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
