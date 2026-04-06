// Finance layouts
import FinanceOverview from "layouts/finance/overview";
import FinanceTransactions from "layouts/finance/transactions";
import FinanceInsights from "layouts/finance/insights";

// Icons
import CreditCard from "examples/Icons/CreditCard";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";

const routes = [
  { type: "title", title: "Finance", key: "finance-title" },
  {
    type: "collapse",
    name: "Overview",
    key: "finance",
    route: "/finance",
    icon: <CreditCard size="12px" />,
    component: <FinanceOverview />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Transactions",
    key: "transactions",
    route: "/finance/transactions",
    icon: <Document size="12px" />,
    component: <FinanceTransactions />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Insights",
    key: "insights",
    route: "/finance/insights",
    icon: <SpaceShip size="12px" />,
    component: <FinanceInsights />,
    noCollapse: true,
  },
];

export default routes;
