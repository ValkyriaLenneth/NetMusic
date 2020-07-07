import React, { useState, useCallback, useRef } from "react";
import { Container, Menu, TopDesc, SongList, SongItem } from "./style";
import { CSSTransition } from "react-transition-group";
import Header from "../../baseUI/header";
import Scroll from "../../baseUI/scroll";
import { getCount, getName } from "../../api/utils";
import style from '../../assets/global-style';

export const HEADER_HEIGHT = 45;


function Album(props) {
    const [showStatus, setShowStatus] = useState(true);
    const [title, setTitle] = useState("Album");
    const [isMarquee, setIsMarquee] = useState(false);

    //mock 数据
    const currentAlbum = {
        creator: {
            avatarUrl: "http://p1.music.126.net/O9zV6jeawR43pfiK2JaVSw==/109951164232128905.jpg",
            nickname: "浪里推舟"
        },
        coverImgUrl: "http://p2.music.126.net/ecpXnH13-0QWpWQmqlR0gw==/109951164354856816.jpg",
        subscribedCount: 2010711,
        name: "听完就睡，耳机是天黑以后柔软的梦境",
        tracks:[
            {
                name: "我真的受伤了",
                ar: [{name: "张学友"}, {name: "周华健"}],
                al: {
                    name: "学友 热"
                }
            },
            {
                name: "我真的受伤了",
                ar: [{name: "张学友"}, {name: "周华健"}],
                al: {
                    name: "学友 热"
                }
            },
            {
                name: "我真的受伤了",
                ar: [{name: "张学友"}, {name: "周华健"}],
                al: {
                    name: "学友 热"
                }
            },
            {
                name: "我真的受伤了",
                ar: [{name: "张学友"}, {name: "周华健"}],
                al: {
                    name: "学友 热"
                }
            },
            {
                name: "我真的受伤了",
                ar: [{name: "张学友"}, {name: "周华健"}],
                al: {
                    name: "学友 热"
                }
            },
            {
                name: "我真的受伤了",
                ar: [{name: "张学友"}, {name: "周华健"}],
                al: {
                    name: "学友 热"
                }
            },
            {
                name: "我真的受伤了",
                ar: [{name: "张学友"}, {name: "周华健"}],
                al: {
                    name: "学友 热"
                }
            },
            {
                name: "我真的受伤了",
                ar: [{name: "张学友"}, {name: "周华健"}],
                al: {
                    name: "学友 热"
                }
            },
            {
                name: "我真的受伤了",
                ar: [{name: "张学友"}, {name: "周华健"}],
                al: {
                    name: "学友 热"
                }
            },
            {
                name: "我真的受伤了",
                ar: [{name: "张学友"}, {name: "周华健"}],
                al: {
                    name: "学友 热"
                }
            },
        ]
    }

    const handleBack = () => {
        setShowStatus(false);
    }

    const headerEl = useRef();

    const handleScroll = (pos) => {
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
    };


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
                    title={title}
                    handleClick={handleBack}
                    ref={headerEl}
                    isMarquee={isMarquee}
                >
                </Header>
                <Scroll bounceTop={false} onScroll={handleScroll}>
                    <div>
                        <TopDesc background={currentAlbum.coverImgUrl}>
                            <div className="background">
                                <div className="filter"></div>
                            </div>
                            <div className="img_wrapper">
                                <div className="decorate"></div>
                                <img src={currentAlbum.coverImgUrl} alt=""/>
                                <div className="play_count">
                                    <i className="iconfont play">&#xe885;</i>
                                    <span className="count">{Math.floor (currentAlbum.subscribedCount/1000)/10} 万 </span>
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
                        <SongList>
                            <div className="first_line">
                                <div className="play_all">
                                    <i className="iconfont">&#xe6e3;</i>
                                    <span>Play all <span className="sum">(all: {currentAlbum.tracks.length})</span></span>
                                </div>
                                <div className="add_list">
                                    <i className="iconfont">&#xe62d;</i>
                                    <span>Collect({getCount(currentAlbum.subscribedCount)}</span>
                                </div>
                            </div>
                            <SongItem>
                                {
                                    currentAlbum.tracks.map( (item, index) => {
                                        return (
                                            <li key={index}>
                                                <span className="index">{index+1}</span>
                                                <div className="info">
                                                    <span>{item.name}</span>
                                                    <span>
                                                            {getName(item.ar)} - {item.al.name}
                                                        </span>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </SongItem>
                        </SongList>
                    </div>

                </Scroll>

            </Container>
        </CSSTransition>
        )
}

export default React.memo(Album);