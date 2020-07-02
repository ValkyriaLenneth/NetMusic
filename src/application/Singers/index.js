import React, { useState } from "react";
import Horizen from "../../baseUI/horizen-item";
import {alphaTypes, categoryTypes} from '../../api/config';
import { NavContainer, List, ListContainer, ListItem } from "./style";
import Scroll from "../../baseUI/scroll";

function Singers(props) {

    let [category, setCategory] = useState('');
    let [alpha, setAlpha] = useState ('');

    let handleUpdateAlpha = (val) => {
        setAlpha(val);
    }

    let handleUpdateCategory = (val) => {
        setCategory(val);
    }

    // mock data
    const singerList = [1, 2,3, 4,5,6,7,8,9,10,11,12,13,14,15,16].map(item => {
        return {
            picUrl: "https://p2.music.126.net/uTwOm8AEFFX_BYHvfvFcmQ==/109951164232057952.jpg",
            name: "隔壁老樊",
            accountId: 277313426,
        }
    });

    const renderSingerList = () => {
        return (
            <List>
                {
                    singerList.map((item, index) => {
                        return (
                            <ListItem key={item.accountId+""+index}>
                                <div className="img_wrapper">
                                    <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
                                </div>
                                <span className="name">{item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    }

    return (
        <div>
            <NavContainer>
                <Horizen
                    list={categoryTypes}
                    title={"categories(default)"}
                    handleClick={handleUpdateCategory}
                    oldVal={category}
                ></Horizen>
                <Horizen
                    list={alphaTypes}
                    title={"alphaTypes:"}
                    handleClick={handleUpdateAlpha}
                    oldVal={alpha}
                ></Horizen>
            </NavContainer>
            <ListContainer>
                <Scroll>
                    { renderSingerList() }
                </Scroll>
            </ListContainer>
        </div>

    )
}

export default React.memo(Singers);