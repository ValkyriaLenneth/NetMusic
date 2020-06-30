import React, { useEffect } from "react";
import Slider from '../../components/slider';
import RecommendList from '../../components/list'
import Scroll from "../../baseUI/scroll";
import { Content } from './style.js'
import * as actionTypes from './store/actionCreator';
import { connect } from "react-redux";

function Recommend(props) {
    const { bannerList, recommendList } = props;

    const { getBannerDataDispatch, getRecommendDataDispatch } = props;

    useEffect(() => {
        getBannerDataDispatch();
        getRecommendDataDispatch();
    }, []);

    const bannerListJS = bannerList? bannerList.toJS(): [];
    const recommendListJS = recommendList? recommendList.toJS(): [];

    return (
        <Content>
            <Scroll className="list">
                <div>
                    <Slider bannerList={bannerListJS}/>
                    <RecommendList recommendList={recommendListJS}/>
                </div>
            </Scroll>
        </Content>
    )
}

const mapStateToProps = (state) => ({
    bannerList: state.getIn(['recommend', 'bannerList']),
    recommendList: state.getIn(['recommend', 'recommendList'])
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