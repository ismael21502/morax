import React from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useEffect } from 'react';
// function Model({ url }) {
//   const obj = useLoader(OBJLoader, url); // cargar OBJ
//   return <primitive object={obj} />;
// }
// function Model({ url }) {
//   const gltf = useGLTF(url);
//   return <primitive object={gltf.scene} />;
// }
export function Model({ url, angles, opening }) {
  const { scene } = useGLTF(url);
  const degToRad = (deg) => deg * Math.PI / 180;
  useEffect(() => {
    const maxOpeningDeg = 63 / 100
    // Accede a las partes del modelo
    const J1 = scene.getObjectByName("J1")
    const J2 = scene.getObjectByName("J2")
    const J3 = scene.getObjectByName("J3")
    const claw1 = scene.getObjectByName("DriveGear1")
    const claw2 = scene.getObjectByName("DriveGear2")
    const jaw1 = scene.getObjectByName("Jaw1")
    const jaw2 = scene.getObjectByName("Jaw2")
    const limb1 = scene.getObjectByName("Limb1")
    const limb2 = scene.getObjectByName("Limb2")

    // Aplica rotaciones como en tu ejemplo original
    if (J1) J1.rotation.y = degToRad(angles['J1'])
    if (J2) J2.rotation.x = degToRad(angles['J2'])
    if (J3) J3.rotation.x = degToRad(angles['J3'])

    // Rotaciones de la pinza
    if (claw1) claw1.rotation.z = degToRad(opening * maxOpeningDeg + 180) //Reemplazar por el angulo de la pinza
    if (claw2) claw2.rotation.z = degToRad(-opening * maxOpeningDeg) //Reemplazar por el angulo de la pinza
    if (jaw1) jaw1.rotation.z = degToRad(-opening * maxOpeningDeg + 180)
    if (jaw2) jaw2.rotation.z = degToRad(opening * maxOpeningDeg)
    if (limb1) limb1.rotation.z = degToRad(opening * maxOpeningDeg)
    if (limb2) limb2.rotation.z = degToRad(-opening * maxOpeningDeg)
  }, [scene, angles, opening])

  return <primitive object={scene} />;
}
function RobotModel({ angles, opening }) {
  return (
    <div className='w-full h-full border-1 border-solid border-[#4A4A4A] rounded-lg bg-gradient-to-b from-[#0D0D0D] to-[#0F0F0F]'>
      {/* <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 10, -5]} intensity={1} />
        <Model url="/RobotCompleto.glb" angles={angles} opening={opening}/>
        <OrbitControls />
      </Canvas> */}
      <Canvas camera={{ position: [0, 1, 3], fov: 70 }}>
        {/* Luz ambiental básica */}
        <ambientLight intensity={0.01} />

        {/* Luz de entorno tipo "Material Preview" */}
        <Environment preset="city" />

        <Model url="/RobotCompleto.glb" angles={angles} opening={opening} />
        <OrbitControls />
      </Canvas>




    </div>
  );
}

export default RobotModel;
