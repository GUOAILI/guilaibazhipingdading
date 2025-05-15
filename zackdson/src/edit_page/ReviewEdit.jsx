import React, {useState,useEffect,useRef} from 'react';
import { Form, Input, Button, Select,Image,Checkbox,notification } from 'antd';
import {useNavigate, useLocation} from 'react-router-dom';
import UploadMe from '../component/UploadMe';
import TableService from '../util/tableService';
import base64ToFile from '../util/ImageTransformService';
import moment from 'moment';
const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});

const { TextArea } = Input;

const ReviewEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [pjddyz,setPjddyz]=useState([]);
    const zpddyz=useRef(null);
  
    const cxddyz=JSON.parse(localStorage.getItem('reviewRecord'));
  
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
    navigate('/nav/review/list', { 
      state: { returnPage: location.state?.pageNumber } 
    });
  };

    const onFinish = (values) => {
      // console.log('form data is:',values);
      // console.log('pjddyz:',pjddyz);
      let delImages='';
      for(let i=0;i<pjddyz.length;i++){
        if (pjddyz[i].value===true){
          delImages=delImages + pjddyz[i].name+',';
        }
      }
      // console.log('delImages:',delImages);
      
      // return null;
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
      // formData.append('reviewDate', values.reviewDate);  
      formData.append('category', values.category);  
      formData.append('title', values.title);  
      formData.append('detail', values.detail);  
      formData.append('overview', values.overview);  
    // 2024/7/1 add for delete images, and subject is not nessesary for update so comment it.
      formData.append('delImages', delImages);
     
      //send http request to store files & images as well as save other info into database
      async function innerMethod(data){
          try{
            await TableService.updateReviewDb(data);
            openNotificationWithIcon("success","复习 数据更新成功!")
            navigate('/nav/review/list',{ 
              state: { returnPage: location.state?.pageNumber } 
            });
          }catch(ex){
            // token 过期已在拦截器中处理，这里只需处理其他错误
            if (!ex.response || ex.response.status !== 401) {
              openNotificationWithIcon("error","复习 数据更新失败，再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员")}
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
          title:cxddyz.title,
          // reviewDate:cxddyz.reviewDate,
          category:cxddyz.category,
          detail:cxddyz.detail,
          overview:cxddyz.overview,
        }}
      >
      {/* <Form.Item name="reviewDate" label={<label style={{color:'blue'}}>复习日</label>}>
        <Input type='text' />
      </Form.Item> */}
      <Form.Item name="category" label={<label style={{color:'blue'}}>分类</label>} >
        <Select style={{ width: '30%' }}>
          <Select.Option value="随堂复习">随堂复习</Select.Option>
          <Select.Option value="周复习">周复习</Select.Option>
          <Select.Option value="月复习">月复习</Select.Option>
          <Select.Option value="期中复习">期中复习</Select.Option>
          <Select.Option value="期末复习">期末复习</Select.Option>
          <Select.Option value="总复习">总复习</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="title" label={<label style={{color:'blue'}}>复习内容概述</label>}>
        <Input style={{ width: '50%'}}/>
      </Form.Item>
      <Form.Item name="detail" label={<label style={{color:'blue'}}>复习内容详细</label>}>
        <TextArea maxLength={200}  style={{color:'darkgreen'}} />
      </Form.Item>
      <Form.Item name="overview" label={<label style={{color:'blue'}}>个人总结</label>}>
        <TextArea maxLength={100} style={{color:'darkviolet'}} />
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
        {/* </FormItem> */}
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

export default ReviewEdit;
