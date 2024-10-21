import React, { useState, useEffect } from "react";
import { Card, Button, Form, Image, Alert } from "react-bootstrap";
import axios from "axios";

axios.defaults.withCredentials = true;

const AboutMe = () => {
  const [aboutMeData, setAboutMeData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newAboutMe, setNewAboutMe] = useState("");
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAboutMeData();
  }, []);

  const fetchAboutMeData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/about-me`
      );
      setAboutMeData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAboutMeData(null);
      } else {
        console.error("Error fetching about me data:", error);
        setError(
          "Failed to load about me information. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setNewAboutMe(aboutMeData ? aboutMeData.aboutMe : "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewProfilePhoto(null);
  };

  const handlePhotoChange = (event) => {
    setNewProfilePhoto(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.append("aboutMe", newAboutMe);
    if (newProfilePhoto) {
      formData.append("profilePhoto", newProfilePhoto);
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/about-me`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setAboutMeData(response.data.data);
      setIsEditing(false);
      setNewProfilePhoto(null);
    } catch (error) {
      console.error("Error updating about me:", error);
      setError("Failed to update about me information. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading about me information...</div>;
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>About Me</h2>
          {!isEditing && (
            <Button variant="primary" onClick={handleEdit}>
              {aboutMeData ? "Edit" : "Add Information"}
            </Button>
          )}
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {!isEditing ? (
          aboutMeData ? (
            <div className="d-flex">
              <Image
                src={`${import.meta.env.VITE_BACKEND_URL}${
                  aboutMeData.profilePhotoUrl
                }`}
                alt="Profile"
                roundedCircle
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                className="me-4"
              />
              <p>{aboutMeData.aboutMe}</p>
            </div>
          ) : (
            <Alert variant="info">
              No information available. Click "Add Information" to get started.
            </Alert>
          )
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Profile Photo</Form.Label>
              <Form.Control
                type="file"
                onChange={handlePhotoChange}
                accept="image/*"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>About Me</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newAboutMe}
                onChange={(e) => setNewAboutMe(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default AboutMe;
