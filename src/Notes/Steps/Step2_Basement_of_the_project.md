## What we did this step:
- Write the routers
- Create the public components
- Initialize redux 

### How to write the routers
- `react-router` : the basic router function
- `react-router-dom`: provides JSX for implementation
- `react-router-config`    

##### What is router configuration?  
- Tell router how to match url and run code.

#### react-router-dom
Provides JSX like `HashRouter`, `Link`

#### react-router-config
Static route configuration helpers for React Router

Routes are objects with the same properties as a <Route> with a couple  differences:  

- the only render prop it accepts is component (no render or children)  
- introduces the routes key for sub routes  
- Consumers are free to add any additional props they'd like to a route, you can access props.route inside the component, this object is a reference to the object used to render and match.  
- accepts key prop to prevent remounting component when transition was made from route with the same component and same key prop  

``` 
const routes = [{
    component: Root,
    routes: [
        {
            path: '/',
            exact: true,
            component Home
        },
        {
            path: '/child/:id',
            component: Child,
            routes: [
                {
                    routes: [
                        path: '/child/:id/grand-child'
                        component: GrandChild
                    ]
                }
            ]
        }
    ]
}]
```

--- 
### Public Component:  
The style of Home 
- Top component
    - with styled.div
    - background color with three iconfonts
- Tab
    - with styled.div
    - Three NavLink 
        - `to='/recommend'`
        - `activeClassName`: the class to give the element when it is active
        - TabItem with span
        
--- 
### Redux
- `redux`
- `react-redux`
- `immutable`
- `immutable-redux`
- `redux-thunk`: make `store.dispatch` can accept a function as parameter