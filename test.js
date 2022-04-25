import React from 'react';
import { useState } from 'react';

const Currency = () => {
  const [value, setValue] = useState();
  const handleChange = (e) => {
    const numeric = +e.target.value.replace(/\D/g, "")
    setValue(`$ ${(numeric / 100).toFixed(2)}`)
  }

  return ( <input value={value} onChange={handleChange} />;
  )
}