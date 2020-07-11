import React, {useCallback, useEffect, useRef, useState} from "react";
import { CSSTransition } from "react-transition-group";
import { Container, ImgWrapper, BgLayer, CollectButton, SongListWrapper } from './style';
import Header from "../../baseUI/header";
import Scroll from "../../baseUI/scroll";
import SongsList from "../SongsList";
import { HEADER_HEIGHT } from "../Album";
import { connect } from 'react-redux';
import {changeEnterLoading, getSingerInfo} from "./store/actionCreator";
import Loading from "../../baseUI/loading";

function Singer(props) {
    const [showStatus, setShowStatus] = useState(true);

    const setShowStatusFalse = useCallback(() => {
        setShowStatus(false);
    },[]);

    const {
        artist: immutableArtist,
        songs: immutableSongs,
        loading
    } = props;

    const { getSingerDataDispatch } = props;

    const artist = immutableArtist.toJS();
    const songs = immutableSongs.toJS();



    const collectButton = useRef();
    const imageWrapper = useRef();
    const songScrollWrapper = useRef();
    const songScroll = useRef();
    const layer = useRef();
    const header = useRef();
    const initialHeight = useRef(0);

    const OFFSET = 5;

    useEffect(() => {
        const id = props.match.params.id;
        getSingerDataDispatch(id);
        let h = imageWrapper.current.offsetHeight;
        songScrollWrapper.current.style.top = `${h - OFFSET}px`;
        initialHeight.current = h;
        layer.current.style.top = `${h - OFFSET}px`;
        songScroll.current.refresh();
        //eslint-disable-next-line
    }, []);

    const handleScroll = useCallback(pos => {
        let height = initialHeight.current;
        const newY = pos.y;
        const imageDOM = imageWrapper.current;
        const buttonDOM = collectButton.current;
        const headerDOM = header.current;
        const layerDOM = layer.current;
        const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;

        const percent = Math.abs(newY / height);

        // pull down
        if(newY > 0) {
            imageDOM.style["transform"] = `scale(${1+percent})`;
            buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0`;
            layerDOM.style.top = `${height - OFFSET + newY}px`;
        }
        // pull up until Header
        else if(newY >= minScrollY) {
            layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
            layerDOM.style.zIndex = 1;
            imageDOM.style.paddingTop = '75%';
            imageDOM.style.height = 0;
            imageDOM.style.zIndex = -1;
            buttonDOM.style['transform'] = `translate3d(0, ${newY}px, 0`;
            buttonDOM.style['opacity'] = `${1 - percent * 2}`;
        }
        // pull up beyond Header
        else if (newY < minScrollY) {
            layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
            layerDOM.style.zIndex = 1;
            headerDOM.style.zIndex = 100;
            imageDOM.style.height = `${HEADER_HEIGHT}px`;
            imageDOM.style.paddingTop = 0;
            imageDOM.style.zIndex = 99;
        }
    },[]);

    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            classNames="fly"
            appear={true}
            unmountOnExit
            onExited={props.history.goBack}
        >
            <Container>
                <Header
                    title={artist.name}
                    handleClick={setShowStatusFalse}
                    ref={header}
                >
                </Header>
                <ImgWrapper
                    bgUrl={artist.picUrl}
                    ref={imageWrapper}
                >
                    <div className="filter">
                    </div>
                </ImgWrapper>
                <CollectButton
                    ref={collectButton}
                >
                    <i className="iconfont">&#xe62d;</i>
                    <span className="text">Favor</span>
                </CollectButton>
                <BgLayer ref={layer}></BgLayer>
                <SongListWrapper
                    ref={songScrollWrapper}
                >
                    <Scroll
                        ref={songScroll}
                        onScroll={handleScroll}
                    >
                        <SongsList
                            songs={songs}
                            showCollect={true}
                        >

                        </SongsList>
                    </Scroll>
                </SongListWrapper>
                { loading? (<Loading></Loading>): null}
            </Container>
        </CSSTransition>
    )
}

const mapStateToProps = state => ({
    artist: state.getIn(['singerInfo', 'artist']),
    songs: state.getIn(['singerInfo', 'songsOfArtist']),
    loading: state.getIn(['singerInfo', 'loading']),
});

const mapDispatchToProps = dispatch => {
    return {
        getSingerDataDispatch (id) {
            dispatch(changeEnterLoading(true));
            dispatch(getSingerInfo(id));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer));