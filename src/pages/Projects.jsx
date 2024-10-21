import { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Alert, Image } from "react-bootstrap";
import axios from "axios";
axios.defaults.withCredentials = true;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    title: "",
    description: "",
    imageUrl: "",
    technologies: [],
  });
  const [newImage, setNewImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchTechnologies();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/projects`,
        { withCredentials: true }
      );
      if (response.data && Array.isArray(response.data.items)) {
        setProjects(response.data.items);
      } else if (Array.isArray(response.data)) {
        setProjects(response.data);
      } else {
        throw new Error("Data received is not in the expected format");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTechnologies = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/technologies`,
        { withCredentials: true }
      );
      if (response.data && Array.isArray(response.data.items)) {
        setTechnologies(response.data.items);
      } else if (Array.isArray(response.data)) {
        setTechnologies(response.data);
      } else {
        console.error("Technologies data is not in the expected format");
      }
    } catch (error) {
      console.error("Error fetching technologies:", error);
    }
  };

  const resetProjectForm = () => {
    setCurrentProject({
      title: "",
      description: "",
      imageUrl: "",
      technologies: [],
    });
    setNewImage(null);
    setImageError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", currentProject.title);
      formData.append("description", currentProject.description);
      formData.append(
        "technologies",
        JSON.stringify(currentProject.technologies)
      );
      if (newImage) {
        formData.append("image", newImage);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      };

      if (currentProject._id) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/projects/${
            currentProject._id
          }`,
          formData,
          config
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/projects`,
          formData,
          config
        );
      }
      setShowModal(false);
      resetProjectForm();
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      setError("Failed to save project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/projects/${id}`,
        { withCredentials: true }
      );
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete project. Please try again.");
    }
  };

  const handleTechChange = (e) => {
    const techId = e.target.value;
    const isChecked = e.target.checked;
    setCurrentProject((prevProject) => ({
      ...prevProject,
      technologies: isChecked
        ? [...new Set([...prevProject.technologies, techId])]
        : prevProject.technologies.filter((id) => id !== techId),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setImageError("Invalid file type. Only JPEG, JPG and PNG are allowed.");
        e.target.value = ""; // Reset the input
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        setImageError("File is too large. Maximum size is 5MB.");
        e.target.value = ""; // Reset the input
        return;
      }
      setNewImage(file);
      setImageError(null);
    }
  };

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Projects</h2>
      <Button
        onClick={() => {
          resetProjectForm();
          setShowModal(true);
        }}
        className="mb-3"
      >
        Add Project
      </Button>

      {projects.length === 0 ? (
        <Alert variant="info">
          No projects found. Click the "Add Project" button to add your first
          project!
        </Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Image</th>
              <th>Technologies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((proj) => (
              <tr key={proj._id}>
                <td>{proj.title}</td>
                <td>{proj.description}</td>
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    {proj.imageUrl && (
                      <Image
                        src={`${import.meta.env.VITE_BACKEND_URL}${
                          proj.imageUrl
                        }`}
                        thumbnail
                        width="100"
                      />
                    )}
                  </div>
                </td>
                <td>{proj.technologies.map((tech) => tech.name).join(", ")}</td>
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      variant="info"
                      onClick={() => {
                        setCurrentProject({
                          ...proj,
                          technologies: proj.technologies.map(
                            (tech) => tech._id
                          ),
                        });
                        setShowModal(true);
                      }}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(proj._id)}
                    >
                      Delete
                    </Button>
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
            {currentProject._id ? "Edit" : "Add"} Project
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={currentProject.title}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    title: e.target.value,
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
                value={currentProject.description}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    description: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              {currentProject.imageUrl && (
                <div className="mb-2">
                  <Image
                    src={`${import.meta.env.VITE_BACKEND_URL}${
                      currentProject.imageUrl
                    }`}
                    thumbnail
                    width="200"
                  />
                </div>
              )}
              <Form.Control
                type="file"
                onChange={handleImageChange}
                accept=".jpg,.jpeg,.png"
              />
              {imageError && <Alert variant="danger">{imageError}</Alert>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Technologies</Form.Label>
              {technologies.map((tech) => (
                <Form.Check
                  key={tech._id}
                  type="checkbox"
                  label={tech.name}
                  value={tech._id}
                  checked={currentProject.technologies.includes(tech._id)}
                  onChange={handleTechChange}
                />
              ))}
            </Form.Group>
            <Button type="submit" disabled={isSubmitting || imageError}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Projects;
