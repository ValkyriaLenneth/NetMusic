import React from "react";
import { SongList, SongItem } from './style';
import { getName } from "../../api/utils";

const SongsList = React.forwardRef(((props, refs) => {
    const { collectCount, showCollect, songs } = props;
    const totalCount = songs.length;

    const selectItem = (e, index) => {
        console.log(index);
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

    console.log(showCollect)

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

export default React.memo(SongsList);