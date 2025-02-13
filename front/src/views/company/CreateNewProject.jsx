import React, {  useState, useEffect,} from "react";
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { soupherb, gaikwad, ongc, Lotus } from '../../images';
import { Link } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa';
import { useAuth } from "../../store/auth";
import {  useNavigate } from 'react-router-dom';

const CreateNewProject = () => {

  const {isLoggedIn}= useAuth();
  const navigate = useNavigate();
  const [adminlist, setAdminlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/customer/custlist');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      setAdminlist(result.msg);

    } catch (error) {
      
      console.error('Error fetching data:', error);
      console.log('Failed to load data. Please try again later.');
    } 
  };

    // Filtered admin list based on the search term
    const filteredAdminlist = adminlist.filter((project) =>
      project.compname.toLowerCase().includes(searchTerm.toLowerCase())
    );
 // Handle search input change
 const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
};

  useEffect(() => {
    if( !isLoggedIn ){
      navigate('/auth/signin');
    }
    fetchData();
  }, [isLoggedIn, navigate]); 


  return (
    <div className="create-new-project mb40">
      {/* <Card>
          <Card.Body>

          </Card.Body>
        </Card> */}
      <Row className="">
        <Col lg={4}>
          <div id="main-search" className="open-search">
            <div className="input-group mt-2">
              <span role="button" tabIndex="0" className="input-group-append search-btn" style={{ borderRadius: '50%', marginRight: 15 }}>
                <i className="feather icon-search input-group-text" />
              </span>
              <input type="text" id="m-search"
                className="form-control"

                value={searchTerm}
                onChange={handleSearchChange} placeholder="Search websites..." />
            </div>
          </div>
        </Col>
        <Col lg={2}></Col>
        <Col lg={6}>
          <div className="text-right mt20">
            <Link to="/dev-forms/details-form" className="create-button btn btn-primary waves-effect waves-light">
              <AiOutlinePlus /> Create New Project
            </Link>
          </div>
        </Col>
      </Row>
      <Row>      
      {filteredAdminlist.length > 0 ? (
          filteredAdminlist.map((val) => (
        <Col lg={4} key={val._id} >
          <Card className="project-card">
            <div className="card-image-wrapper">
              <Card.Img variant="top" src={Lotus} />
              <div className="overlay">
                <div className="button">
                  <a
                    href="http://localhost:3001/auth/signin"
                    target="_blank"
                    className="create-button btn btn-primary waves-effect waves-light"
                  >
                    Preview 
                  </a>
                </div>
              </div>
            </div>
            <Card.Body>
              <Card.Title>
              {val.compname} {' '}
                <a href="http://localhost:3001/auth/signin" target="_blank" style={{ float: 'right' }} className="view-color">
                  <FaRegEye />
                </a>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      ))
    ) : (
      <p>No projects found</p>
    )}
       
      </Row>
      {/* <Row>
        <Col lg={4}>
          <Card className="project-card">
            <div className="card-image-wrapper">
              <Card.Img variant="top" src={soupherb} />
              <div className="overlay">
                <div className="button">
                  <a
                    href="https://www.digihostsolutions.com/soupherb-new/"
                    target="_blank"
                    className="create-button btn btn-primary waves-effect waves-light"
                  >
                    Preview
                  </a>
                </div>
              </div>
            </div>
            <Card.Body>
              <Card.Title>
                SoupHerb - Soulful Sips Of Soma{' '}
                <a href="https://www.digihostsolutions.com/soupherb-new/" target="_blank" style={{ float: 'right' }} className="view-color">
                  <FaRegEye />
                </a>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="project-card">
            <div className="card-image-wrapper">
              <Card.Img variant="top" src={gaikwad} />
              <div className="overlay">
                <div className="button">
                  <a href="https://www.drgaikwad.com/" target="_blank" className="create-button btn btn-primary waves-effect waves-light">
                    Preview
                  </a>
                </div>
              </div>
            </div>
            <Card.Body>
              <Card.Title>
                Dr. S. Gaikwad{' '}
                <a href="https://www.drgaikwad.com/" target="_blank" style={{ float: 'right' }} className="view-color">
                  <FaRegEye />
                </a>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="project-card">
            <div className="card-image-wrapper">
              <Card.Img variant="top" src={ongc} />
              <div className="overlay">
                <div className="button">
                  <a
                    href="https://digihostsolutions.com/ongc-live/"
                    target="_blank"
                    className="create-button btn btn-primary waves-effect waves-light"
                  >
                    Preview
                  </a>
                </div>
              </div>
            </div>
            <Card.Body>
              <Card.Title>
                ONGC{' '}
                <a href="https://digihostsolutions.com/ongc-live/" target="_blank" style={{ float: 'right' }} className="view-color">
                  <FaRegEye />
                </a>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
    </div>
  );
};

export default CreateNewProject;
