import React, { useState, useRef } from 'react';
import { Form, Button, Input, notification, Row, Progress } from 'antd';
import { useNavigate } from 'react-router-dom';
import PersistService from '../util/persistService';

const openNotificationWithIcon = (type, message, description) =>
  notification[type]({ message, description });

const DeserializePage = () => {
  const navigate = useNavigate();
  const [form1] = Form.useForm(); // 数据库恢复表单
  const [form2] = Form.useForm(); // 解压照片表单
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [zipInputKey, setZipInputKey] = useState(Date.now());
  const fileInputRef = useRef(null);
  const zipInputRef = useRef(null);

  // 状态管理
  const [isLoadingDatabase, setIsLoadingDatabase] = useState(false); // 数据库恢复加载状态
  // const [isLoadingUnzip, setIsUnzipLoading] = useState(false);     // 解压加载状态
  const [unzipProgress, setUnzipProgress] = useState(0);           // 解压进度
  const [isButton1Disabled, setIsButton1Disabled] = useState(false);
  const [isButton2Disabled, setIsButton2Disabled] = useState(false);

  // 数据库文件选择处理
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      form1.setFieldsValue({ filename: fileName });
    }
  };

  const handleInputClick = () => {
    if (!form1.getFieldValue('filename') && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClearFile = () => {
    form1.setFieldsValue({ filename: '' });
    setFileInputKey(Date.now());
  };

  // 照片zip文件选择处理
  const handleZipChange = (e) => {
    if (e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      form2.setFieldsValue({ zipname: fileName });
    }
  };

  const handleZipInputClick = () => {
    if (!form2.getFieldValue('zipname') && zipInputRef.current) {
      zipInputRef.current.click();
    }
  };

  const handleClearZip = () => {
    form2.setFieldsValue({ zipname: '' });
    setZipInputKey(Date.now());
  };

  // 数据库恢复提交
  const onFinishDatabase = (values) => {
    setIsLoadingDatabase(true);
    async function deserialize(filename) {
      try {
        setIsButton1Disabled(true);
        await PersistService.recoverToTable(filename);
        openNotificationWithIcon('success', '备份数据恢复成功');
        form1.setFieldsValue({ filename: '' });
        setFileInputKey(Date.now());
      } catch (err) {
        if (!err.response || ![400, 401, 403].includes(err.response?.status)) {
          openNotificationWithIcon('error', '备份数据恢复失败，请联系管理员');
        }
      } finally {
        setIsLoadingDatabase(false);
        setIsButton1Disabled(false);
      }
    }
    deserialize(values.filename);
  };

  // 解压进度轮询函数
  const checkUnzipProgress =async (id) => {
    const interval = setInterval(async () => {
      try {
        const res = await PersistService.getProgress(id);
        setUnzipProgress(res.data);
        if (res.data >= 100) {
          clearInterval(interval);
          // setIsUnzipLoading(false);
          setUnzipProgress(0);
          setIsButton2Disabled(false);
          openNotificationWithIcon('success', '照片压缩包解压完成');

          form2.setFieldsValue({ zipname: '' });
          setZipInputKey(Date.now());
        }
      } catch (err) {
        clearInterval(interval);
        // setIsUnzipLoading(false);
        setIsButton2Disabled(false);
        setUnzipProgress(0);

        if (!err.response || ![400, 401, 403].includes(err.response?.status)) {
          openNotificationWithIcon('error', '获取解压进度失败');}
      }
    }, 1000);
  };

  // 照片解压提交
  const onFinishUnzip = (values) => {
    const zipname = values.zipname;
    if (!zipname) {
      openNotificationWithIcon('error', '请指定照片压缩文件名');
      return;
    }

    async function startUnzip() {
      try {
        const res = await PersistService.unZipTheFile(zipname);
        // setUnzipTaskId(id);
        setIsButton2Disabled(true);
        checkUnzipProgress(res.data);
      } catch (err) {
        // setIsUnzipLoading(false);
        setIsButton2Disabled(false);
        if (!err.response || ![400, 401, 403].includes(err.response?.status)) {
          openNotificationWithIcon('error', '启动解压任务失败');}
      }
    }

    startUnzip();
  };

  return (
    <>
      {/* 数据库恢复表单 */}
      <Form form={form1} onFinish={onFinishDatabase}>
        <h2 style={{ color: '#00008b' }}>备份数据恢复</h2>
        <div style={{ marginBottom: 8 }}>本操作共分2步:</div>
        <div style={{ color: '#bd33a4', fontWeight: 'bold', marginBottom: 16 }}>
          第一步: 将本地备份数据库文件(all-entities-xxx.ser)导入数据库
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
            <label htmlFor="filename" style={{
              color: 'blue',
              minWidth: '80px',
              textAlign: 'right',
              paddingRight: '8px'
            }}>指定文件名</label>
            <Form.Item
              name="filename"
              rules={[
                { required: true, message: '请指定文件名' },
                {
                  validator(_, value) {
                    const regex = /^all-entities-\d{13}\.ser$/i;
                    if (!value || regex.test(value)) return Promise.resolve();
                    return Promise.reject(new Error('文件名不匹配备份文件'));
                  }
                }
              ]}
              style={{ flexGrow: 1, marginBottom: 0 }}
            >
              <Input
                onClick={handleInputClick}
                readOnly
                placeholder="点击选择文件"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item shouldUpdate noStyle>
              {() => (
                <Button
                  onClick={handleClearFile}
                  disabled={!form1.getFieldValue('filename')}
                  type="primary"
                >
                  清空指定文件
                </Button>
              )}
            </Form.Item>
          </div>
        </div>

        {/* 隐藏的文件输入框 */}
        <input
          key={fileInputKey}
          type="file"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <Form.Item style={{ display: 'flex', justifyContent: 'left' }}>
          <Button
            type="primary"
            danger
            htmlType="submit"
            loading={isLoadingDatabase}
            disabled={isButton1Disabled}
            style={{ width: '150px' }}
          >
            提交
          </Button>
        </Form.Item>
      </Form>

      {/* 照片解压表单 */}
      <Form form={form2} onFinish={onFinishUnzip}>
        <div style={{ color: '#bd33a4', fontWeight: 'bold', marginTop: 32, marginBottom: 8 }}>
          第二步: 将本地备份照片压缩文件(uploads-xxx.zip)解压导入
        </div>

        <div style={{ marginBottom: 15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
            <label htmlFor="zipname" style={{
              color: 'blue',
              minWidth: '80px',
              textAlign: 'right',
              paddingRight: '8px'
            }}>指定文件名</label>
            <Form.Item
              name="zipname"
              rules={[
                { required: true, message: '请指定照片压缩文件名' },
                {
                  validator(_, value) {
                    const regex = /^uploads-\d{13}\.zip$/i;
                    if (!value || regex.test(value)) return Promise.resolve();
                    return Promise.reject(new Error('文件名不匹配备份文件'));
                  }
                }
              ]}
              style={{ flexGrow: 1, marginBottom: 0 }}
            >
              <Input
                onClick={handleZipInputClick}
                readOnly
                placeholder="点击选择文件"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item shouldUpdate noStyle>
              {() => (
                <Button
                  onClick={handleClearZip}
                  disabled={!form2.getFieldValue('zipname')}
                  type="primary"
                >
                  清空指定文件
                </Button>
              )}
            </Form.Item>
          </div>
        </div>

        {/* 隐藏的ZIP文件输入框 */}
        <input
          key={zipInputKey}
          type="file"
          style={{ display: 'none' }}
          ref={zipInputRef}
          onChange={handleZipChange}
        />

        {/* 进度条显示 */}
        {unzipProgress > 0 && (
          <Row gutter={[12, 12]} style={{ marginTop: '1em' }}>
            <Progress percent={unzipProgress} status="active" />
          </Row>
        )}

        <Form.Item style={{ display: 'flex', justifyContent: 'left' }}>
          <Button
            type="primary"
            danger
            htmlType="submit"
            // loading={isLoadingUnzip}
            disabled={isButton2Disabled}
            style={{ width: '150px' }}
          >
            提交
          </Button>
        </Form.Item>
      </Form>

      {/* 返回按钮 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <Button
          type="primary"
          style={{ width: '150px' }}
          onClick={() => {
            navigate('/nav/empty');
          }}
        >
          返回
        </Button>
      </div>
    </>
  );
};

export default DeserializePage;