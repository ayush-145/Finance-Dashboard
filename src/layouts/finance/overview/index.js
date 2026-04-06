import { useMemo } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";
import DefaultDoughnutChart from "examples/Charts/DoughnutCharts/DefaultDoughnutChart";

import { useFinance } from "context/FinanceContext";
import {
  getTotalBalance,
  getTotalIncome,
  getTotalExpenses,
  getMonthlyTotals,
  getCategoryBreakdown,
} from "data/mockData";

// Palette for doughnut slices
const CATEGORY_COLORS = [
  "info", "error", "success", "warning", "primary", "dark", "secondary",
  "info", "error", "success",
];

// Gradient presets for summary cards
const CARD_GRADIENTS = {
  balance: "linear-gradient(135deg, #17c1e8 0%, #5e72e4 100%)",
  income:  "linear-gradient(135deg, #2dce89 0%, #2dcecc 100%)",
  expense: "linear-gradient(135deg, #f5365c 0%, #f56036 100%)",
};

/* ─── Custom Summary Card ─── */
function SummaryCard({ gradient, icon, label, value }) {
  return (
    <Card sx={{ overflow: "visible" }}>
      <SoftBox p={2} display="flex" alignItems="center" gap={2}>
        <SoftBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="3.2rem"
          height="3.2rem"
          borderRadius="12px"
          sx={{
            background: gradient,
            color: "#fff",
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.14)",
            flexShrink: 0,
          }}
        >
          <Icon fontSize="small">{icon}</Icon>
        </SoftBox>
        <SoftBox lineHeight={1}>
          <SoftTypography
            variant="button"
            color="text"
            fontWeight="regular"
            textTransform="uppercase"
            sx={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
          >
            {label}
          </SoftTypography>
          <SoftTypography variant="h5" fontWeight="bold">
            {value}
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

SummaryCard.propTypes = {
  gradient: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

function FinanceOverview() {
  const [state, dispatch] = useFinance();
  const { transactions, role } = state;

  const balance = useMemo(() => getTotalBalance(transactions), [transactions]);
  const income = useMemo(() => getTotalIncome(transactions), [transactions]);
  const expenses = useMemo(() => getTotalExpenses(transactions), [transactions]);
  const monthlyTotals = useMemo(() => getMonthlyTotals(transactions), [transactions]);
  const categoryBD = useMemo(() => getCategoryBreakdown(transactions), [transactions]);

  const fmt = (n) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  // Line chart data
  const lineChartData = useMemo(() => {
    const labels = monthlyTotals.map((m) => {
      const [y, mo] = m.month.split("-");
      const d = new Date(y, mo - 1);
      return d.toLocaleString("default", { month: "short", year: "2-digit" });
    });
    return {
      labels,
      datasets: [
        { label: "Income", color: "success", data: monthlyTotals.map((m) => m.income) },
        { label: "Expenses", color: "error", data: monthlyTotals.map((m) => m.expense) },
      ],
    };
  }, [monthlyTotals]);

  // Doughnut chart data
  const doughnutData = useMemo(() => {
    const labels = categoryBD.map((c) => c.category);
    const data = categoryBD.map((c) => c.total);
    const backgroundColors = categoryBD.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]);
    return {
      labels,
      datasets: { label: "Spending", data, backgroundColors },
      cutout: 70,
    };
  }, [categoryBD]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        {/* Top bar — title + Role switcher + Dark mode */}
        <SoftBox mb={3}>
          <SoftTypography variant="h4" fontWeight="bold">
            Finance Overview
          </SoftTypography>
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Track your income, expenses, and balance at a glance.
          </SoftTypography>
        </SoftBox>

        {/* Summary Cards */}
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} xl={4}>
              <SummaryCard
                gradient={CARD_GRADIENTS.balance}
                icon="account_balance_wallet"
                label="Total Balance"
                value={fmt(balance)}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <SummaryCard
                gradient={CARD_GRADIENTS.income}
                icon="trending_up"
                label="Total Income"
                value={fmt(income)}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <SummaryCard
                gradient={CARD_GRADIENTS.expense}
                icon="trending_down"
                label="Total Expenses"
                value={fmt(expenses)}
              />
            </Grid>
          </Grid>
        </SoftBox>

        {/* Charts */}
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <GradientLineChart
                title="Balance Trend"
                description={
                  <SoftBox display="flex" alignItems="center">
                    <SoftBox fontSize="1rem" color="success" mb={0.3} mr={0.5} lineHeight={0}>
                      <Icon className="font-bold">show_chart</Icon>
                    </SoftBox>
                    <SoftTypography variant="button" color="text" fontWeight="medium">
                      Monthly income vs expenses
                    </SoftTypography>
                  </SoftBox>
                }
                height="20.25rem"
                chart={lineChartData}
              />
            </Grid>
            <Grid item xs={12} lg={5}>
              <Card>
                <SoftBox p={3}>
                  <SoftBox mb={1}>
                    <SoftTypography variant="h6">Spending Breakdown</SoftTypography>
                  </SoftBox>
                  <SoftTypography variant="button" color="text" fontWeight="regular" mb={2} component="div">
                    Expenses by category
                  </SoftTypography>
                  <SoftBox height="14rem" mb={2}>
                    <DefaultDoughnutChart chart={doughnutData} height="14rem" />
                  </SoftBox>
                  <Divider />
                  {/* Legend */}
                  <SoftBox display="flex" flexWrap="wrap" gap={1.5} mt={2}>
                    {categoryBD.slice(0, 6).map((c, i) => (
                      <SoftBox key={c.category} display="flex" alignItems="center" gap={0.5}>
                        <SoftBox
                          width="10px"
                          height="10px"
                          borderRadius="50%"
                          sx={{
                            background: (theme) => {
                              const colorKey = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                              return theme.palette[colorKey]?.main || "#344767";
                            },
                          }}
                        />
                        <SoftTypography variant="caption" color="text">
                          {c.category} (${c.total.toLocaleString()})
                        </SoftTypography>
                      </SoftBox>
                    ))}
                  </SoftBox>
                </SoftBox>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>

        {/* Quick Stats */}
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <SoftBox p={3} display="flex" alignItems="center" gap={2}>
                  <SoftBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="3rem"
                    height="3rem"
                    borderRadius="12px"
                    sx={{
                      background: "linear-gradient(135deg, #17c1e8, #5e72e4)",
                      color: "#fff",
                      boxShadow: "0 4px 20px 0 rgba(0,0,0,0.14)",
                    }}
                  >
                    <Icon>receipt_long</Icon>
                  </SoftBox>
                  <SoftBox>
                    <SoftTypography variant="button" color="text" fontWeight="regular">
                      Transactions
                    </SoftTypography>
                    <SoftTypography variant="h5" fontWeight="bold">
                      {transactions.length}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <SoftBox p={3} display="flex" alignItems="center" gap={2}>
                  <SoftBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="3rem"
                    height="3rem"
                    borderRadius="12px"
                    sx={{
                      background: "linear-gradient(135deg, #2dce89, #2dcecc)",
                      color: "#fff",
                      boxShadow: "0 4px 20px 0 rgba(0,0,0,0.14)",
                    }}
                  >
                    <Icon>savings</Icon>
                  </SoftBox>
                  <SoftBox>
                    <SoftTypography variant="button" color="text" fontWeight="regular">
                      Savings Rate
                    </SoftTypography>
                    <SoftTypography variant="h5" fontWeight="bold">
                      {income > 0 ? Math.round(((income - expenses) / income) * 100) : 0}%
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <SoftBox p={3} display="flex" alignItems="center" gap={2}>
                  <SoftBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="3rem"
                    height="3rem"
                    borderRadius="12px"
                    sx={{
                      background: "linear-gradient(135deg, #fb6340, #fbb140)",
                      color: "#fff",
                      boxShadow: "0 4px 20px 0 rgba(0,0,0,0.14)",
                    }}
                  >
                    <Icon>category</Icon>
                  </SoftBox>
                  <SoftBox>
                    <SoftTypography variant="button" color="text" fontWeight="regular">
                      Categories Used
                    </SoftTypography>
                    <SoftTypography variant="h5" fontWeight="bold">
                      {categoryBD.length}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>

        {/* Role indicator */}
        <SoftBox display="flex" justifyContent="flex-end" mb={1}>
          <SoftBadge
            badgeContent={role === "admin" ? "Admin Mode" : "Viewer Mode"}
            color={role === "admin" ? "info" : "secondary"}
            variant="gradient"
            size="sm"
          />
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default FinanceOverview;
