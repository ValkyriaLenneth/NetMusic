import React from "react";
import { Redirect } from "react-router-dom";
// Components
import Home from "../application/Home";
import Recommend from "../application/Recommend";
import Singers from "../application/Singers";
import Rank from "../application/Rank";

// export default [
//     {
//         path: "/",
//         component: Home,
//         routes: [
//             {
//                 path: "/",
//                 exact: true,
//                 render: () => (
//                     <Redirect to={"/recommend"}/>
//                 )
//             },
//             {
//                 path: "/recommend",
//                 component: Recommend
//             },
//             {
//                 path: "/rank",
//                 component: Rank
//             },
//             {
//                 path: "/singers",
//                 component: Singers,
//             }
//         ]
//     }
// ]

export default [
    {
        path: "/",
        component: Home,
        routes: [
            {
                path: "/",
                exact: true,
                render: () => (
                    <Redirect to={"/recommend"}/> // redirect from Home to recommend
                )
            },
            {
                path: "/recommend",
                component: Recommend,
            },
            {
                path: "/singers",
                component: Singers,
            },
            {
                path: "/rank",
                component: Rank
            }
        ]
    }
]