import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const navbarStyle = {
  marginBottom: "10px",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
};

const navLinkStyle = {
  color: "#333",
  textDecoration: "none",
  padding: "0.5rem 1rem",
};

const activeStyle = {
  color: "#007bff",
  fontWeight: "bold",
};

const CustomNavLink = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...navLinkStyle,
        ...(isActive ? activeStyle : {}),
      })}
    >
      {children}
    </NavLink>
  );
};

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector((state) => state.auth.user?.fullname);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="light" expand="lg" style={navbarStyle}>
        <Container fluid>
          <Navbar.Brand as={NavLink} to="/dashboard">
            Portfolio Admin
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <CustomNavLink to="/dashboard">Dashboard</CustomNavLink>
              <CustomNavLink to="/projects">Projects</CustomNavLink>
              <CustomNavLink to="/experiences">Experiences</CustomNavLink>
              <CustomNavLink to="/technologies">Technologies</CustomNavLink>
              <CustomNavLink to="/users">Users</CustomNavLink>
              <CustomNavLink to="/social-networks">
                Social Networks
              </CustomNavLink>
            </Nav>
            <Navbar.Text className="me-2">{userName}</Navbar.Text>
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
