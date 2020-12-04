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
                        <div className="fig-name"> {item.name}</div>
                        <div className="num-parts"> Parts : {item.num_parts}</div>
                        <Link to={{
                            pathname: '/detail',
                            search: '?fig_num=' + item.fig_num,
                            state: { figNum: item.fig_num }
                        }}>
                            
                            <div className="frame">
                                <img src={item.image_url} alt="" className="image" /> 
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
            <br></br>
            <PageNavbar />
            <br></br>
            <div className="list-wrapper">
            <div className="figureTitle">LEGO MINIFIGURES IN THE THEME</div>   

                <div className="minifigsContainter">
                    {minifigs}
                </div>
            </div>
        </div>
    )

})