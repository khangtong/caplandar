import axios from 'axios';
import { redirect } from 'next/navigation';
import { Category, User } from './definitions';

export async function fetchUser(token: string | undefined): Promise<User> {
  if (!token) redirect('/login');

  let user = null;

  try {
    const response = await axios.get(`${process.env.API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    user = response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch user.');
  }

  return user;
}

export async function fetchCategory(
  token: string | undefined
): Promise<Category[]> {
  if (!token) redirect('/login');

  let categories = null;

  try {
    const response = await axios.get(`${process.env.API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    categories = response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch categories.');
  }

  return categories;
}

export async function fetchTodayList(
  token: string | undefined
): Promise<any[]> {
  if (!token) redirect('/login');

  let schedules = null;
  const year = new Date().getFullYear();
  const month =
    new Date().getMonth() + 1 < 10
      ? `0${new Date().getMonth() + 1}`
      : new Date().getMonth() + 1;
  const date =
    new Date().getDate() < 10
      ? `0${new Date().getDate()}`
      : new Date().getDate();

  try {
    const response = await axios.get(
      `${process.env.API_URL}/search?year=${year}&month=${month}&date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    schedules = response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch schedules.');
  }

  return schedules;
}
