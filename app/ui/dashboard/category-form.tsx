import { addCategory, updateCategory } from '@/app/lib/actions';
import { CategoryType } from '@/app/lib/definitions';
import { useActionState } from 'react';
import { useState, useEffect } from 'react';

interface CategoryFormProps {
  openCategory: boolean;
  editCategory: boolean;
  category: CategoryType;
}

export default function CategoryForm({
  openCategory,
  editCategory,
  category,
}: CategoryFormProps) {
  const [state, action, isPending] = useActionState(
    editCategory ? updateCategory : addCategory,
    undefined
  );
  const [color, setColor] = useState(
    editCategory ? category?.color : '#b591ef'
  );
  const [id, setId] = useState(editCategory ? category?.id : 0);

  useEffect(() => {
    if (editCategory && category?.color) {
      setColor(category?.color);
    }

    if (editCategory && category?.id) {
      setId(category?.id);
    }
  }, [editCategory, category?.color, category?.id]);

  return (
    <form
      action={action}
      className={`${
        openCategory || editCategory || 'hidden'
      } absolute left-68 max-w-409 h-fit p-6 rounded-lg bg-white shadow-4 z-50`}
      style={{ top: '80vh' }}
    >
      <div className="flex items-center mb-2">
        <input
          type="text"
          name="id"
          className="hidden"
          value={id}
          onChange={(e) => setId(+e.target.value)}
        />
        <input
          type="color"
          className="py-1.5 px-3 rounded-l-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 w-full mb-2 bg-neutral-100 duration-200 cursor-pointer appearance-none"
          id="category-color-input"
          name="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          title="Choose your color"
          style={{ flex: '1', height: 'calc(1.5em + .75rem + calc(1px * 2))' }}
        />
        {state?.errors?.color && (
          <span className="text-left text-xs text-red-500 relative -top-2">
            {state.errors.color}
          </span>
        )}
        <input
          type="text"
          className="py-1.5 px-3 rounded-r-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 w-full mb-2 bg-neutral-100 duration-200"
          id="category-name-input"
          name="name"
          placeholder="Enter category name"
          style={{ flex: '5' }}
          defaultValue={editCategory ? category?.name : ''}
          required
        />
        {state?.errors?.name && (
          <span className="text-left text-xs text-red-500 relative -top-2">
            {state.errors.name}
          </span>
        )}
      </div>
      <button
        disabled={isPending}
        type="submit"
        className="rounded-lg p-2 font-bold capitalize w-full border-none text-gray-100 bg-neutral-900 duration-200"
      >
        {editCategory ? 'save' : 'add category'}
      </button>
    </form>
  );
}
