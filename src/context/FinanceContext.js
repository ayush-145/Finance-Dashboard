import { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import defaultTransactions from "data/mockData";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "finance_state";

// ── Initial state ──
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const loadedFilters = parsed.filters || defaultFilters();
      if (loadedFilters.category === "") loadedFilters.category = "all";
      if (loadedFilters.type === "") loadedFilters.type = "all";

      const txns = parsed.transactions || defaultTransactions;
      const sanitizedTxns = txns.map((t) => (t.id ? t : { ...t, id: uuidv4() }));

      return {
        transactions: sanitizedTxns,
        filters: loadedFilters,
        role: parsed.role || "admin",
        darkMode: parsed.darkMode || false,
      };
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function defaultFilters() {
  return { category: "all", type: "all", search: "", sortBy: "date", sortDir: "desc" };
}

function getInitialState() {
  return (
    loadState() || {
      transactions: defaultTransactions.map((t) => (t.id ? t : { ...t, id: uuidv4() })),
      filters: defaultFilters(),
      role: "admin",
      darkMode: false,
    }
  );
}

// ── Reducer ──
function reducer(state, action) {
  switch (action.type) {
    case "ADD_TXN":
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case "EDIT_TXN":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    case "DELETE_TXN":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "RESET_FILTERS":
      return { ...state, filters: defaultFilters() };

    case "SET_ROLE":
      return { ...state, role: action.payload };

    case "TOGGLE_DARK":
      return { ...state, darkMode: !state.darkMode };

    default:
      throw new Error(`Unhandled finance action: ${action.type}`);
  }
}

// ── Context ──
const FinanceCtx = createContext(null);
FinanceCtx.displayName = "FinanceContext";

function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // storage full — ignore
    }
  }, [state]);

  // Apply / remove dark-mode class on body
  useEffect(() => {
    if (state.darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [state.darkMode]);

  const value = useMemo(() => [state, dispatch], [state]);

  return <FinanceCtx.Provider value={value}>{children}</FinanceCtx.Provider>;
}

FinanceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useFinance() {
  const ctx = useContext(FinanceCtx);
  if (!ctx) throw new Error("useFinance must be used inside FinanceProvider");
  return ctx;
}

// ── Action helpers ──
const addTxn = (dispatch, txn) => dispatch({ type: "ADD_TXN", payload: txn });
const editTxn = (dispatch, txn) => dispatch({ type: "EDIT_TXN", payload: txn });
const deleteTxn = (dispatch, id) => dispatch({ type: "DELETE_TXN", payload: id });
const setFilters = (dispatch, f) => dispatch({ type: "SET_FILTERS", payload: f });
const resetFilters = (dispatch) => dispatch({ type: "RESET_FILTERS" });
const setRole = (dispatch, role) => dispatch({ type: "SET_ROLE", payload: role });
const toggleDark = (dispatch) => dispatch({ type: "TOGGLE_DARK" });

export {
  FinanceProvider,
  useFinance,
  addTxn,
  editTxn,
  deleteTxn,
  setFilters,
  resetFilters,
  setRole,
  toggleDark,
};
