import React from 'react';
import { Form, Input, Radio, Button,Image } from 'antd';
import {useNavigate, useLocation} from 'react-router-dom';
import { useSelector } from 'react-redux';
const { TextArea } = Input;

const SummaryShow = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const cxddyz=JSON.parse(useSelector((state) => state.record.summaryRecord));
  // handle return navigation
  const handleReturn = () => {
      navigate('/nav/summary/list', { 
        state: { returnPage: location.state?.pageNumber } 
    });
  };

  return (
    <>
    <Form 
      className="show-form"
      layout="vertical" 
      disabled
      initialValues={{
        title:cxddyz.title,
        // easy:cxddyz.easy==='高'?'high':cxddyz.easy==='中'?'medium':'low',
        easy:cxddyz.easy,
        knowledge:cxddyz.knowledge,
        keyPoints:cxddyz.keyPoints==='undefined' ? '' : cxddyz.keyPoints,
        example:cxddyz.example==='undefined' ? '' : cxddyz.example,
      }}
      >
      <Form.Item  
        name="title"  
        label={<span style={{ color: 'blue' }}>题型概述</span>} 
      >  
        <Input type="text" style={{ width: '50%' }}/>  
      </Form.Item> 

      <Form.Item  
        name="easy"
        label={<span style={{ color: 'blue' }}>难易度</span>} 
      >  
        <Radio.Group>  
          <Radio value="高">高</Radio>  
          <Radio value="中">中</Radio>  
          <Radio value="低">低</Radio>  
        </Radio.Group>  
      </Form.Item>  

      <Form.Item  
        name="knowledge"  
        label={<span style={{ color: 'blue' }}>知识点归纳</span>} 
      >  
        <TextArea  
          maxLength={500}  
          showCount  
          autoSize={{ minRows: 2, maxRows: 6 }}  
        />  
      </Form.Item>  

      <Form.Item  
        name="keyPoints"  
        label={<span style={{ color: 'blue' }}>解题要点</span>} 
      >  
        <TextArea  
          maxLength={200}  
          showCount  
          autoSize={{ minRows: 1, maxRows: 4 }}  
        />  
      </Form.Item>  

      <Form.Item  
        name="example"  
        label={<span style={{ color: 'blue' }}>范例</span>} 
      >  
        <TextArea  
          maxLength={500}  
          showCount  
          autoSize={{ minRows: 2, maxRows: 6 }}  
        />  
      </Form.Item>  
    </Form>
    <hr />
    <ul>
      {cxddyz.mjddyz.length ? 
      cxddyz.mjddyz.map((smap,index)=>(
          <Image key={index} width={480} src={smap} />
      )) 
              :
          <p>没有附加图片</p>
      }
    </ul>
      <hr />
      <div style={{display:'flex',justifyContent:'center', alignItems:'center'}}>
        <Button style={{width:'8rem',marginTop:'1rem',marginBottom:'2rem'}}  type='primary' danger  onClick={handleReturn}>OK</Button>
      </div>
    </>
  );
};

export default SummaryShow;