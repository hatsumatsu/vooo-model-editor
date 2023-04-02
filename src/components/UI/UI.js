import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { shallow } from 'zustand/shallow';
import { nanoid } from 'nanoid';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

import { Dropzone } from './Dropzone';
import { Slider } from './Slider';

import { useData } from '../../stores/data';
import { Checkbox } from './Checkbox';

function UI() {
  return (
    <div className="UI">
      <div className="UI__content">
        <UIPanel id="model" title="Model" color="#ffbf00">
          <ModelUI />
        </UIPanel>

        <UIPanel
          id="transform"
          title="Transform"
          color="#001fd1"
          isLightText={true}
        >
          <TransformUI />
        </UIPanel>

        <UIPanel id="items" title="Markers" color="#ff6352">
          <MarkersUI />
        </UIPanel>

        <UIPanel id="export" title="Export" isInitiallyCollapsed={true}>
          <OutputUI />
        </UIPanel>

        <UIPanel id="import" title="Import" isInitiallyCollapsed={true}>
          <ImportUI />
        </UIPanel>
      </div>
    </div>
  );
}

function UIPanel({
  id,
  title = '',
  color = '#ccc',
  isLightText = false,
  children,
  isInitiallyCollapsed = false
}) {
  const [isCollapsed, setIsCollapsed] = useState(isInitiallyCollapsed);

  return (
    <div
      className={`UIPanel UIPanel--${id} ${isLightText ? ' isLightText' : ''}`}
      style={{ backgroundColor: color }}
    >
      <p
        className="UIPanel__title"
        onClick={() => {
          setIsCollapsed((state) => !state);
        }}
      >
        <span>{title}</span>
      </p>

      {!isCollapsed && <div className="UIPanel__content">{children}</div>}
    </div>
  );
}

function ModelUI() {
  const { modelIsHidden, setModelIsHidden } = useData(
    (state) => ({
      modelIsHidden: state.modelIsHidden,
      setModelIsHidden: state.setModelIsHidden
    }),
    shallow
  );

  return (
    <div className="UIFields">
      <Dropzone />

      <Checkbox
        id="modelIsHidden"
        label="Hide MOdel"
        value={modelIsHidden}
        setValue={setModelIsHidden}
      />
    </div>
  );
}

function TransformUI() {
  const {
    scale,

    positionX,
    positionY,
    positionZ,

    rotationX,
    rotationY,
    rotationZ,

    setScale,

    setPositionX,
    setPositionY,
    setPositionZ,

    setRotationX,
    setRotationY,
    setRotationZ
  } = useData(
    (state) => ({
      scale: state.scale,

      positionX: state.positionX,
      positionY: state.positionY,
      positionZ: state.positionZ,

      rotationX: state.rotationX,
      rotationY: state.rotationY,
      rotationZ: state.rotationZ,

      setScale: state.setScale,

      setPositionX: state.setPositionX,
      setPositionY: state.setPositionY,
      setPositionZ: state.setPositionZ,

      setRotationX: state.setRotationX,
      setRotationY: state.setRotationY,
      setRotationZ: state.setRotationZ
    }),
    shallow
  );

  return (
    <div className="UIFields">
      <Slider
        label="Scale"
        id="scale"
        value={scale}
        setValue={setScale}
        min={0.1}
        max={50}
        step={0.1}
      />

      <Slider
        label="X"
        id="positionX"
        value={positionX}
        setValue={setPositionX}
        min={-100}
        max={100}
        step={0.1}
      />

      <Slider
        label="Y"
        id="positionY"
        value={positionY}
        setValue={setPositionY}
        min={-100}
        max={100}
        step={0.1}
      />

      <Slider
        label="Z"
        id="positionZ"
        value={positionZ}
        setValue={setPositionZ}
        min={-100}
        max={100}
        step={0.1}
      />

      <Slider
        label="Rotation X"
        id="rotationX"
        value={rotationX}
        setValue={setRotationX}
        min={-1}
        max={1}
        step={0.01}
      />

      <Slider
        label="Rotation Y"
        id="rotationY"
        value={rotationY}
        setValue={setRotationY}
        min={-1}
        max={1}
        step={0.01}
      />

      <Slider
        label="Rotation Z"
        id="rotationZ"
        value={rotationZ}
        setValue={setRotationZ}
        min={-1}
        max={1}
        step={0.01}
        onChange={(value) => {
          setRotationZ(value);
        }}
      />
    </div>
  );
}

function MarkersUI() {
  const { items, setItems, addItem, removeItem, updateItem, moveItem } =
    useData(
      (state) => ({
        items: state.items,

        setItems: state.setItems,
        addItem: state.addItem,
        removeItem: state.removeItem,
        updateItem: state.updateItem,
        moveItem: state.moveItem
      }),
      shallow
    );

  /**
   * Events
   */
  const onClickAdd = useCallback(() => {
    const item = {
      id: nanoid(),
      position: [0, 0, 0],
      title: ''
    };

    addItem(item);
  }, [addItem]);

  const onChange = useCallback(
    (_item) => {
      updateItem(_item.id, _item);
    },
    [updateItem]
  );

  const onClickRemove = useCallback(
    (id) => {
      if (!id) return;

      removeItem(id);
    },
    [removeItem]
  );

  const onClickMoveDown = useCallback((index) => {
    if (index === undefined) return;

    moveItem(index, index + 1);
  }, []);

  const onClickMoveUp = useCallback((index) => {
    if (index === undefined) return;

    moveItem(index, index - 1);
  }, []);

  return (
    <div className="Markers">
      <ul className="Markers__list">
        {items &&
          items.map((item, index) => (
            <Item
              item={item}
              index={index}
              key={`item-${item.id}`}
              onChange={onChange}
              onClickRemove={onClickRemove}
              onClickMoveDown={onClickMoveDown}
              onClickMoveUp={onClickMoveUp}
            />
          ))}
      </ul>

      <div className="Markers__actions">
        <button onClick={onClickAdd} className="Markers__add Button">
          Add marker
        </button>
      </div>
    </div>
  );
}

function Item({
  item,
  index = 0,
  onClickRemove = () => {},
  onClickMoveDown = () => {},
  onClickMoveUp = () => {},
  onChange = () => {}
}) {
  const [title, setTitle] = useState(item.title);

  useEffect(() => {
    let debouncer;

    function onChangeDebounced() {
      onChange({
        ...item,
        ...{ title }
      });
    }

    clearTimeout(debouncer);
    debouncer = setTimeout(onChangeDebounced, 500);

    return () => {
      clearTimeout(debouncer);
    };
  }, [title, onChange]); // omit item as dependency to avoid infinite loop

  function onChangeTitle(event) {
    setTitle(event.target.value);
  }

  return (
    <li className="Marker">
      <div className="Marker__header">
        <p className="Marker__index">{index + 1}</p>

        <input
          type="text"
          value={title}
          onChange={onChangeTitle}
          className="Marker__title Input"
        />

        <button
          onClick={() => {
            onClickMoveDown(index);
          }}
          className="Marker__remove Button ButtonGroup ButtonGroup--first"
          title="move down"
        >
          ↓
        </button>
        <button
          onClick={() => {
            onClickMoveUp(index);
          }}
          className="Marker__remove Button ButtonGroup"
          title="move up"
        >
          ↑
        </button>
        <button
          onClick={() => {
            onClickRemove(item.id);
          }}
          className="Marker__remove Button ButtonGroup ButtonGroup--last"
          title="remove"
        >
          ✕
        </button>
      </div>
      <div className="Marker__content">
        <MarkerEditor />
      </div>
    </li>
  );
}

function MarkerEditor() {
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: '<p>Hello World!</p>'
  });

  return (
    <div className="Editor">
      <div className="Editor__ui">
        <button
          onClick={() => {
            editor.chain().focus().toggleBold().run();
          }}
          className="Button ButtonGroup ButtonGroup--first"
        >
          B
        </button>

        <button
          onClick={() => {
            editor.chain().focus().toggleItalic().run();
          }}
          className="Button ButtonGroup"
        >
          I
        </button>

        <button
          onClick={() => {
            const url = window.prompt('URL');
            editor.commands.setLink({ href: url });
          }}
          className="Button ButtonGroup"
        >
          Link
        </button>
        <button
          onClick={() => {
            editor.commands.unsetLink();
          }}
          className="Button ButtonGroup ButtonGroup--last"
        >
          Unlink
        </button>

        <button
          onClick={() => {
            editor.commands.unsetAllMarks();
          }}
          className="Button ButtonGroup ButtonGroup--last"
        >
          Clear
        </button>
      </div>
      <div className="Editor__content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function OutputUI() {
  const {
    scale,
    positionX,
    positionY,
    positionZ,
    rotationX,
    rotationY,
    rotationZ,
    items
  } = useData((state) => ({
    scale: state.scale,

    positionX: state.positionX,
    positionY: state.positionY,
    positionZ: state.positionZ,
    rotationX: state.rotationX,
    rotationY: state.rotationY,
    rotationZ: state.rotationZ,

    items: state.items
  }));

  const output = useMemo(() => {
    return JSON.stringify(
      {
        scale,
        positionX,
        positionY,
        positionZ,
        rotationX,
        rotationY,
        rotationZ,
        items
      } || {},
      null,
      2
    );
  }, [
    items,
    scale,
    positionX,
    positionY,
    positionZ,
    rotationX,
    rotationY,
    rotationZ
  ]);

  return (
    <div className="Output">
      <textarea disabled className="Output__input Input" value={output} />
    </div>
  );
}

function ImportUI() {
  const inputRef = useRef();

  const { importData } = useData(
    (state) => ({
      importData: state.importData
    }),
    shallow
  );

  const [value, setValue] = useState('');

  useEffect(() => {
    if (value) {
      try {
        const data = JSON.parse(value.trim());
        if (data) {
          importData(data);
          // if (inputRef.current) inputRef.current.value = "";
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [value, importData]);

  function onChange(event) {
    setValue(event.target.value || '');
  }

  return (
    <div className="Import">
      <textarea
        ref={inputRef}
        className="Import__input Input"
        onChange={onChange}
      />
    </div>
  );
}

export { UI };
