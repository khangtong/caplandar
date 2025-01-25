import { useState } from 'react';
import { Category } from '../lib/definitions';

export default function CategorySelectionBox({
  categories,
  categoryId,
}: {
  categories: Category[];
  categoryId?: number;
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  function select(e: any, index: number) {
    setSelectedCategoryId((prevCategoryIndex) =>
      prevCategoryIndex === index ? null : index
    );
    const input = e.target.parentNode.children[3];
    setTimeout(() => {
      const i = [...e.target.parentNode.children].findIndex((el) =>
        el.classList.contains('shadow-7')
      );

      input.value = categories[i]?.id || 0;
    }, 100);
  }

  return (
    <div className="category-selection-box flex flex-wrap mb-3">
      {categories?.map((category: Category, index: number) => (
        <div
          key={category?.id}
          className={`w-fit p-1.5 mr-3 rounded-lg cursor-pointer duration-200 capitalize hover:shadow-7 ${
            (selectedCategoryId != null
              ? selectedCategoryId === index
              : categoryId === category?.id) && 'shadow-7'
          }`}
          style={{ backgroundColor: category?.color }}
          onClick={(e) => select(e, index)}
        >
          {category?.name}
        </div>
      ))}
      <input
        type="number"
        className="hidden"
        name="category"
        defaultValue={categoryId}
      />
    </div>
  );
}
