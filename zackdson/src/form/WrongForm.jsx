import React,{useRef} from 'react';  
import { Form, Input, DatePicker, Radio,Select, Button,notification } from 'antd'; 
import base64ToFile from '../util/ImageTransformService';
import FileService from '../util/fileService';
import UploadMe from '../component/UploadMe';
import {useNavigate} from 'react-router-dom';
import moment from 'moment'; // 日期选择组件需要moment.js来处理日期  

const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});
const { TextArea } = Input;
  
const WrongForm = () => {  
    const navigate = useNavigate();
    const zpddyz=useRef(null);

    const onFinish = (values) => {
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
        // formData.append('inputDate', moment(values.inputDate).format('YYYY-MM-DD'));  
        formData.append('point', values.point);  
        formData.append('back', values.back);  
        formData.append('easy', values.easy);  
        formData.append('dpjno', values.dpjno);  
        formData.append('correct', values.correct ? values.correct : '');
        // a invisible variable that contains the key info of this page,it's nessessary
        formData.append('subject', localStorage.getItem("branchDetail"));
       
        //send http request to store files & images as well as save other info into database
        async function innerMethod(data){
            try{
                await FileService.uploadFileAndSaveToWrongDb(data);
                openNotificationWithIcon("success","上传成功!")
                navigate('/nav/wrong/list')
            }catch(ex){
                // console.log("error info is:",ex);
                openNotificationWithIcon("error","上传失败!")
            }
        }    
        innerMethod(formData);
      };
      
  return (
    <>
    <h1>{localStorage.getItem("branchDetail") + ' 录入新数据'}</h1>
    <Form  
        name="wrong_form"  
        layout="vertical"
        // initialValues={{ back: '随堂测验',dpjno:localStorage.getItem('branchDetail')+'-'+moment(new Date()).format("YYYY-MM-DD-hh-mm-ss") }}  
        onFinish={onFinish}
        scrollToFirstError
      //   style={{ maxWidth: '400px' }}  
      >  
        <Form.Item  
          name="point"  
          label={<span style={{ color: 'blue' }}>错误摘要</span>} 
          rules={[{ required: true, message: '请输入错误摘要!' }]}  
        >  
          <Input type="text" style={{ width: '50%' }}/>  
        </Form.Item>        
        <Form.Item  
          name="back"  
          label={<span style={{ color: 'blue' }}>出错背景</span>} 
          rules={[{ required: true, message: '请选择出错背景!' }]}  
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
          rules={[{ required: true, message: '请选择难易度!' }]}  
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
          rules={[{ required: true, message: '请选择出错原因!' }]}  
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
            placeholder="上限200字"  
            style={{ color: 'darkgreen' }}  
            maxLength={200}  
            showCount  
            autoSize={{ minRows: 2, maxRows: 4 }}  
          />  
        </Form.Item>  
  {/*   
        <Form.Item  
          name="weakpoint"  
          label={<span style={{ color: 'blue' }}>暴露不足点</span>} 
        >  
          <TextArea  
            placeholder="上限100字"  
            style={{ color: 'darkpurple' }}  
            maxLength={100}  
            showCount  
            autoSize={{ minRows: 2, maxRows: 4 }}  
          />  
        </Form.Item>  
    
        <Form.Item  
          name="errsum"  
          label={<span style={{ color: 'blue' }}>错题总结</span>} 
        >  
          <TextArea  
            placeholder="上限200字"  
            style={{ color: 'darkorange' }}  
            maxLength={200}  
            showCount  
            autoSize={{ minRows: 2, maxRows: 8 }}  
          />  
        </Form.Item> */}
        {/* make the upload functionability to be a common component */}
        <UploadMe ref={zpddyz} up_btn_txt="*错题照片或文件上传的话,点击下面按钮" />
        <hr />
    
        <Form.Item>  
        <div style={{display:'flex',justifyContent:'center',paddingTop:'2em'}}>
          <Button type="primary" danger htmlType="submit" style={{ fontSize:'18px',width: '30%' }}>
              提交
            </Button>
          <Button type="primary"
            style={{ fontSize:'18px',width: '30%' ,marginLeft:'1em'}}
            onClick={()=>navigate(-1)}
            >
              取消
            </Button>
        </div>
        </Form.Item>  
      </Form>  
    </>  
  );  
};  
  
export default WrongForm;