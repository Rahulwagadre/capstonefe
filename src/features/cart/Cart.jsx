import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export const Cart = () => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const [cartProds, setCartProds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalQty, setTotalQty] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  useEffect(() => {
    const fetchCartData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const [cartResponse, productsResponse] = await Promise.all([
          axios.get(`http://localhost:9012/cart/${userId}`),
          axios.get("http://localhost:9010/product")
        ]);

        const cart = cartResponse.data;
        const products = productsResponse.data.data || [];

        const calculatedTotalQty = Object.values(cart.prodDetails || {}).reduce((sum, qty) => sum + qty, 0);
        const calculatedTotalAmount = products
          .filter(product => cart.prodDetails && cart.prodDetails[product.id])
          .reduce((sum, product) => sum + (product.price * (cart.prodDetails[product.id] || 0)), 0);

        const cartProducts = products
          .filter(product => cart.prodDetails && cart.prodDetails[product.id])
          .map(product => ({
            ...product,
            quantity: cart.prodDetails[product.id] || 0
          }));

        setTotalQty(calculatedTotalQty);
        setTotalAmount(calculatedTotalAmount);
        setCartProds(cartProducts);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError(err.message || 'Failed to load cart');
        const localCart = localStorage.getItem(`cart_${userId}`);
        if (localCart) {
          const parsedCart = JSON.parse(localCart);
          setCartProds(parsedCart.items || []);
          setTotalQty(parsedCart.totalQty || 0);
          setTotalAmount(parsedCart.totalAmount || 0);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [userId]);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await axios.put(`http://localhost:9012/cart/${userId}`, {
        productId,
        quantity: newQuantity
      });

      if (response.data.status) {
        setCartProds(prev => 
          prev.map(item => 
            item.id === productId 
              ? { ...item, quantity: newQuantity } 
              : item
          )
        );
        
        const newTotalQty = cartProds.reduce((sum, item) => 
          sum + (item.id === productId ? newQuantity : item.quantity), 0);
        const newTotalAmount = cartProds.reduce((sum, item) => 
          sum + (item.price * (item.id === productId ? newQuantity : item.quantity)), 0);

        setTotalQty(newTotalQty);
        setTotalAmount(newTotalAmount);

        localStorage.setItem(`cart_${userId}`, JSON.stringify({
          items: cartProds.map(item => 
            item.id === productId 
              ? { ...item, quantity: newQuantity } 
              : item
          ),
          totalQty: newTotalQty,
          totalAmount: newTotalAmount
        }));
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:9012/cart/${userId}/${productId}`);
      
      if (response.data.status) {
        setCartProds(prev => prev.filter(item => item.id !== productId));
        
        const removedItem = cartProds.find(item => item.id === productId);
        const newTotalQty = totalQty - (removedItem?.quantity || 0);
        const newTotalAmount = totalAmount - (removedItem?.price * (removedItem?.quantity || 0) || 0);

        setTotalQty(newTotalQty);
        setTotalAmount(newTotalAmount);

        localStorage.setItem(`cart_${userId}`, JSON.stringify({
          items: cartProds.filter(item => item.id !== productId),
          totalQty: newTotalQty,
          totalAmount: newTotalAmount
        }));
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const placeOrder = async () => {
    try {
      const response = await axios.post("http://localhost:9012/order", { userId });
      if (response.data.status) {
        setIsCheckoutSuccess(true);
        setCartProds([]);
        setTotalQty(0);
        setTotalAmount(0);
        localStorage.removeItem(`cart_${userId}`);
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      console.error("Error placing order:", err);
    }
  };

  const goToHome = () => {
    navigate('/');
  };

  if (loading) return <div className="text-center py-8">Loading cart...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!userId) return <div className="text-center py-8">Please login to view your cart</div>;

  if (!cartProds || cartProds.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Your cart is empty</p>
        <button
          onClick={goToHome}
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Checkout Success Modal */}
      <Transition appear show={isCheckoutSuccess} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsCheckoutSuccess(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Order Successful!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your order has been placed successfully. You'll be redirected to the home page shortly.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setIsCheckoutSuccess(false);
                        navigate('/');
                      }}
                    >
                      Go to Home Now
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="flex h-full flex-col bg-white shadow-xl">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
            <span className="text-sm text-gray-500">{totalQty} items</span>
          </div>

          {cartProds.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="text-gray-500">Your cart is empty</p>
              <button
                onClick={goToHome}
                className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="mt-8">
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {cartProds.map((product) => (
                    <li key={product.id} className="flex py-6">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{product.name}</h3>
                            <p className="ml-4">${product.price}</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(product.id, product.quantity - 1)}
                              disabled={product.quantity <= 1}
                              className="px-2 py-1 border rounded-l disabled:opacity-50"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 border-t border-b">
                              {product.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, product.quantity + 1)}
                              className="px-2 py-1 border rounded-r"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(product.id)}
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {cartProds.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${totalAmount.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6">
              <button
                onClick={placeOrder}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Place Order
              </button>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                or{' '}
                <button
                  onClick={goToHome}
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Continue Shopping
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// working ends here

// import React, { useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useUser } from '../../context/UserContext';
// import axios from 'axios';
// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment } from 'react';

// export const Cart = () => {
//   const navigate = useNavigate();
//   const { userId } = useUser();
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

//   useEffect(() => {
//     const fetchCart = async () => {
//       if (!userId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
        
//         const response = await axios.get(`http://localhost:9012/cart/${userId}`);
//         setCart(response.data);
//       } catch (err) {
//         console.error("Error fetching cart:", err);
//         setError(err.message || 'Failed to load cart');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCart();
//   }, [userId]);

//   const updateQuantity = async (productId, newQuantity) => {
//     try {
//       const response = await axios.put(`http://localhost:9012/cart/update`, {
//         userId,
//         productId,
//         quantity: newQuantity
//       });

//       if (response.data) {
//         setCart(response.data);
//       }
//     } catch (err) {
//       console.error("Error updating quantity:", err);
//     }
//   };

//   const removeItem = async (productId) => {
//     try {
//       const response = await axios.delete(`http://localhost:9012/cart/deleteProd`, {
//         data: {
//           userId,
//           productId
//         }
//       });
      
//       if (response.data) {
//         setCart(response.data);
//       }
//     } catch (err) {
//       console.error("Error removing item:", err);
//     }
//   };

//   const placeOrder = async () => {
//     try {
//       const response = await axios.post("http://localhost:9012/order", { 
//         userId,
//         products: cart.products 
//       });
      
//       if (response.data) {
//         setIsCheckoutSuccess(true);
//         setCart(null);
        
//         // Clear cart after successful order
//         await axios.delete(`http://localhost:9012/cart/deleteProd`, {
//           data: {
//             userId,
//             productId: 'all' // You might need to modify your API to handle bulk delete
//           }
//         });

//         // Redirect to home after 3 seconds
//         setTimeout(() => {
//           navigate('/');
//         }, 3000);
//       }
//     } catch (err) {
//       console.error("Error placing order:", err);
//     }
//   };

//   const goToHome = () => {
//     navigate('/');
//   };

//   if (loading) return <div className="text-center py-8">Loading cart...</div>;
//   if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
//   if (!userId) return <div className="text-center py-8">Please login to view your cart</div>;
//   if (!cart || !cart.products || cart.products.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500">Your cart is empty</p>
//         <button
//           onClick={goToHome}
//           className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
//         >
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }

//   // Calculate totals
//   const totalQty = cart.products.reduce((sum, product) => sum + product.quantity, 0);
//   const totalAmount = cart.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

//   return (
//     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//       {/* Checkout Success Modal */}
//       <Transition appear show={isCheckoutSuccess} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={() => setIsCheckoutSuccess(false)}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-25" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                   <Dialog.Title
//                     as="h3"
//                     className="text-lg font-medium leading-6 text-gray-900"
//                   >
//                     Order Successful!
//                   </Dialog.Title>
//                   <div className="mt-2">
//                     <p className="text-sm text-gray-500">
//                       Your order has been placed successfully. You'll be redirected to the home page shortly.
//                     </p>
//                   </div>

//                   <div className="mt-4">
//                     <button
//                       type="button"
//                       className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
//                       onClick={() => {
//                         setIsCheckoutSuccess(false);
//                         navigate('/home');
//                       }}
//                     >
//                       Go to Home Now
//                     </button>
//                   </div>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>

//       <div className="flex h-full flex-col bg-white shadow-xl">
//         <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
//           <div className="flex items-start justify-between">
//             <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
//             <span className="text-sm text-gray-500">{totalQty} items</span>
//           </div>

//           <div className="mt-8">
//             <div className="flow-root">
//               <ul role="list" className="-my-6 divide-y divide-gray-200">
//                 {cart.products.map((product) => (
//                   <li key={product.id} className="flex py-6">
//                     <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
//                       <img
//                         src={product.imageUrl || 'https://via.placeholder.com/150'}
//                         alt={product.name}
//                         className="h-full w-full object-cover"
//                       />
//                     </div>

//                     <div className="ml-4 flex flex-1 flex-col">
//                       <div>
//                         <div className="flex justify-between text-base font-medium text-gray-900">
//                           <h3>{product.name}</h3>
//                           <p className="ml-4">${product.price}</p>
//                         </div>
//                       </div>
//                       <div className="flex flex-1 items-end justify-between text-sm">
//                         <div className="flex items-center">
//                           <button
//                             onClick={() => updateQuantity(product.id, product.quantity - 1)}
//                             disabled={product.quantity <= 1}
//                             className="px-2 py-1 border rounded-l disabled:opacity-50"
//                           >
//                             -
//                           </button>
//                           <span className="px-4 py-1 border-t border-b">
//                             {product.quantity}
//                           </span>
//                           <button
//                             onClick={() => updateQuantity(product.id, product.quantity + 1)}
//                             className="px-2 py-1 border rounded-r"
//                           >
//                             +
//                           </button>
//                         </div>

//                         <button
//                           onClick={() => removeItem(product.id)}
//                           type="button"
//                           className="font-medium text-indigo-600 hover:text-indigo-500"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
//           <div className="flex justify-between text-base font-medium text-gray-900">
//             <p>Subtotal</p>
//             <p>${totalAmount.toFixed(2)}</p>
//           </div>
//           <p className="mt-0.5 text-sm text-gray-500">
//             Shipping and taxes calculated at checkout.
//           </p>
//           <div className="mt-6">
//             <button
//               onClick={placeOrder}
//               className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
//             >
//               Checkout
//             </button>
//           </div>
//           <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
//             <p>
//               or{' '}
//               <button
//                 onClick={goToHome}
//                 type="button"
//                 className="font-medium text-indigo-600 hover:text-indigo-500"
//               >
//                 Continue Shopping
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// second draft
