import { useMemo } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";

import { useFinance } from "context/FinanceContext";
import {
  getHighestCategory,
  getMonthlyComparison,
  getAvgTransaction,
  getTop5Expenses,
  generateInsightText,
  getMonthlyTotals,
} from "data/mockData";

function InsightCard({ icon, iconColor, title, value, subtitle }) {
  return (
    <Card>
      <SoftBox p={3}>
        <SoftBox display="flex" alignItems="center" gap={2} mb={1}>
          <SoftBox
            variant="gradient"
            bgColor={iconColor}
            color="white"
            width="3rem"
            height="3rem"
            borderRadius="md"
            display="flex"
            justifyContent="center"
            alignItems="center"
            shadow="md"
          >
            <Icon>{icon}</Icon>
          </SoftBox>
          <SoftBox>
            <SoftTypography variant="button" color="text" fontWeight="regular">
              {title}
            </SoftTypography>
            <SoftTypography variant="h5" fontWeight="bold">
              {value}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        {subtitle && (
          <SoftTypography variant="caption" color="text">
            {subtitle}
          </SoftTypography>
        )}
      </SoftBox>
    </Card>
  );
}

InsightCard.defaultProps = {
  subtitle: "",
};

InsightCard.propTypes = {
  icon: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  subtitle: PropTypes.string,
};

function Insights() {
  const [state] = useFinance();
  const { transactions } = state;

  const highest = useMemo(() => getHighestCategory(transactions), [transactions]);
  const comparison = useMemo(() => getMonthlyComparison(transactions), [transactions]);
  const avgTx = useMemo(() => getAvgTransaction(transactions), [transactions]);
  const top5 = useMemo(() => getTop5Expenses(transactions), [transactions]);
  const insights = useMemo(() => generateInsightText(transactions), [transactions]);
  const monthlyTotals = useMemo(() => getMonthlyTotals(transactions), [transactions]);

  // Bar chart data — income vs expense per month
  const barChartData = useMemo(() => {
    const labels = monthlyTotals.map((m) => {
      const [y, mo] = m.month.split("-");
      return new Date(y, mo - 1).toLocaleString("default", { month: "short" });
    });
    return {
      chart: {
        labels,
        datasets: { 
          label: "Net Savings", 
          data: monthlyTotals.map((m) => Math.round(m.net)),
          backgroundColor: monthlyTotals.map((m) => m.net >= 0 ? "#2dce89" : "#f5365c"),
          textColor: state.darkMode ? "#fff" : "#344767",
        },
      },
      items: [
        {
          icon: { color: "success", component: "trending_up" },
          label: "Total Income",
          progress: {
            content: `$${monthlyTotals.reduce((s, m) => s + m.income, 0).toLocaleString()}`,
            percentage: 100,
          },
        },
        {
          icon: { color: "error", component: "trending_down" },
          label: "Total Expenses",
          progress: {
            content: `$${monthlyTotals.reduce((s, m) => s + m.expense, 0).toLocaleString()}`,
            percentage: 70,
          },
        },
      ],
    };
  }, [monthlyTotals, state.darkMode]);

  const changeArrow = (val) => (val >= 0 ? "arrow_upward" : "arrow_downward");
  const changeColor = (val, invert) => {
    if (invert) return val >= 0 ? "error" : "success";
    return val >= 0 ? "success" : "error";
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        {/* Header */}
        <SoftBox mb={3}>
          <SoftTypography variant="h4" fontWeight="bold">
            Insights
          </SoftTypography>
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Key metrics and smart observations from your financial data.
          </SoftTypography>
        </SoftBox>

        {/* Key Metric Cards */}
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={4}>
              <InsightCard
                icon="local_fire_department"
                iconColor="error"
                title="Highest Spending Category"
                value={highest.category}
                subtitle={`Total: $${highest.total.toLocaleString()}`}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <InsightCard
                icon="compare_arrows"
                iconColor="info"
                title="Month-over-Month"
                value={
                  <SoftBox display="flex" alignItems="center" gap={1}>
                    <SoftBox display="flex" alignItems="center" gap={0.3}>
                      <Icon color={changeColor(comparison.incomeChange, false)} sx={{ fontSize: "1rem !important" }}>
                        {changeArrow(comparison.incomeChange)}
                      </Icon>
                      <SoftTypography variant="h6" fontWeight="bold">
                        {comparison.incomeChange}%
                      </SoftTypography>
                    </SoftBox>
                    <SoftTypography variant="caption" color="text">
                      income
                    </SoftTypography>
                    <SoftBox display="flex" alignItems="center" gap={0.3} ml={1}>
                      <Icon color={changeColor(comparison.expenseChange, true)} sx={{ fontSize: "1rem !important" }}>
                        {changeArrow(comparison.expenseChange)}
                      </Icon>
                      <SoftTypography variant="h6" fontWeight="bold">
                        {comparison.expenseChange}%
                      </SoftTypography>
                    </SoftBox>
                    <SoftTypography variant="caption" color="text">
                      expenses
                    </SoftTypography>
                  </SoftBox>
                }
                subtitle="Compared to previous month"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <InsightCard
                icon="functions"
                iconColor="warning"
                title="Avg. Transaction Size"
                value={`$${avgTx.toLocaleString()}`}
                subtitle={`Across ${transactions.length} transactions`}
              />
            </Grid>
          </Grid>
        </SoftBox>

        {/* Smart Insights */}
        <SoftBox mb={3}>
          <Card>
            <SoftBox p={3}>
              <SoftBox display="flex" alignItems="center" gap={1} mb={2}>
                <Icon color="info">auto_awesome</Icon>
                <SoftTypography variant="h6" fontWeight="bold">
                  Smart Observations
                </SoftTypography>
              </SoftBox>
              {insights.map((text, i) => (
                <SoftBox key={i} display="flex" alignItems="flex-start" gap={1} mb={1.5}>
                  <Icon sx={{ color: "#17c1e8", mt: 0.2, fontSize: "1rem !important" }}>
                    lightbulb
                  </Icon>
                  <SoftTypography variant="button" color="text" fontWeight="regular">
                    {text}
                  </SoftTypography>
                </SoftBox>
              ))}
            </SoftBox>
          </Card>
        </SoftBox>

        {/* Charts + Top 5 */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <ReportsBarChart
              color={state.darkMode ? "dark" : "white"}
              title="Monthly Net Savings"
              description={
                <>
                  Income minus expenses each month
                </>
              }
              chart={barChartData.chart}
              items={barChartData.items}
            />
          </Grid>
          <Grid item xs={12} lg={5}>
            <Card sx={{ height: "100%" }}>
              <SoftBox p={3}>
                <SoftBox display="flex" alignItems="center" gap={1} mb={2}>
                  <Icon color="error">receipt_long</Icon>
                  <SoftTypography variant="h6" fontWeight="bold">
                    Top 5 Expenses
                  </SoftTypography>
                </SoftBox>
                <Divider />
                {top5.length === 0 ? (
                  <SoftBox py={4} textAlign="center">
                    <SoftTypography variant="button" color="text">
                      No expense data available.
                    </SoftTypography>
                  </SoftBox>
                ) : (
                  top5.map((txn, i) => (
                    <SoftBox
                      key={txn.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1.5}
                      sx={{
                        borderBottom: i < top5.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                      }}
                    >
                      <SoftBox display="flex" alignItems="center" gap={1.5}>
                        <SoftBox
                          width="28px"
                          height="28px"
                          borderRadius="50%"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{
                            background: "linear-gradient(135deg, #f5365c22, #f5603622)",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#f5365c",
                          }}
                        >
                          {i + 1}
                        </SoftBox>
                        <SoftBox>
                          <SoftTypography variant="button" fontWeight="medium">
                            {txn.description}
                          </SoftTypography>
                          <SoftTypography variant="caption" color="text" display="block">
                            {txn.category} • {new Date(txn.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </SoftTypography>
                        </SoftBox>
                      </SoftBox>
                      <SoftTypography variant="button" fontWeight="bold" sx={{ color: "#f5365c" }}>
                        -${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </SoftTypography>
                    </SoftBox>
                  ))
                )}
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Insights;
