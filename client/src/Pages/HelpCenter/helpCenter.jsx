import React from "react";
import { motion } from "framer-motion";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { FaQuestionCircle, FaPhoneAlt, FaEnvelope, FaBook } from "react-icons/fa";

// ✅ Re-usable breadcrumbs
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

const HelpCenter = () => {
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
            Help Center
          </motion.h1>
          <motion.p
            className="max-w-3xl mx-auto text-lg md:text-xl text-orange-100"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Find answers to common questions, guides, and ways to contact our
            support team.
          </motion.p>
        </div>
      </section>

      {/* ✅ FAQ Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-[#FC8934] mb-12">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          {[ 
            {
              q: "How can I reset my password?",
              a: "Go to the login page, click 'Forgot Password', and follow the instructions to reset your password via email.",
            },
            {
              q: "Where can I track my order?",
              a: "Log in to your account, navigate to 'My Orders', and select the order you want to track.",
            },
            {
              q: "How can I contact support?",
              a: "You can reach us via email or phone (details below). Our support team is available 24/7.",
            },
            {
              q: "Do you offer refunds?",
              a: "Yes, we offer refunds within 30 days of purchase if the product meets our refund policy criteria.",
            },
          ].map((faq, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-6 rounded-xl shadow border border-[#FC8934]/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                <FaQuestionCircle className="text-[#FC8934] mr-2" /> {faq.q}
              </h3>
              <p className="text-gray-600">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ Contact Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#FC8934] mb-12">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-6 rounded-xl shadow bg-[#fff3eb]">
              <FaPhoneAlt className="text-[#FC8934] text-3xl mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-800">Phone</h3>
              <p className="text-gray-600">+123 456 7890</p>
            </div>
            <div className="p-6 rounded-xl shadow bg-[#fff3eb]">
              <FaEnvelope className="text-[#FC8934] text-3xl mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-800">Email</h3>
              <p className="text-gray-600">support@yourcompany.com</p>
            </div>
            <div className="p-6 rounded-xl shadow bg-[#fff3eb]">
              <FaBook className="text-[#FC8934] text-3xl mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-800">Knowledge Base</h3>
              <p className="text-gray-600">Browse articles & guides to help yourself.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;
