import React from "react";
import { motion } from "framer-motion";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";

// Re-usable breadcrumbs (keeps parity with your About page)
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

const LegalNotice = () => {
  return (
    <div className="bg-[#fffaf7] min-h-screen">
      <DynamicBreadcrumbs />

      {/* Hero */}
      <section className="relative bg-[#FC8934] text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Legal Notice
          </motion.h1>
          <motion.p
            className="max-w-3xl mx-auto text-lg md:text-xl text-orange-100"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Important legal information about the use of this website and
            services. Please read carefully.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-16 space-y-10 text-gray-700">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-[#FC8934]">Company Information</h2>
          <p>
            <strong>Company Name:</strong>EnaBazar.com
            <br />
            <strong>Address:</strong> 3900 Islampur Road, Feni, Bangladesh
            <br />
            <strong>Contact:</strong>EnaBazar@gmail.com.com
          </p>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-[#FC8934]">Scope</h2>
          <p>
            This legal notice governs access to and use of this website and the services
            provided. By using our website you agree to comply with these terms.
          </p>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-[#FC8934]">Intellectual Property</h2>
          <p>
            All content, design, logos, text, images and other materials on this site are
            the property of Your Company Ltd. and protected by intellectual property laws.
            You may not reproduce, distribute, or create derivative works without prior
            written consent.
          </p>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-[#FC8934]">Limitation of Liability</h2>
          <p>
            The information on this website is provided "as is" without warranties of any
            kind. To the fullest extent permitted by law, Your Company Ltd. disclaims
            liability for any damages arising from the use of this site.
          </p>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-[#FC8934]">Links to Third Parties</h2>
          <p>
            This website may contain links to third-party sites. These links are provided
            for convenience only; we do not endorse and are not responsible for their
            content or policies.
          </p>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-[#FC8934]">Privacy & Cookies</h2>
          <p>
            Please refer to our Privacy Policy for details about how we collect and use
            personal data. By using this website you consent to our cookie policy.
          </p>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-[#FC8934]">Governing Law</h2>
          <p>
            These terms are governed by the laws of [Country]. Any dispute arising from
            these terms will be subject to the jurisdiction of the courts of [City/Country].
          </p>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-[#FC8934]">Changes</h2>
          <p>
            We may update this legal notice from time to time. The date of the latest
            version will be indicated at the top of this page.
          </p>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-[#FC8934]">Contact</h2>
          <p>
            If you have questions about this legal notice, please contact us at
            <a href="mailto:info@yourcompany.com" className="text-[#FC8934] font-medium"> info@yourcompany.com</a>.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          <p>Last updated: September 17, 2025</p>
        </div>
      </section>
    </div>
  );
};

export default LegalNotice;
