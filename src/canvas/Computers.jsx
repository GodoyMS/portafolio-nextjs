import React, { useRef,useMemo } from 'react';

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF,useAnimations, GizmoHelper, GizmoViewport, GizmoViewcube } from "@react-three/drei";
import CanvasLoader from "./Loader";
import { useFrame,useThree } from '@react-three/fiber';
import { AnimationMixer } from 'three';

const Computers = ({ isMobile }) => {
  const man = useGLTF("./dancing_man.glb");
  const computer=useGLTF("./desktop_pc/scene.gltf");
  const rug= useGLTF("./rug.glb");
  const desk=useGLTF("./desk.glb");
  console.log(man)
  const meshRef = useRef();
  const { actions,animations } = useAnimations(man.animations, meshRef);

  useEffect(() => {
    actions['Take 001'].reset().play();
   
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
      
      <pointLight position={[20,20,20]} color="##3399ff" castShadow intensity={1}   />

      

    <group ref={meshRef} dispose={null} >
    <mesh 
  
    
  >
   
    <primitive
      object={man.scene}
      scale={isMobile ? 0.015 : 0.02}
      position={isMobile ? [1, -1.25, 0] : [1.5, -2.25, -1]}
      rotation={[0, 2, 0]}
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
       scale={isMobile ? 0.05 : 0.05}
       position={ isMobile? [-1.5, -1.4, 0] :[-1.5, -2.4, 0] }
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
