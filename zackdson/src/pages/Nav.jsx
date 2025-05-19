import React, { useState,useEffect } from 'react';
import { Layout, Menu,Button,Tooltip,Modal,Form,Input,Popconfirm } from 'antd';
const { Header, Content, Sider,Footer } = Layout;
import { Outlet,useNavigate,useLoaderData } from 'react-router-dom';
// import MenuService from '../util/menuService';
import { notification } from "antd";
// import { tokenLoader } from '../util/authentication';
import { LogoutOutlined,UserOutlined,
  ToolOutlined,CheckCircleOutlined,
  ArrowDownOutlined,ArrowUpOutlined,
  // AppstoreOutlined 
} from '@ant-design/icons';
import GradeService from '../util/gradeService';
import UserService from '../util/userService';
import dayjs from 'dayjs'; // 需要安装 dayjs: npm install dayjs
import { useSelector, useDispatch } from 'react-redux';
import { setBranchDetail } from '../store/subjectSlice';
import { setUseTip } from '../store/backupSlice';
import { setSchool, setGrade, setResetGrade } from '../store/userSlice';
const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});

// export async function loader(){
//     // look if the token is expired!
//     // tokenLoader();
//     // 判断tokenLoader返回值
//     // const tokenResult = tokenLoader();
//     if (tokenLoader() == null) {
//         notification.warning({
//             message: '警告',
//             description: 'token过期，请重新登录'
//         });
//         localStorage.removeItem("dpj-sb");
//         localStorage.removeItem("school");
//         localStorage.removeItem("grade");
//         localStorage.removeItem("resetGrade");
//         localStorage.removeItem("subject");
//         localStorage.removeItem("branchDetail");
//         localStorage.removeItem("notebookRecord");
//         localStorage.removeItem("writingRecord");
//         localStorage.removeItem("commonRecord");
//         localStorage.removeItem("wrongRecord");
//         localStorage.removeItem("examRecord");
//         localStorage.removeItem("reviewRecord");
//         localStorage.removeItem("extensionRecord");
//         localStorage.removeItem("long");
//         localStorage.removeItem("token");
//         localStorage.removeItem("expiration");

//         return redirect('/');
//     }
//     try {
//       // 2024/6/24 此处需要修改，根据年级抽取科目getInitSetting()
//         // const restData = await MenuService.getAllSubjects();
//         const restData = await MenuService.getInitDson();
//         const subjects = await restData.data;
//         // console.log('=nav=,subjects=',subjects);
//         // 2025/4/28 toczpd 解释如果initdson表中allsub没有实际数据那么职位'[]'
//         // 2025/4/28 toczpd 则长度为2，有值的话，比如[{"key":"英语 写作","label":"写作"},{"key":"英语 其他","label":"其他"}]
//         // 2025/4/28 toczpd 则长度大于2。这就是筛选的原则'
//         // 2025/4/28 toczpd 所有条件也可以写成xg.allsub.length !== 2'
//         let guoaili=subjects.filter(xg=>xg.allsub !== null && xg.allsub.length>2);
//         // console.log('=nav=guoaili length:',guoaili.length);

//         // 2024/6/24 if no subject and subtype available,go to the congfig page.
//         // there is an infinite loop when the bellow code runs.
//         // I think the logic is 'if the father page (nav) is not renderd, then
//         // there is no possible of diving into its son page firstly.
//         // if(guoaili.length===0) return redirect('/nav/manage');
//         if(guoaili.length===0){
//           openNotificationWithIcon('warning',"您还设定没有科目，请首先点击左上方的【学科管理】按钮");
//         }else{
//           // 2024/7/3 add for subject and branch table curd request
//           localStorage.setItem('dpj-sb',JSON.stringify(guoaili.map((ini)=>ini.chname)));
//         }

//         let items=[];
//         items=guoaili.map((xxg)=>{
//             return {
//                 // key: xxg.name,
//                 key: xxg.chname,
//                 icon: <AppstoreOutlined />,
//                 label: xxg.chname,
//                 children:JSON.parse(xxg.allsub),           
//             }
//         });
//         // console.log("=nav=after transformming of subject and subtype,items=",items);
//         return items;

//     }catch(ex){
//         // alert("主科目取得异常,请检查后端是否开启");
//         // openNotificationWithIcon("error","主科目取得异常,再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员");
//         openNotificationWithIcon("error","令牌过期，请重新登录");
//         return redirect('/');
//     }
// }


export default function Nav () {
  // console.log('items main=',items);
  const navigate = useNavigate();
  const [stateOpenKeys, setStateOpenKeys] = useState([]);
  // 导航页面nav显示时，显示 【日夜脑未停留,心力用尽学丘】用
  const [beforeSubject, setBeforeSubject] = useState(true);
  const [visible,setVisible]=useState(false);
  const [zpddyz,setZpddyz]=useState({});
  const [headerIndex, setHeaderIndex] = useState(0);
  const [backupVisible, setBackupVisible] = useState(false);
  const [useVisible, setUseVisible] = useState(false);

  const dispatch = useDispatch();
  const school = useSelector(state => state.user.school);
  const grade = useSelector(state => state.user.grade);
  const long = useSelector(state => state.user.long);
  const lastBackupTip = useSelector(state => state.backup.lastBackupTip);
  const lastUseTip = useSelector(state => state.backup.lastUseTip);


  const schoolMap = {
    kindergarten: '幼儿园',
    primary: '小学',
    middle: '初中',
    high: '高中',
    college: '大学'
  };
  // 新增：Header 轮播内容
  const headerTexts = [
    "我曾经看过山和大海，也穿过人山人海",
    "日夜脑未停留，心力用尽学丘",
    "宝剑锋从磨砺出，梅花香自苦寒来",
    "书山有路勤为径，学海无涯苦作舟",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeaderIndex((prev) => (prev + 1) % headerTexts.length);
    }, 15000); // 每3秒切换一次
    return () => clearInterval(timer);
  }, [headerTexts.length]);


  useEffect(() => {
    // 优先判断 lastBackupTip，如果没有则用 lastUseTip
    // const lastBackupTip = localStorage.getItem('lastBackupTip');
    // const lastUseTip = localStorage.getItem('lastUseTip');
    const now = dayjs();
  
    if (!lastBackupTip) {
      // 如果还未设定 lastBackupTip，则用 lastUseTip 判断
      if (!lastUseTip) {
        // 第一次使用，记录 lastUseTip
        dispatch(setUseTip(now.toISOString()));
      } else if (now.diff(dayjs(lastUseTip), 'month') >= 1) {
        setUseVisible(true);
      }
    } else if (now.diff(dayjs(lastBackupTip), 'month') >= 1) {
      setBackupVisible(true);
    }
  }, [lastBackupTip, lastUseTip, dispatch]);

  const items=useLoaderData();
  if(!items){
      // alert("main主科目取得异常,请检查后端是否开启");
      // openNotificationWithIcon("error","主科目取得异常,再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员",ex);
    return null;
  }
  const getLevelKeys = (items1) => {
    const key = {};
    const func = (items2, level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  }; 

  const levelKeys = getLevelKeys(items);
  const handleGuoailiBeigan =({key }) => {
    setBeforeSubject(false);
    // let 江珊=String(key).slice(2);
    // console.log('江珊=',江珊);
    dispatch(setBranchDetail(key));
    navigate('/nav/empty');
  };

  const handleUseTipOk = () => {
    setUseVisible(false);
  };
  const handleBackupTipOk = () => {
    setBackupVisible(false);
  };

  const handelSubjectManamementButton = () => {
    setBeforeSubject(false);
    navigate('/nav/manage');
  }

  // 2024/6/29
  const handleUserInfo=async ()=>{
    try{
      const resData =await UserService.getCurrentUser();
      const username= await resData.data.username;
      setZpddyz(()=> {
        const mjddyz={
          // 2024/7/4 here the username should get from backend,not saved in local for security reason.
          // username:localStorage.getItem('user'),
          username:username,
          // school:localStorage.getItem('school')==='primary'?'小学'
          //       :localStorage.getItem('school')==='middle'?'初中':'高中',
          school: school,
          grade:grade 
        }
        return mjddyz;
      });
      setVisible(true);
      }catch(ex){
        // token 过期已在拦截器中处理，这里只需处理其他错误
        if (!ex.response || ex.response.status !== 401) {
          openNotificationWithIcon("error","后台取得用户异常，再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员")}
      return null;
    }
  }
  // 2024/7/2
  const handlerChangeGrade = () => {
    async function delGrade() {
      try{
          await GradeService.deleteGrade();
          dispatch(setResetGrade('yes'));
          dispatch(setSchool(null));
          dispatch(setGrade(null));
          navigate('/home')
      }catch(err){
          // token 过期已在拦截器中处理，这里只需处理其他错误
          if (!err.response || err.response.status !== 401) {
            openNotificationWithIcon("error","年级变更处理后台异常!再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员")}
          return null;
      }
    }
    delGrade();
  }

  // const handleSubjectEdit = ()

  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    // open
    if (currentOpenKey !== undefined) {
    const repeatIndex = openKeys
      .filter((key) => key !== currentOpenKey)
      .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
    setStateOpenKeys(
      openKeys
        // remove repeat key
        .filter((_, index) => index !== repeatIndex)
        // remove current level all child
        .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
    );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }       
  };    
  return (
        <Layout>
        <Sider width={256} style={{ minHeight: '100vh' }}>
          {/* <div style={{ height: '32px', background: 'rgba(255,255,255,.2)', margin: '16px' }} /> */}
          <Button 
            style={{ width:'80%', height: '32px', background: 'rgba(255,255,255,.2)', margin: '16px',color:'yellow',fontSize:'18px' }}
            type='text' onClick={handelSubjectManamementButton}
             >学科管理</Button>
          <Menu theme='dark'
            mode="inline"
            // defaultSelectedKeys={['231']}
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
            onClick={handleGuoailiBeigan}  //important, the main work flows are here!
            style={{
                width: 256,
                }}
            items={items} >
          </Menu>
        </Sider>
        <Layout >
          <Header style={{ 
                background: '#0066a1', 
                // background: '#008000', 
                textAlign: 'center', 
                padding: 0,
                color:'white', 
                fontSize:'26px'
            }}
          >
            {/* 我曾经看过山和大海，也穿过人山人海 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '28px', marginLeft:'1em' }}>{headerTexts[headerIndex]}</span>
          </div>
          <div>
            <Tooltip title="当前用户信息">
              <Button type="primary"  shape="circle" icon={<UserOutlined />} 
              style={{ marginRight: '10px',backgroundColor:'#2529d8' }} 
              onClick={handleUserInfo}
              />
            </Tooltip>
            <Tooltip title="修改年级">
            <Popconfirm
              title="变更年级"
              onConfirm={handlerChangeGrade}
              description="您确认要变更吗？请注意变更后现有的数据都会暂时不可见，直到把年级重新变回来。"
              okText="是的，我要变更"
              cancelText="取消变更"
            >
              <Button type="primary" 
                shape="circle" icon={<ToolOutlined />} 
                style={{ marginRight: '10px',backgroundColor:'#2529d8' }}
              />
            </Popconfirm>
            </Tooltip>
            {/* 2024/6/24 add */}
            <Tooltip title="编辑科目及子分类">
              <Button type="primary"  
                      onClick={()=>navigate('/nav/subject')}
                      shape="circle" icon={<CheckCircleOutlined />} 
                      style={{ marginRight: '10px',backgroundColor:'#2529d8' }}
              />
            </Tooltip>
            {long === 'donglai' && (
              <Tooltip title="从本地文件导入数据">
                <Button
                  type="primary"
                  onClick={() => navigate('/nav/deserialize')}
                  shape="circle"
                  icon={<ArrowUpOutlined />}
                  style={{ marginRight: '10px', backgroundColor: '#ffa700' }}
                />
              </Tooltip>
            )}
            {/* {localStorage.getItem('long')==='donglai' &&  */}
            <Tooltip title="数据本地备份">
              <Button type="primary"  
                      onClick={()=>navigate('/nav/serialize')}
                      shape="circle" icon={<ArrowDownOutlined />} 
                      style={{ marginRight: '10px',backgroundColor:'red' }}
              />
            </Tooltip>
            <Tooltip title="退出当前登录状态">
            <Popconfirm
              title="退出确认"
              onConfirm={()=>navigate('/logout')}
              description="您确认要退出吗？请确认已经提交了写好的数据。"
              okText="是的，退出"
              cancelText="不退了"
            >
                <Button type="primary"  shape="circle" icon={<LogoutOutlined />} 
                  style={{ marginRight: '10px',backgroundColor:'#848482' }}
                  // onClick={()=>navigate('/logout')}
                />
            </Popconfirm>
            </Tooltip>
          </div>
        </div>
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 12, background: '#fff', minHeight: 360 }}>
              {beforeSubject && <div>
                  {/* <h1>
                  ==========    日夜脑未停留,心力用尽学丘    ==========
                  </h1> */}
                </div>}
              {/* <main style={{fontSize:'5em'}}> */}
                <Outlet />
                
              {/* </main> */}
            </div>
            {/* <RootLayout /> */}
          </Content>
          <Footer style={{ textAlign: 'center' }}>蚂蚁设计赋能©2024 Created by minhui</Footer>
          <Modal  
            title="用户信息"  
            open={visible} 
            destroyOnClose
            onCancel={()=>setVisible(false)}  
            footer={null}  
            >  
              <Form  
                name="userInfo"
                initialValues={zpddyz}
              >  
                <Form.Item
                  name="username"
                  label="用户名"
                >
                  <Input style={{color:'blue'}}  />
                </Form.Item>

                <Form.Item
                  name="school"
                  label="学校"
                >
                  <Input  style={{color:'blue'}}  />
                </Form.Item>

                <Form.Item
                  name="grade"
                  label="年级"
                >
                  <Input style={{color:'blue'}}/>
                </Form.Item>
                  <Form.Item>  
                    <Button type="primary" danger 
                      style={{marginLeft:'15em'}}
                      onClick={()=>setVisible(false)} >  
                    OK
                  </Button>  
                </Form.Item>  
              </Form>  
            </Modal>   

            <Modal
              title="温馨提示"
              open={useVisible}
              onOk={handleUseTipOk}
              onCancel={handleUseTipOk}
              okText="知道了"
              cancelButtonProps={{ style: { display: 'none' } }}
            >
              <p>为防止计算机系统故障导致本应用的数据丢失，请点击右上角红色按钮进行本地备份！</p>
            </Modal>
            <Modal
              title="温馨提示"
              open={backupVisible}
              onOk={handleBackupTipOk}
              onCancel={handleBackupTipOk}
              okText="知道了"
              cancelButtonProps={{ style: { display: 'none' } }}
            >
              <p>距离您上次备份已经超过一个月，建议您定期备份数据，以防丢失。请点击右上角红色按钮进行本地备份！</p>
            </Modal>
        </Layout>
      </Layout>
  )
}
// export default Nav;