import React, { useRef,useMemo } from 'react';

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF,useAnimations, GizmoHelper, GizmoViewport, GizmoViewcube } from "@react-three/drei";
import CanvasLoader from "./Loader";
import { useFrame,useThree } from '@react-three/fiber';
import { AnimationMixer } from 'three';

const Computers = ({ isMobile }) => {
  const computer=useGLTF("./desktop_pc/scene.gltf");
  const rug= useGLTF("./shaggy_rug.glb");
  const desk=useGLTF("./desk.glb");
  const coolMan=useGLTF("./cool_man.glb");
  const meshRef = useRef();
  const { actions } = useAnimations(coolMan.animations, meshRef);

  useEffect(() => {
    actions['salute'].reset().play();
   
  }, []);
  


    
  return (
    <group position={[0,0,0]} rotation={[0,0,0]} >

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
      
      <pointLight position={[15,20,0]} color="##3399ff" castShadow intensity={1}   />

      
{/*Man*/}
    <group ref={meshRef} dispose={null} >
    <mesh 
  
    
  >
   
    <primitive
      object={coolMan.scene}
      scale={isMobile ? 1.5 : 2}
      position={isMobile ? [0, -1.4, -1.5] : [3, -2.4, -1.5]}
      rotation={[0,1.3, 0]}
    />
  </mesh>
    </group>
 

    <mesh>
     
      
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.2 : 0.3}
        position={ isMobile? [-1, 0, -0.3] :[-1.5, -0.5, 0] }
        rotation={ [0, 0, 0]}

      />
    </mesh>

    {/*Rug*/}

    <mesh>      
     <primitive
       object={rug.scene}
       scale={isMobile ? 0.5 : 0.7}
       position={ isMobile? [-1.5, -1.4, 0] :[0, -2.4, 0] }
       rotation={ [0, 0, 0]}

     />
   </mesh>

    {/*Desk*/}

    <mesh>      
     <primitive
       object={desk.scene}
       scale={isMobile ? 0.007: 0.01}
       position={ isMobile? [-1.2, -1.25, 0] :[-1.5, -2.35, 0.5] }
       rotation={ [0, 1.58, 0]}

     />
   </mesh>
    
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
      
      camera={{ position: [20, 3, 5], fov: 25 }}
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
