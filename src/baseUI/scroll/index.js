import React, {forwardRef, useEffect, useState, useRef, useImperativeHandle, useMemo} from "react";
import PropTypes from 'prop-types';
import BScroll from "better-scroll";
import styled from "styled-components";
import Loading from "../loading/index";
import LoadingV2 from "../loading-v2";
import { debounce } from "../../api/utils";

const ScrollContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
`
const PullUpLoading = styled.div`
  position: absolute;
  left: 0;right: 0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`

const PullDownLoading = styled.div`
  position: absolute;
  left: 0;right: 0;
  top: 0;
  height: 60px;
  margin: auto;
  z-index: 100;
`

const Scroll = forwardRef((props, ref) => {

    const [bScroll, setBScroll] = useState();
    const scrollContainerRef = useRef();
    const {direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props;
    const { pullUp, pullDown, onScroll } = props;
    const PullUpdisplayStyle = pullUpLoading? {display: ""} : {display: "none"};
    const PullDowndisplayStyle = pullDownLoading? {display: ""} : {display: "none"};

    let pullUpDebounce = useMemo(()=>{
        return debounce(pullUp, 300);
    }, [pullUp]);

    let pullDownDebounce = useMemo(() => {
        return debounce(pullDown, 300);
    }, [pullDown]);


    useEffect(() => {
        const scroll = new BScroll (scrollContainerRef.current, {
            scrollX: direction === 'horizental',
            scrollY: direction === 'vertical',
            probeType: 3,
            click: click,
            bounce: {
                top: bounceTop,
                bottom: bounceBottom,
            },
        });
        setBScroll(scroll);
        return () => {
            setBScroll(null);
        }
    }, []);

    useEffect(() => {
        if(refresh && bScroll){
            bScroll.refresh();
        }
    });

    useEffect(() => {
        if(!bScroll || !onScroll) return;
        bScroll.on('scroll', (scroll) => {
            onScroll(scroll);
        })

        return () => {
            bScroll.off('scroll');
        }
    }, [onScroll, bScroll]);

    useEffect(() => {
        if(!bScroll || !pullUp) return;
        bScroll.on('scrollEnd', () => {
            if(bScroll.y <= bScroll.maxScrollY + 100){
                pullUp();
            }
        });
        return () => {
            bScroll.off('scrollEnd');
        }
    }, [pullUp, bScroll]);

    useEffect(() => {
        if(!bScroll || !pullDown) return;
        bScroll.on('touchEnd', (pos) => {
            if(pos.y > 50) {
                pullDown();
            }
        });
        return () => {
            bScroll.off('touchEnd');
        }
    }, [pullDown, bScroll]);

    useImperativeHandle (ref, () => ({
        refresh () {
            if (bScroll) {
                bScroll.refresh ();
                bScroll.scrollTo (0, 0);
            }
        },
        getBScroll () {
            if (bScroll) {
                return bScroll;
            }
        }
    }));


    useEffect( () => {
        if (!bScroll || !pullUp) return;
        const handlePullUp = () => {
            if(bScroll.y <= bScroll.maxScrollY + 100){
                pullUpDebounce();
            }
        };
        bScroll.on('scrollEnd', handlePullUp);
        return () => {
            bScroll.off('scrollEnd', handlePullUp);
        }
    }, [pullUp, pullUpDebounce, bScroll])

    useEffect( () => {
        if(!bScroll || !pullDown) return;
        const handlePullDown = (pos) => {
            if(pos.y > 50) {
                pullDownDebounce();
            }
        };
        bScroll.on('touchEnd', handlePullDown);
        return () => {
            bScroll.off('touchEnd', handlePullDown);
        }
    }, [pullDown, pullDownDebounce, bScroll]);
    return (
        <ScrollContainer ref={scrollContainerRef}>
            {props.children}
            <PullUpLoading style={ PullUpdisplayStyle }><Loading></Loading></PullUpLoading>
            <PullDownLoading style={ PullDowndisplayStyle }><LoadingV2></LoadingV2></PullDownLoading>
        </ScrollContainer>
    )
});

Scroll.defaultProps = {
    direction: "vertical",
    click: true,
    refresh: true,
    onScroll:null,
    pullUpLoading: false,
    pullDownLoading: false,
    pullUp: null,
    pullDown: null,
    bounceTop: true,
    bounceBottom: true
};

Scroll.propTypes = {
    direction: PropTypes.oneOf (['vertical', 'horizental']),
    refresh: PropTypes.bool,
    onScroll: PropTypes.func,
    pullUp: PropTypes.func,
    pullDown: PropTypes.func,
    pullUpLoading: PropTypes.bool,
    pullDownLoading: PropTypes.bool,
    bounceTop: PropTypes.bool,// 是否支持向上吸顶
    bounceBottom: PropTypes.bool// 是否支持向上吸顶
};

export default Scroll;

