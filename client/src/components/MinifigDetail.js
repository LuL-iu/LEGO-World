import PageNavbar from './PageNavbar'
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom'

export default withRouter((props) => {

    const [figNum, setFigNum] = useState(props.location.state.figNum)
    const [minifig, setMiniFig] = useState({})

    useEffect(() => {
        async function getData() {
            let res = await getMinifigById(figNum)
            if (res) {
                setMiniFig(res[0])
                getActor(res[0].name)
            }
           
        }

        getData()
    }, [figNum])


    async function getMinifigById(figNum) {

        return fetch(`http://localhost:8081/minifig/${figNum}`, { method: 'GET' }).then(res => {
            return res.json();
        })
    }

    async function getActor(name) {
        return fetch(`http://localhost:8081/minifig-actor/${name}`, { method: 'GET' }).then(res => {
            return res.json();
        })
    }

    return (


        <div className="minifig-detail">
            <PageNavbar></PageNavbar>

            <div style={{'text-align': 'center'}}>
               
                <div className="frame">
                    <img src={minifig.image_url} alt="centered image" className="image" />
                </div>
                <div className="name" style={{'font-size': '24px'}}>Name: {minifig.name}</div>
                <div className="actor" style={{'font-size': '24px'}}>Actor: Unknown</div>
            </div>
        </div>
    )
})