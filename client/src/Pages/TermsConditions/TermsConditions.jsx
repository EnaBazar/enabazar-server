import React from "react";
import { motion } from "framer-motion";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";

// ✅ Dynamic Breadcrumbs Component
const DynamicBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
 window.scrollTo(0,0)
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

const Terms = () => {
  return (
    <div className="bg-[#fffaf7]">
      {/* ✅ Breadcrumbs */}
      <DynamicBreadcrumbs />

      {/* ✅ Hero Section */}
      <section className="relative bg-[#FC8934] text-white py-16">
        <div className="container rounded-md mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold !mb-4"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Terms & Conditions
          </motion.h1>
          <motion.p
            className="max-w-3xl mx-auto text-lg md:text-xl text-orange-100"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Please read our terms and conditions carefully before using our services.
          </motion.p>
        </div>
      </section>

      {/* ✅ Content Section */}
      <section className="container mx-auto px-6 py-16 space-y-12">
        {/* Section 1 */}
        <motion.div
          className="bg-white shadow-md rounded-xl p-8 !mb-3 border border-[#FC8934]/20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-[#FC8934] mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing and using our website, you accept and agree to be bound
            by these Terms and Conditions. If you do not agree, you must not
            use our services.
          </p>
        </motion.div>

        {/* Section 2 */}
        <motion.div
          className="bg-white shadow-md rounded-xl p-8 border !mb-3 border-[#FC8934]/20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-[#FC8934] mb-4">
            2. User Responsibilities
          </h2>
          <p className="text-gray-600 leading-relaxed">
            You agree to use our services responsibly and not engage in any
            activity that may harm, disrupt, or misuse our platform or
            community.
          </p>
        </motion.div>

        {/* Section 3 */}
        <motion.div
          className="bg-white shadow-md rounded-xl !mb-3 p-8 border border-[#FC8934]/20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-[#FC8934] mb-4">
            3. Privacy Policy
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Your personal information will be handled in accordance with our
            Privacy Policy. We are committed to safeguarding your data and
            maintaining confidentiality.
          </p>
        </motion.div>

        {/* Section 4 */}
        <motion.div
          className="bg-white shadow-md !mb-3 rounded-xl p-8 border border-[#FC8934]/20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-[#FC8934] mb-4">
            4. Limitation of Liability
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We are not responsible for any damages arising from the use or
            inability to use our services, including data loss, business
            interruption, or indirect damages.
          </p>
        </motion.div>

        {/* Section 5 */}
        <motion.div
          className="bg-white shadow-md rounded-xl !mb-3 p-8 border border-[#FC8934]/20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-[#FC8934] mb-4">
            5. Changes to Terms
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We may update these Terms & Conditions at any time. Continued use of
            our services after changes are posted constitutes acceptance of the
            updated terms.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Terms;
