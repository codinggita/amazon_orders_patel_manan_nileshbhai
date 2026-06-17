import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { createOrder, updateOrder } from '../../features/orders/orderSlice';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import { FiUser, FiBox, FiDollarSign, FiMapPin, FiTruck, FiArrowRight } from 'react-icons/fi';

const OrderSchema = Yup.object().shape({
  CustomerName: Yup.string().min(2, 'Too short').max(100).required('Required'),
  ProductName: Yup.string().max(200).required('Required'),
  Category: Yup.string().required('Required'),
  Brand: Yup.string().required('Required'),
  Quantity: Yup.number().integer('Must be integer').min(1, 'Min 1').required('Required'),
  TotalAmount: Yup.number().min(0, 'Must be positive').required('Required'),
  PaymentMethod: Yup.string().required('Required'),
  OrderStatus: Yup.string().required('Required'),
  City: Yup.string().required('Required'),
  State: Yup.string().required('Required'),
  Country: Yup.string().required('Required'),
});

const OrderForm = ({ initialData, onClose }) => {
  const dispatch = useDispatch();
  const isEditing = !!initialData;

  const initialValues = isEditing ? {
    ...initialData,
    TotalAmount: parseFloat(initialData.TotalAmount?.$numberDecimal || initialData.TotalAmount || 0),
  } : {
    CustomerName: '', ProductName: '', Category: '', Brand: '',
    Quantity: 1, TotalAmount: 0, PaymentMethod: 'Credit Card',
    OrderStatus: 'Pending', City: '', State: '', Country: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditing) {
        await dispatch(updateOrder({ orderId: initialData._id, updateData: values })).unwrap();
      } else {
        await dispatch(createOrder(values)).unwrap();
      }
      onClose();
    } catch (e) { /* toast handled by slice */ }
    finally { setSubmitting(false); }
  };

  const statusOpts = [
    { value: 'Pending', label: 'Pending' }, { value: 'Processing', label: 'Processing' },
    { value: 'Shipped', label: 'Shipped' }, { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }, { value: 'Returned', label: 'Returned' },
  ];
  const payOpts = [
    { value: 'Credit Card', label: 'Credit Card' }, { value: 'Debit Card', label: 'Debit Card' },
    { value: 'UPI', label: 'UPI' }, { value: 'COD', label: 'Cash on Delivery' },
    { value: 'Net Banking', label: 'Net Banking' },
  ];

  return (
    <Formik initialValues={initialValues} validationSchema={OrderSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left col */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>Customer & Product</p>
              <FormInput name="CustomerName" label="Customer" placeholder="John Doe" icon={FiUser} />
              <FormInput name="ProductName" label="Product" placeholder="Wireless Headphones" icon={FiBox} />
              <FormInput name="Category" label="Category" placeholder="Electronics" />
              <FormInput name="Brand" label="Brand" placeholder="Sony" />
            </div>
            {/* Right col */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>Order Details</p>
              <div className="grid grid-cols-2 gap-3">
                <FormInput name="Quantity" type="number" label="Qty" min="1" />
                <FormInput name="TotalAmount" type="number" step="0.01" label="Amount" icon={FiDollarSign} />
              </div>
              <FormSelect name="PaymentMethod" label="Payment" options={payOpts} />
              <FormSelect name="OrderStatus" label="Status" options={statusOpts} icon={FiTruck} />
            </div>
          </div>

          {/* Shipping */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#334155' }}>Shipping</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FormInput name="City" label="City" placeholder="Mumbai" icon={FiMapPin} />
              <FormInput name="State" label="State" placeholder="Maharashtra" />
              <FormInput name="Country" label="Country" placeholder="India" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button type="button" onClick={onClose}
              className="text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)' }}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all disabled:opacity-50"
              style={{ background: '#6366F1', boxShadow: '0 4px 14px rgba(99,102,241,0.25)' }}>
              {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Order')}
              {!isSubmitting && <FiArrowRight size={13} />}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default OrderForm;
