import React, {useState, useCallback, useRef, useEffect} from "react";
import { Container, Menu, TopDesc, SongList, SongItem } from "./style";
import { CSSTransition } from "react-transition-group";
import Header from "../../baseUI/header";
import Scroll from "../../baseUI/scroll";
import style from '../../assets/global-style';
import { connect } from 'react-redux';
import { getAlbumList, changeEnterLoading } from "./store/actionCreator";
import { isEmptyObject } from "../../api/utils";
import Loading from "../../baseUI/loading";
import SongsList from "../SongsList";
import MusicNote from "../../baseUI/music-note";

export const HEADER_HEIGHT = 45;

function Album(props) {
    const [showStatus, setShowStatus] = useState(true);
    const [title, setTitle] = useState("Album");
    const [isMarquee, setIsMarquee] = useState(false);
    const headerEl = useRef();

    const id = props.match.params.id;
    const { currentAlbum: currentAlbumImmutable, enterLoading, songsCount } = props;
    const { getAlbumDataDispatch } = props;

    useEffect(() => {
        getAlbumDataDispatch(id);
    }, [getAlbumDataDispatch, id]);

    let currentAlbum = currentAlbumImmutable.toJS();

    const handleBack = useCallback( () => {
        setShowStatus(false);
    })

    const handleScroll = useCallback((pos) => {
        let minScrollY = -HEADER_HEIGHT;
        let percent = Math.abs(pos.y / minScrollY);
        let headerDOM = headerEl.current;
        if(pos.y < minScrollY){
            headerDOM.style.backgroundColor = style["theme-color"];
            headerDOM.style.opacity = Math.min(1, (percent-1)/10);
            setTitle(currentAlbum.name);
            setIsMarquee(true);
        } else{
            headerDOM.style.backgroundColor = "";
            headerDOM.style.opacity = 1;
            setTitle("Album");
            setIsMarquee(false);
        }
    }, [currentAlbum]);

    const renderTopDesc = () => {
        return (
            <TopDesc background={currentAlbum.coverImgUrl}>
                <div className="background">
                    <div className="filter"></div>
                </div>
                <div className="img_wrapper">
                    <div className="decorate"></div>
                    <img src={currentAlbum.coverImgUrl} alt=""/>
                    <div className="play_count">
                        <i className="iconfont play">&#xe885;</i>
                        <span className="count">{Math.floor (currentAlbum.subscribedCount/1000)} K </span>
                    </div>
                </div>
                <div className="desc_wrapper">
                    <div className="title">{currentAlbum.name}</div>
                    <div className="person">
                        <div className="avatar">
                            <img src={currentAlbum.creator.avatarUrl} alt=""/>
                        </div>
                        <div className="name">{currentAlbum.creator.nickname}</div>
                    </div>
                </div>
            </TopDesc>
        )
    }

    const renderMenu = () => {
        return (
            <Menu>
                <div>
                    <i className="iconfont">&#xe6ad;</i>
                    Comment
                </div>
                <div>
                    <i className="iconfont">&#xe86f;</i>
                    Like
                </div>
                <div>
                    <i className="iconfont">&#xe62d;</i>
                    Favor
                </div>
                <div>
                    <i className="iconfont">&#xe606;</i>
                    More
                </div>
            </Menu>
        )
    }

    const musicNoteRef = useRef();

    const musicAnimation = (x, y) => {
        musicNoteRef.current.startAnimation({x,y});
    }


    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            classNames="fly"
            appear={true}
            unmountOnExit
            onExited={props.history.goBack}
        >
            <Container play={songsCount}>
                <Header
                    title={title}
                    handleClick={handleBack}
                    ref={headerEl}
                    isMarquee={isMarquee}
                >
                </Header>
                {
                    !isEmptyObject(currentAlbum)? (
                        <Scroll bounceTop={false} onScroll={handleScroll}>
                            <div>
                                { renderTopDesc() }
                                { renderMenu() }
                               <SongsList
                                songs={currentAlbum.tracks}
                                collectCount={currentAlbum.subscribedCount}
                                showCollect={true}
                                showBackground={true}
                                musicAnimation={musicAnimation}
                               >
                                </SongsList>
                            </div>

                        </Scroll>
                    ): null
                }
                { enterLoading? <Loading></Loading> : null}
                <MusicNote ref={musicNoteRef}/>
            </Container>
        </CSSTransition>
        )
}

const mapStateToProps = state => ({
    currentAlbum: state.getIn(['album', 'currentAlbum']),
    enterLoading: state.getIn(['album', 'enterLoading']),
    songsCount: state.getIn(['player', 'playList']).size,
})

const mapDispatchToProps = dispatch => {
    return {
        getAlbumDataDispatch (id) {
            dispatch (changeEnterLoading(true));
            dispatch (getAlbumList(id));
        },
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));