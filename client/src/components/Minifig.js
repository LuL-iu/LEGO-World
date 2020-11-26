import PageNavbar from './PageNavbar'
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import '../style/Minifig.css'

export default () => {

    const [minifigs, setMinifigs] = useState([])

    useEffect(() => {
        async function fetchData() {
            let ret = await requestServer()

            let assemled = ret.filter(item => item.image_url !== null).map(item => {

                return (
                    <div key={item.fig_num} className="each">
                        <Link to={{
                            pathname: '/detail',
                            search: '?fig_num=' + item.fig_num,
                            state: { figNum: item.fig_num }
                        }}>
                            <div className="fig-name"> Id : {item.fig_num}</div>
                            <div className="num-parts"> Parts : {item.num_parts}</div>
                            <div className="frame">
                                <img src={item.image_url} alt="centered image" className="image" />
                            </div>
                        </Link>
                    </div>

                )
            })
            setMinifigs(assemled)
        }
        fetchData()
    }, [])

    async function requestServer(figNum = 'all') {

        return fetch(`http://localhost:8081/minifig/${figNum}`, { method: 'GET' }).then(res => {
            return res.json();
        })
    }

    return (

        <div className="minifig">
            <PageNavbar />

            <div className="list-wrapper">
                <h1>All minifigs</h1>

                <div className="list">
                    {minifigs}
                </div>
            </div>
        </div>
    )
}