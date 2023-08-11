import React, { useRef,useMemo } from 'react';

import { Suspense, useEffect, useState } from "react";
import { Canvas,useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF,useAnimations, GizmoHelper, GizmoViewport, GizmoViewcube } from "@react-three/drei";
import CanvasLoader from "./Loader";
import { useFrame } from '@react-three/fiber';
import { AnimationMixer } from 'three';

const Computers = ({ isMobile }) => {
  const computer=useGLTF("./desktop_pc/low_poly_gaming_desk_refactored.glb");
  const pcGaming=useGLTF("./pc_gamer/pc_gamer.glb")
  const coolMan=useGLTF("./man/man_in_suit_react.glb");
  const meshRef = useRef();
  const deg2rad = degrees => degrees * (Math.PI / 180);
  useThree(({camera}) => {
    camera.rotation.set(deg2rad(30), 0, 0);
  });

  
  // const { actions } = useAnimations(coolMan.animations, meshRef);

  // useEffect(() => {
  //   actions['salute'].reset().play();
   
  // }, []);
  


    
  return (
    <group scale={0.7} position={isMobile ? [-2,-1.5,0] : [0,-0.5,0]} rotation={[0,0,0]} >

       <hemisphereLight intensity={0.15} groundColor='black' />
       <spotLight
       color={'#3399ff'}
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      
      <pointLight position={[15,20,0]} color="#ffffff" castShadow intensity={1}   />

      
{/*Man*/}
    <group ref={meshRef} dispose={null} >
    <mesh 
  
    
  >
   
    <primitive
      object={coolMan.scene}
      scale={isMobile ? 0.03 : 0.03}
      position={isMobile ? [0, -2.4, -1.5] : [0, -2.4, -1.5]}
      rotation={[0,1.3, 0]}
    />
  </mesh>
    </group>
 
    <group position={isMobile ? [0,0,-1]: [0,0,0]}>
    <mesh>
      <primitive
        object={computer.scene}
        scale={isMobile ? 2.5 : 2.5}
        position={ isMobile? [-3, -0.5, 0] :[-3, -0.5, 0] }
        rotation={ [0, 1.7, 0]}

      />
    </mesh>    

       {/*PC gaming*/}

       <mesh>      
     <primitive
       object={pcGaming.scene}
       scale={isMobile ? 3 : 3}
       position={ isMobile? [-3.5, 0.85, 2.5] :[-3.5, 0.85, 2.5] }
       rotation={ [0, 1.7, 0]}

     />
   </mesh>

    </group>
   



    
    {/* <mesh  position={isMobile ? [1,-1.45,0] : [-1.7,-1.5,0.5]} rotation={[Math.PI / 2, 0, 0]}castShadow receiveShadow >
                <boxGeometry args={[2.2,4.2,1.8]}/>
                
                <meshStandardMaterial color="#ffff" envMapIntensity={0.5} roughness={0.2} metalness={0} />
     </mesh> */}
    </group>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

 

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

    const memoizedCanvas = useMemo(
    () => (
      <Canvas
   
      
      shadows
      dpr={[1, 2]}
      
      camera={{ position: isMobile ? [30, 3, 5]:[20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
       
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile}/>
      </Suspense>

      <Preload all />
    </Canvas>
    )
  );



  return memoizedCanvas;
};

export default ComputersCanvas;
