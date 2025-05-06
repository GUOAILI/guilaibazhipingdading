import React, { useState, useEffect, useRef } from 'react';  
import { Form, Button, Row, Col, Input,Radio,notification } from 'antd'; 
// import MenuService from '../util/menuService';
import {useNavigate} from 'react-router-dom';
import PersistService from '../util/persistService';

const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});
  
const DeserializePage = () => {  
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const fileInputRef = useRef(null);

    // 新增：文件选择后写入表单
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            form.setFieldsValue({ filename: fileName });
        }
    };

    // 新增：点击输入框时弹出文件选择
    const handleInputClick = () => {
        // 只有当输入框为空时才弹出文件选择
        if (!form.getFieldValue('filename') && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    
    // 清空指定文件
    const handleClearFile = () => {
        form.setFieldsValue({ filename: '' });
        setFileInputKey(Date.now()); // 重置input
    };

    const onFinish=(values)=>{
        async function deserialize(filename){
            try{
                await PersistService.recoverToTable(filename);
                openNotificationWithIcon('success','备份数据恢复成功');
                // navigate('/nav/empty');
            }catch(ex){
                openNotificationWithIcon('error','备份数据恢复失败');
                return null;
            }
        }
        deserialize(values.filename)
    }
        
    return (  
        <>  
            <Form
               form={form}
               onFinish={onFinish}
             >  
                <h3 style={{color:'#00008b'}}>备份数据恢复</h3>  
                <div style={{ color: '#333', marginBottom: 16 }}>本操作将把本地备份文件导入数据库</div>
                <Form.Item
                    name='filename'
                    label={<span style={{ color: 'blue'}}>指定文件名</span>} 
                    rules={[{ required: true, message: '请指定文件名' },
                    ]}
                  >
                     <Input 
                        onClick={handleInputClick}
                        style={{ width: '30em', marginLeft: '0.5em', display: 'inline-block' }}
                        readOnly
                        placeholder="点击选择文件"
                        addonAfter={
                            <Form.Item shouldUpdate noStyle>
                                {() => (
                                    <Button
                                        onClick={handleClearFile}
                                        disabled={!form.getFieldValue('filename')}
                                        type="primary"
                                        // style={{ backgroundColor: 'green',color: 'white' }}
                                    >
                                        清空指定文件
                                    </Button>
                                )}
                            </Form.Item>
                        }
                                
                     />
                </Form.Item> 
                {/* 隐藏的文件选择框 */}
                <input
                    type="file"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <Form.Item>
                    <Button type="primary" 
                        style={{marginLeft:'5em'}}
                        danger htmlType="submit" >
                            提交
                    </Button>
                    <Button type="primary" 
                        style={{marginLeft:'5em'}}
                        onClick={()=>{navigate('/nav/empty')}}>
                            取消
                    </Button>
                </Form.Item>
            </Form>
        </>
    )}
export default DeserializePage;