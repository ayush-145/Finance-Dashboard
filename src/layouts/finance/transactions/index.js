import { useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import InputBase from "@mui/material/InputBase";
import { Table as MuiTable } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";


import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { useFinance, setFilters, resetFilters, deleteTxn } from "context/FinanceContext";
import { CATEGORIES } from "data/mockData";
import { exportCSV, exportJSON } from "utils/exportData";
import TransactionModal from "layouts/finance/transactions/TransactionModal";

function Transactions() {
  const [state, dispatch] = useFinance();
  const { transactions, filters, role, darkMode } = state;
  const isAdmin = role === "admin";

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [catAnchor, setCatAnchor] = useState(null);
  const [typeAnchor, setTypeAnchor] = useState(null);

  const openCat = (e) => setCatAnchor(e.currentTarget);
  const closeCat = () => setCatAnchor(null);
  
  const openType = (e) => setTypeAnchor(e.currentTarget);
  const closeType = () => setTypeAnchor(null);

  // ── Filtered & sorted transactions ──
  const filtered = useMemo(() => {
    let list = [...transactions];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.date.includes(q)
      );
    }

    // Category filter
    if (filters.category && filters.category !== "all") {
      list = list.filter((t) => t.category === filters.category);
    }

    // Type filter
    if (filters.type && filters.type !== "all") {
      list = list.filter((t) => t.type === filters.type);
    }

    // Sort
    const dir = filters.sortDir === "asc" ? 1 : -1;
    if (filters.sortBy === "date") {
      list.sort((a, b) => dir * a.date.localeCompare(b.date));
    } else if (filters.sortBy === "amount") {
      list.sort((a, b) => dir * (a.amount - b.amount));
    }

    return list;
  }, [transactions, filters]);

  const handleSearch = (e) => setFilters(dispatch, { search: e.target.value });
  const handleCategory = (e) => setFilters(dispatch, { category: e.target.value });
  const handleType = (e) => setFilters(dispatch, { type: e.target.value });

  const toggleSort = (field) => {
    if (filters.sortBy === field) {
      setFilters(dispatch, { sortDir: filters.sortDir === "asc" ? "desc" : "asc" });
    } else {
      setFilters(dispatch, { sortBy: field, sortDir: "desc" });
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (txn) => {
    setEditData(txn);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      deleteTxn(dispatch, id);
    }
  };

  const sortIcon = (field) => {
    if (filters.sortBy !== field) return "unfold_more";
    return filters.sortDir === "asc" ? "arrow_upward" : "arrow_downward";
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        {/* Header */}
        <SoftBox mb={3}>
          <SoftTypography variant="h4" fontWeight="bold">
            Transactions
          </SoftTypography>
          <SoftTypography variant="button" color="text" fontWeight="regular">
            View, filter, and manage your financial transactions.
          </SoftTypography>
        </SoftBox>

        {/* Toolbar */}
        <Card sx={{ mb: 3 }}>
          <SoftBox p={2}>
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} sm={6} md={3}>
                <SoftBox
                  display="flex"
                  alignItems="center"
                  width="100%"
                  sx={{
                    height: 40,
                    px: 1.5,
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(52, 71, 103, 0.4)",
                  }}
                >
                  <Icon fontSize="small" sx={{ color: darkMode ? "rgba(255, 255, 255, 0.6)" : "#888", mr: 1 }}>
                    search
                  </Icon>
                  <input
                    placeholder="Search transactions..."
                    value={filters.search}
                    onChange={handleSearch}
                    style={{
                      width: "100%",
                      fontSize: "0.85rem",
                      color: darkMode ? "#fff" : "#344767",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </SoftBox>
              </Grid>

              {/* Category Filter */}
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.category}
                    onChange={handleCategory}
                    displayEmpty
                    sx={{
                      height: 40,
                      borderRadius: "8px",
                      "& .MuiSelect-select": {
                        py: 0,
                        px: 1.5,
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        fontSize: "0.85rem",
                        color: darkMode ? "#fff" : "#344767",
                      },
                      "& fieldset": {
                        borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(52, 71, 103, 0.4)",
                      },
                    }}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {CATEGORIES.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Type Filter */}
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.type}
                    onChange={handleType}
                    displayEmpty
                    sx={{
                      height: 40,
                      borderRadius: "8px",
                      "& .MuiSelect-select": {
                        py: 0,
                        px: 1.5,
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        fontSize: "0.85rem",
                        color: darkMode ? "#fff" : "#344767",
                      },
                      "& fieldset": {
                        borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(52, 71, 103, 0.4)",
                      },
                    }}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Reset */}
              <Grid item xs={4} sm={2} md={1}>
                <Tooltip title="Reset filters">
                  <IconButton onClick={() => resetFilters(dispatch)} size="small">
                    <Icon>refresh</Icon>
                  </IconButton>
                </Tooltip>
              </Grid>

              {/* Actions */}
              <Grid item xs={8} sm={6} md={4}>
                <SoftBox display="flex" justifyContent="flex-end" gap={1} flexWrap="wrap">
                  <SoftButton
                    variant="outlined"
                    color="dark"
                    size="small"
                    onClick={() => exportCSV(filtered)}
                  >
                    <Icon sx={{ mr: 0.5 }}>download</Icon>
                    CSV
                  </SoftButton>
                  <SoftButton
                    variant="outlined"
                    color="dark"
                    size="small"
                    onClick={() => exportJSON(filtered)}
                  >
                    <Icon sx={{ mr: 0.5 }}>download</Icon>
                    JSON
                  </SoftButton>
                  {isAdmin && (
                    <SoftButton variant="gradient" color="info" size="small" onClick={handleAdd}>
                      <Icon sx={{ mr: 0.5 }}>add</Icon>
                      Add
                    </SoftButton>
                  )}
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
        </Card>

        {/* Table */}
        <Card>
          {filtered.length === 0 ? (
            /* Empty State */
            <SoftBox py={8} textAlign="center">
              <Icon sx={{ fontSize: "3rem !important", color: "#ccc", mb: 1 }}>
                search_off
              </Icon>
              <SoftTypography variant="h6" color="text" fontWeight="medium">
                No transactions found
              </SoftTypography>
              <SoftTypography variant="button" color="text" fontWeight="regular">
                Try adjusting your filters or add a new transaction.
              </SoftTypography>
              {isAdmin && (
                <SoftBox mt={2}>
                  <SoftButton variant="gradient" color="info" size="small" onClick={handleAdd}>
                    <Icon sx={{ mr: 0.5 }}>add</Icon>
                    Add Transaction
                  </SoftButton>
                </SoftBox>
              )}
            </SoftBox>
          ) : (
            <TableContainer>
              <MuiTable>
                <SoftBox component="thead">
                  <TableRow>
                    <TableCell align="left">
                      <SoftTypography
                        variant="caption"
                        fontWeight="bold"
                        color="secondary"
                        textTransform="uppercase"
                        sx={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
                        onClick={() => toggleSort("date")}
                      >
                        Date
                        <Icon fontSize="small" sx={{ ml: 0.3, color: "#aaa" }}>
                          {sortIcon("date")}
                        </Icon>
                      </SoftTypography>
                    </TableCell>
                    <TableCell align="left">
                      <SoftTypography variant="caption" fontWeight="bold" color="secondary" textTransform="uppercase">
                        Description
                      </SoftTypography>
                    </TableCell>
                    <TableCell align="left">
                      <SoftTypography variant="caption" fontWeight="bold" color="secondary" textTransform="uppercase">
                        Category
                      </SoftTypography>
                    </TableCell>
                    <TableCell align="right">
                      <SoftTypography
                        variant="caption"
                        fontWeight="bold"
                        color="secondary"
                        textTransform="uppercase"
                        sx={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
                        onClick={() => toggleSort("amount")}
                      >
                        Amount
                        <Icon fontSize="small" sx={{ ml: 0.3, color: "#aaa" }}>
                          {sortIcon("amount")}
                        </Icon>
                      </SoftTypography>
                    </TableCell>
                    <TableCell align="center">
                      <SoftTypography variant="caption" fontWeight="bold" color="secondary" textTransform="uppercase">
                        Type
                      </SoftTypography>
                    </TableCell>
                    {isAdmin && (
                      <TableCell align="center">
                        <SoftTypography variant="caption" fontWeight="bold" color="secondary" textTransform="uppercase">
                          Actions
                        </SoftTypography>
                      </TableCell>
                    )}
                  </TableRow>
                </SoftBox>
                <TableBody>
                  {filtered.map((txn) => (
                    <TableRow key={txn.id} hover>
                      <TableCell align="left">
                        <SoftTypography variant="button" fontWeight="regular" color="secondary">
                          {new Date(txn.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </SoftTypography>
                      </TableCell>
                      <TableCell align="left">
                        <SoftTypography variant="button" fontWeight="medium">
                          {txn.description}
                        </SoftTypography>
                      </TableCell>
                      <TableCell align="left">
                        <Chip
                          label={txn.category}
                          size="small"
                          sx={{
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            borderRadius: "6px",
                            backgroundColor: "rgba(0,0,0,0.06)",
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <SoftTypography
                          variant="button"
                          fontWeight="bold"
                          sx={{
                            color: txn.type === "income" ? "#2dce89" : "#f5365c",
                          }}
                        >
                          {txn.type === "income" ? "+" : "-"}${txn.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </SoftTypography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={txn.type === "income" ? "Income" : "Expense"}
                          size="small"
                          sx={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            color: "#fff",
                            borderRadius: "6px",
                            background:
                              txn.type === "income"
                                ? "linear-gradient(135deg, #2dce89, #2dcecc)"
                                : "linear-gradient(135deg, #f5365c, #f56036)",
                          }}
                        />
                      </TableCell>
                      {isAdmin && (
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleEdit(txn)}>
                              <Icon fontSize="small" color="info">
                                edit
                              </Icon>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(txn.id)}>
                              <Icon fontSize="small" color="error">
                                delete
                              </Icon>
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </MuiTable>
            </TableContainer>
          )}
          {/* Summary footer */}
          {filtered.length > 0 && (
            <SoftBox p={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <SoftTypography variant="caption" color="text">
                Showing {filtered.length} of {transactions.length} transactions
              </SoftTypography>
              <SoftBox display="flex" gap={2}>
                <SoftTypography variant="caption" color="success" fontWeight="bold">
                  Income: $
                  {filtered
                    .filter((t) => t.type === "income")
                    .reduce((s, t) => s + t.amount, 0)
                    .toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </SoftTypography>
                <SoftTypography variant="caption" color="error" fontWeight="bold">
                  Expenses: $
                  {filtered
                    .filter((t) => t.type === "expense")
                    .reduce((s, t) => s + t.amount, 0)
                    .toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </SoftTypography>
              </SoftBox>
            </SoftBox>
          )}
        </Card>

        {/* Transaction Modal */}
        <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} editData={editData} />
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Transactions;
