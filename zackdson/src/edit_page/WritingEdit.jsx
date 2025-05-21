import React, {useState,useEffect,useRef} from 'react';
import { Form, Input, Button, Select,Image,Checkbox,notification } from 'antd';
import {useNavigate, useLocation} from 'react-router-dom';
import UploadMe from '../component/UploadMe';
import RichText from '../component/RichText';
import TableService from '../util/tableService';
import base64ToFile from '../util/ImageTransformService';
import moment from 'moment';
import { useSelector } from 'react-redux';
const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});

const { TextArea } = Input;

const WritingEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pjddyz,setPjddyz]=useState([]);
  const zpddyz=useRef(null);
  const mjddyz=useRef(null);
  // const [form] = Form.useForm();

  // const cxddyz=JSON.parse(localStorage.getItem('writingRecord'));
  const cxddyz= JSON.parse(useSelector((state) => state.record.writingRecord));
  const subject=useSelector((state)=>state.subject.branchDetail);

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
    navigate('/nav/writing/list', { 
      state: { returnPage: location.state?.pageNumber } 
    });
  };

  const onFinish = (values) => {
    // 确保 imp 是数字
    let impValue = values.imp;
    
    // 如果 imp 是汉字，转换为数字
    if (typeof impValue === 'string') {
      switch(impValue) {
        case '高':
          impValue = 3;
          break;
        case '中':
          impValue = 2;
          break;
        case '低':
        default:
          impValue = 1;
          break;
      }
    }
    let delImages = '';
    for (let i = 0; i < pjddyz.length; i++) {
      if (pjddyz[i].value === true) {
        delImages = delImages + pjddyz[i].name + ',';
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
    // formData.append('imp', values.imp);  
    formData.append('imp', impValue);  
    formData.append('title', values.title);  
    formData.append('topic', values.topic);  
    // formData.append('sample', values.sample);  
    formData.append('sample', mjddyz.current.richtext || cxddyz.sample);  
    formData.append('comments', values.comments);
    // 2024/7/1 add for delete images, and subject is not nessesary for update so comment it.
    formData.append('delImages', delImages);
    // a invisible variable that contains the key info of this page
    // formData.append('subject', localStorage.getItem("branchDetail"));
   
    //send http request to store files & images as well as save other info into database
    async function innerMethod(data){
        try{
          await TableService.updateWritingDb(data);
          openNotificationWithIcon("success","写作数据更新成功!")
          // 修改这里，添加页码信息
          navigate('/nav/writing/list', { 
            state: { returnPage: location.state?.pageNumber } 
          });
        }catch(err){
          // token 过期已在拦截器中处理，这里只需处理其他错误
          if (!err.response || (err.response.status !== 400 && err.response.status !== 401 && err.response.status !== 403)) {
            openNotificationWithIcon("error","写作数据更新失败，再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员")}
        }
    }    
    innerMethod(formData);
  };

  return (
    <>
    {/* <h1>{localStorage.getItem("branchDetail") + ' 修改当前数据'}</h1> */}
    <h1>{subject + ' 修改当前数据'}</h1>
    <Form 
      // form={form} 
      layout="vertical"
      onFinish={onFinish}
      // onFieldsChange={dpjLookat}
      // onValuesChange={dpjSee}
      // disabled
      initialValues={{
        imp: cxddyz.imp, // 新增：重要度初始值
        title:cxddyz.title,
        topic:cxddyz.topic,
        // sample:cxddyz.sample,
        // sample:mjddyz.current.richtext,
        comments:cxddyz.comments==='undefined'? '':cxddyz.comments,
      }}
      >

      <Form.Item
        label={<label style={{color:'blue'}}>重要度</label>}
        name="imp"
        // rules={[{ required: true, message: '请选择重要度!' }]}
      >
        <Select placeholder="请选择重要度" style={{ width: '30%' }}>
          <Select.Option value={3}>高</Select.Option>
          <Select.Option value={2}>中</Select.Option>
          <Select.Option value={1}>低</Select.Option>
        </Select>
      </Form.Item>


      <Form.Item name="title"
    //    label="题目"
       label={<label  style={{color:'blue'}}>
            题目
            </label>} 
        >
        <Input />
      </Form.Item>
      <Form.Item name="topic"
       label={<label  style={{color:'blue'}}>
            题材
            </label>} >
        <Select style={{ width: '30%' }}>  
          <Select.Option value="记叙文">记叙文</Select.Option>  
          <Select.Option value="说明文">说明文</Select.Option>  
          <Select.Option value="抒情文">抒情文</Select.Option>  
          <Select.Option value="议论文">议论文</Select.Option>  
          <Select.Option value="应用文">应用文</Select.Option>  
        </Select>  
      </Form.Item>
      <Form.Item name="sample" 
        label={<label  style={{color:'blue'}}>
                范文
                </label>} 
        >
          <RichText ref={mjddyz} content={cxddyz.sample} />
        {/* <TextArea 
            rows={10} 
            // maxLength={1000} 
             /> */}
      </Form.Item>
      <Form.Item name="comments"
        label={<label  style={{color:'blue'}}>
                点评
                </label>} 
        >
        <TextArea rows={4}
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

export default WritingEdit;
