import { getHotSingerListRequest, getSingerListRequest } from "../../../api/request";
import { CHANGE_SINGER_LIST, CHANGE_ENTER_LOADING, CHANGE_PAGE_COUNT, CHANGE_PULLDOWN_LOADING, CHANGE_PULLUP_LOADING, CHANGE_ALPHA, CHANGE_CATEGORY} from "./constants";
import { fromJS } from "immutable";

// define state changer
export const chagneCategory = (data) => ({
    type: CHANGE_CATEGORY,
    data
});

export const changeAlpha = (data) => ({
    type: CHANGE_ALPHA,
    data
});

export const changeSingerList = (data) => ({
    type: CHANGE_SINGER_LIST,
    data: fromJS(data),
});

export const changeEnterLoading = (data) => ({
    type: CHANGE_ENTER_LOADING,
    data
});

export const changePullUpLoading = (data) => ({
    type: CHANGE_PULLUP_LOADING,
    data
});

export const changePullDownLoading = (data) => ({
    type: CHANGE_PULLDOWN_LOADING,
    data
});

export const changePageCount = (data) => ({
    type: CHANGE_PAGE_COUNT,
    data
});

// define dispatch
export const getHotSingerList = () => {
    return (dispatch) => {
        getHotSingerListRequest(0).then(res => {
            const data = res.artists;
            dispatch(changeSingerList(data));
            dispatch(changeEnterLoading(false));
            dispatch(changePullDownLoading(false));
        }).catch( () => {
            console.log("ERROR: Filed to load Hot Singers list");
        })
    }
};

export const refreshMoreHotSingerList = () => {
    return (dispatch, getState) => {
        const pageCount = getState().getIn(['singers', 'pageCount']);
        const singerList = getState().getIn(['singers', 'singerList']).toJS();
        getHotSingerListRequest(pageCount).then(res => {
            const data = [...singerList, ...res.artists];
            dispatch(changeSingerList(data));
            dispatch(changePullUpLoading(false));
        }).catch( () => {
            console.log("ERROR: Filed to load More Singers List");
        })
    }
};

export const getSingerList = (category, alpha) => {
    console.log("get singer list")
    console.log(category + ":" + alpha);
    return (dispatch, getState) => {
        getSingerListRequest(category, alpha, 0).then( res => {
            const data = res.artists;
            console.log(data);
            dispatch(changeSingerList(data));
            dispatch(changeEnterLoading(false));
            dispatch(changePullDownLoading(false));
        }).catch( () => {
            console.log("ERROR: Filed to load singers list");
        })
    }
}

export const refreshMoreSingerList = (category, alpha) => {
    return (dispatch, getState) => {
        const pageCount = getState().getIn(['singers', 'pageCount']);
        const singerList = getState().getIn(['singers', 'singerList']).toJS();
        getSingerListRequest(category, alpha, pageCount).then( res => {
            const data = [...singerList, ...res.artists];
            dispatch(changeSingerList(data));
            dispatch(changePullUpLoading(false));
        }).catch( () => {
            console.log('ERROR: Filed to load more singers List');
        })
    }
};
