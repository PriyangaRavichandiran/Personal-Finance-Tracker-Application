import React from 'react';
import { Form, Button } from 'react-bootstrap';

function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Default Currency</Form.Label>
          <Form.Select>
            <option>INR (₹)</option>
            <option>USD ($)</option>
            <option>EUR (€)</option>
            
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter your name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter your email" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save Settings
        </Button>
      </Form>
    </div>
  );
}

export default Settings;

