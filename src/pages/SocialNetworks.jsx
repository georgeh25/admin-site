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

const SocialNetworks = () => {
  const [socialNetworks, setSocialNetworks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState({
    name: "",
    url: "",
    iconUrl: "",
    status: true,
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSocialNetworks();
  }, []);

  const fetchSocialNetworks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/social-networks`
      );
      if (Array.isArray(response.data.items)) {
        setSocialNetworks(response.data.items);
      } else {
        throw new Error("Data received is not in the expected format");
      }
    } catch (error) {
      console.error("Error fetching social networks:", error);
      setError("Failed to load social networks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetNetworkForm = () => {
    setCurrentNetwork({
      name: "",
      url: "",
      iconUrl: "",
      status: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (currentNetwork._id) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/social-networks/${
            currentNetwork._id
          }`,
          currentNetwork
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/social-networks`,
          currentNetwork
        );
      }
      setShowModal(false);
      resetNetworkForm();
      fetchSocialNetworks();
    } catch (error) {
      console.error("Error saving social network:", error);
      setError("Failed to save social network. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/social-networks/${id}`
      );
      fetchSocialNetworks();
    } catch (error) {
      console.error("Error deleting social network:", error);
      setError("Failed to delete social network. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading social networks...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Social Networks</h2>
      <Button
        onClick={() => {
          resetNetworkForm();
          setShowModal(true);
        }}
        className="mb-3"
      >
        Add Social Network
      </Button>

      {socialNetworks.length === 0 ? (
        <Alert variant="info">
          No social networks found. Click the "Add Social Network" button to add
          your first network!
        </Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>URL</th>
              <th>Icon</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {socialNetworks.map((network) => (
              <tr key={network._id}>
                <td>{network.name}</td>
                <td>{network.url}</td>
                <td>
                  {network.iconUrl && (
                    <Image
                      src={network.iconUrl}
                      alt={network.name}
                      width="30"
                      height="30"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/30";
                      }}
                    />
                  )}
                </td>
                <td>{network.status ? "Active" : "Inactive"}</td>
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <ButtonGroup>
                      <Button
                        variant="info"
                        onClick={() => {
                          setCurrentNetwork(network);
                          setShowModal(true);
                        }}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(network._id)}
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
            {currentNetwork._id ? "Edit" : "Add"} Social Network
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentNetwork.name}
                onChange={(e) =>
                  setCurrentNetwork({
                    ...currentNetwork,
                    name: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="url"
                value={currentNetwork.url}
                onChange={(e) =>
                  setCurrentNetwork({
                    ...currentNetwork,
                    url: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Icon URL</Form.Label>
              <Form.Control
                type="url"
                value={currentNetwork.iconUrl}
                onChange={(e) =>
                  setCurrentNetwork({
                    ...currentNetwork,
                    iconUrl: e.target.value,
                  })
                }
              />
            </Form.Group>
            {currentNetwork.iconUrl && (
              <Form.Group className="mb-3">
                <Form.Label>Icon Preview</Form.Label>
                <div>
                  <Image
                    src={currentNetwork.iconUrl}
                    alt="Icon Preview"
                    thumbnail
                    width="50"
                    height="50"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/50";
                    }}
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

export default SocialNetworks;
