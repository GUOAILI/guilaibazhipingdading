import React, { useState, useRef } from 'react';
import { Form, Button, Input, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import PersistService from '../util/persistService';

const openNotificationWithIcon = (type, message, description) =>
  notification[type]({ message, description });

const DeserializePage = () => {
  const navigate = useNavigate();
  const [form1] = Form.useForm(); // 第一个表单实例
  const [form2] = Form.useForm(); // 第二个表单实例
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [zipInputKey, setZipInputKey] = useState(Date.now());
  const fileInputRef = useRef(null);
  const zipInputRef = useRef(null);

  const [isLoadingDatabase, setIsLoadingDatabase] = useState(false); // ✅ For database restore
  const [isLoadingUnzip, setIsLoadingUnzip] = useState(false);     // ✅ For zip file extraction
  // 数据库文件选择
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

  // 照片zip文件选择
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

  // 数据库文件提交
  const onFinishDatabase = (values) => {
    setIsLoadingDatabase(true); // ✅ 开始加载
    async function deserialize(filename) {
      try {
        await PersistService.recoverToTable(filename);
        openNotificationWithIcon('success', '备份数据恢复成功');
        form1.setFieldsValue({ filename: '' }); // ✅ 清空输入框
        setFileInputKey(Date.now()); // ✅ 可选：重置隐藏的 file input
      } catch (ex) {
        openNotificationWithIcon('error', '备份数据恢复失败');
      } finally {
        setIsLoadingDatabase(false); // ✅ 结束加载
      }
    }
    deserialize(values.filename);
  };

  // 照片zip文件提交
  const onFinishUnzip = (values) => {
    const zipname = values.zipname;
    if (!zipname) {
      openNotificationWithIcon('error', '请指定照片压缩文件名');
      return;
    }
    setIsLoadingUnzip(true); // ✅ 开始加载
    async function unzip() {
      try {
        await PersistService.unZipTheFile(zipname);
        openNotificationWithIcon('success', '照片压缩包解压成功');
        form2.setFieldsValue({ zipname: '' }); // ✅ 清空输入框
        setZipInputKey(Date.now()); // ✅ 可选：重置隐藏的 zip input
      } catch (ex) {
        openNotificationWithIcon('error', '照片压缩包解压失败');
      } finally {
        setIsLoadingUnzip(false); // ✅ 结束加载
      }
    }
    unzip();
  };

  return (
    <>
      {/* 第一个表单：数据库恢复 */}
      <Form form={form1} onFinish={onFinishDatabase}>
        <h2 style={{ color: '#00008b' }}>备份数据恢复</h2>
        <div style={{  marginBottom: 8 }}>本操作共分2步:</div>
        <div style={{ color: '#bd33a4',fontWeight:'bold', marginBottom: 16 }}>
          第一步:将本地备份数据库文件(all-entities-xxx.ser)导入数据库
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
            <label
              htmlFor="filename"
              style={{
                color: 'blue',
                minWidth: '80px',
                textAlign: 'right',
                paddingRight: '8px',
              }}
            >
              指定文件名
            </label>
            <Form.Item
              name="filename"
              rules={[
                { required: true, message: '请指定文件名' },
                {
                    validator(_, value) {
                      const regex = /^all-entities-\d{13}\.ser$/i;
                      if (!value || regex.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('文件名不匹配备份文件'));
                    },
                  },

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
        {/* 隐藏的数据库文件选择框 */}
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
            style={{ width: '150px' }} 
            danger 
            htmlType="submit"
            loading={isLoadingDatabase} // ✅ 绑定加载状态
          >
            提交
          </Button>
        </Form.Item>
      </Form>

      {/* 第二个表单：照片解压 */}
      <Form form={form2} onFinish={onFinishUnzip}>
        <div style={{ color: '#bd33a4',fontWeight:'bold', marginTop: 32, marginBottom: 8 }}>
          第二步:将本地备份照片压缩文件(uploads-xxx.zip)解压导入
        </div>
        <div style={{ marginBottom: 15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
            <label
              htmlFor="zipname"
              style={{
                color: 'blue',
                minWidth: '80px',
                textAlign: 'right',
                paddingRight: '8px',
              }}
            >
              指定文件名
            </label>
            <Form.Item
              name="zipname"
              rules={[{ required: true, message: '请指定照片压缩文件名' },
                {
                    validator(_, value) {
                      const regex = /^uploads-\d{13}\.zip$/i;
                      if (!value || regex.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('文件名不匹配备份文件'));
                    },
                  },
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
        {/* 隐藏的zip文件选择框 */}
        <input
          key={zipInputKey}
          type="file"
          style={{ display: 'none' }}
          ref={zipInputRef}
          onChange={handleZipChange}
        />
        <Form.Item style={{ display: 'flex', justifyContent: 'left' }}>
          <Button 
            type="primary" danger 
            style={{ width: '150px' }} 
            htmlType="submit"
            loading={isLoadingUnzip} // ✅ 绑定加载状态
          >
            提交
          </Button>
        </Form.Item>
      </Form>

      {/* 取消按钮单独居中放最下方 */}
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