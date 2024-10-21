import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AboutMe from "./AboutMe";

const Dashboard = () => {
  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Portfolio Dashboard</h1>
      <Row>
        <Col md={12}>
          <AboutMe />
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Projects</Card.Title>
              <Card.Text>
                Manage your portfolio projects. Add, edit, or remove projects.
              </Card.Text>
              <Link to="/projects">
                <Button variant="primary">Go to Projects</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Experiences</Card.Title>
              <Card.Text>
                Update your work experiences. Add new roles or edit existing
                ones.
              </Card.Text>
              <Link to="/experiences">
                <Button variant="primary">Go to Experiences</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Technologies</Card.Title>
              <Card.Text>
                Manage the technologies and skills you're proficient in.
              </Card.Text>
              <Link to="/technologies">
                <Button variant="primary">Go to Technologies</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Social Networks</Card.Title>
              <Card.Text>
                Manage your social network profiles and links.
              </Card.Text>
              <Link to="/social-networks">
                <Button variant="primary">Go to Social Networks</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Users</Card.Title>
              <Card.Text>Manage user accounts for the admin panel.</Card.Text>
              <Link to="/users">
                <Button variant="primary">Go to Users</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
