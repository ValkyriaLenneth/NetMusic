# React.props  
`const element = <Welcome name="Sara">`  
React会把JSX接受的属性(Attributes)以及子组件(Children)合并为单个对象,传递给组件.  
这个对象就是 `props`  
解构的用法:  
`const { route } = props;`  
相当于  
`const route = props.route`