import React, { useState } from 'react';
import { Form, Button, Row, notification, Progress } from 'antd';
import { useNavigate } from 'react-router-dom';
import PersistService from '../util/persistService';
import { useDispatch } from 'react-redux'; // 新增
import { setBackupTip } from '../store/backupSlice'; // 新增
import dayjs from 'dayjs'; // 新增

const openNotificationWithIcon = (type, message, description) =>
  notification[type]({ message, description });

const SerializePage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch(); // 新增

  const checkProgress = async (id) => {
    const interval = setInterval(async () => {
      try {
        const res = await PersistService.getProgress(id);
        setProgress(res.data);
        if (res.data >= 100) {
          clearInterval(interval);
          setProgress(0);
          openNotificationWithIcon('success', '备份完成! 文件保存在：C:/minhui/persist路径下');
          dispatch(setBackupTip(dayjs().toISOString())); // 新增：设定 lastBackupTip 为当前日期
          // localStorage.setItem('lastBackupTip', dayjs().toISOString()); // 新增：存储到 localStorage
          setIsButtonDisabled(false);
          
        }
      } catch (err) {
        clearInterval(interval);
        setProgress(0);
        setIsButtonDisabled(false);
        if (!err.__notified) {
          openNotificationWithIcon('error', '获取进度失败');}
      }
    }, 1000);
  };

  const onFinish = () => {
    async function serializeAll() {
      try {
        // setIsLoading(true);
        setIsButtonDisabled(true);
        const res = await PersistService.serializeAllDatabaseData();
        const id = res.data;

        // setTaskId(id);
        checkProgress(id); // 开始轮询进度
      } catch (err) {
        if (!err.__notified) {
          openNotificationWithIcon('error', '启动备份任务失败');}
        // setIsLoading(false);
        setIsButtonDisabled(false);
      }
    }
    serializeAll();
  };

  const onCancel = () => {
    navigate(-1);
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

        {progress > 0 && (
          <Row gutter={[12, 12]} style={{ marginTop: '1em' }}>
            <Progress percent={progress} status="active" />
          </Row>
        )}

        <Row gutter={[12, 12]} style={{ marginTop: '2em' }}>
          <Button
            type="primary"
            style={{ marginLeft: '3em' }}
            danger
            htmlType="submit"
            disabled={isButtonDisabled}
            // loading={isLoading}
          >
            备份数据
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: '2em' }}
            onClick={onCancel}
          >
            返回
          </Button>
        </Row>
      </Form>
    </>
  );
};

export default SerializePage;