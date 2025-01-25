'use client';

import Checkbox from '../checkBox';
import { Category } from '@/app/lib/definitions';
import { deleteCategory } from '@/app/lib/actions';

interface CategoryProps {
  categories: Category[];
  schedules: any[];
  openCategory: boolean;
  editCategory: boolean;
  setOpenCategory: (open: boolean) => void;
  setEditCategory: (edit: boolean) => void;
  setCategory: (category: Category) => void;
}

export default function CategorySection({
  categories,
  schedules,
  openCategory,
  editCategory,
  setOpenCategory,
  setEditCategory,
  setCategory,
}: CategoryProps) {
  function handleOpenEditCategory(e: any) {
    const categoryId = e.currentTarget.id.split('-')[1];
    const category: Category = categories.find(
      (cat: Category) => cat?.id === parseInt(categoryId)
    );
    setCategory(category);
    setEditCategory(!editCategory);
  }

  return (
    <div>
      <div className="rounded-lg bg-neutral-800 mb-2 py-2 px-3">
        <span className="text-sm font-light text-hair-line">My Calendar</span>
        {categories.map((category: Category) => (
          <div key={category?.id} className="flex items-center mt-2">
            <Checkbox
              id={`category--checkbox-${category?.id}`}
              color={category?.color || ''}
              schedules={schedules}
            />
            <label
              className="cursor-pointer"
              htmlFor={`category--checkbox-${category?.id}`}
            >
              {category?.name}
            </label>
          </div>
        ))}
      </div>
      <div className="relative rounded-lg bg-neutral-800 mb-2 py-2 px-3">
        <div
          onClick={() => setOpenCategory(!openCategory)}
          className="absolute top-2 right-3 cursor-pointer w-6 h-6 rounded-full text-center hover:bg-white-0.2"
        >
          <i className="fa-light fa-plus"></i>
        </div>
        <span className="text-sm font-light text-hair-line">Categories</span>
        {categories.map((category: Category) => (
          <div
            key={category?.id}
            id={`category-${category?.id}`}
            onClick={(e) => handleOpenEditCategory(e)}
            className="mt-1 flex items-center rounded px-1 cursor-pointer hover:bg-white-0.2"
          >
            <div
              className="h-4 w-4 rounded-full mr-2"
              style={{ backgroundColor: category?.color }}
            ></div>
            <span>{category?.name}</span>
            <i
              onClick={() => deleteCategory(category?.id || -1)}
              className="fa-regular fa-trash-can cursor-pointer ml-auto hover:text-red-600"
            ></i>
          </div>
        ))}
      </div>
    </div>
  );
}
