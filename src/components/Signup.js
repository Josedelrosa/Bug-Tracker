import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const firstName = useRef();
  const lastName = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not Match");
    }
    if (passwordRef.current.value.length < 6) {
      return setError("Password should be at least 6 characters long");
    }
    try {
      setError("");
      setLoading(true);
      await signup(
        emailRef.current.value,
        passwordRef.current.value,
        firstName.current.value,
        lastName.current.value
      );
      history("/dashboard");
    } catch (error) {
      setError("Failed to create an account");
      console.log(error);
    }
    setLoading(false);
  }
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="first-name">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="name" ref={firstName} required></Form.Control>
            </Form.Group>
            <Form.Group id="last-name">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="name" ref={lastName} required></Form.Control>
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required></Form.Control>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirm</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                required
              ></Form.Control>
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-2" type="submit">
              {loading ? "Loading…" : "Sign Up"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </>
  );
}
