import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Modal,
  Alert,
  Image,
  ButtonGroup,
} from "react-bootstrap";
import axios from "axios";
axios.defaults.withCredentials = true;

const Technologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTech, setCurrentTech] = useState({
    name: "",
    iconUrl: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/technologies`
      );
      //console.log("Response from server:", response.data);
      if (
        response.data &&
        response.data.items &&
        Array.isArray(response.data.items)
      ) {
        setTechnologies(response.data.items);
      } else if (Array.isArray(response.data)) {
        setTechnologies(response.data);
      } else {
        throw new Error("Data received is not in the expected format");
      }
    } catch (error) {
      console.error("Error fetching technologies:", error);
      setError("Failed to load technologies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetTechForm = () => {
    setCurrentTech({
      name: "",
      iconUrl: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (currentTech._id) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/technologies/${
            currentTech._id
          }`,
          currentTech
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/technologies`,
          currentTech
        );
      }
      setShowModal(false);
      resetTechForm();
      fetchTechnologies();
    } catch (error) {
      console.error("Error saving technology:", error);
      setError("Failed to save technology. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/technologies/${id}`
      );
      fetchTechnologies();
    } catch (error) {
      console.error("Error deleting technology:", error);
      setError("Failed to delete technology. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading technologies...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Technologies</h2>
      <Button
        onClick={() => {
          resetTechForm();
          setShowModal(true);
        }}
        className="mb-3"
      >
        Add Technology
      </Button>

      {technologies.length === 0 ? (
        <Alert variant="info">
          No technologies found. Click the "Add Technology" button to add your
          first technology!
        </Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Icon</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {technologies.map((tech) => (
              <tr key={tech._id}>
                <td>{tech.name}</td>
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    {tech.iconUrl && (
                      <Image
                        src={tech.iconUrl}
                        alt={tech.name}
                        thumbnail
                        width="50"
                      />
                    )}
                  </div>
                </td>
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <ButtonGroup>
                      <Button
                        variant="info"
                        onClick={() => {
                          setCurrentTech(tech);
                          setShowModal(true);
                        }}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(tech._id)}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentTech._id ? "Edit" : "Add"} Technology
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentTech.name}
                onChange={(e) =>
                  setCurrentTech({
                    ...currentTech,
                    name: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Icon URL</Form.Label>
              <Form.Control
                type="url"
                value={currentTech.iconUrl}
                onChange={(e) =>
                  setCurrentTech({
                    ...currentTech,
                    iconUrl: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            {currentTech.iconUrl && (
              <Form.Group className="mb-3">
                <Form.Label>Icon Preview</Form.Label>
                <div>
                  <Image
                    src={currentTech.iconUrl}
                    alt={currentTech.name}
                    thumbnail
                    width="50"
                  />
                </div>
              </Form.Group>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Technologies;
