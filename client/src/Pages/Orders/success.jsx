import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const OrderSuccess = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="w-full p-10 py-20 flex items-center justify-center flex-col gap-3">
      <img src="/successorder.png" width="150" alt="Order Success" />

      <h1 className="mb-0 text-[25px] font-semibold">
        Your order is placed
      </h1>
      <p className="mt-0 text-[15px] text-gray-700 text-center max-w-md">
        Thank you for your order and enjoy this exclusive product!
      </p>

      <Link to="/">
        <Button className="btn-org btn-border btn-sml mt-3">
          Back to Home
        </Button>
      </Link>
    </section>
  );
};
