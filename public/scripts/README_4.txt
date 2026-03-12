# Dip Buying Strategy — Clean Analysis Engine

## Core Thesis

When SPY drops intraday, the price tends to recover toward the close. By placing a limit buy at `Open - HistoricalAvgDrop`, we capture the intraday recovery for a same-day profit.

## How It Works

1. **Calculate rolling average drop** on "red days" (Close < Open) over the past 21 trading days
2. **Set limit buy** at `Open - AvgDrop` each morning
3. **If filled** (Low reaches our limit), hold until market close
4. **Sell at Close** — same-day round trip, no overnight risk

All indicators use `.shift(1)` to eliminate look-ahead bias — decisions only use data available before market open.

## Backtest Results (2009–2024, $16K capital)

| Strategy | Trades | Win Rate | Total P&L | ROI | Sharpe |
|---|---|---|---|---|---|
| **Basic Dip (no filter)** | 2,830 | 56.0% | $24,809 | 155.1% | 1.11 |
| **2+ Consecutive Red Days** | 559 | 58.1% | $11,586 | 72.4% | 2.39 |
| **Monday Only** | 500 | 57.4% | $5,360 | 33.5% | 1.38 |
| **VIX > 15** | 1,995 | 56.6% | $22,650 | 141.6% | 1.30 |
| **Combined (Mon+VIX>15+Red)** | 173 | 59.0% | $3,787 | 23.7% | 2.31 |
| **4+ Consecutive Red Days** | 111 | 51.4% | $3,095 | 19.3% | 2.75 |

Basic strategy was profitable in **14 out of 16 years** tested.

## Files

- `dip_analysis_engine.py` — Full analysis engine with all 7 strategy variants, year-by-year breakdown, and risk metrics
- `quick_dip_check.py` — Lightweight single-strategy runner for quick checks

## Usage

```bash
# Full analysis with all strategies
python dip_analysis_engine.py --spy path/to/spy.csv --vix path/to/vix.csv

# Quick check on a single strategy
python quick_dip_check.py --spy path/to/spy.csv
```

## Key Insights

- **Best risk-adjusted**: 2+ Consecutive Red Days (Sharpe 2.39, 58.1% win rate)
- **Highest absolute return**: Basic strategy ($24,809 total, most trades)
- **Best win rate**: Combined filter — Monday + VIX>15 + prior red day (59.0%)
- **RSI and Bollinger Band filters hurt performance** — they filter out too many profitable trades
- **Thursday** surprisingly shows the highest single-day win rate (58.2%)
