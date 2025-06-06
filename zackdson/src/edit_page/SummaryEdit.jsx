import React, {useState,useEffect,useRef} from 'react';
import { Form, Input, Button, Select,Image,Checkbox,notification,Radio } from 'antd';
import {useNavigate, useLocation} from 'react-router-dom';
import UploadMe from '../component/UploadMe';
import TableService from '../util/tableService';
import base64ToFile from '../util/ImageTransformService';
import moment from 'moment';
import { useSelector } from 'react-redux';
const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});

const { TextArea } = Input;

const SummaryEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pjddyz,setPjddyz]=useState([]);
  const zpddyz=useRef(null);

  const cxddyz= JSON.parse(useSelector((state) => state.record.summaryRecord));

  useEffect(()=>{
    setPjddyz(cxddyz.mjddyz.map((zpd)=>{
        return {
            name:zpd,
            value:false
        }
      })
    );
  },[]);

  // 添加返回处理函数
  const handleCancel = () => {
    navigate('/nav/summary/list', { 
      state: { returnPage: location.state?.pageNumber },
            replace: true // 避免历史栈堆积
    });
  };

  const onFinish = (values) => {
    let delImages='';
    for(let i=0;i<pjddyz.length;i++){
      if (pjddyz[i].value===true){
        delImages=delImages + pjddyz[i].name+',';
      }
    }
    
    // Here you can handle form submission logic, e.g., send data to server
    const formData=new FormData();
    zpddyz.current.files.forEach((file)=>{
        formData.append('files',file.originFileObj);
    });

    const today=moment(new Date()).format("YYYY-MM-DD-hh-mm-ss");
    zpddyz.current.images.forEach((image)=>{
        const zpd_andom=today + '-' + Math.random().toString(18).substring(2);
        formData.append('files',base64ToFile(image.url),zpd_andom);
    });
    // 添加其他字段  
    formData.append('id', cxddyz.id);  
    formData.append('title', values.title);  
    formData.append('easy', values.easy);  
    formData.append('knowledge', values.knowledge); 
    formData.append('keyPoints', values.keyPoints);
    formData.append('example', values.example);
    formData.append('delImages', delImages);
   
    //send http request to store files & images as well as save other info into database
    async function innerMethod(data){
        try{
          await TableService.updateSummaryDb(data);
          openNotificationWithIcon("success","总结 数据更新成功!")
          navigate('/nav/summary/list',{ 
            state: { returnPage: location.state?.pageNumber },
            replace: true // 避免历史栈堆积
          });
        }catch(err){
          // token 过期已在拦截器中处理，这里只需处理其他错误
          if (!err.__notified) {
            openNotificationWithIcon("error","总结 数据更新失败，再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员")}
        }
    }    
    innerMethod(formData);
  };

  return (
    <>
    <h1>{useSelector(state => state.subject.branchDetail) + ' 修改当前数据'}</h1>
    <Form 
      layout="vertical" 
      onFinish={onFinish}
      initialValues={{
        title:cxddyz.title,
        // easy:cxddyz.easy==='高'?'high':cxddyz.easy==='中'?'medium':'low',
        easy:cxddyz.easy,
        knowledge:cxddyz.knowledge,
        keyPoints:cxddyz.keyPoints,
        example:cxddyz.example,
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
          maxLength={300}  
          showCount  
          autoSize={{ minRows: 2, maxRows: 6 }}  
        />  
      </Form.Item>  

      <Form.Item  
        name="keyPoints"  
        label={<span style={{ color: 'blue' }}>解题要点(照片形式的话可不写)</span>} 
      >  
        <TextArea  
          maxLength={300}  
          showCount  
          autoSize={{ minRows: 2, maxRows: 6 }}  
        />  
      </Form.Item>  

      <Form.Item  
        name="example"  
        label={<span style={{ color: 'blue' }}>范例(照片形式的话可不写)</span>} 
      >  
        <TextArea  
          maxLength={300}  
          showCount  
          autoSize={{ minRows: 2, maxRows: 6 }}  
        />  
      </Form.Item>  

    <hr />
    <ul>
      {cxddyz.mjddyz.length ? 
      cxddyz.mjddyz.map((smap,index)=>(
        <div key={smap} style={{ display:'flex',alignItems:'center'}}> 
        <Image key={index} width={480} src={smap} />
          <Checkbox 
            // here is bery important
            onChange={()=>{
                setPjddyz((oldzpd)=>{
                  const newzpd=[...oldzpd];
                  newzpd[index].value=!newzpd[index].value;
                  return newzpd;
                });
            }} 
            style={{marginLeft:'3em',color:'red'}}
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
      <hr/>
      <div style={{display:'flex',justifyContent:'center',paddingTop:'2em'}}>
        <Button type="primary" danger htmlType="submit" style={{ fontSize:'18px',width: '30%' }}>
            提交
          </Button>
        <Button type="primary"
          style={{ fontSize:'18px',width: '30%' ,marginLeft:'1em'}}
          onClick={handleCancel}
          >
            取消
          </Button>
      </div>
    </Form>
    </>
  );
};

export default SummaryEdit;