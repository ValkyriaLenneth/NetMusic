import React, {useEffect, useState} from "react";
import Horizen from "../../baseUI/horizen-item";
import {alphaTypes, categoryTypes} from '../../api/config';
import { NavContainer, List, ListContainer, ListItem } from "./style";
import Scroll from "../../baseUI/scroll";
import { connect } from 'react-redux';
import { getSingerList, getHotSingerList, changeEnterLoading, refreshMoreHotSingerList, refreshMoreSingerList, changePageCount, changePullUpLoading, changePullDownLoading } from "./stores/actionCreators";



function Singers(props) {

    let [category, setCategory] = useState('');
    let [alpha, setAlpha] = useState ('');

    const { singerList, enterLoading, pullUpLoading, pullDownLoading, getCount } = props;
    const { getHotSingerDispatch, updateDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch } = props;

    useEffect( () => {
        getHotSingerDispatch();

    }, []);

    let handleUpdateAlpha = (val) => {
        setAlpha(val);
        updateDispatch(category, val);
    }

    let handleUpdateCategory = (val) => {
        setCategory(val);
        updateDispatch(val, alpha);
    }



    const renderSingerList = () => {
        const list = singerList? singerList.toJS(): [];
        return (
            <List>
                {
                    list.map((item, index) => {
                        return (
                            <ListItem key={item.accountId+""+index}>
                                <div className="img_wrapper">
                                    <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
                                </div>
                                <span className="name">{item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    }

    return (
        <div>
            <NavContainer>
                <Horizen
                    list={categoryTypes}
                    title={"categories(default)"}
                    handleClick={(val) => handleUpdateCategory(val)}
                    oldVal={category}
                ></Horizen>
                <Horizen
                    list={alphaTypes}
                    title={"alphaTypes:"}
                    handleClick={(val) => handleUpdateAlpha(val)}
                    oldVal={alpha}
                ></Horizen>
            </NavContainer>
            <ListContainer>
                <Scroll>
                    { renderSingerList() }
                </Scroll>
            </ListContainer>
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
                console.log("done");

                dispatch(getHotSingerList());
            }else {
                dispatch(getSingerList(category, alpha));
            }
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers));