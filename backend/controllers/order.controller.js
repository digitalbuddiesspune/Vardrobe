import Order from '../models/Order.js';

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product');

    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    const order = await Order.findOne({ _id: id, user: userId }).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};
