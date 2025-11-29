import React, { useContext, useState, useEffect } from "react";
import ProductItem from "../../Components/ProductItem";
import { Grid, Container, Pagination, useMediaQuery } from "@mui/material";
import { MyContext } from "../../App";

const ProductsSlider = (props) => {
  const context = useContext(MyContext);

  const [page, setPage] = useState(1);

  // ✅ Media query দিয়ে responsive column বের করছি
  const isXs = useMediaQuery("(max-width:600px)");      // মোবাইল
  const isSm = useMediaQuery("(min-width:600px) and (max-width:900px)");  // ট্যাবলেট ছোট
  const isMd = useMediaQuery("(min-width:900px) and (max-width:1200px)"); // ট্যাবলেট বড়
  // default হবে lg → ডেস্কটপ

  let itemsPerRow = 5; // default lg
  if (isMd) itemsPerRow = 4;
  else if (isSm) itemsPerRow = 3;
  else if (isXs) itemsPerRow = 2;

  const itemsPerPage = itemsPerRow * 2; // ✅ দুই row

  // 👉 Paginate data
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = props?.data?.slice(startIndex, startIndex + itemsPerPage);

  const pageCount = Math.ceil((props?.data?.length || 0) / itemsPerPage);

  // 👉 Page reset যদি itemsPerPage change হয়
  useEffect(() => {
    setPage(1);
  }, [itemsPerPage]);

  return (
    <Container maxWidth="lg" className="py-7">
      <Grid container spacing={2}>
        {paginatedData?.map((item, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
            <ProductItem item={item} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-end !mt-6">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </div>
      )}
    </Container>
  );
};

export default ProductsSlider;
