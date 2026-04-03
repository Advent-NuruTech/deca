// pages/OrderConfirmationPage.jsx
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchOrder } from "../store/slices/orderSlice";
import SEO from "../components/SEO";
import SuccessMessage from "../components/order/SuccessMessage";
import OrderItems from "../components/order/OrderItems";
import ShippingInfo from "../components/order/ShippingInfo";
import OrderSummary from "../components/order/OrderSummary";
import ActionButtons from "../components/order/ActionButtons";

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.order);

  useEffect(() => {
    if (orderNumber) {
      dispatch(fetchOrder(orderNumber));
    }
    window.scrollTo(0, 0);
  }, [dispatch, orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
          />
          <p className="mt-4 text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Order Not Found
          </h1>
          <p className="text-gray-400 mb-8">
            We couldn't find an order with the number "{orderNumber}".
          </p>
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Browse Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`Order Confirmation - ${order.orderNumber}`}
        description={`Order confirmation for ${order.orderNumber} at Fancy Tech Integration South Sudan`}
      />

      <div className="min-h-screen bg-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Success Message */}
          <div className="max-w-4xl mx-auto mb-8">
            <SuccessMessage
              orderNumber={order.orderNumber}
              createdAt={order.createdAt}
            />
          </div>

          {/* Order Details */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <OrderItems items={order.items} />
                <ShippingInfo
                  customer={order.customer}
                  address={order.customer.address}
                />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <OrderSummary order={order} />
              </div>
            </div>

            {/* Action Buttons */}
            <ActionButtons />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
