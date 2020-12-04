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
                <div className="title">LEGO MINIFIGURE</div>
                <div className="sub-title">{minifig.name}</div>
                <div className="main-figure-container">

                    <div className="setframe">
                        <img src={minifig.image_url} alt="" className="image" />
                    </div>
                    <div className="num-parts">Number of Parts: {minifig.num_parts}</div>
                   
                </div>
                <br></br>
                <div className="sub-title">Minifigure in Set</div>
                <div className ="detail-set">
                    <Link to={"/product?set_num=" + set.set_num}>
                        <div className="set-image-frame">
                            <img src={set.image_url} alt="" className="image" />
                        </div>
                    </Link> 
                    <div className ="otherSetName"> {set.name} </div>
                </div>
                <div className="sub-title">Find All Minifigures in The Set</div>
                <div className="relative-image">
                    {relative.filter(item => item.image_url !== null).map(item =>
                        <div className="otherfigures">
                            <Link to={"/detail?set_num=" + item.fig_num}>
                                <div className = "otherFigureframe" onClick={() => setFigNum(item.fig_num)}>
                                    <img key={item.fig_num} src={item.image_url}/> 
                                    
                                </div>
                                </Link>
                                <div className ="otherFigureName"> {item.name} </div>
                        </div> )   
                    }
                </div>
            </div>
        </div>
    )
})