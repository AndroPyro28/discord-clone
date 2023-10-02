"use client"

import {Html, useProgress} from '@react-three/drei'
const Loader = () => {
  const {progress} = useProgress()
  return (
    <Html>
      <span className='canvas-loader'>
        {progress.toFixed(2)}%
      </span>
      <p style={{
        fontSize: 14,
        color: '#f1f1f1',
        fontWeight: 800,
        marginTop:40
      }}></p>
    </Html>
  )
}

export default Loader