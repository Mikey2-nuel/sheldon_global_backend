import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js'
import {
//   createWithdrawal,
//   getAllWithdrawals,
  getWithdrawalsByUser,
  updateWithdrawalStatus
} from '../models/withdrawalModel.js';
import {
  createWithdrawal,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from '../controllers/withdrawalController.js';


const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    // user id comes from the decoded token (authMiddleware sets req.user)
    const user_id = req.user.userId;

    const { currency, amount, wallet } = req.body;

    if (!currency || !amount || !wallet) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const result = await createWithdrawal({
      user_id,
      currency,
      amount,
      wallet,
      status: "pending",
    });

    res.status(201).json({
      message: "Withdrawal request submitted",
      withdrawalId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', getAllWithdrawals);
router.post('/:id/approve', approveWithdrawal);
router.post('/:id/reject', rejectWithdrawal);

router.get('/user/:id', verifyToken, async (req, res) => {
  const requestedId = parseInt(req.params.id);
  const tokenUserId = req.user.userId;

  if (requestedId !== tokenUserId) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  const withdrawals = await getWithdrawalsByUser(requestedId);
  res.json(withdrawals);
});

router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const result = await updateWithdrawalStatus(req.params.id, status);
  res.json({ message: 'Status updated', result });
});

export default router;
