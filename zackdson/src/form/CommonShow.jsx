import React, { useRef } from 'react';
import { Form, Input, Button, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import RichText from '../component/RichText';
const CommonShow = () => {
  const navigate = useNavigate();
  const zpddyz = useRef(null);

  const cxddyz = JSON.parse(localStorage.getItem('commonRecord'));
  return (
    <>
      <Form
      className="show-form"
      layout="vertical"
        disabled
        initialValues={{
          title: cxddyz.title,
          sample: cxddyz.sample
        }}
      >
        <Form.Item name="title"
          label={<label style={{ color: 'blue' }}>
            标题
          </label>}
        >
          <Input style={{ color: '#a626aa' }} />
        </Form.Item>
        <Form.Item name="sample"
          label={<label style={{ color: 'blue' }}>
            内容
          </label>}
        >
          <RichText ref={zpddyz} content={cxddyz.sample} />
        </Form.Item>
      </Form>
      <hr />
      <ul>
        {cxddyz.mjddyz.length ?
          cxddyz.mjddyz.map((smap, index) => (
            <Image key={index} width={480} src={smap} />
          ))
          :
          <p>没有附加图片</p>
        }
      </ul>
      <hr />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button style={{ width: '8rem', marginTop: '1rem', marginBottom: '2rem' }} type='primary' danger onClick={() => navigate(-1)} >OK</Button>
      </div>
    </>
  );
};

export default CommonShow;