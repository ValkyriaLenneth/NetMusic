import React from 'react'
import { Router, Route, Link } from 'react-router'
import { IndexRoute, Redirect } from 'react-router'

// 默认页面
const Dashboard = React.createClass({
    render() {
        return <div>Welcome to the app!</div>
    }
})

// App 组件
const App = React.createClass({
    render() {
        return (
            <div>
                <h1>App</h1>
                <ul>
                    /* 指向两个child的 link 和 to */
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/inbox">Inbox</Link></li>
                </ul>
                {this.props.children}
            </div>
        )
    }
})

const About = React.createClass({
    render() {
        return <h3>About</h3>
    }
})

const Inbox = React.createClass({
    render() {
        return (
            <div>
                <h2>Inbox</h2>
                {this.props.children || "Welcome to your Inbox"}
            </div>
        )
    }
})

const Message = React.createClass({
    render() {
        return <h3>Message {this.props.params.id}</h3>
    }
})

React.render((
    // Router Configuration
    <Router> // 首先用Router 标签
        <Route path="/" component={App}> // 一级 route , 用 component 对应组件
            <IndexRoute component={Dashboard}/> // 默认的主页设置
            <Route path="about" component={About} /> // 用 path 属性表示对应的二级route
            <Route path="inbox" component={Inbox}>
                // 对应的三级route /:id 为动态路由参数
                <Route path="messages/:id" component={Message} />
                // 嵌套渲染方法, 直接在渲染 inbox 的时候,渲染 messeage
                <Route path="/messages/:id" component={Message} />
                // 但是由于刚才改变了原始 url, 所以访问 /inbox/message/anyid 时候会404
                // 用 Recidrect/ 来解决 , 所有到 /inbox/message/anyid 的链接都会自动指向 /messages/anyid
                <Redirect from={'messages/:id'} to={"/messages/:id"}/>
            </Route>
        </Route>
    </Router>
), document.body)

/*
Route 可以定义
    - onEnter
    - onLeave
    两个 hook, 分别在页面跳转的前后进行触发,而且逐层冒泡

    继续我们上面的例子，如果一个用户点击链接，从 /messages/5 跳转到 /about，下面是这些 hook 的执行顺序：
        /messages/:id 的 onLeave
        /inbox 的 onLeave
        /about 的 onEnter
 */


/*
也可以用原声 route 数组来构造
 */
const routerConfig = [{
    path: '/',
    component: App,
    indexRoute: { component: Dashboard},
    childRoutes: [
        {
            path: 'about',
            component: About,
        },
        {
            path: 'indbox',
            component: Inbox,
            childRoutes: [
                {
                    path: '/messages/:id',
                    component: Message,
                },
                {
                    path: 'messeges/:id',
                    onEnter: function (nextState, replaceState) {
                        replaceState(null, '/messages/' + nextState.params.id);
                    }
                }
            ]
        }
    ]
}]
React.render(<Router routes={routerConfig} />, document.body);

/*
匹配语法
    如果一个路由使用了相对路径，那么完整的路径将由它的所有祖先节点的路径和自身指定的相对路径拼接而成。
    使用绝对路径可以使路由匹配行为忽略嵌套关系。

    <Route path="/hello/:name">         // 匹配 /hello/michael 和 /hello/ryan
    <Route path="/hello(/:name)">       // 匹配 /hello, /hello/michael 和 /hello/ryan
    <Route path="/files/*.*"> ;          // 匹配 /files/hello.jpg 和 /files/path/to/hello.jpg;

 */


/*
   React Router 是建立在 history 之上的。
   简而言之，一个 history 知道如何去监听浏览器地址栏的变化， 并解析这个 URL 转化为 location 对象，
   然后 router 使用它匹配到路由，最后正确地渲染对应的组件。

    常用的 history 有三种形式， 但是你也可以使用 React Router 实现自定义的 history。

        browserHistory
        hashHistory
        createMemoryHistory
*/