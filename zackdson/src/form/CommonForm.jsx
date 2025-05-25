import React, { useRef } from 'react';
import { Form, Input, Button, notification, Select } from 'antd';
import UploadMe from '../component/UploadMe';
import RichText from '../component/RichText';
import FileService from '../util/fileService';
import base64ToFile from '../util/ImageTransformService';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const openNotificationWithIcon = (type, message, description) => notification[type]({ message, description });

const CommonForm = () => {
  const [form] = Form.useForm();
  const zpddyz = useRef(null);
  const cxddyz = useRef(null);
  const navigate = useNavigate();
  const subject = useSelector((state) => state.subject.branchDetail);

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
    formData.append('imp', values.imp);  
    formData.append('title', values.title);
    formData.append('sample', cxddyz.current.richtext);
    // formData.append('subject', localStorage.getItem("branchDetail"));
    formData.append('subject', subject);

    async function innerMethod(data) {
      try {
        await FileService.uploadFileAndSaveToCommonDb(data);
        openNotificationWithIcon("success", "上传成功!");
        navigate('/nav/common/list?showLastPage=true');
      } catch (err) {
        // token 过期已在拦截器中处理，这里只需处理其他错误
        if (!err.__notified) {
          openNotificationWithIcon("error", "上传失败，再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员")}
      }
    }
    innerMethod(formData);
  };

  return (
    <>
    {/* <h1>{localStorage.getItem("branchDetail") + ' 录入新数据'}</h1> */}
    <h1>{subject + ' 录入新数据'}</h1>
    <Form form={form}
      layout="vertical"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item name="title"
        label={<label style={{ color: 'blue' }}>标题</label>}
        rules={[{ required: true, message: '请输入标题' }]}>
        <Input placeholder='输入标题' style={{ width: '30%' }} />
      </Form.Item>
      <Form.Item
        label={<label style={{ color: 'blue' }}>重要度</label>}
        name="imp"
        rules={[{ required: true, message: '请选择重要度!' }]}
      >
        <Select placeholder="请选择重要度" style={{ width: '30%' }}>
          <Select.Option value={3}>高</Select.Option>
          <Select.Option value={2}>中</Select.Option>
          <Select.Option value={1}>低</Select.Option>
        </Select>
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
    </>
  );
};

export default CommonForm;