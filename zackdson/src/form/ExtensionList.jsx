import React, { useEffect,useState,Fragment } from "react";
import {useNavigate, useLocation} from 'react-router-dom';
import {
  Button,Table,
  Spin,
  notification,Popconfirm
} from 'antd';
import TableService from "../util/tableService";

const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});

function ExtensionList() {
    const navigate = useNavigate();
    const [user, setUser]=useState([]);
    const [xiaofang,setXiaofang]=useState(false);
    const [isLoading, setIsLoading]=useState(false);
    const subject=localStorage.getItem("branchDetail");
    // 2025/5/12 handle return navigation
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();

    const deleteOneRecord = async (id)=>{
      try{
        await TableService.delOneExt(id);
        setXiaofang(x=>!x);
        openNotificationWithIcon("success","删除课外记录成功");
      }catch(ex){
        openNotificationWithIcon("error","删除课外记录异常,请联系管理员");
      }
    }
    const editRecord = (record)=>{
      localStorage.setItem("extensionRecord",JSON.stringify(record));
      navigate('/nav/extension/edit');
    }


    const columns = [
        {
          title: '课外课摘要(可点击)',
          dataIndex: 'abs',
          key: 'abs',
          // 跳转详情页
          render: (text, record) => {
            
            return <a onClick={()=>{
                localStorage.setItem("extensionRecord",JSON.stringify(record));
                navigate('/nav/extension/detail', { state: { pageNumber: currentPage } });
            }}>
                {text}
            </a>
            }
        },
        {
          title: '授课教师',
          dataIndex: 'teacher',
          key: 'teacher',
        },
        {
          title: '照片',
          // dataIndex: 'mjddyz',
          key: 'photo',
          render: (_,record) => (<span> {record.mjddyz.length>0 ? record.mjddyz.length+'张' : '未添加'} </span>),
        },
        {
          title: '上课日',
          dataIndex: 'extDate',
          key: 'extDate',
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
          title: '难易度',
          dataIndex: 'easy',
          key: 'easy',
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
          // reuse the perfect code of lagacy project fujitsu
          title: 'Action',
          className:'laoyaoziling',
          key: 'action',
          width: 160, // 可根据实际调整
          render: (text, record) => (
            <Fragment>
              <Popconfirm
                title={`删除 ${record.abs}`} 
                description="你确定真的要删除吗?"
                onConfirm={() => deleteOneRecord(record.id)} okText='确定' cancelText='取消'
              >
                <Button type="primary" danger style={{fontSize:'12px'}}>删除</Button>
              </Popconfirm>

              <Button style={{marginLeft: '5px',backgroundColor:'green',fontSize:'12px'}} type='primary' onClick={() => editRecord(record)}>修改</Button>
            </Fragment>
          ),
        }                
];

  useEffect( ()=>{
    const zpddyz = async ()=> {
        try{
          setIsLoading(true);
          const res = await TableService.getAllExt(subject);
          // console.log(res.data);
          setUser(res.data);
          setIsLoading(false);
        } catch(err){
          setIsLoading(false);
          openNotificationWithIcon("error","获取后台 课外课 数据出错,请联系管理员")
          // setIsLoading(true);
          // console.log(err);
        }
    };
    zpddyz();
    
    // 2025/5/12 handle return navigation
    if (location.state?.returnPage) {
      setCurrentPage(location.state.returnPage);
    }
  },[xiaofang, location]);

  const getRowClassName = (_, index) => {
    let className = ''
    // oddRow 和 evenRow为我们css文件中的样式名称
    className = index % 2 === 0 ? "oddRow" : "evenRow"
    return className
  }

  return (
    <>
    <h1>{localStorage.getItem("branchDetail")}</h1>
    <div style={{background:'white'}}>
          {isLoading ?
          <>
            <h2>正在获取以往记录...</h2>
            <Spin style={{marginLeft:'23rem'}} size="large"/> 
          </>
          : 
          <>
            {/* <h2>光辉的足迹</h2> */}
            <Table columns={columns} 
              dataSource={user} 
              rowClassName={getRowClassName}  
              rowKey={rec=>rec.id} 
              pagination={{
                current: currentPage,
                onChange: (page) => setCurrentPage(page)
              }}
              />
          </>
          }
          <div style={{display:'flex',justifyContent:'center'}}>
            <Button style={{width:'8rem',marginTop:'1rem',marginBottom:'2rem'}}  type="primary" onClick={()=>navigate('/nav/extension/input')}>
              我要追加
            </Button>
          </div>
    </div>
    </>
  );
}
export default ExtensionList;
