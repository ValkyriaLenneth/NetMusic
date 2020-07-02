# How to use redux 
## file structure:
- actionCreators: place actions
- constants: the type of action
- index: import reducer and action
- reducer: save initialStation and reducer

## Step
1. Initialize state in reducer
2. Define constants, the type of action, in constant.js
3. define reducer in reducer.js
4. write action in actionCreator
5. export the reducer and actionCreators
6. register store in global store in src/store/reducer
7. connect Redux in Singers/index.js