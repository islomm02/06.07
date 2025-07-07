import axios from 'axios';

const BASE_URL = 'http://54.210.160.235';

export const getStacks = async () => {
  const res = await axios.get(`${BASE_URL}/stacks`);
  return res.data.data; 
};

export const createStack = async (newStack: { name: string }) => {
  const res = await axios.post(`${BASE_URL}/stacks`, newStack);
  return res.data;
};

export const updateStack = async ({ id, name }: { id: number; name: string }) => {
  const res = await axios.put(`${BASE_URL}/stacks/${id}`, { name });
  return res.data;
};

export const deleteStack = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/stacks/${id}`);
  return res.data;
};
