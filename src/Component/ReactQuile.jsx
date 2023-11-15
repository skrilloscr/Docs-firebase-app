import React, { useState, useEffect } from 'react';
import { Container, Button, Col, Row } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

function stripHTMLTags(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

function ReactQuile() {
  const { id } = useParams();
  const [docBody, setDocBody] = useState('');
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const fetchDocBody = async () => {
    try {
      const docRef = doc(db, 'edocuments', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { docbody, title } = docSnap.data();
        setDocBody(docbody);
        setTitle(title);
      } else {
        console.log('Document does not exist!');
      }
    } catch (error) {
      console.error('Error fetching document body:', error);
    }
  };

  const handleDocBodyChange = async (content, _, source) => {
    try {
      if (source === 'user') {
        setDocBody(content);
      }
    } catch (error) {
      console.error('Error updating document body:', error);
    }
  };

  const handleTitleChange = async (event) => {
    try {
      const newTitle = event.target.value;
      const docRef = doc(db, 'edocuments', id);
      await updateDoc(docRef, {
        title: newTitle,
      });
      setTitle(newTitle);
    } catch (error) {
      console.error('Error updating document title:', error);
    }
  };

  const handleSaveDocument = async () => {
    try {
      const sanitizedValue = stripHTMLTags(docBody);
      const docRef = doc(db, 'edocuments', id);
      await updateDoc(docRef, {
        docbody: sanitizedValue,
        title,
      });
      console.log('Document saved successfully');
      navigate('/');
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const handleDeleteDocument = async () => {
    try {
      const docRef = doc(db, 'edocuments', id);
      await deleteDoc(docRef);
      navigate('/');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  useEffect(() => {
    fetchDocBody();
  }, [id]);

  return (
    <div className='vh-100' style={{ backgroundColor: '#df9ff7' }}>
      <Container className='p-3'>
        <Row className='mb-3'>
          <Col xs={12} md={6}>
            <label htmlFor="title" className="form-label">TITLE</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={handleTitleChange}
            />
          </Col>
        </Row>
        <ReactQuill
          className='bg-body-secondary mb-3'
          value={docBody}
          onChange={handleDocBodyChange}
        />
        <Row className='mt-3'>
          <Col xs={12} md={6}>
            <Button variant="primary" onClick={handleSaveDocument}>Save Document</Button>{' '}
            <Button variant="danger" onClick={handleDeleteDocument}>Delete Document</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ReactQuile;
