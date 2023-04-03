import { Suspense, useState, useRef, useCallback } from 'react';
import { shallow } from 'zustand/shallow';

import { BoxHelper } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Html,
  OrbitControls,
  TransformControls,
  useHelper
} from '@react-three/drei';
import { Perf } from 'r3f-perf';

import { Model } from './Model';

import { useData } from '../../stores/data';

import { BASE_SIZE } from '../../config';

function Viewer() {
  return (
    <div className="Viewer">
      <Canvas
        camera={{
          position: [0, BASE_SIZE, BASE_SIZE],
          far: BASE_SIZE * 20,
          near: 1
        }}
        orthographic={false}
        gl={{}}
        flat={true}
        onCreated={({ gl }) => {}}
      >
        <color attach="background" args={['#ddd']} />

        <Suspense fallback={null}>
          <Scene />
        </Suspense>

        <OrbitControls enableZoom={false} makeDefault />

        <Perf position="bottom-left" deepAnalyze={true} matrixUpdate={true} />
      </Canvas>
    </div>
  );
}

function Scene() {
  return (
    <group>
      <Lights />
      <Composition />
    </group>
  );
}

function Lights({}) {
  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight position={[BASE_SIZE, BASE_SIZE, 0]} intensity={1.0} />
      <pointLight position={[-BASE_SIZE, BASE_SIZE, 50]} intensity={0.8} />
    </group>
  );
}

function Composition() {
  const autoRotateRef = useRef();

  useFrame(({ clock }, delta) => {
    // return;
  });

  return (
    <group ref={autoRotateRef} rotation={[0, 0, 0]}>
      <group scale={1}>
        <Model />
        <Space />
        <Markers />
      </group>
    </group>
  );
}

function Space() {
  const boxRef = useRef();

  useHelper(boxRef, BoxHelper, '#000');

  return (
    <>
      <mesh scale={BASE_SIZE} ref={boxRef} visible={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={'#000'} />
      </mesh>

      <gridHelper size={BASE_SIZE} division={10} color={'#000'} />
    </>
  );
}

function Markers() {
  const { items, updateItem } = useData((state) => ({
    items: state.items,
    updateItem: state.updateItem
  }));

  const onChange = useCallback(
    (_item) => {
      updateItem(_item.id, _item);
    },
    [updateItem]
  );

  return (
    <group>
      {items &&
        items.map((item, i) => (
          <Marker
            item={item}
            index={i}
            key={`marker-${item.id}`}
            onChange={onChange}
          />
        ))}
    </group>
  );
}

function Marker({ item, index, onChange = () => {} }) {
  const markerRef = useRef();
  const debouncer = useRef();
  console.log('Marker', item, item.position, markerRef.current?.position);

  const { activeItemId, setActiveItemId } = useData(
    (state) => ({
      activeItemId: state.activeItemId,
      setActiveItemId: state.setActiveItemId
    }),
    shallow
  );

  function onClick() {
    setActiveItemId(item.id === activeItemId ? null : item.id);
  }

  function onTransform() {
    clearTimeout(debouncer.current);
    debouncer.current = setTimeout(() => {
      if (!markerRef.current) return;

      onChange({
        ...item,
        ...{ position: markerRef.current.position }
      });

      console.log(markerRef.current.position);
    }, 500);
  }

  return (
    <>
      {activeItemId === item.id && (
        <TransformControls
          mode="translate"
          object={markerRef}
          onChange={onTransform}
        />
      )}

      <group
        ref={markerRef}
        position={[
          item.position.x || 0,
          item.position.y || 0,
          item.position.z || 0
        ]}
      >
        <mesh scale={BASE_SIZE / 40} onClick={onClick}>
          <sphereBufferGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color={'#ff6352'} />
        </mesh>

        <Html>
          <p className="ViewerMarker">{item.title || index + 1}</p>
        </Html>
      </group>
    </>
  );
}

export { Viewer };
