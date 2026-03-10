import { useState, useCallback } from 'react';

export const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  // 일반 input onChange
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    if (!name) return;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // 직접 값 세팅 (Quill 등)
  const setDirectly = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // 초기화
  const reset = useCallback(() => {
    setValues({ ...initialValues });
  }, [initialValues]);

  return { values, setValues, handleChange, setDirectly, reset };
};
