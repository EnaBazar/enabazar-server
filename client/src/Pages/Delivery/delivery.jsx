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

const Delivery = () => {
  const deliverySteps = [
    {
        
      title: "Order Processing",
      
      description:
        "Once you place your order, our team verifies the details and prepares your items for shipment.",
    },
    {
      title: "Packaging",
      description:
        "We ensure your products are carefully packed to avoid any damage during transit.",
    },
    {
      title: "Shipping",
      description:
        "Your order is handed over to our trusted courier partners for fast and secure delivery.",
    },
    {
      title: "Delivery",
      description:
        "Track your package in real-time until it reaches your doorstep safely.",
    },
    {
      title: "Feedback & Support",
      description:
        "We value your feedback. Contact us for any queries or assistance regarding your delivery.",
    },
  ];

  const faqItems = [
    {
      question: "What are the estimated delivery times?",
      answer:
        "Delivery times vary based on your location. Typically, orders are delivered within 3-7 business days.",
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes! Once your order is shipped, we provide a tracking number so you can monitor its progress.",
    },
    {
      question: "What if my package is delayed?",
      answer:
        "If your delivery is delayed, please contact our support team and we will resolve the issue promptly.",
    },
    {
      question: "Can I change my delivery address after placing an order?",
      answer:
        "Yes, but only if the order hasn’t been shipped yet. Contact support immediately to update your address.",
    },
    {
      question: "What is the return policy?",
      answer:
        "You can return products within 14 days of delivery. Items must be unused and in original packaging.",
    },
  ];

  return (
    <div className="bg-[#fffaf7]">
      {/* ✅ Breadcrumbs */}
      <DynamicBreadcrumbs />

      {/* ✅ Hero Section */}
      <section className="relative bg-[#FC8934] text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Delivery Information
          </motion.h1>
          <motion.p
            className="max-w-3xl mx-auto text-lg md:text-xl text-orange-100"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Learn about our shipping process, delivery times, and policies to ensure a smooth shopping experience.
          </motion.p>
        </div>
      </section>

      {/* ✅ Delivery Steps */}
      <section className="container mx-auto px-6 py-16 space-y-12">
        {deliverySteps.map((step, idx) => (
          <motion.div
            key={idx}
            className="bg-white shadow-md rounded-xl p-8 border border-[#FC8934]/20 !mb-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
          >
            <h2 className="text-2xl font-bold text-[#FC8934] mb-4">{step.title}</h2>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </section>

      {/* ✅ FAQ Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#FC8934] mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqItems.map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-white shadow-md rounded-xl p-6 border !mb-3 border-[#FC8934]/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <h3 className="text-xl font-semibold text-[#FC8934] mb-2">{item.question}</h3>
              <p className="text-gray-600">{item.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Delivery;
