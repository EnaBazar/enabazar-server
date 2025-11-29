import React from "react";
import { motion } from "framer-motion";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { FaLock, FaShieldAlt, FaCreditCard, FaExchangeAlt } from "react-icons/fa";

// ✅ Breadcrumbs component
const DynamicBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  window.scrollTo(0, 0);

  return (
    <div className="bg-[#fff3eb] py-3 px-6">
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/"
          className="!text-[#FC8934] font-medium"
        >
          Home
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <Typography key={to} color="text.primary" className="!text-gray-700">
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Typography>
          ) : (
            <Link
              underline="hover"
              component={RouterLink}
              to={to}
              key={to}
              className="!text-[#FC8934]"
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};

const SecurePayment = () => {
  return (
    <div className="bg-[#fffaf7] min-h-screen">
      <DynamicBreadcrumbs />

      {/* ✅ Hero Section */}
      <section className="relative bg-[#FC8934] text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Secure Payment
          </motion.h1>
          <motion.p
            className="max-w-3xl mx-auto text-lg md:text-xl text-orange-100"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Shop with confidence — your payments are protected with the highest security standards.
          </motion.p>
        </div>
      </section>

      {/* ✅ Secure Payment Features */}
      <section className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <FaLock className="text-[#FC8934] text-3xl mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-800">Data Encryption</h3>
              <p className="text-gray-600">
                All payment information is encrypted with SSL technology to keep your transactions safe.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <FaShieldAlt className="text-[#FC8934] text-3xl mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-800">Fraud Protection</h3>
              <p className="text-gray-600">
                Advanced monitoring systems detect and prevent unauthorized transactions in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <FaCreditCard className="text-[#FC8934] text-3xl mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-800">Multiple Payment Options</h3>
              <p className="text-gray-600">
                Pay securely using credit/debit cards, PayPal, and other trusted payment gateways.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <FaExchangeAlt className="text-[#FC8934] text-3xl mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-800">Easy Refunds</h3>
              <p className="text-gray-600">
                If eligible, refunds are processed quickly and securely back to your original payment method.
              </p>
            </div>
          </div>
        </div>

        <motion.img
          src="https://img.freepik.com/free-vector/secure-payment-concept-illustration_114360-4771.jpg"
          alt="Secure Payment"
          className="rounded-xl shadow-lg border border-[#FC8934]/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      </section>

      {/* ✅ Footer Note */}
      <section className="bg-white py-10 text-center text-gray-600 text-sm border-t border-gray-200">
        <p>
          We never store your credit card details. Payments are processed securely through our trusted providers.
        </p>
      </section>
    </div>
  );
};

export default SecurePayment;
