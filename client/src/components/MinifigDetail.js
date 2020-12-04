import PageNavbar from './PageNavbar'
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom'
import '../style/MinifigDetail.css'

export default withRouter((props) => {
    const reqParam = props.location.search.split('=')[1]
    const [figNum, setFigNum] = useState(reqParam)
    const [minifig, setMiniFig] = useState({})
    const [actor, setActor] = useState({})
    const [set, setSet] = useState({})
    const [relative, setRelative] = useState([])

    useEffect(() => {
        async function getData() {
            console.log(reqParam)
            console.log(figNum)
            let res = await getMinifigById(figNum)
            if (res.length > 0) {
                setMiniFig(res[0])
            }
            let actor = await getActor(res[0].fig_num)
            if (actor.length > 0) {
                setActor(actor[0])
            }
            let set = await querySet(res[0].fig_num)
            
            if (set.length > 0) {
                setSet(set[0])
            }

            let relative = await querySetRelative(set[0].set_num)
            if (relative.length > 0) {
                setRelative(relative)
            }
            console.log("HELLO");
            console.log(relative);

        }

        getData()
    }, [figNum])


    async function getMinifigById(figNum) {

        return fetch(`http://localhost:8081/minifig/${figNum}`, { method: 'GET' }).then(res => {
            return res.json();
        })
    }

    async function getActor(figNum) {
        return fetch(`http://localhost:8081/minifig/actor/${figNum}`, { method: 'GET' }).then(res => {
            return res.json();
        })
    }

    async function querySet(figNum) {
        return fetch(`http://localhost:8081/minifig/set/${figNum}`, { method: 'GET' }).then(res => {
            return res.json();
        })
    }

    async function querySetRelative(setNum) {
        return fetch(`http://localhost:8081/sets/relative/${setNum}`, { method: 'GET' }).then(res => {
            return res.json();
        })
    }

    return (


        <div className="minifig-detail">
            <PageNavbar></PageNavbar>

            <div className="main-wrapper">
                <div className="detail-container" style={{ 'textAlign': 'center', 'marginTop': '100px' }}>

                    <div className="frame">
                        <img src={minifig.image_url} alt="centered image" className="image" style={{ 'width': '300px', 'height': '300px' }} />
                    </div>
                    <div className="name" style={{ 'fontSize': '20px' }}>Name: {minifig.name}</div>

                    <div className="actor" style={{ 'fontSize': '20px' }}>Actor: {actor.name}</div>
                </div>

                <div className="detail-container">
                    <Link to={"/product?set_num=" + set.set_num}>
                        <div className="set-image">
                        
                            <img src={set.image_url} alt="centered image" className="image" />
                            </div>
                       
                    </Link>
                    <div className="relative-image">
                    <div className="setsContainer">
                        {
                            relative.filter(item => item.image_url !== null).map(item => <Link to={"/detail?fig_num=" + item.fig_num}><div onClick={() => setFigNum(item.fig_num)}><img key={item.fig_num} src={item.image_url}/> </div></Link>)
                        }
                    </div>
                    </div>
                </div>
            </div>

        </div>
    )
})