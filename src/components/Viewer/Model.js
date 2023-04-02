import {
  Suspense,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect
} from 'react';

import { shallow } from 'zustand/shallow';

import { useControls } from 'leva';
import { useFrame, useThree } from '@react-three/fiber';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

import { useData } from '../../stores/data';

function Model({ isHidden }) {
  const { gl } = useThree();

  const {
    buffer,

    scale,

    positionX,
    positionY,
    positionZ,

    rotationX,
    rotationY,
    rotationZ,

    modelIsHidden
  } = useData(
    (state) => ({
      buffer: state.buffer,

      scale: state.scale,

      positionX: state.positionX,
      positionY: state.positionY,
      positionZ: state.positionZ,

      rotationX: state.rotationX,
      rotationY: state.rotationY,
      rotationZ: state.rotationZ,

      modelIsHidden: state.modelIsHidden
    }),
    shallow
  );

  const [scene, setScene] = useState();

  useEffect(() => {
    if (!buffer) return;

    async function parse() {
      const THREE_PATH = `https://unpkg.com/three@0.151.x`;

      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      const KTX2_LOADER = new KTX2Loader().setTranscoderPath(
        `${THREE_PATH}/examples/jsm/libs/basis/`
      );

      dracoLoader.setDecoderPath(`${THREE_PATH}/examples/jsm/libs/draco/gltf/`);
      loader
        .setCrossOrigin('anonymous')
        .setDRACOLoader(dracoLoader)
        .setMeshoptDecoder(MeshoptDecoder)
        .setKTX2Loader(KTX2_LOADER.detectSupport(gl));

      const gltf = await loader.parseAsync(buffer, '');
      console.log('gltf', gltf);

      setScene(gltf?.scene);
    }

    parse();
  }, [buffer, gl]);

  useEffect(() => {
    console.log('scene', scene);
  }, [scene]);

  useFrame(({ clock }, delta) => {
    // return;
  });

  return (
    <>
      <group
        position={[positionX, positionY, positionZ]}
        visible={!modelIsHidden}
      >
        <group scale={scale}>
          <group
            rotation={[
              rotationX * Math.PI * 2,
              rotationY * Math.PI * 2,
              rotationZ * Math.PI * 2
            ]}
          >
            <group dispose={null}>
              {scene && <primitive object={scene} />}
            </group>
          </group>
        </group>
      </group>
    </>
  );
}

export { Model };
