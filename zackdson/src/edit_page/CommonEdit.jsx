import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Image, Checkbox, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import UploadMe from '../component/UploadMe';
import RichText from '../component/RichText';
import TableService from '../util/tableService';
import base64ToFile from '../util/ImageTransformService';
import moment from 'moment';
const openNotificationWithIcon = (type, message, description) => notification[type]({ message, description });

const { TextArea } = Input;

const CommonEdit = () => {
  const navigate = useNavigate();
  const [pjddyz, setPjddyz] = useState([]);
  const zpddyz = useRef(null);
  const mjddyz = useRef(null);

  const cxddyz = JSON.parse(localStorage.getItem('commonRecord'));

  useEffect(() => {
    setPjddyz(cxddyz.mjddyz.map((zpd) => {
      return {
        name: zpd,
        value: false
      }
    }));
  }, []);

  const onFinish = (values) => {
    let delImages = '';
    for (let i = 0; i < pjddyz.length; i++) {
      if (pjddyz[i].value === true) {
        delImages = delImages + pjddyz[i].name + ',';
      }
    }

    const formData = new FormData();
    zpddyz.current.files.forEach((file) => {
      formData.append('files', file.originFileObj);
    });

    const today = moment(new Date()).format("YYYY-MM-DD-hh-mm-ss");
    zpddyz.current.images.forEach((image) => {
      const zpd_andom = today + '-' + Math.random().toString(18).substring(2);
      formData.append('files', base64ToFile(image.url), zpd_andom);
    });
    formData.append('id', cxddyz.id);
    formData.append('title', values.title);
    formData.append('sample', mjddyz.current.richtext || cxddyz.sample);
    formData.append('delImages', delImages);

    async function innerMethod(data) {
      try {
        await TableService.updateCommonDb(data);
        openNotificationWithIcon("success", "数据更新成功!")
        navigate('/nav/common/list')
      } catch (ex) {
        openNotificationWithIcon("error", "数据更新失败!")
      }
    }
    innerMethod(formData);
  };

  return (
    <>
    <h1>{localStorage.getItem("branchDetail") + ' 修改当前数据'}</h1>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          title: cxddyz.title,
        }}
      >
        <Form.Item name="title"
          label={<label style={{ color: 'blue' }}>
            题目
          </label>}
        >
          <Input />
        </Form.Item>
        <Form.Item name="sample"
          label={<label style={{ color: 'blue' }}>
            内容
          </label>}
        >
          <RichText ref={mjddyz} content={cxddyz.sample} />
        </Form.Item>
        <hr />
        <ul>
          {cxddyz.mjddyz.length ?
            cxddyz.mjddyz.map((smap, index) => (
              <div key={smap} style={{ display: 'flex', alignItems: 'center' }}>
                <Image key={index} width={480} src={smap} />
                <Checkbox
                  onChange={(e) => {
                    setPjddyz((oldzpd) => {
                      const newzpd = [...oldzpd];
                      newzpd[index].value = !newzpd[index].value;
                      return newzpd;
                    });
                  }}
                  style={{ marginLeft: '3em', color: 'red' }}
                >
                  勾选删除
                </Checkbox>
              </div>
            ))
            :
            <p>没有附加图片</p>
          }
        </ul>
        <hr />
        <UploadMe ref={zpddyz} up_btn_txt="*追加文件,图片上传" />
        <hr />
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
      </Form>
    </>
  );
};

export default CommonEdit;