import React, {useEffect, useRef, useState} from "react";
import { getName } from "../../../api/utils";
import { NormalPlayerContainer, Top, Middle, Bottom, Operators, CDWrapper, ProgressWrapper, LyricWrapper, LyricContainer } from './style';
import { CSSTransition } from "react-transition-group";
import animations from 'create-keyframe-animation';
import { prefixStyle, formatPlayTime } from "../../../api/utils";
import ProgressBar from "../../../baseUI/progress-bar";
import {playMode} from "../../../api/config";
import Scroll from "../../../baseUI/scroll";


function NormalPlayer(props) {
    const { song, fullScreen, playing, percent, duration, currentTime, mode } = props;
    const { toggleFullScreen, clickPlaying, onProgressChange, handleNext, handlePrev, changeMode, togglePlayList } = props;
    const { currentLineNum, currentPlayingLyric, currentLyric } = props;

    const transform = prefixStyle('transform');

    const normalPlayerRef = useRef();
    const cdWrapperRef = useRef();
    const currentState = useRef("");
    const lyricScrollRef = useRef();
    const lyricLineRefs = useRef([]);

    useEffect(() => {
        if (!lyricScrollRef.current) return;
        let bScroll = lyricScrollRef.current.getBScroll();
        if(currentLineNum > 5) {
            let lineEl = lyricLineRefs.current[currentLineNum - 5].current;
            bScroll.scrollToElement(lineEl, 1000);
        } else {
            bScroll.scrollTo(0, 0, 1000);
        }
    }, [currentLineNum])

    const _getPosAndScale = () => {
        const targetWidth = 40;
        const paddingLeft = 40;
        const paddingBottom = 30;
        const paddingTop = 80
        const width = window.innerWidth * 0.8;
        const scale = targetWidth / width;
        const x = -(window.innerWidth / 2 - paddingLeft);
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;

        return {
            x,
            y,
            scale
        };
    };

    const enter = () => {
        normalPlayerRef.current.style.display = `block`;
        const {x, y, scale} = _getPosAndScale();
        let animation = {
            0: {
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
            },
            60: {
                transform: `translate3d(0,0,0) scale(1.1)`
            },
            100: {
                transform: `translate3d(0,0,0) scale(1)`
            }
        }
        animations.registerAnimation({
            name: 'move',
            animation,
            presets: {
                duration: 400,
                easing: 'linear',
            }
        });
        animations.runAnimation(cdWrapperRef.current, 'move');
    };

    const afterEnter = () => {
        const cdWrapperDom = cdWrapperRef.current;
        animations.unregisterAnimation('move');
        cdWrapperDom.style.animation = "";
    }

    const leave = () => {
        if(!cdWrapperRef.current) return;
        const cdWrapperDOM = cdWrapperRef.current;
        cdWrapperDOM.style.transition = 'all 0.4s';
        const { x, y, scale} = _getPosAndScale();
        cdWrapperDOM.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    };

    const afterLeave = () => {
        if(!cdWrapperRef.current) return;
        const cdWrapperDOM = cdWrapperRef.current;
        cdWrapperDOM.style.transition = "";
        cdWrapperDOM.style[transform] = "";
        normalPlayerRef.current.style.display = "none";
        currentState.current = "";
    }

    const getPlayMode = () => {
        let content;
        if (mode === playMode.sequence) {
            content = "&#xe625";
        }else if (mode === playMode.loop) {
            content = "&#xe653";
        }else {
            content = "&#xe61b";
        }
        return content;
    }

    const toggleCurrentState = () => {
        if (currentState.current !== "lyric") {
            currentState.current = "lyric";
       } else {
            currentState.current = "";
        }
    }


    return (
        <CSSTransition
            classNames="normal"
            in={fullScreen}
            timeout={400}
            mountOnEnter
            onEnter={enter}
            onEntered={afterEnter}
            onExit={leave}
            onExited={afterLeave}
        >
            <NormalPlayerContainer ref={normalPlayerRef}>
                <div className="background">
                    <img src={song.al.picUrl + "?param=300x300"} width='100%' height='100%' alt=""/>
                </div>
                <div className="background layer"></div>
                <Top className="top">
                    <div className="back" onClick={() => toggleFullScreen(false)}>
                        <i className="iconfont">&#xe662;</i>
                    </div>
                    <h1 className="title">{song.name}</h1>
                    <h1 className="subtitle">{getName(song.ar)}</h1>
                </Top>
                <Middle
                    ref={cdWrapperRef}
                    onClick={toggleCurrentState}
                >
                    <CSSTransition
                        timeout={400}
                        classNames="fade"
                        in={currentState.current !== "lyric"}
                    >
                        <CDWrapper
                            style={{visibility: currentState.current !== "lyric"?  "visible": "hidden"}}
                        >
                            <div className="cd">
                                <img src={song.al.picUrl + '?param=400x400'}  className={`image play ${playing? "": "pause"}`}/>
                            </div>
                            <p className="playing_lyric">{currentPlayingLyric}</p>
                        </CDWrapper>
                    </CSSTransition>
                    <CSSTransition
                        timeout={400}
                        classNames="fade"
                        in={currentState.current === "lyric"}
                    >
                        <LyricContainer>
                            <Scroll ref={lyricScrollRef}>
                                <LyricWrapper
                                    className="lyric_wrapper"
                                    style={{visibility: currentState.current === "lyric" ? "visible" : "hidden"}}
                                >
                                    {
                                        currentLyric
                                            ? currentLyric.lines.map((item, index) => {
                                                lyricLineRefs.current[index] = React.createRef();
                                                return (
                                                    <p
                                                        className={`text ${currentLineNum === index ? "current" : ""}`}
                                                        key={item + index}
                                                        ref={lyricLineRefs.current[index]}
                                                    >
                                                        {item.txt}
                                                    </p>
                                                )
                                            })
                                            : <p className="text pure">Pure Music</p>
                                    }
                                </LyricWrapper>
                            </Scroll>
                        </LyricContainer>
                    </CSSTransition>
                </Middle>
                <Bottom className="bottom">
                    <ProgressWrapper>
                        <span className="time time-l">{formatPlayTime(currentTime)}</span>
                        <div className="progress-bar-wrapper">
                            <ProgressBar
                                percent={percent}
                                percentChange={onProgressChange}
                            />
                        </div>
                        <div className="time time-r">{formatPlayTime(duration)}</div>
                    </ProgressWrapper>
                    <Operators>
                        <div className="icon i-left" onClick={changeMode}>
                            <i className="iconfont "
                               dangerouslySetInnerHTML={{__html: getPlayMode()}}
                            />
                        </div>
                        <div className="icon i-left"><i className="iconfont " onClick={handlePrev}>&#xe6e1;</i></div>
                        <div className="icon  i-center">
                            <i className="iconfont"
                                onClick={e => clickPlaying(e, !playing)}
                               dangerouslySetInnerHTML={{
                                   __html: playing? "&#xe723;": "&#xe731;"
                               }}
                            >
                            </i>
                        </div>
                        <div className="icon  i-right"><i className="iconfont" onClick={handleNext}>&#xe718;</i></div>

                        <div className="icon i-right" onClick={() => togglePlayList(true)}><i className="iconfont ">&#xe640;</i></div>
                    </Operators>
                </Bottom>
            </NormalPlayerContainer>

        </CSSTransition>
    )
}

export default React.memo(NormalPlayer);