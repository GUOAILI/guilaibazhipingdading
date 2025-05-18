import React, { useState } from 'react';  
import { Modal, Form, Input, Button, notification } from 'antd';
import Container from '../util/Container';
import AuthService from '../util/authService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../store/userSlice'; // 新增

const openNotificationWithIcon = (type, message, description) => notification[type]({ message, description });
// 登录功能组件  
const LoginForm = () => { 
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 新增

  // 处理注册Modal的显示与隐藏  
  const showRegisterModal = () => {  
    setVisible(true);  
  };  
  
  // 处理注册Modal的关闭  
  const handleRegisterCancel = () => {  
    setVisible(false);  
  };  
  
  // 处理注册表单的提交（这里仅作演示，实际应发送请求到服务器）  
  const handleRegisterFinish = values => {  
    async function register(val) {
      try {
        await AuthService.createuser({
          username: val.username,
          password: val.password,
        });
        form.resetFields();
        openNotificationWithIcon('success', '同学注册成功!')
        setVisible(false);
      } catch (err) {
        openNotificationWithIcon('error', '同学注册失败!再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员')
      }
    }
    register(values);
  };  

  // 登录服务请求
  const onFinish = async (values) => {
    try {
      const res = await AuthService.loginuser({
        username: values.username,
        password: values.password,
      });
      openNotificationWithIcon('success', values.username + ' 同学登录成功');
      form.resetFields();
      // Redux 统一管理用户信息
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 120);
      dispatch(setUserInfo({
        token: res.data.password,
        username: res.data.username,
        long: res.data.username ? "donglai" : "dongqiang",
        expiration: expiration.toISOString(),
        // 可根据需要补充其它字段
      }));
      navigate('/home');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        openNotificationWithIcon('error', values.username + ' 同学身份验证失败，用户不存在或者密码错误');
      } else {
        openNotificationWithIcon('error', values.username + ' 同学登录失败,再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员');
      }
    }
  };

  return (  
    <>
      <h1 style={{ textAlign: 'center', fontSize: '4em' }}>学习辅助系统</h1>
      <h2 style={{ textAlign: 'center', color: 'blue' }}>请登录</h2>
      <Container>
        <Form  
          name="login"  
          initialValues={{ remember: true }}  
          onFinish={onFinish}
          labelCol={{ span: 6 }}
        >  
          <Form.Item  
            name="username"  
            label="用户名"  
            rules={[{ required: true, message: '请输入用户名!' }]}  
          >  
            <Input />  
          </Form.Item>  
    
          <Form.Item  
            name="password"  
            label="密码"  
            rules={[{ required: true, message: '请输入密码!' }]}  
          >  
            <Input.Password />  
          </Form.Item>  
    
          <Form.Item>  
            <Button type="primary" htmlType="submit"
              style={{ marginLeft: '5em' }}
            >  
              登录  
            </Button>  
            <Button type="link" onClick={showRegisterModal}>  
              注册新用户  
            </Button>  
          </Form.Item>  
        </Form>  
      </Container>
  
      {/* 注册Modal */}  
      <Modal  
        title="注册新用户"  
        open={visible} 
        destroyOnClose
        onCancel={() => setVisible(false)}  
        footer={null}  
      >  
        <Form  
          form={form}  
          name="register"  
          onFinish={handleRegisterFinish}  
        >  
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="密码确认"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '请确认密码',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('您输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>  
            <Button type="primary" danger htmlType="submit" style={{ marginLeft: '10em', marginRight: '2em' }}>  
              注册  
            </Button>  
            <Button type="primary" onClick={handleRegisterCancel} >  
              取消
            </Button>  
          </Form.Item>  
        </Form>  
      </Modal>   
    </> 
  );  
};  
  
export default LoginForm;