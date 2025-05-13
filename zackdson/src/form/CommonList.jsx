import React, { useEffect, useState, Fragment } from "react";
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Button, Table,
  Spin,
  notification, Popconfirm
} from 'antd';
import TableService from "../util/tableService";

const openNotificationWithIcon = (type, message, description) => notification[type]({ message, description });

function CommonList() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [xiaofang, setXiaofang] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const subject = localStorage.getItem("branchDetail");
  // 2025/5/12 handle return navigation
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  // 2025/5/13 add page control
  const [searchParams] = useSearchParams();

  const deleteOneRecord = async (id) => {
    try {
      await TableService.delOneCommon(id);
      setXiaofang(x => !x);
      openNotificationWithIcon("success", "删除记录成功");
    } catch (ex) {
      openNotificationWithIcon("error", "删除记录异常,请联系管理员");
    }
  }
  const editRecord = (record) => {
    localStorage.setItem("commonRecord", JSON.stringify(record));
    navigate('/nav/common/edit', { state: { pageNumber: currentPage }});
  }

  const columns = [
    {
      title: '标题(可点击)',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a onClick={() => {
          localStorage.setItem("commonRecord", JSON.stringify(record));
          navigate('/nav/common/detail', { state: { pageNumber: currentPage } });
        }}>
          {text}
        </a>
      )
    },
    {
      title: '照片',
      // dataIndex: 'mjddyz',
      key: 'photo',
      render: (_,record) => (<span> {record.mjddyz.length>0 ? record.mjddyz.length+'张' : '未添加'} </span>),
     },
    {
      title: '做成日',
      dataIndex: 'beginday',
      key: 'beginday',
      render: (text, record) => {
        if (record.beginday !== record.modday) {
          return (
            <span>
              <span style={{ color: '#1890ff' }}>做成:</span> {record.beginday}
              <br />
              <span style={{ color: '#faad14' }}>修正:</span> {record.modday}
            </span>
          );
        }
        return record.beginday;
      }
    },
    {
      title: '重要度',
      dataIndex: 'imp',
      key: 'imp',

      render: (text) => {
        if (text === '高') {
          return <span style={{ color: '#d0021b', fontSize:'1.8em' }}>{text}</span>;
        }
        if (text === '中') {
          return <span style={{ color: '#1890ff',fontSize:'1.2em' }}>{text}</span>;
        }
        return <span style={{ color: 'gray', fontWeight: 'bold' }}>{text}</span>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      width: 160, // 可根据实际调整
      render: (text, record) => (
        <Fragment>
          <Popconfirm
            title={`删除 ${record.title}`}
            description="你确定真的要删除吗?"
            onConfirm={() => deleteOneRecord(record.id)} okText='确定' cancelText='取消'
          >
            <Button type="primary" danger style={{ fontSize: '12px' }}>删除</Button>
          </Popconfirm>
          <Button style={{ marginLeft: '5px', backgroundColor: 'green', fontSize: '12px' }} 
                  type='primary' 
                  onClick={() => editRecord(record)}
          >
            修改
          </Button>
        </Fragment>
      ),
    }
  ];

  useEffect(() => {
    const zpddyz = async () => {
      try {
        setIsLoading(true);
        const res = await TableService.getAllCommon(subject);
        setUser(res.data);
        // 2025/5/13计算总页数（假设每页10条记录，可根据实际分页设置调整）
        const pageSize = 10; // 或者从分页配置中获取
        const calculatedTotalPages = Math.ceil(res.data.length / pageSize);
        
        if (searchParams.get('showLastPage') === 'true' && calculatedTotalPages > 1) {
          setCurrentPage(calculatedTotalPages);
          // 清除URL参数
          navigate('/nav/common/list', { replace: true });
        } 
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        openNotificationWithIcon("error", "获取后台数据出错,请联系管理员")
      }
    };
    zpddyz();

    // 2025/5/12 handle return navigation
    if (location.state?.returnPage) {
      setCurrentPage(location.state.returnPage);
    }
  }, [xiaofang, Location]);

  const getRowClassName = (_, index) => {
    let className = ''
    className = index % 2 === 0 ? "oddRow" : "evenRow"
    return className
  }

  return (
    <>
      <h1>{localStorage.getItem("branchDetail")}</h1>
      <div style={{ background: 'white' }}>
        {isLoading ?
          <>
            <h2>正在获取以往记录...</h2>
            <Spin style={{ marginLeft: '23rem' }} size="large" />
          </>
          :
          <>
            <Table columns={columns}
              dataSource={user}
              rowClassName={getRowClassName}
              rowKey={rec => rec.id}
              // 2025/5/12
              pagination={{
                current: currentPage,
                onChange: (page) => setCurrentPage(page),
                total: user.length // 确保分页组件知道总记录数
              }}
            />
          </>
        }
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button style={{ width: '8rem', marginTop: '1rem', marginBottom: '2rem' }} type="primary" onClick={() => navigate('/nav/common/input')}>
            我要追加
          </Button>
        </div>
      </div>
    </>
  );
}

export default CommonList;