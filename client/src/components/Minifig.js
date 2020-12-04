import PageNavbar from './PageNavbar'
import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { withRouter } from 'react-router-dom'


import '../style/Minifig.css'

export default withRouter((props) => {

    const [minifigs, setMinifigs] = useState([])
    const params = useParams();
    const [themeID, setthemeID] = useState(params.themeId);

    

    useEffect(() => {
        async function fetchData() {
            let ret = await requestServer(themeID)
            console.log(ret);
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
    }, [themeID])

    async function requestServer(themeID) {
        const res = await fetch(`http://localhost:8081/minifig/theme/${themeID}`, { method: 'GET' });
        return res.json();
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

})