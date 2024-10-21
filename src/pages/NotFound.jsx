// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

const NotFound = () => {
  return (
    <Container className="text-center mt-5">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Button variant="primary" as={Link} to="/">
        Go to Home
      </Button>
    </Container>
  );
};

export default NotFound;
