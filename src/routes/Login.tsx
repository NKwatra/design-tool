import { Row, Tabs, Col, Card, Form, Input, Button } from "antd";
import * as React from "react";
import styles from "../styles/login.module.css";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { SigninDetails, SignupDetails } from "../types/network";
import networkServices from "../lib/network";
import { useHistory } from "react-router";

const Label = ({ label }: { label: string }) => (
  <span style={{ fontWeight: 500, fontSize: 22 }}>{label}</span>
);

const Login: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const history = useHistory();

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
    <div className={styles.mainContent}>
      <Row className={styles.rowContainer}>
        <Col span={18} offset={3} className={styles.blackOverlay}>
          <Tabs
            defaultActiveKey="SignIn"
            size="large"
            tabBarGutter={0}
            type="card"
            className="login-tabs"
          >
            <Tabs.TabPane tab="Sign in" key="SignIn">
              <Card className={styles.card} bordered={false}>
                <Form
                  name="login_form"
                  className={styles.form}
                  onFinish={handleSignin}
                  scrollToFirstError
                  requiredMark={false}
                  layout="vertical"
                >
                  <Form.Item
                    label={<Label label="Email" />}
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
                      className={styles.input}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<Label label="Password" />}
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
                      className={styles.input}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={loading}
                      className={styles.primaryButton}
                    >
                      Sign In
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Sign up" key="SignUp">
              <Card className={styles.card} bordered={false}>
                <Form
                  name="signup"
                  className={styles.form}
                  onFinish={handleSignup}
                  scrollToFirstError
                  layout="vertical"
                  requiredMark={false}
                >
                  <Form.Item
                    label={<Label label="First Name" />}
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
                      className={styles.input}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<Label label="Last Name" />}
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
                      className={styles.input}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<Label label="Email" />}
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
                      className={styles.input}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<Label label="Password" />}
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
                      className={styles.input}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={loading}
                      className={styles.primaryButton}
                    >
                      Sign up
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
