- `line-height`: 行间距
- `quotes`: 引号样式
- `content`: 在::before, ::after中插入内容
- `border-spacing`: 相邻单元格之间的距离 
- `border-collapse`: 
    - `collapse`: 相邻单元格共享边框
    - `seperate`: 不共享边框 
- `i.iconfont &#xe62b;` 使用图标字体  

- `overflow` + `text-overflow:ellipsis` + `white-space: nowrap`:  
    - `overflow`会不显示超出部分
    - `text-overflow:ellipsis` 把超出部分换成 ... 
    - `white-space: nowrap` 不会出现最后一个单词换行的情况  

- `position: flex` 网页布局
    - `flex-direction:` 布局的走向
        - `row` 子元素横向排列
        - `column` 子元素纵向排列
    - `justify-content` 子元素在主轴上的对齐方式
        - flex-start（默认值）：左对齐
        - flex-end：右对齐
        - center： 居中
        - space-between：两端对齐，项目之间的间隔都相等。
        - space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。
    

- selector:
    - `>` 直接子代
    - ` ` 子代
    - `~` 兄弟
    - `+` 紧邻的兄弟
    - `:` 伪类
    - `::` 伪元素