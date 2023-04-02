import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
  useCallback
} from 'react';
import { shallow } from 'zustand/shallow';
import { useDropzone } from 'react-dropzone';

import { useData } from '../../stores/data';

function Dropzone() {
  const { setBuffer } = useData(
    (state) => ({ setBuffer: state.setBuffer }),
    shallow
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
          const binary = reader.result;
          console.log(binary);

          setBuffer(binary);
        };

        reader.readAsArrayBuffer(file);
      });
    },
    [setBuffer]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'model/gltf-binary': ['.glb'],
      'model/gltf_binary': ['.glb'],
      'application/octet-stream': ['.glb']
    }
  });

  return (
    <div className="UIField">
      <div {...getRootProps()} className="Dropzone">
        <input {...getInputProps()} className="Dropzone__input" />
        <p className="Dropzone__hint">
          Drag & drop .GLB file or click to select files
        </p>
      </div>
    </div>
  );
}

export { Dropzone };
