import PageNavbar from './PageNavbar'
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom'

export default withRouter((props) => {
    console.log()
    const reqParam = props.location.search.split('=')[1]
    const [figNum, setFigNum] = useState(reqParam)
    const [minifig, setMiniFig] = useState({})
    const [actor, setActor] = useState({})

    useEffect(() => {
        async function getData() {
            let res = await getMinifigById(figNum)
            if (res.length <= 0) return
            setMiniFig(res[0])
            let actor = await getActor(res[0].fig_num)
            if (actor.length <= 0) return
            setActor(actor[0])
           
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

    return (


        <div className="minifig-detail">
            <PageNavbar></PageNavbar>

            <div style={{'textAlign': 'center', 'marginTop': '100px'}}>
               
                <div className="frame">
                    <img src={minifig.image_url} alt="centered image" className="image" style={{'width': '300px', 'height': '300px'}}/>
                </div>
                <div className="name" style={{'fontSize': '24px'}}>Name: {minifig.name}</div>
                
    <div className="actor" style={{'fontSize': '24px'}}>Actor: {actor.name}</div>
            </div>
        </div>
    )
})