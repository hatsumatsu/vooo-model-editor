import { create } from 'zustand';

const useData = create((set, get) => ({
  buffer: null,

  scale: 1,

  positionX: 0,
  positionY: 0,
  positionZ: 0,

  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,

  items: [], // {id, position:[x,y,z], title}
  activeItemId: null,

  modelIsHidden: false,

  setBuffer: (buffer) => set({ buffer: buffer }),

  setScale: (scale) => set({ scale: scale }),

  setPositionX: (positionX) => set({ positionX: positionX }),
  setPositionY: (positionY) => set({ positionY: positionY }),
  setPositionZ: (positionZ) => set({ positionZ: positionZ }),

  setRotationX: (rotationX) => set({ rotationX: rotationX }),
  setRotationY: (rotationY) => set({ rotationY: rotationY }),
  setRotationZ: (rotationZ) => set({ rotationZ: rotationZ }),

  setItems: (items) => set({ items: items }),
  addItem: (item) => set({ items: [...get().items, item] }),
  removeItem: (id) => {
    set({ items: get().items.filter((_item) => _item.id !== id) });
  },
  updateItem: (id, item) => {
    console.log('updateItem()', id, item);

    if (!id) id = item.id;

    set({
      items: get().items.map((_item) => {
        return _item.id === id ? item : _item;
      })
    });
  },
  setActiveItemId: (activeItemId) => set({ activeItemId: activeItemId }),
  /*
  setItemData: (id, key, value) => {
    console.log("setItemData()", id, key, value);

    const items = get().items;

    items.map((item) => {
      if (item.id === id) {
        item[key] = value;
      }

      return item;
    });

    set({ items: [...items] });
  }
  */

  moveItem: (index, targetIndex) => {
    console.log('moveItem()', index, targetIndex, get().items);
    const items = get().items;
    if (targetIndex >= items.length || targetIndex < 0) return;

    items.splice(targetIndex, 0, items.splice(index, 1)[0]);

    console.log('moveItem()', items);

    set({ items: [...items] });
  },

  importData: (data) => {
    console.log('importData()', data, data.scale);
    set(data);
  },

  setModelIsHidden: (modelIsHidden) => set({ modelIsHidden: modelIsHidden })
}));

export { useData };
