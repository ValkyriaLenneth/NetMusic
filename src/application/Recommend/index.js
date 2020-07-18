import React, { useEffect } from "react";
import Slider from '../../components/slider';
import RecommendList from '../../components/list'
import Scroll from "../../baseUI/scroll";
import { Content } from './style.js'
import * as actionTypes from './store/actionCreator';
import { connect } from "react-redux";
import { forceCheck } from 'react-lazyload';
import Loading from "../../baseUI/loading";
import {renderRoutes} from "react-router-config";


function Recommend(props) {
    const { bannerList, recommendList,enterLoading, songsCount } = props;

    const { getBannerDataDispatch, getRecommendDataDispatch } = props;

    useEffect(() => {
        if(!bannerList.size) getBannerDataDispatch();
        if(!recommendList.size) getRecommendDataDispatch();
    }, []);

    const bannerListJS = bannerList? bannerList.toJS(): [];
    const recommendListJS = recommendList? recommendList.toJS(): [];

    return (
        <Content play={songsCount}>
            <Scroll className="list" onScroll={forceCheck}>
                <div>
                    <Slider bannerList={bannerListJS}/>
                    <RecommendList recommendList={recommendListJS}/>
                </div>
            </Scroll>
            {enterLoading? <Loading></Loading>: null}
            { renderRoutes(props.route.routes) }
        </Content>
    )
}

const mapStateToProps = (state) => ({
    bannerList: state.getIn(['recommend', 'bannerList']),
    recommendList: state.getIn(['recommend', 'recommendList']),
    enterLoading: state.getIn(['recommend', 'enterLoading']),
    songsCount: state.getIn(['player', 'playList']).size,
});

const mapDispatchToProps = (dispatch) => {
    return {
        getBannerDataDispatch () {
            dispatch (actionTypes.getBannerList());
        },
        getRecommendDataDispatch () {
            dispatch (actionTypes.getRecommendList());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));