import React, { useRef } from 'react';
import { Form, Input, Button, notification, Select } from 'antd';
import UploadMe from '../component/UploadMe';
import RichText from '../component/RichText';
import FileService from '../util/fileService';
import base64ToFile from '../util/ImageTransformService';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const openNotificationWithIcon = (type, message, description) => notification[type]({ message, description });
const { TextArea } = Input;

const CommonForm = () => {
  const [form] = Form.useForm();
  const zpddyz = useRef(null);
  const cxddyz = useRef(null);
  const navigate = useNavigate();

  const onFinish = (values) => {
    const formData = new FormData();
    zpddyz.current.files.forEach((file) => {
      formData.append('files', file.originFileObj);
    });

    const today = moment(new Date()).format("YYYY-MM-DD-hh-mm-ss");
    zpddyz.current.images.forEach((image) => {
      const zpd_andom = today + '-' + Math.random().toString(18).substring(2);
      formData.append('files', base64ToFile(image.url), zpd_andom);
    });
    // formData.append('imp', values.imp);
    formData.append('title', values.title);
    formData.append('sample', cxddyz.current.richtext);
    formData.append('subject', localStorage.getItem("branchDetail"));

    async function innerMethod(data) {
      try {
        await FileService.uploadFileAndSaveToCommonDb(data);
        openNotificationWithIcon("success", "上传成功!");
        navigate('/nav/common/list');
      } catch (ex) {
        openNotificationWithIcon("error", "上传失败!");
      }
    }
    innerMethod(formData);
  };

  return (
    <Form form={form}
      layout="vertical"
      onFinish={onFinish}
      scrollToFirstError
    >
      {/* <Form.Item
        label={<label style={{ color: 'blue' }}>重要度</label>}
        name="imp"
        rules={[{ required: true, message: '请选择重要度!' }]}
      >
        <Select placeholder="请选择重要度" style={{ width: '30%' }}>
          <Select.Option value={3}>高</Select.Option>
          <Select.Option value={2}>中</Select.Option>
          <Select.Option value={1}>低</Select.Option>
        </Select>
      </Form.Item> */}
      <Form.Item name="title"
        label={<label style={{ color: 'blue' }}>题目</label>}
        rules={[{ required: true, message: '请输入题目' }]}>
        <Input placeholder='输入题目' style={{ width: '30%' }} />
      </Form.Item>
      <Form.Item name="sample"
        // rules={[{ required: true, message: '请输入内容' }]}
        label={<label style={{ color: 'blue' }}>内容</label>}
      >
        <RichText ref={cxddyz} />
      </Form.Item>
      <UploadMe ref={zpddyz} up_btn_txt="*内容上传(比如手机照片)" />
      <hr />
      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2em' }}>
          <Button type="primary" danger htmlType="submit" style={{ fontSize: '18px', width: '30%' }}>
            提交
          </Button>
          <Button type="primary"
            style={{ fontSize: '18px', width: '30%', marginLeft: '1em' }}
            onClick={() => navigate(-1)}
          >
            取消
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default CommonForm;