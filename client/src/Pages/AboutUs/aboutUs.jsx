import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaProjectDiagram, FaRegLightbulb } from "react-icons/fa";
import { MdOutlineHistoryEdu } from "react-icons/md";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";

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

const About = () => {
  return (
    <div className="bg-[#fffaf7]">
      {/* ✅ Breadcrumbs */}
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
            About Our Company
          </motion.h1>
          <motion.p
            className="max-w-3xl mx-auto text-lg md:text-xl text-orange-100"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            We are passionate about delivering high-quality products and
            services that help businesses grow and succeed in the digital era.
          </motion.p>
        </div>
      </section>

      {/* ✅ Mission & Vision */}
      <section className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#FC8934] mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to empower businesses with innovative digital
            solutions, ensuring that they stay ahead of the competition in a
            fast-paced world. We believe in creating meaningful value for our
            clients through technology and creativity.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#FC8934] mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            Our vision is to be a globally recognized company that sets
            benchmarks for excellence, innovation, and customer satisfaction in
            the technology and service industry.
          </p>
        </div>
      </section>

      {/* ✅ Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 shadow rounded-xl bg-[#fff3eb]">
            <FaUsers className="text-[#FC8934] text-4xl mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800">250+</h3>
            <p className="text-gray-600">Happy Clients</p>
          </div>
          <div className="p-6 shadow rounded-xl bg-[#fff3eb]">
            <FaProjectDiagram className="text-[#FC8934] text-4xl mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800">500+</h3>
            <p className="text-gray-600">Projects Completed</p>
          </div>
          <div className="p-6 shadow rounded-xl bg-[#fff3eb]">
            <FaRegLightbulb className="text-[#FC8934] text-4xl mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800">10+</h3>
            <p className="text-gray-600">Years of Experience</p>
          </div>
          <div className="p-6 shadow rounded-xl bg-[#fff3eb]">
            <MdOutlineHistoryEdu className="text-[#FC8934] text-4xl mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800">15</h3>
            <p className="text-gray-600">Awards Won</p>
          </div>
        </div>
      </section>

      {/* ✅ Team Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-[#FC8934] mb-12">
          Meet Our Team
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {[
            { name: "Md.Ibrahim Khalil",
               role: "CEO",
                img: "/public/user.png" },
            { name: "Jane Smith", role: "CTO", img: "https://via.placeholder.com/300" },
            { name: "David Wilson", role: "Lead Developer", img: "https://via.placeholder.com/300" },
            { name: "Sarah Johnson", role: "Marketing Head", img: "https://via.placeholder.com/300" },
          ].map((member, idx) => (
            <motion.div
              key={idx}
              className="bg-white shadow-lg rounded-xl overflow-hidden text-center p-6 hover:shadow-xl transition border border-[#FC8934]/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full mb-4 object-cover border-4 border-[#FC8934]/30"
              />
              <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
              <p className="text-[#FC8934] text-sm font-medium">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
