import { useState, useEffect, useMemo } from 'react';
import { categoryApi } from '@/modules/admin/categoryApi';
import { Category } from '@/types/categoryItem';


export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await categoryApi.getAll();
        setCategories(result);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // useMemo để chuẩn hóa cho Select AntD
  const selectOptions = useMemo(
    () =>
      categories.map(cat => ({
        label: cat.title,
        value: cat.alias,
      })),
    [categories]
  );

  return { categories, selectOptions, loading, error };
};
