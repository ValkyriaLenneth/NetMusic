import React, { useEffect } from "react";
import { connect } from 'react-redux';
import {getRankList} from "./redux";
import Loading from "../../baseUI/loading";
import { List, ListItem, Container, SongList} from "./style";
import Scroll from "../../baseUI/scroll";
import { EnterLoading } from './../Singers/style';
import { filterIndex, filterIdx } from '../../api/utils';
import { renderRoutes } from "react-router-config";

function Rank(props) {

    const { rankList: list, loading } = props;
    const { getRankListDataDispatch } = props;
    let rankList = list ? list.toJS() : [];

    useEffect( () => {
        if(!rankList.length){
            getRankListDataDispatch();
        }
    }, []);

    const enterDetail = (detail) => {
        props.history.push(`/rank/${detail.id}`);
    }

    let globalStartIndex = filterIndex (rankList);
    let officialList = rankList.slice(0, globalStartIndex);
    let globalList = rankList.slice(globalStartIndex);

    const renderSongList = (list) => {

        return list.length? (
            <SongList>
                {
                    list.map ((item, index) =>{
                            return <li key={index}>{index+1}.{item.first} - {item.second}</li>
                        }
                    )
                }
            </SongList>
        ): null;
    }

    const renderRankList = (list, global) => {
        return (
            <List globalRank={global}>
                {
                    list.map((item) => {
                        return (
                            <ListItem
                            key={item.coverImgId}
                            tracks={item.tracks}
                            onClick={() => enterDetail(item)}
                            >
                                <div className="image_wrapper">
                                    <img src={item.coverImgUrl} alt=""/>
                                    <div className="decorate"></div>
                                    <span className="update_frequency">{item.updateFrequency}</span>
                                </div>
                                { renderSongList (item.tracks) }
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    }



    let displayStyle = loading? {"display": "none"}: {"display": ""};


    return (
        <Container>
            <Scroll>
                <div>
                    <h1 className="official" style={displayStyle}>Official Rank</h1>
                    { renderRankList (officialList) }
                    <h1 className="global"style={displayStyle}>Global Rank</h1>
                    { renderRankList (globalList, true) }
                    { loading? <EnterLoading><Loading></Loading></EnterLoading>: null }
                </div>
            </Scroll>
            { renderRoutes (props.route.routes) }
        </Container>
    )
}

const mapStateToProps = (state) => ({
    rankList: state.getIn(['rank', 'rankList']),
    loading: state.getIn(['rank', 'loading']),
});

const mapDispatchToProps = (dispatch) => {
    return {
        getRankListDataDispatch () {
            dispatch (getRankList());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank));