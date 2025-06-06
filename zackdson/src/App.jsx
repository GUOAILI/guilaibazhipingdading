import React from "react";
import {
  createBrowserRouter,
  // createHashRouter,
  RouterProvider
} from 'react-router-dom';
// import HomePage,{loader as HomeLoader} from './pages/Home';
import HomePage from './pages/Home';
import {loader as HomeLoader} from './pages/HomeLoader';
// import Nav,{loader as NavLoader} from './pages/Nav';
import Nav from './pages/Nav';
import {loader as NavLoader} from './pages/NavLoader';
import EmptyLayout from "./pages/EmptyPage";
// import SubjectManagement,{ action as subjectAction} from "./pages/SubjectManagement";
import SubjectManagement from "./pages/SubjectManagement";
import { action as subjectAction} from "./pages/SubjectAction";
import WritingForm from "./form/WritingForm";
import WritingList from "./form/WritingList";
import WritingShow from "./form/WritingShow";
import NotebookForm from "./form/NotebookForm";
import NotebookShow from "./form/NotebookShow";
import NotebookList from "./form/NotebookList";
import ExamForm from "./form/ExamForm";
import ExamList from "./form/ExamList";
import ExamShow from "./form/ExamShow";
import ReviewForm from "./form/ReviewForm";
import ReviewList from "./form/ReviewList";
import ReviewShow from "./form/ReviewShow";
import WrongForm from "./form/WrongForm";
import WrongShow from "./form/WrongShow";
import WrongList from "./form/WrongList";
import SummaryForm from "./form/SummaryForm";
import SummaryShow from "./form/SummaryShow";
import SummaryList from "./form/SummaryList";
import LoginForm from "./pages/Login";
// import LogoutPage,{loader as logoutLoader} from "./pages/Logout";
import LogoutPage from "./pages/Logout";
import ExtensionForm from "./form/ExtensionForm";
import ExtensionShow from "./form/ExtensionShow";
import ExtensionList from "./form/ExtensionList";
import WritingEdit from "./edit_page/WritingEdit";
import NotebookEdit from "./edit_page/NotebookEdit";
import ReviewEdit from "./edit_page/ReviewEdit";
import WrongEdit from "./edit_page/WrongEdit";
import SummaryEdit from "./edit_page/SummaryEdit";
import ExamEdit from "./edit_page/ExamEdit";
import ExtensionEdit from "./edit_page/ExtensionEdit";
import SubjectEdit from "./pages/SubjectEdit";
import SerializePage from "./pages/SerializePage";
import DeserializePage from "./pages/DeserializePage";
// import GradeManagement,{loader as gradeLoader,action as gradeAction} from "./pages/GradeManagement";
import CommonForm from "./form/CommonForm";
import CommonList from "./form/CommonList";
import CommonShow from "./form/CommonShow";
import CommonEdit from "./edit_page/CommonEdit";

const router = createBrowserRouter([
  {
    path: '/',
      element: <LoginForm />,
      // errorElement: <ErrorPage />,
      id: 'login',
      // loader: HomeLoader,
    },
  {
    path: '/home',
      element: <HomePage />,
      // errorElement: <ErrorPage />,
      id: 'home',
      loader: HomeLoader,
  },
  {
    path: '/logout',
      element: <LogoutPage />,
      // errorElement: <ErrorPage />,
      id: 'logout',
      // loader: logoutLoader,
  },
  {
      path: '/nav',
      element: <Nav />,
      id: 'navigation',
      loader: NavLoader,
      children: [
        { path: '/nav/manage', 
          element: <SubjectManagement />,
          // loader: subjectLoader,
          action: subjectAction
        },
            // 临时测试用
      // { path: '/nav/branch2', element: <SubjectExtLayout /> },
      { path: '/nav/empty', 
        element: <EmptyLayout />,
        // loader: tokenLoader,
       },
      { path: '/nav/writing/list', 
        element: <WritingList />,
      },
      { path: '/nav/writing/input', 
        element: <WritingForm />,
      },
      { path: '/nav/writing/detail', 
        element: <WritingShow />,
      },
      // ======2025/4/25 toczpd Common 相关路由 ======
      { path: '/nav/common/list', 
        element: <CommonList />,
      },
      { path: '/nav/common/input', 
        element: <CommonForm />,
      },
      { path: '/nav/common/detail', 
        element: <CommonShow />,
      },
      { path: '/nav/common/edit', 
        element: <CommonEdit />,
      },
      // 2024/6/21 to implement the notebook part
      { path: '/nav/notebook/list', 
        element: <NotebookList />,
      },
      { path: '/nav/notebook/input', 
        element: <NotebookForm />,
      },
      { path: '/nav/notebook/detail', 
        element: <NotebookShow />,
      },
      // 2024/6/25 to implement the exam part
      { path: '/nav/exam/list', 
        element: <ExamList />,
      },
      { path: '/nav/exam/input', 
        element: <ExamForm />,
      },
      { path: '/nav/exam/detail', 
        element: <ExamShow />,
      },
      // 2024/6/26 add
      { path: '/nav/review/list', 
        element: <ReviewList />,
      },
      { path: '/nav/review/input', 
        element: <ReviewForm />,
      },
      { path: '/nav/review/detail', 
        element: <ReviewShow />,
      },
      // 2024/6/29 add
      { path: '/nav/wrong/list', 
        element: <WrongList />,
      },
      { path: '/nav/wrong/input', 
        element: <WrongForm />,
      },
      { path: '/nav/wrong/detail', 
        element: <WrongShow />,
      },
      { path: '/nav/Summary/list', 
        element: <SummaryList />,
      },
      { path: '/nav/Summary/input', 
        element: <SummaryForm />,
      },
      { path: '/nav/Summary/detail', 
        element: <SummaryShow />,
      },
      { path: '/nav/extension/list', 
        element: <ExtensionList />,
      },
      { path: '/nav/extension/input', 
        element: <ExtensionForm />,
      },
      { path: '/nav/extension/detail', 
        element: <ExtensionShow />,
      },
      // 2024/7/1 add edit implementation
      { path: '/nav/writing/edit', 
        element: <WritingEdit />,
      },
      { path: '/nav/notebook/edit', 
        element: <NotebookEdit />,
      },
      { path: '/nav/extension/edit', 
        element: <ExtensionEdit />,
      },
      { path: '/nav/review/edit', 
        element: <ReviewEdit />,
      },
      { path: '/nav/wrong/edit', 
        element: <WrongEdit />,
      },
      { path: '/nav/Summary/edit', 
        element: <SummaryEdit />,
      },
      { path: '/nav/exam/edit', 
        element: <ExamEdit />,
      },
      // 2024/7/2 add
      { path: '/nav/subject', 
        element: <SubjectEdit />,
      },
      { path: '/nav/serialize', 
        element: <SerializePage />,
      },
      { path: '/nav/deserialize', 
        element: <DeserializePage />,
      },
      // { path: '/nav/richtext', 
      //   element: <RichText />,
      // },
     ],
}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
