/*
  This is the login page. It accepts username and password states then stored in the users reducer.
  Once the submit button is clicked, it triggers the request from the api. If user is authenticated
  it will redirect to the portal landing page.
*/
import React, { useEffect, useState } from "react";
import {
  Input,
  FormGroup,
  Label,
  Container,
  Button,
  Form,
  Spinner,
  Badge,
} from "reactstrap";
import {AuthContainer} from "../../../Layouts/Portal";
import { useDispatch, useSelector } from "react-redux";
import { authUser, setRememberMe } from "../../../features/Portal/userSlice";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const dispatch = useDispatch();
  const { isLoading, loginAttempts, errorMessage, rememberMe } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const userCredentials = {
    username: username,
    password: password,
  };

  const onFormChanged = (e) => {
    const fielId = e.target.getAttribute("id");

    switch (fielId) {
      case "username":
        setUsername(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (rememberMe) {
      Cookies.set("userCredentials", JSON.stringify(userCredentials));
    }
    dispatch(authUser(userCredentials, navigate));
  };

  useEffect(() => {

    if (Cookies.get("userCredentials")) {
      const userCredentials = JSON.parse(Cookies.get("userCredentials"));
      setUsername(userCredentials.username);
      setPassword(userCredentials.password);
    }

    if (Cookies.get("accessToken")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <AuthContainer
      title={"Department of Agriculture Regional Field Office 2 Portal"}
    >
      <Container className="p-5">
        <Form onSubmit={onFormSubmit}>
          <h2 className="text-center">Login</h2>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              invalid={errorMessage === "Wrong Username" && true}
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={onFormChanged}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              invalid={errorMessage === "Wrong Password" && true}
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={onFormChanged}
              required
            />
          </FormGroup>
          <FormGroup>
            <Input
              id="chkRemember"
              name="remember_me"
              type="checkbox"
              onClick={() => dispatch(setRememberMe())}
            />
            &nbsp;
            <Label for="chkRemember">Remember me</Label>
          </FormGroup>
          <FormGroup className="d-flex flex-column">
          {errorMessage !== "" && (
              <Badge color="danger" className="mb-2 text-wrap">
                {errorMessage}
              </Badge>
          )}
          {loginAttempts > 0 && (
              <Badge color="danger">
                You only have ({5 - loginAttempts}) attempts
              </Badge>
          )}
          </FormGroup>
          <FormGroup>
            <Button className="bg-light-green" block type="submit">
              {isLoading ? <Spinner color="light" /> : "Submit"}
            </Button>
          </FormGroup>
        </Form>
      </Container>
    </AuthContainer>
  );
};

export default Login;
