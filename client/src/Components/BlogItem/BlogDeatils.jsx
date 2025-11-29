import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDataFromApi(`/blog/${id}`)
      .then((res) => {
        setBlog(res?.blog || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-red-500 text-lg font-semibold mb-4">
          Blog not found!
        </p>
        <Link
          to="/blog"
          className="inline-block text-white bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg shadow-md transition"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full !mt-6 p-2">
      {/* Hero Image Section */}
      {blog.images && (
        <div className="relative w-full max-w-6xl mx-auto h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center mt-8 rounded-2xl  overflow-hidden shadow-lg">
          <img
            src={blog.images}
            alt={blog.blogtitle}
            className="w-full h-full object-cover brightness-90"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {blog.blogtitle}
            </h1>
            {blog.author && (
              <p className="text-xs sm:text-sm md:text-base text-gray-200">
                By <span className="font-semibold">{blog.author}</span> •{" "}
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Blog Content */}
      <div className="container mx-auto py-10 px-4 lg:px-20">
        <div className="prose prose-base sm:prose-lg lg:prose-xl max-w-none text-gray-800 leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: blog.description }} />
        </div>

        {/* Back Button */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/blog"
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition shadow-md"
          >
            ← Back to Blog List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
