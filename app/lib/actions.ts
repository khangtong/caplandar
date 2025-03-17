'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import axios from 'axios';

import {
  LoginFormSchema,
  ScheduleFormSchema,
  AddGuestFormSchema,
  AddCategoryFormSchema,
  EditCategoryFormSchema,
  SearchSchedulesFormSchema,
  EditProfileFormSchema,
  ChangePasswordFormSchema,
} from './definitions';
import calculateNoti from './calculateNoti';

export async function login(state: any, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Sign in
  const input = validatedFields.data;

  try {
    const response = await axios.post(
      `${process.env.API_URL}/users/signin`,
      JSON.stringify(input),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status == 200) {
      const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

      (await cookies()).set('session', response.data.token, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
      });

      return {
        success: true,
      };
    }
  } catch (error: any) {
    return {
      message: error?.response?.data?.message,
    };
  }
}

export async function logout() {
  (await cookies()).set('session', '', {
    httpOnly: true,
    secure: true,
    expires: Date.now(),
    sameSite: 'lax',
    path: '/',
  });

  redirect('/login');
}

export async function addSchedule(state: any, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = ScheduleFormSchema.safeParse({
    title: formData.get('title'),
    date: new Date(formData.get('date') as string),
    timeFrom: `${formData.get('from')}:00`,
    timeTo: `${formData.get('to')}:00`,
    location: formData.get('location'),
    noti: formData.get('noti'),
    notiUnit: formData.get('unit'),
    guests: formData.get('guests'),
    category: parseInt(formData.get('category') as string),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare the data
  const data = validatedFields.data;
  data.noti = calculateNoti(
    data.date.toISOString().split('T')[0],
    data.noti,
    data.timeFrom,
    data.notiUnit
  );

  // 3. Get the session token from cookies
  const token = (await cookies()).get('session')?.value;

  // 4. Send the data to API
  try {
    await axios.post(`${process.env.API_URL}/schedules`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error(
      `ERROR (${error.response?.status}): ${error.response?.data?.message}`
    );
    return {
      message: 'Database Error: Failed to create schedule.',
    };
  }
}

export async function updateSchedule(state: any, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = ScheduleFormSchema.safeParse({
    id: parseInt(formData.get('id') as string),
    title: formData.get('title'),
    date: new Date(formData.get('date') as string),
    timeFrom:
      formData.get('from')?.toString().length === 8
        ? formData.get('from')
        : `${formData.get('from')}:00`,
    timeTo:
      formData.get('to')?.toString().length === 8
        ? formData.get('to')
        : `${formData.get('to')}:00`,
    location: formData.get('location'),
    noti: formData.get('noti'),
    notiUnit: formData.get('unit'),
    guests: formData.get('guests')?.toString().startsWith("'")
      ? formData.get('guests')?.slice(1, -1)
      : formData.get('guests'),
    category: parseInt(formData.get('category') as string),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare the data
  const data = validatedFields.data;
  data.noti = calculateNoti(
    data.date.toISOString().split('T')[0],
    data.noti,
    data.timeFrom,
    data.notiUnit
  );

  // 3. Get the session token from cookies
  const token = (await cookies()).get('session')?.value;

  // 4. Send the data to API
  try {
    await axios.put(`${process.env.API_URL}/schedules`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error(
      `ERROR (${error.response?.status}): ${error.response?.data?.message}`
    );
    return {
      message: 'Database Error: Failed to update schedule.',
    };
  }
}

export async function deleteSchedule(id: number) {
  // 1. Get the session token from cookies
  const token = (await cookies()).get('session')?.value;

  // 2. Send the data to API
  try {
    await axios.delete(`${process.env.API_URL}/schedules/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    console.error(
      `ERROR (${error.response?.status}): ${error.response?.data?.message}`
    );
    return {
      message: 'Database Error: Failed to delete schedule.',
    };
  }
}

export async function addGuest(state: any, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = AddGuestFormSchema.safeParse({
    usernameOrEmail: formData.get('usernameOrEmail'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare the data
  const { usernameOrEmail } = validatedFields.data;

  // 3. Get the session token from cookies
  const token = (await cookies()).get('session')?.value;

  // 4. Send the data to API
  try {
    const response = await axios.get(
      `${process.env.API_URL}/users/search?usernameOrEmail=${usernameOrEmail}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      revalidatePath('/dashboard');
      return { data: response.data.data };
    }
  } catch (error: any) {
    console.error(
      `ERROR (${error.response?.status}): ${error.response?.data?.message}`
    );
    return {
      message: `Database Error: Failed to add guest.`,
    };
  }
}

export async function addCategory(state: any, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = AddCategoryFormSchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare the data
  const data = validatedFields.data;

  // 3. Get the session token from cookies
  const token = (await cookies()).get('session')?.value;

  // 4. Send the data to API
  try {
    await axios.post(`${process.env.API_URL}/categories`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error(
      `ERROR (${error.response?.status}): ${error.response?.data?.message}`
    );
    return {
      message: `Database Error: Failed to create category.`,
    };
  }
}

export async function updateCategory(state: any, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = EditCategoryFormSchema.safeParse({
    id: parseInt(formData.get('id') as string),
    name: formData.get('name'),
    color: formData.get('color'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare the data
  const data = validatedFields.data;

  // 3. Get the session token from cookies
  const token = (await cookies()).get('session')?.value;

  // 4. Send the data to API
  try {
    await axios.put(`${process.env.API_URL}/categories`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error(
      `ERROR (${error.response?.status}): ${error.response?.data?.message}`
    );
    return {
      message: `Database Error: Failed to update category.`,
    };
  }
}

export async function searchSchedules(state: any, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = SearchSchedulesFormSchema.safeParse({
    title: formData.get('title') || undefined,
    year: parseInt(formData.get('year') as string) || undefined,
    month: parseInt(formData.get('month') as string) || undefined,
    date: parseInt(formData.get('date') as string) || undefined,
    location: formData.get('location') || undefined,
    category: parseInt(formData.get('category') as string) || undefined,
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare the query
  const data = validatedFields.data;
  let query = '?';

  for (const [key, value] of Object.entries(data)) {
    if (value) {
      if (key === 'date' || key === 'month')
        query += `${key}=${(value as number) > 9 ? value : `0${value}`}&`;
      else query += `${key}=${value}&`;
    }
  }

  // 3. Get the session token from cookies
  const token = (await cookies()).get('session')?.value;

  // 4. Send the data to API
  try {
    let response;
    if (query === '?') {
      response = await axios.get(`${process.env.API_URL}/schedules`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      response = await axios.get(`${process.env.API_URL}/search${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (response.status === 200) {
      return { data: response.data.data };
    }
  } catch (error: any) {
    console.error(
      `ERROR (${error.response?.status}): ${error.response?.data?.message}`
    );
    return {
      message: `Database Error: Failed to add guest.`,
    };
  }
}

export async function updateProfile(state: any, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = EditProfileFormSchema.safeParse({
    avatar: formData.get('avatar') || null,
    username: formData.get('username'),
    email: formData.get('email'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare the data
  const data = validatedFields.data;

  // 3. Get the session token from cookies
  const token = (await cookies()).get('session')?.value;

  // 4. Send the data to API
  try {
    await axios.patch(`${process.env.API_URL}/users/me`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error(
      `ERROR (${error.response?.status}): ${error.response?.data?.message}`
    );
    return {
      message: `Database Error: Failed to update profile.`,
    };
  }
}

export async function changePassword(state: any, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = ChangePasswordFormSchema.safeParse({
    currentPassword: formData.get('password'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare the data
  const data = validatedFields.data;

  // 3. Get the session token from cookies
  const token = (await cookies()).get('session')?.value;

  // 4. Send the data to API
  try {
    await axios.patch(`${process.env.API_URL}/users/change-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    console.error(
      `ERROR (${error.response?.status}): ${error.response?.data?.message}`
    );
    return {
      message: `Database Error: Failed to change password.`,
    };
  }
}

export async function deleteCategory(id: number) {
  // 1. Get the session token from cookies
  const token = (await cookies()).get('session')?.value;

  try {
    await axios.delete(`http://localhost:8080/api/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    console.error(
      `ERROR (${error.response?.status}): ${error.response?.data?.message}`
    );
    return {
      message: 'Database Error: Failed to delete category.',
    };
  }
}

export async function blockUser(id: number) {
  // 1. Get the session token from cookies
  const token = (await cookies()).get('session')?.value;

  try {
    await axios.post(
      `http://localhost:8080/api/blacklists?blockedUser=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: any) {
    console.error(
      `ERROR (${error.response?.status}): ${error.response?.data?.message}`
    );
    return {
      message: 'Database Error: Failed to block user.',
    };
  }
}

export async function deleteBlacklist(id: number) {
  // 1. Get the session token from cookies
  const token = (await cookies()).get('session')?.value;

  try {
    await axios.delete(`http://localhost:8080/api/blacklists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    console.error(
      `ERROR (${error.response?.status}): ${error.response?.data?.message}`
    );
    return {
      message: 'Database Error: Failed to unblock user.',
    };
  }
}
