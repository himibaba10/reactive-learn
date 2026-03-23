import { getCategories } from '@/queries/categories.queries';
import { useEffect, useState } from 'react';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);
  return { categories };
};

export default useCategories;
