import React, { useState } from 'react';  
import { Form, Button, Row, notification } from 'antd'; 
import { useNavigate } from 'react-router-dom';
import PersistService from '../util/persistService';

const openNotificationWithIcon = (type, message, description) => notification[type]({ message, description });

const SerializePage = () => {  
    const navigate = useNavigate();
    const [filePath, setFilePath] = useState('');

    const onFinish = (values) => {
        async function serializeAll() {
            try {
                // 假设PersistService.serializeAllDatabaseData返回后端返回的路径字符串
                const res = await PersistService.serializeAllDatabaseData();
                setFilePath(res.data); // 保存路径
                openNotificationWithIcon('success', '数据库数据持久化成功');
            } catch (ex) {
                openNotificationWithIcon('error', '数据库数据持久化失败');
                setFilePath('');
                return null;
            }
        }
        serializeAll();
    }

    const onCancel = () => {
        navigate(-1); // 返回上一页
    }

    return (  
        <>  
            <Form onFinish={onFinish}>  
                <h3 style={{ color: '#00008b' }}>表数据本地持久化</h3>  
                <Row gutter={[12, 12]}>
                    <span style={{ marginLeft: '2em', color: '#333' }}>
                        本操作将会把数据库中所有的数据保存到本地
                    </span>
                </Row>
                {filePath && (
                    <Row gutter={[12, 12]} style={{ marginTop: '1em' }}>
                        <span style={{ marginLeft: '2em', color: '#008000' }}>
                            数据已保存到：{filePath}
                        </span>
                    </Row>
                )}
                <Row gutter={[12, 12]} style={{ marginTop: '2em' }}>
                    <Button 
                        type="primary" 
                        style={{ marginLeft: '3em' }} 
                        danger 
                        htmlType="submit"
                    >
                        备份数据
                    </Button>
                    <Button 
                        type="primary" 
                        style={{ marginLeft: '2em' }} 
                        onClick={onCancel}
                    >
                        取消
                    </Button>
                </Row>
            </Form>
        </>
    )
}
export default SerializePage;