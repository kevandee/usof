import Login from '../pages/Login'
import Register from "../pages/Register"
import Posts from "../pages/Posts/Posts"
import Post from "../pages/Page/Page"
import Home from "../pages/Home/Home"

export const privateRoutes = [
    {path: '/posts', element: <Posts/>, exact: true},
    {path: '/posts/:id', element: <Post/>, exact: true},
    {path: '/home', element: <Home/>, exact: true}
]

export const publicRoutes = [
    {path: '/sign-in', element: <Login/>, exact: true},
    {path: '/sign-up', element: <Register/>, exact: true}
]