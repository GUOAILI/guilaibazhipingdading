import React, { useRef } from 'react';  
import { Form, Input, Radio, Button, notification } from 'antd'; 
import base64ToFile from '../util/ImageTransformService';
import FileService from '../util/fileService';
import UploadMe from '../component/UploadMe';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from 'react-redux';

const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});
const { TextArea } = Input;
  
const SummaryForm = () => {  
    const navigate = useNavigate();
    const zpddyz = useRef(null);
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
        
        formData.append('easy', values.easy);  
        formData.append('title', values.title);  
        formData.append('knowledge', values.knowledge);  
        formData.append('keyPoints', values.keyPoints ? values.keyPoints : '');
        formData.append('example', values.example ? values.example : '');
        formData.append('subject', subject);
       
        async function innerMethod(data) {
            try {
              await FileService.uploadFileAndSaveToSummaryDb(data);
              openNotificationWithIcon("success", "上传成功!")
              navigate('/nav/summary/list?showLastPage=true')
            } catch(err) {
              if (!err.__notified) {
                openNotificationWithIcon("error", "上传失败，再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员")
              }
            }
        }    
        innerMethod(formData);
    };
      
    return (
        <>
        <h1>{subject + ' 录入新数据'}</h1>
        <Form  
            name="summary_form"  
            layout="vertical"
            onFinish={onFinish}
            scrollToFirstError
        >  
            <Form.Item  
                name="title"  
                label={<span style={{ color: 'blue' }}>题型概述</span>} 
                rules={[{ required: true, message: '请输入题型概述!' }]}  
            >  
                <Input type="text" style={{ width: '50%' }}/>  
            </Form.Item>        
            
            <Form.Item  
                name="easy"
                label={<span style={{ color: 'blue' }}>难易度</span>} 
                rules={[{ required: true, message: '请选择难易度!' }]}  
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
                rules={[{ required: true, message: '请输入知识点归纳!' }]}  
            >  
                <TextArea  
                    placeholder="上限300字"  
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
                    placeholder="上限300字"  
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
                    placeholder="上限300字"  
                    maxLength={300}  
                    showCount  
                    autoSize={{ minRows: 2, maxRows: 6 }}  
                />  
            </Form.Item>  
            
            <UploadMe ref={zpddyz} up_btn_txt="*归纳总结照片文件上传的话,点击下面按钮" />
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
  
export default SummaryForm;