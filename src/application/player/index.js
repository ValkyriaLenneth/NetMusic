import React, { useState, useEffect, useRef } from "react";
import { connect } from 'react-redux';
import { changeCurrentIndex, changeCurrentSong, changeFullScreen, changePlayingState, changePlayList, changePlayMode, changeSequencePlayList, changeShowPlayList} from './store/actioncreator';
import MiniPlayer from "./miniPlayer";
import NormalPlayer from "./normalPlayer";
import { getSongUrl, isEmptyObject, findIndex,shuffle } from "../../api/utils";
import Toast from "../../baseUI/toast";
import {playMode} from "../../api/config";
import PlayList from "./play-List";
import { getLyricRequest } from "../../api/request";

function Player (props) {
    const { fullScreen, playing, currentIndex, currentSong:immutableCurrentSong,playList:immutablePlayList, mode, sequencePlayList:immutableSequencePlayList } = props;
    const { toggleFullScreenDispatch, togglePlayingDispatch, changeCurrentIndexDispatch, changeCurrentDispatch, changePlayListDispatch, changeModeDispatch, togglePlayListDispatch } = props;

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

    const [preSong, setPreSong] = useState({});
    const [modeText, setModeText] = useState("");

    const playList = immutablePlayList.toJS();
    const sequencePlayList = immutableSequencePlayList.toJS();
    const currentSong = immutableCurrentSong.toJS();

    const audioRef = useRef();
    const toastRef = useRef();
    const currentLyric = useRef();

    const songReady = useRef(true);

    useEffect(() => {
        if( currentIndex === -1 ||
            !playList[currentIndex] ||
            playList[currentIndex].id === preSong.id ||
            !playList.length ||
            !songReady
        ) return;
        songReady.current = false;
        let current = playList[currentIndex];
        setPreSong(current);
        changeCurrentDispatch(current);
        audioRef.current.src=getSongUrl(current.id);
        setTimeout(() => {
            audioRef.current.play().then(() => {
                songReady.current = true;
            });
        });
        togglePlayingDispatch(true);
        getLyric(current.id);
        setCurrentTime(0);
        setDuration((current.dt / 1000) | 0);

    },[playList, currentIndex]);

    useEffect(() => {
        playing? audioRef.current.play(): audioRef.current.pause();
    }, [playing]);

    const clickPlaying = (e, state) => {
        e.stopPropagation();
        togglePlayingDispatch(state);
    }

    const changeMode = () => {
        let newMode = (mode + 1) % 3;
        if (newMode === 0) {
            // sequence
            changePlayListDispatch(sequencePlayList);
            let index = findIndex(currentSong, sequencePlayList);
            changeCurrentIndexDispatch(index);
            setModeText("sequnence");
        } else if (newMode === 1) {
            // loop
            changePlayListDispatch(sequencePlayList);
            setModeText("loop");
        } else if (newMode === 2) {
            // random
            let newList = shuffle(sequencePlayList);
            let index = findIndex(currentSong, newList);
            changePlayListDispatch(newList);
            changeCurrentIndexDispatch(index);
            setModeText("random");
        }
        changeModeDispatch(newMode);
        toastRef.current.show();
    }

    const updateTime = e => {
        setCurrentTime(e.target.currentTime);
    };

    const onProgressChange = curPercent => {
        const newTime = curPercent * duration;
        setCurrentTime(newTime);
        audioRef.current.currentTime = newTime;
        if(!playing) {
            togglePlayingDispatch(true);
        }
    }

    const handleLoop = () => {
        audioRef.current.currentTime = 0;
        changePlayingState(true);
        audioRef.current.play();
    }

    const handlePrev = () => {
        if (playList.length === 1) {
            handleLoop();
            return;
        }
        let index = currentIndex - 1;
        if (index < 0) index = playList.length - 1;
        if (!playing) togglePlayingDispatch(true);
        changeCurrentIndexDispatch(index);
    };

    const handleNext = () => {
        if(playList.length === 1) {
            handleLoop();
            return;
        }
        let index = currentIndex + 1;
        if (index === playList.length) index = 0;
        if (!playing) togglePlayingDispatch(true);
        changeCurrentIndexDispatch(index);
    }

    const handleEnd = () => {
        if (mode === playMode.loop) {
            handleLoop();
        } else {
            handleNext();
        }
    }

    const getLyric = id => {
        let lyric = "";
        if (currentLyric.current) {
            currentLyric.current.stop();
        }
        setTimeout(() => {
            songReady.current = true;
        }, 3000);
        getLyricRequest(id).then(data => {
            console.log(data);
            lyric = data.lrc.lyric;

            if(!lyric) {
                currentLyric.current = null;
                return;
            }
        }).catch (() => {
            songReady.current = true;
            audioRef.current.play();
        })
    }

    return (
        <div>
            {
                isEmptyObject(currentSong)? null:
                    <MiniPlayer
                        song={currentSong}
                        fullScreen={fullScreen}
                        toggleFullScreen={toggleFullScreenDispatch}
                        playing={playing}
                        clickPlaying={clickPlaying}
                        percent={percent}
                        togglePlayList = {togglePlayListDispatch}
                    />
            }
            {
                isEmptyObject(currentSong)? null:
                    <NormalPlayer
                        song={currentSong}
                        fullScreen={fullScreen}
                        toggleFullScreen={toggleFullScreenDispatch}
                        playing={playing}
                        clickPlaying={clickPlaying}
                        percent={percent}
                        duration={duration}
                        currentTime={currentTime}
                        onProgressChange={onProgressChange}
                        handlePrev={handlePrev}
                        handleNext={handleNext}
                        mode={mode}
                        changeMode={changeMode}
                        togglePlayList = {togglePlayListDispatch}
                    />
            }
            <audio  ref={audioRef}
                onTimeUpdate={updateTime}
                onEnded={handleEnd}
            />
            <PlayList/>
            <Toast text={modeText} ref={toastRef}/>
        </div>
    )
}

const mapStateToProps = state => ({
    fullScreen: state.getIn(['player', 'fullScreen']),
    playing: state.getIn(['player', 'playing']),
    currentSong: state.getIn(['player', 'currentSong']),
    showPlayList: state.getIn(['player', 'showPlayList']),
    mode: state.getIn(['player', 'mode']),
    currentIndex: state.getIn(['player', 'currentIndex']),
    playList : state.getIn(['player', 'playList']),
    sequencePlayList: state.getIn(['player','sequencePlayList']),
});

const mapDispatchToProps = dispatch => {
    return {
        togglePlayingDispatch (data) {
            dispatch(changePlayingState(data));
        },
        toggleFullScreenDispatch (data) {
            dispatch(changeFullScreen(data));
        },
        togglePlayListDispatch (data) {
            dispatch(changeShowPlayList(data));
        },
        changeCurrentIndexDispatch (data) {
            dispatch(changeCurrentIndex(data));
        },
        changeCurrentDispatch (data) {
            dispatch(changeCurrentSong(data));
        },
        changeModeDispatch (data) {
            dispatch(changePlayMode(data));
        },
        changePlayListDispatch (data) {
            dispatch(changePlayList(data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));