import { Row, Tabs, Col, Card, Form, Input, Button } from "antd";
import * as React from "react";
import PageWrapper from "../components/PageWrapper";
import styles from "../styles/login.module.css";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { SigninDetails, SignupDetails } from "../types/network";
import networkServices from "../lib/network";
import { useHistory } from "react-router";
import { useAppDispatch } from "../lib/hooks";

const Login: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleSignup = async (values: SignupDetails) => {
    setLoading(true);
    const result = await networkServices.signup(values);
    setLoading(false);
    if (result.success) {
      localStorage.setItem("name", result.user.firstName);
      history.replace("/dashboard");
    }
  };

  const handleSignin = async (values: SigninDetails) => {
    setLoading(true);
    const result = await networkServices.signin(values);
    setLoading(false);
    if (result.success) {
      localStorage.setItem("name", result.user.firstName);
      history.push("/dashboard");
    }
  };

  return (
    <PageWrapper dispatch={dispatch}>
      <Row className={styles.mainContent}>
        <Col span={12} offset={6}>
          <Tabs
            defaultActiveKey="SignIn"
            className={styles.tabContainer}
            size="large"
            tabBarGutter={0}
          >
            <Tabs.TabPane tab="SIGN IN" key="SignIn">
              <Card>
                <Form
                  name="login_form"
                  className={styles.form}
                  onFinish={handleSignin}
                  scrollToFirstError
                >
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your email address",
                      },
                    ]}
                    className={styles.formInput}
                  >
                    <Input
                      placeholder="Email Address"
                      prefix={<MailOutlined className={styles.itemIcon} />}
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Password!",
                      },
                    ]}
                    className={styles.formInput}
                  >
                    <Input
                      prefix={<LockOutlined className={styles.itemIcon} />}
                      type="password"
                      placeholder="Password"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={loading}
                    >
                      SIGN IN
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab="SIGN UP" key="SignUp">
              <Card>
                <Form
                  name="signup"
                  className={styles.form}
                  onFinish={handleSignup}
                  scrollToFirstError
                >
                  <Form.Item
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your first name",
                      },
                    ]}
                    className={styles.formInput}
                  >
                    <Input
                      placeholder="First Name"
                      prefix={<UserOutlined className={styles.itemIcon} />}
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your last name",
                      },
                    ]}
                    className={styles.formInput}
                  >
                    <Input
                      placeholder="Last Name"
                      prefix={<UserOutlined className={styles.itemIcon} />}
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your email address",
                        type: "email",
                      },
                    ]}
                    className={styles.formInput}
                  >
                    <Input
                      placeholder="Email Address"
                      prefix={<MailOutlined className={styles.itemIcon} />}
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Password!",
                      },
                    ]}
                    className={styles.formInput}
                  >
                    <Input
                      prefix={<LockOutlined className={styles.itemIcon} />}
                      type="password"
                      placeholder="Password"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={loading}
                    >
                      SIGN UP
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default Login;
