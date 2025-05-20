import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid'
import { selectAllProducts, fetchAllProductsAsync } from './productSlice';
export const ProductList = () => {
  // const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);

  useEffect(() => {
    dispatch(fetchAllProductsAsync());
    // dispatch(fetchAllProductBrandsAsync());
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (

            <Link  key={product.id} to="/product-detail">
            <div className="group relative border-solid border-2 border-gray-200 p-3">
              <img
                alt={product.title}
                src={product.thumbnail}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-60"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <div>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.title}
                    </div>
                  </h3>
                  
                  <p className="mt-1 text-sm text-gray-900"><StarIcon className="w-5 h-5 inline"/>{product.rating}</p>
                </div>
                <div className="">
                <p className="text-sm font-medium text-gray-600 line-through">
                  ${product.price}
                </p>
                <p className="text-m font-medium text-gray-900">
                  {/* ${Math.round((product.price * (100 - product.discountPercentage)) / 100)} */}
                  ${parseFloat(product.price*(1-product.discountPercentage/100)).toFixed(2)}
                </p>
                </div>
              </div>
            </div>
            </Link>
            
          ))}
        </div>
      </div>
    </div>
  );
};
