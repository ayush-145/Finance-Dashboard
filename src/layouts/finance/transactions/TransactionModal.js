import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";

import { CATEGORIES } from "data/mockData";
import { useFinance, addTxn, editTxn } from "context/FinanceContext";

const EMPTY = {
  date: new Date().toISOString().slice(0, 10),
  description: "",
  amount: "",
  category: "Groceries",
  type: "expense",
};

function TransactionModal({ open, onClose, editData }) {
  const [, dispatch] = useFinance();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(editData);

  useEffect(() => {
    if (editData) {
      setForm({
        date: editData.date,
        description: editData.description,
        amount: String(editData.amount),
        category: editData.category,
        type: editData.type,
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [editData, open]);

  const set = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.date) e.date = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = "Enter a positive number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const txn = {
      id: isEdit ? editData.id : uuidv4(),
      date: form.date,
      description: form.description.trim(),
      amount: parseFloat(Number(form.amount).toFixed(2)),
      category: form.category,
      type: form.type,
    };
    if (isEdit) {
      editTxn(dispatch, txn);
    } else {
      addTxn(dispatch, txn);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <SoftBox display="flex" alignItems="center" gap={1}>
          <Icon color="info">{isEdit ? "edit" : "add_circle"}</Icon>
          <SoftTypography variant="h6">
            {isEdit ? "Edit Transaction" : "Add Transaction"}
          </SoftTypography>
        </SoftBox>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} sm={6}>
            <SoftTypography variant="caption" fontWeight="bold" mb={0.5} component="div">
              Date
            </SoftTypography>
            <TextField
              type="date"
              fullWidth
              size="small"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              error={Boolean(errors.date)}
              helperText={errors.date}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SoftTypography variant="caption" fontWeight="bold" mb={0.5} component="div">
              Amount ($)
            </SoftTypography>
            <TextField
              type="number"
              fullWidth
              size="small"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              error={Boolean(errors.amount)}
              helperText={errors.amount}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>
          <Grid item xs={12}>
            <SoftTypography variant="caption" fontWeight="bold" mb={0.5} component="div">
              Description
            </SoftTypography>
            <SoftInput
              placeholder="e.g. Grocery shopping"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              error={Boolean(errors.description)}
            />
            {errors.description && (
              <SoftTypography variant="caption" color="error">
                {errors.description}
              </SoftTypography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <SoftTypography variant="caption" fontWeight="bold" mb={0.5} component="div">
              Category
            </SoftTypography>
            <FormControl fullWidth size="small">
              <Select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <SoftTypography variant="caption" fontWeight="bold" mb={0.5} component="div">
              Type
            </SoftTypography>
            <FormControl fullWidth size="small">
              <Select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SoftButton variant="outlined" color="secondary" size="small" onClick={onClose}>
          Cancel
        </SoftButton>
        <SoftButton variant="gradient" color="info" size="small" onClick={handleSave}>
          <Icon sx={{ mr: 0.5 }}>save</Icon>
          {isEdit ? "Update" : "Add"}
        </SoftButton>
      </DialogActions>
    </Dialog>
  );
}

TransactionModal.defaultProps = {
  editData: null,
};

TransactionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editData: PropTypes.object,
};

export default TransactionModal;
