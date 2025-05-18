import React, { useState } from 'react';
import { Form, Button, Row, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import PersistService from '../util/persistService';
import { useDispatch } from 'react-redux';
import { setBackupTip,setUseTip } from '../store/backupSlice';

const openNotificationWithIcon = (type, message, description) =>
  notification[type]({ message, description });

const SerializePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filePath, setFilePath] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // ✅ 控制按钮状态
  const [isLoading, setIsLoading] = useState(false); // ✅ 添加 loading 状态
  const onFinish = () => {
    async function serializeAll() {
      try {
        setIsLoading(true); // ✅ 开始加载
        // 设置按钮禁用
        setIsButtonDisabled(true);

        // 调用接口
        const res = await PersistService.serializeAllDatabaseData();

        if (res && res.data) {
          setFilePath(res.data);
          openNotificationWithIcon('success', '数据库数据持久化成功');

          // 设置 localStorage
          // localStorage.setItem('lastBackupTip', new Date().toISOString());
          dispatch(setBackupTip(new Date().toISOString()));
          // localStorage.removeItem('lastUseTip');
          dispatch(setUseTip(null));

        } else {
          throw new Error('接口返回无有效数据');
        }
      } catch (ex) {
        // token 过期已在拦截器中处理，这里只需处理其他错误
        if (!ex.response || ex.response.status !== 401) {
          openNotificationWithIcon('error', '数据库数据持久化失败，再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员');}
        setFilePath('');
        setIsButtonDisabled(false); // 失败时恢复按钮可用
      } finally {
        setIsLoading(false); // ✅ 结束加载，无论成功或失败都关闭 loading
      }
    }
    serializeAll();
  };

  const onCancel = () => {
    navigate(-1); // 返回上一页
  };

  return (
    <>
      <Form onFinish={onFinish}>
        <h3 style={{ color: '#00008b' }}>数据本地备份</h3>
        <div>
          <span style={{ marginLeft: '2em', color: '#333' }}>
            本操作将会把数据库中所有的数据保存，并把所有照片压缩打包
          </span>
        </div>
        <div>
          <span style={{ marginLeft: '2em', color: '#bd33a4', fontSize: '1em', fontWeight: 'bold' }}>
            请在备份完成后，尽量把备份文件保存到另外一个存储设备中(例如移动硬盘、U盘、云盘或者手机)
          </span>
        </div>
        {filePath && (
          <Row gutter={[12, 12]} style={{ marginTop: '1em' }}>
            <span style={{ marginLeft: '2em', color: '#008000' }}>
              数据库数据已保存在：{'C:/minhui'+filePath}
            </span>
          </Row>
        )}
        <Row gutter={[12, 12]} style={{ marginTop: '2em' }}>
          <Button
            type="primary"
            style={{ marginLeft: '3em' }}
            danger
            htmlType="submit"
            disabled={isButtonDisabled} // ✅ 绑定禁用状态
            loading={isLoading}
          >
            备份数据
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: '2em' }}
            onClick={onCancel}
            // disabled={isButtonDisabled} // 可选：是否同时禁用取消按钮？
          >
            返回
          </Button>
        </Row>
      </Form>
    </>
  );
};

export default SerializePage;