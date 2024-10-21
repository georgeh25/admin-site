import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Modal,
  Alert,
  ButtonGroup,
} from "react-bootstrap";
import axios from "axios";
axios.defaults.withCredentials = true;

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [currentExperience, setCurrentExperience] = useState({
    company: "",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/experiences`
      );
      if (Array.isArray(response.data.items)) {
        setExperiences(response.data.items);
      } else {
        throw new Error("Data received is not in the expected format");
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
      setError("Failed to load experiences. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetExperienceForm = () => {
    setCurrentExperience({
      company: "",
      role: "",
      description: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (currentExperience._id) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/experiences/${
            currentExperience._id
          }`,
          currentExperience
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/experiences`,
          currentExperience
        );
      }
      setShowModal(false);
      resetExperienceForm();
      fetchExperiences();
    } catch (error) {
      console.error("Error saving experience:", error);
      setError("Failed to save experience. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/experiences/${id}`
      );
      fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
      setError("Failed to delete experience. Please try again.");
    }
  };

  const handleShowDescription = (experience) => {
    setCurrentExperience(experience);
    setShowDescriptionModal(true);
  };

  const handleEditClick = (experience) => {
    setCurrentExperience({
      ...experience,
      startDate: experience.startDate.split("T")[0],
      endDate: experience.endDate ? experience.endDate.split("T")[0] : "",
    });
    setShowModal(true);
  };

  if (isLoading) {
    return <div>Loading experiences...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Experiences</h2>
      <Button
        onClick={() => {
          resetExperienceForm();
          setShowModal(true);
        }}
        className="mb-3"
      >
        Add Experience
      </Button>

      {experiences.length === 0 ? (
        <Alert variant="info">
          No experiences found. Click the "Add Experience" button to add your
          first experience!
        </Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Duration</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => (
              <tr key={exp._id}>
                <td>{exp.company}</td>
                <td>{exp.role}</td>
                <td>{`${new Date(exp.startDate).toLocaleDateString()} - ${
                  exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString()
                    : "Present"
                }`}</td>
                <td>
                  <Button
                    variant="link"
                    onClick={() => handleShowDescription(exp)}
                  >
                    View Description
                  </Button>
                </td>
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <ButtonGroup>
                      <Button
                        variant="info"
                        onClick={() => handleEditClick(exp)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(exp._id)}
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

      {/* Modal para añadir/editar experiencia */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentExperience._id ? "Edit" : "Add"} Experience
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                value={currentExperience.company}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    company: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                value={currentExperience.role}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    role: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentExperience.description}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    description: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={currentExperience.startDate}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    startDate: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={currentExperience.endDate}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    endDate: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para mostrar la descripción completa */}
      <Modal
        show={showDescriptionModal}
        onHide={() => setShowDescriptionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentExperience.role} at {currentExperience.company}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{currentExperience.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDescriptionModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Experiences;
