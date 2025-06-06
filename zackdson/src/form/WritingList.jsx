import React, { useEffect,useState,Fragment } from "react";
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom';
import {
  Button,Table,
  Spin,
  notification,Popconfirm
} from 'antd';
import TableService from "../util/tableService";
import { useSelector, useDispatch } from 'react-redux';
import { setRecord } from '../store/recordSlice';
const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});

function WritingList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user, setUser]=useState([]);
    const [xiaofang,setXiaofang]=useState(false);
    const [isLoading, setIsLoading]=useState(false);
    // const subject=localStorage.getItem("branchDetail");
    const subject = useSelector((state) => state.subject.branchDetail);
    // 2025/5/12 handle return navigation
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
    // 2025/5/13 add page control
    const [searchParams] = useSearchParams();
    const [returnPageHandled, setReturnPageHandled] = useState(false);

    const deleteOneRecord = async (id)=>{
      try{
        await TableService.delOneWriting(id);
        setXiaofang(x=>!x);
        openNotificationWithIcon("success","删除 作文 记录成功");
      }catch(err){
        // token 过期已在拦截器中处理，这里只需处理其他错误
        if (!err.__notified) {
          openNotificationWithIcon("error","删除作文记录异常,再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员")}
      }

    }
    const editRecord = (record)=>{
      // localStorage.setItem("writingRecord",JSON.stringify(record));
      dispatch(setRecord({ type: 'writingRecord', value: JSON.stringify(record) }));
      navigate('/nav/writing/edit', { state: { pageNumber: currentPage }});
    }

    const columns = [
        {
        title: '标题(可点击)',
        dataIndex: 'title',
        key: 'title',
        // render: (text) => <span style={{color:'red'}}>{text}</span>,
        // 跳转详情页
        render: (text, record) => {
            
            return <a onClick={()=>{
                // localStorage.setItem("writingRecord",JSON.stringify(record));
                dispatch(setRecord({ type: 'writingRecord', value: JSON.stringify(record) }));
                navigate('/nav/writing/detail', { state: { pageNumber: currentPage } });
            }}>
                {text}
            </a>
          }
        },
        {
          title: '题材',
          dataIndex: 'topic',
          key: 'topic',
        },
        {
        title: '照片',
        key: 'photo',
        // render: (_,record) => (<span> {record.mjddyz.length>0 ? record.mjddyz.length+'张' : '未添加'} </span>),
        render: (_,record) => (
          <span style={record.mjddyz.length > 0 ? { color: '#ae63e4'} : {} }>
            {record.mjddyz.length>0 ? record.mjddyz.length+'张' : '未添加'} 
          </span>
        ),
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
          // reuse the perfect code of lagacy project fujitsu
          title: 'Action',
          className:'laoyaoziling',
          key: 'action',
          width: 160, // 可根据实际调整
          render: (text, record) => (
            <Fragment>
              <Popconfirm
                title={`删除 ${record.title}`} 
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
          const res = await TableService.getAllWriting(subject);
          // console.log(res.data);
          setUser(res.data);
          // 2025/5/13计算总页数（假设每页10条记录，可根据实际分页设置调整）
          const pageSize = 10; // 或者从分页配置中获取
          const calculatedTotalPages = Math.ceil(res.data.length / pageSize);
          
          if (searchParams.get('showLastPage') === 'true' && calculatedTotalPages > 1) {
            setCurrentPage(calculatedTotalPages);
            // 清除URL参数
            // navigate('/nav/writing/list', { replace: true });
          } 
          setIsLoading(false);
        } catch(err){
          setIsLoading(false);
          // token 过期已在拦截器中处理，这里只需处理其他错误
          if (!err.__notified) {
            openNotificationWithIcon("error","获取后台写作数据出错,再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员")}
          // setIsLoading(true);
          // console.log(err);
        }
    };
    zpddyz();
    
    // 只在 returnPage 存在且未处理时跳页
    if (location.state?.returnPage && !returnPageHandled) {
      setCurrentPage(location.state.returnPage);
      setReturnPageHandled(true); // 标记已处理
    }
    // 如果 location.state 变了（比如从编辑页回来），重置 handled
    if (!location.state?.returnPage && returnPageHandled) {
      setReturnPageHandled(false);
    }
  }, [xiaofang, location.key, searchParams, subject, location.state, returnPageHandled]);
  const getRowClassName = (_, index) => {
    let className = ''
    // oddRow 和 evenRow为我们css文件中的样式名称
    className = index % 2 === 0 ? "oddRow" : "evenRow"
    return className
  }

  return (
    <>
    {/* <h1>{localStorage.getItem("branchDetail")}</h1> */}
    <h1>{subject}</h1>
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
                onChange: (page) => setCurrentPage(page),
                total: user.length, // 确保分页组件知道总记录数
                showSizeChanger: false // 添加这行以隐藏 pageSize 选择框
              }}
              />
          </>
          }
          <div style={{display:'flex',justifyContent:'center'}}>
            <Button style={{width:'8rem',marginTop:'1rem',marginBottom:'2rem'}}  type="primary" onClick={()=>navigate('/nav/writing/input')}>
              我要追加
            </Button>
          </div>
    </div>
    </>
  );
}

export default WritingList;
