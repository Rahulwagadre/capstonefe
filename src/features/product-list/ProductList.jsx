import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { StarIcon } from '@heroicons/react/20/solid';
import { selectAllProducts, fetchAllProductsAsync } from './productSlice';
import { useUser } from '../../context/UserContext';
import axios from "axios";

export const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const { userId, isLoading, logout } = useUser();

  useEffect(() => {
    dispatch(fetchAllProductsAsync());
  }, [dispatch]);

  const addToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Adding to cart:", product);
    let creatCart = {
      userId,
      productId: product.id,
      quantity: 1
    }
    let res = await axios.post("http://localhost:9012/cart/addProd", creatCart);
    // Add your cart logic here
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group relative border-solid border-2 border-gray-200 p-3"
            >
              <div className="relative">
                <img
                  alt={product.name}
                  src={product.imageUrl}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-60"
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-700">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <StarIcon className="w-4 h-4 inline mr-1" />
                    {product.rating}
                  </p>
                </div>
                
                <div className="ml-4">
                  <button
                    type="button"
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer transition-colors duration-200"
                    onClick={(e) => addToCart(e, product)}
                  >
                    Add to cart
                  </button>
                </div>
                
                <div className="ml-4 text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${product.price}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {product.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};