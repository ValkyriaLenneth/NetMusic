import React, {useEffect, useState, useContext} from "react";
import Horizen from "../../baseUI/horizen-item";
import {alphaTypes, categoryTypes} from '../../api/config';
import { NavContainer, List, ListContainer, ListItem } from "./style";
import Scroll from "../../baseUI/scroll";
import { connect } from 'react-redux';
import { getSingerList, getHotSingerList, changeEnterLoading, refreshMoreHotSingerList, refreshMoreSingerList, changePageCount, changePullUpLoading, changePullDownLoading } from "./stores/actionCreators";
import Loading from "../../baseUI/loading";
import LazyLoad, { forceCheck } from 'react-lazyload';
import {CategoryDataContext, CHANGE_ALPHA, CHANGE_CATEGORY, Data} from "./data";
import { renderRoutes } from "react-router-config";

function Singers(props) {

    // let [category, setCategory] = useState('');
    // let [alpha, setAlpha] = useState ('');
    const {data, dispatch} = useContext(CategoryDataContext);

    const {category, alpha} = data.toJS();

    const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount } = props;
    const { getHotSingerDispatch, updateDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch } = props;

    useEffect( () => {
        if (!singerList.size){
            getHotSingerDispatch();
        }
    }, []);

    let handleUpdateAlpha = (val) => {
        // setAlpha(val);
        dispatch({type: CHANGE_ALPHA, data: val});
        updateDispatch(category, val);
    }

    let handleUpdateCategory = (val) => {
        // setCategory(val);
        dispatch({type: CHANGE_CATEGORY, data: val});
        updateDispatch(val, alpha);
    }

    const enterDetail = (id) => {
        props.history.push(`/singers/${id}`);
    }


    const renderSingerList = () => {
        const list = singerList? singerList.toJS(): [];
        return (
            <List>
                {
                    list.map((item, index) => {
                        return (
                            <ListItem
                                key={item.accountId+""+index}
                                onClick={() => enterDetail(item.id)}
                            >
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={
                                        <img src={require('./singer.png')} alt="music" width="100%" height="100%"/>
                                    }>
                                        <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
                                    </LazyLoad>
                                </div>
                                <span className="name">{item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    }

    const handlePullUp = () => {
        pullUpRefreshDispatch (category, alpha, category === '', pageCount);
    }

    const handlePullDown = () => {
        pullDownRefreshDispatch (category, alpha);
    }
    return (
        <div>
            <Data>
                <NavContainer>
                    <Horizen
                        list={categoryTypes}
                        title={"categories(default)"}
                        handleClick={(val) => handleUpdateCategory(val)}
                        oldVal={category}
                    >

                    </Horizen>
                    <Horizen
                        list={alphaTypes}
                        title={"alphaTypes:"}
                        handleClick={(val) => handleUpdateAlpha(val)}
                        oldVal={alpha}
                    >

                    </Horizen>
                </NavContainer>
                <ListContainer>
                    <Scroll
                        pullUp={ handlePullUp }
                        pullDown={ handlePullDown }
                        pullUpLoading={ pullUpLoading }
                        pullDownLoading={ pullDownLoading }
                        onScroll={ forceCheck }
                    >
                        { renderSingerList() }
                    </Scroll>
                    <Loading show={ enterLoading }></Loading>
                </ListContainer>
            </Data>
            { renderRoutes(props.route.routes) }
        </div>

    )
}

const mapStateToProps = (state) => ({
    singerList: state.getIn(['singers', 'singerList']),
    enterLoading: state.getIn(['singers', 'enterLoading']),
    pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
    pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
    pageCount: state.getIn(['singers', 'pageCount']),
});

const mapDispatchToProps = (dispatch) => {
    return {
        getHotSingerDispatch() {
            dispatch(getHotSingerList());
        },
        updateDispatch(category, alpha) {
            dispatch(changePageCount(0));
            dispatch(changeEnterLoading(true));
            console.log("updateDispatch ")
            dispatch(getSingerList(category, alpha));

        },
        pullUpRefreshDispatch(category, alpha, hot, count) {
            dispatch(changePullUpLoading(true));
            dispatch(changePageCount(count+1));
            if(hot) {
                dispatch(refreshMoreHotSingerList());
            }else {
                dispatch(refreshMoreSingerList(category, alpha));
            }
        },
        pullDownRefreshDispatch(category, alpha){
            dispatch(changePullDownLoading(true));
            dispatch(changePageCount(0));
            if(category === '' && alpha === ''){
                dispatch(getHotSingerList());
            }else {
                dispatch(getSingerList(category, alpha));
            }
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers));