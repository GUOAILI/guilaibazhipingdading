import React from 'react';
import { Form, Input, Radio, Select, Button,Image } from 'antd';
import {useNavigate, useLocation} from 'react-router-dom';
import { useSelector } from 'react-redux';
const { TextArea } = Input;

const WrongShow = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // const cxddyz=JSON.parse(localStorage.getItem('wrongRecord'));
  const cxddyz=JSON.parse(useSelector((state) => state.record.wrongRecord));
  // 2025/5/14 handle return navigation
  const handleReturn = () => {
      navigate('/nav/wrong/list', { 
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
        dpjno:cxddyz.dpjno,
        // inputDate:cxddyz.inputDate,
        back:cxddyz.back,
        easy:cxddyz.easy==='高'?'high':cxddyz.easy==='中'?'medium':'low',
        point:cxddyz.point,
        correct:cxddyz.correct==='undefined' ? '' : cxddyz.correct,
      }}
      >
      <Form.Item  
        name="point"  
        label={<span style={{ color: 'blue' }}>错误摘要</span>} 
        // rules={[{ required: true, message: '请输入本张卷子关键字!' }]}  
      >  
        <Input type="text" style={{ width: '50%' }}/>  
      </Form.Item> 

      <Form.Item  
        name="back"  
        label={<span style={{ color: 'blue' }}>出错背景</span>} 
        // rules={[{ required: true, message: '请选择出错背景!' }]}  
      >  
        <Select style={{ width: '30%' }}>  
          <Select.Option value="随堂测验">随堂测验</Select.Option>  
          <Select.Option value="平时刷题">平时刷题</Select.Option>  
          <Select.Option value="考试">考试</Select.Option>  
          <Select.Option value="其他">其他</Select.Option>  
        </Select>  
      </Form.Item>  
 
  
      <Form.Item  
        name="easy"
        label={<span style={{ color: 'blue' }}>难易度</span>} 
      >  
        <Radio.Group>  
          <Radio value="high">高</Radio>  
          <Radio value="medium">中</Radio>  
          <Radio value="low">低</Radio>  
        </Radio.Group>  
      </Form.Item>  
      <Form.Item  
        name="dpjno"  
        label={<span style={{ color: 'blue' }}>出错原因</span>} 
        // rules={[{ required: true, message: '请选择出错原因!' }]}  
      >  
        <Select style={{ width: '30%' }}>  
          <Select.Option value="粗心">粗心</Select.Option>  
          <Select.Option value="概念不清">概念不清</Select.Option>  
          <Select.Option value="题型不适应">题型不适应</Select.Option>  
          <Select.Option value="不够熟练">不够熟练</Select.Option>  
          <Select.Option value="记忆模糊">记忆模糊</Select.Option>  
          <Select.Option value="审题错误">审题错误</Select.Option>  
          <Select.Option value="能力不足">能力不足</Select.Option>  
          <Select.Option value="时间分配不合理">时间分配不合理</Select.Option>  
          <Select.Option value="书写潦草">书写潦草</Select.Option>  
        </Select>  
      </Form.Item>    
      <Form.Item  
        name="correct"  
        label={<span style={{ color: 'blue' }}>正确答案(照片的话,此处可不填)</span>} 
      >  
        <TextArea  
          // placeholder="上限200字"  
          style={{ color: 'darkgreen' }}  
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
              // <li >{smap.id}</li>
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

export default WrongShow;
