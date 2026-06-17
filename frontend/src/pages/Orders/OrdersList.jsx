import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { fetchOrders, setFilters, deleteOrder } from '../../features/orders/orderSlice';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import OrderForm from './OrderForm';

const STATUS_STYLES = {
  Delivered: { bg: 'rgba(52,211,153,0.08)', text: '#34D399', border: 'rgba(52,211,153,0.15)' },
  Pending:   { bg: 'rgba(251,191,36,0.08)', text: '#FBBF24', border: 'rgba(251,191,36,0.15)' },
  Shipped:   { bg: 'rgba(99,102,241,0.08)',  text: '#818CF8', border: 'rgba(99,102,241,0.15)' },
  Processing:{ bg: 'rgba(56,189,248,0.08)',  text: '#38BDF8', border: 'rgba(56,189,248,0.15)' },
  Cancelled: { bg: 'rgba(239,68,68,0.08)',   text: '#F87171', border: 'rgba(239,68,68,0.15)' },
  Returned:  { bg: 'rgba(168,85,247,0.08)',  text: '#A855F7', border: 'rgba(168,85,247,0.15)' },
};

const OrdersList = () => {
  const dispatch = useDispatch();
  const { orders, pagination, filters, status } = useSelector((state) => state.orders);
  const [deleteId, setDeleteId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      status: filters.status,
    }));
  }, [dispatch, filters]);

  const handlePageChange = useCallback((p) => dispatch(setFilters({ page: p })), [dispatch]);

  const handleSearch = useCallback((term) => {
    dispatch(setFilters({ search: term, page: 1 }));
  }, [dispatch]);

  const handleDelete = () => {
    if (deleteId) {
      dispatch(deleteOrder(deleteId));
      setDeleteId(null);
    }
  };

  const columns = [
    {
      header: 'Order ID',
      accessor: 'OrderID',
      render: (row) => <span className="font-semibold text-sm" style={{ color: '#818CF8' }}>{row.OrderID}</span>,
    },
    {
      header: 'Customer',
      accessor: 'CustomerName',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{ background: 'rgba(99,102,241,0.12)', color: '#818CF8' }}>
            {row.CustomerName?.charAt(0)}
          </div>
          <span className="text-sm text-white">{row.CustomerName}</span>
        </div>
      ),
    },
    {
      header: 'Product',
      accessor: 'ProductName',
      render: (row) => (
        <span className="text-sm max-w-[180px] truncate block" style={{ color: '#94A3B8' }} title={row.ProductName}>
          {row.ProductName}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'TotalAmount',
      render: (row) => (
        <span className="text-sm font-semibold" style={{ color: '#34D399' }}>
          ${parseFloat(row.TotalAmount?.$numberDecimal || row.TotalAmount || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'OrderStatus',
      render: (row) => {
        const s = STATUS_STYLES[row.OrderStatus] || STATUS_STYLES.Pending;
        return (
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
            {row.OrderStatus}
          </span>
        );
      },
    },
    {
      header: '',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => { setEditingOrder(row); setIsFormOpen(true); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: '#475569' }}
          >
            <FiEdit2 size={13} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:text-red-400"
            style={{ color: '#475569' }}
          >
            <FiTrash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      <Helmet>
        <title>Orders | OrderFlow Dashboard</title>
      </Helmet>

      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-white">Orders</h1>
          <p className="text-sm mt-0.5" style={{ color: '#475569' }}>Browse and manage your dataset</p>
        </div>
        <button
          onClick={() => { setEditingOrder(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl text-white transition-all"
          style={{ background: '#6366F1', boxShadow: '0 4px 14px rgba(99,102,241,0.25)' }}
        >
          <FiPlus size={14} /> Add Order
        </button>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        isLoading={status === 'loading'}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchPlaceholder="Search orders..."
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Order"
        message="This action cannot be undone. The order will be permanently removed."
        confirmText="Delete"
        isDestructive
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingOrder ? 'Edit Order' : 'New Order'}
        size="lg"
      >
        <OrderForm initialData={editingOrder} onClose={() => setIsFormOpen(false)} />
      </Modal>
    </div>
  );
};

export default OrdersList;
