import React from "react";
import { SongList, SongItem } from './style';
import { getName } from "../../api/utils";
import { connect } from 'react-redux';
import { changePlayList, changeCurrentIndex, changeSequencePlayList } from "../player/store/actioncreator";

const SongsList = React.forwardRef(((props, refs) => {
    const { collectCount, showCollect, songs } = props;
    const totalCount = songs.length;

    const { changePlayListDispatch, changeCurrentIndexDispatch, changeSequencePlayListDispatch } = props;
    const { musicAnimation } = props;


    const selectItem = (e, index) => {
        changePlayListDispatch(songs);
        changeSequencePlayListDispatch(songs);
        changeCurrentIndexDispatch(index);
        musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
    }

    let songList = (list) => {
        let res = [];
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            res.push(
                <li key={item.id} onClick={(e) => selectItem(e, i)}>
                    <span className="index">{i + 1}</span>
                    <div className="info">
                        <span>{item.name}</span>
                        <span>
                            { item.ar? getName(item.ar): getName(item.artists)} - { item.al? item.al.name: item.album.name}
                        </span>
                    </div>
                </li>
            )
        }
        return res;
    };

    const collect = count => {
        return (
            <div className="add_list">
                <i className="iconfont">&#xe62d;</i>
                <span>Favor({Math.floor(count / 1000)}K)</span>
            </div>
        )
    }

    return (
        <SongList
            ref={refs}
            showBackground={props.showBackGround}
        >
            <div className="first_line">
                <div className="play_all" onClick={e => selectItem(e, 0)}>
                    <i className="iconfont">&#xe6e3;</i>
                    <span>Play all <span className="sum">(all: {totalCount})</span></span>
                </div>
                { showCollect? collect(collectCount): null }
            </div>
            <SongItem>
                { songList(songs)}
            </SongItem>

        </SongList>
    )
}));

const mapDispatchToProps = (dispatch) => {
    return {
        changePlayListDispatch (data) {
            dispatch(changePlayList(data));
        },
        changeSequencePlayListDispatch(data) {
            dispatch(changeSequencePlayList(data));
        },
        changeCurrentIndexDispatch (data) {
            dispatch(changeCurrentIndex(data));
        }
    }
}

export default connect(null, mapDispatchToProps)(React.memo(SongsList));