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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: "",
    password: "",
    fullname: "",
    status: true,
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users`
      );
      if (Array.isArray(response.data.items)) {
        setUsers(response.data.items);
      } else {
        throw new Error("Data received is not in the expected format");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserForm = () => {
    setCurrentUser({
      username: "",
      password: "",
      fullname: "",
      status: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (currentUser._id) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/${currentUser._id}`,
          currentUser
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/users`,
          currentUser
        );
      }
      setShowModal(false);
      resetUserForm();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      setError("Failed to save user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/${id}`
      );
      if (response.status === 400) {
        setError("Cannot delete the last active user in the system.");
      } else {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.response && error.response.status === 400) {
        setError("Cannot delete the last active user in the system.");
      } else {
        setError("Failed to delete user. Please try again.");
      }
    }
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Users</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button
        onClick={() => {
          resetUserForm();
          setShowModal(true);
        }}
        className="mb-3"
      >
        Add User
      </Button>

      {users.length === 0 ? (
        <Alert variant="info">
          No users found. Click the "Add User" button to add your first user!
        </Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.fullname}</td>
                <td>{user.status ? "Active" : "Inactive"}</td>
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <ButtonGroup>
                      <Button
                        variant="info"
                        onClick={() => {
                          setCurrentUser({ ...user, password: "" });
                          setShowModal(true);
                        }}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(user._id)}
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
          <Modal.Title>{currentUser._id ? "Edit" : "Add"} User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.username}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    username: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={currentUser.password}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    password: e.target.value,
                  })
                }
                required={!currentUser._id}
              />
              {currentUser._id && (
                <Form.Text className="text-muted">
                  Leave blank to keep the current password.
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.fullname}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    fullname: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Users;
