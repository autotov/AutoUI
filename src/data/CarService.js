import React, {useEffect, useState} from 'react';

function getCars() {
    const [backendData, setBackendData] = useState([{}])


    useEffect(() => {
        fetch("/cars").then(
            response => response.json()
        ).then(
            data => {
                setBackendData(data)
            }
        )
    });

    console.log("backendData = ")
    console.log(backendData)

    return backendData
}

export default getCars;