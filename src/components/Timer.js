import React, { useEffect, useState } from 'react'

const Timer = ({duration, setBidTimeOut}) => {

    const [time, setTime] = useState(duration);

    useEffect(()=>{
       if(time>0)
       {
         setTimeout(()=>{
            setTime(time-1000);
        },1000);
       }
       else
       {
        setBidTimeOut(true);
       }
    },[time]);

    const getFormattedTime=(millisecond)=>{
        if(time>0)
        {
            let total_seconds = parseInt(Math.floor(millisecond/1000));
        let total_minutes = parseInt(Math.floor(total_seconds/60));
        let total_hours = parseInt(Math.floor(total_minutes/60));
        let days = parseInt(Math.floor(total_hours/24));

        let seconds = parseInt(total_seconds % 60);
        let minutes = parseInt(total_minutes % 60);
        let hours = parseInt(total_hours % 24);

        return `${days}: ${hours}: ${minutes}: ${seconds}`; 
        }
        else{
            return   `0: 0: 0: 0`;
        }
    }

  return (<div>{getFormattedTime(time)}</div>)
}

export default Timer