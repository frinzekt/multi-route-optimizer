import React from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
} from "reactstrap";

const EntryForm = ({ handleChange, handleSubmit }) => {
  return (
    <Container>
      <Card>
        <CardBody>
          <CardTitle>Enter Your Route Parameters Here</CardTitle>
          <Form>
            <FormGroup>
              <Label for="addresses">Addresses</Label>
              <FormText color="muted">
                Insert Addresses Here. Ensure 1 address for each line
              </FormText>
              <Input
                type="textarea"
                name="addresses"
                id="addresses"
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="output">Output</Label>
              <FormText color="muted">
                This is where you could copy the optimized route directly to
                Excel or any other source.
              </FormText>
              <Input
                type="textarea"
                name="output"
                id="output"
                value="abc"
                disabled
              />
            </FormGroup>
            <Button onClick={handleSubmit}>Optimize</Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default EntryForm;
