import React from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Row,
  Col,
} from "reactstrap";

const EntryForm = ({
  handleChange,
  handleCheck,
  handleSubmit,
  formattedAddress = [""],
}) => {
  return (
    <Container fluid={true}>
      <Card>
        <CardBody>
          <CardTitle>Enter Your Route Parameters Here</CardTitle>
          <CardText>
            <Form>
              <Row>
                <Col xs={{ span: 12, order: 2 }} md={{ span: 7, order: 1 }}>
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
                      This is where you could copy the optimized route directly
                      to Excel or any other source.
                    </FormText>
                    <Input
                      type="textarea"
                      name="output"
                      id="output"
                      value={formattedAddress.join("\n")}
                      disabled
                    />
                  </FormGroup>
                  <Button onClick={handleSubmit}>Optimize</Button>
                </Col>
                <Col
                  xs={{ span: 12, order: 1 }}
                  md={{ span: 3, order: 2, offset: 2 }}
                >
                  <strong>
                    <p>Additional Parameters</p>
                  </strong>
                  <FormGroup>
                    <Label check>
                      <Input
                        type="checkbox"
                        id="endAtTheStart"
                        onChange={handleCheck}
                      ></Input>{" "}
                      End At The Start
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </CardText>
        </CardBody>
      </Card>
    </Container>
  );
};

export default EntryForm;
