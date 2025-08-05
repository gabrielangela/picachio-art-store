import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../configs/firebase';

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

export const addProduct = createAsyncThunk('products/add', async (product) => {
  const docRef = await addDoc(collection(db, 'products'), product);
  return { id: docRef.id, ...product };
});

export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
  await deleteDoc(doc(db, 'products', id));
  return id;
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, updated }) => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, updated);
  return { id, ...updated };
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export default productsSlice.reducer;