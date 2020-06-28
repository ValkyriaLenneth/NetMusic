# How to use Swiper
Swiper is a component that provides convinient way to create slider 

--- 
`npm install swiper --save`

--- 
#### import  
```
import Swiper from "swiper";
import "swiper/css/swiper.css";
``` 

---
#### HTML 
``` 
div.swiper-container
    <-- slider -->
    div.swiper-wrapper
        div.swiper-slide
        div.swiper-slide
    
    <-- pagination -->
    div.swiper-pagination

    <--- navi buttons -->
    div.swiper-button-prev
    div.swiper-button-next
    
    <-- scroll bar -->
    div.swiper-scrollbar
```

--- 
#### Initialization of Swiper 
``` 
const mySwiper = new Swiper ('.swiper-container', {
        // configuration
        loop: true,

        // pagination
        pagination: {
            el: '.swiper-pagination',    
        },
        
        // navigation
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }

        // scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        }
    });
```  

---
#### Initial with Hook: useEffect  
```
useEffect( () => {
 // Async Action
}, [dependncies])
```
For each dependency in dependencies changed, useEffect will call the given Async Action.  
If dependencies is not given, useEffect would be called when render.  
 
With basic knowledge of hooks, lets look at how to initialize swiper:
``` 
const [sliderSwiper, setSliderSwiper] = useState(null);
const { bannerList } = props; 
```
We use hook: useState to store the sliderSwiper as state. 
Then get the bannerList, which is an array, from props.  

``` 
useEffect = (() => {
    if( bannerList && !sliderSwiper){
        let newSliderSwiper = new Swiper(".swiper-container", {
            //configuration
        }),
        // call the method from hook to update the state
        setSliderSwiper(newSliderSwiper);
    }, [bannerList.length, sliderSwiper]
})
```  

--- 
#### About CSS  
- SliderContainer:      JSX for the whole component 
- .slider-container:    0-level wrapper
- .swiper-wrapper:       1-level slider wrapper
- .swiper-pagination:        1-level pagination component
- .swiper-slide:         2-level slider wrapper
- .slider-nav:          3-level slider navigation, wrapped the img
