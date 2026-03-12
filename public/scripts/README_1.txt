# Quantitative Market Analysis & Backtesting Engine

A Python-based framework for downloading market data, analyzing intraday price patterns, and backtesting custom trading strategies on SPY and QQQ — with **1,495 strategy scripts** tested across 26 years of data (2000–2025).

---

## Executive Summary

This project explores two core hypotheses about intraday price behavior:

1. **Gap Mean Reversion** — when a stock "gaps" at market open (opens significantly higher or lower than the previous close), the price tends to revert toward the previous close within the same trading day.

2. **Intraday Dip Recovery** — when SPY drops during the trading day, the price tends to recover toward the close, creating a systematic buying opportunity with zero overnight risk.

Starting from basic implementations of both strategies, I systematically layered in volatility filters (VIX, ATR), sentiment indicators (CPCI), technical signals (RSI, MACD, Bollinger Bands, Moving Averages), pattern recognition (consecutive red days, day-of-week effects), and machine learning models (Random Forest, Gradient Boosting) to find which conditions produce the highest-probability trades.

**Key results across 26 years of backtesting (2000–2025):**
- Top strategies achieved **79.55% average win rates**
- Best risk-adjusted strategy: **Price Below Bollinger Band Lower** — Sharpe Ratio 0.731, 78.85% win rate
- Best raw profit: **MA 5/10 Cross + VIX Low** — $9,136 profit on $16K capital, 693 trades
- Strategies remained profitable in **every single year** tested, including 2008, 2020, and 2022 crashes
- 2025 forward-testing showed Sharpe ratios **improving by 94%** vs. backtest period
- QQQ outperformed SPY by **45%** on the same strategies
- Dip-buying basic strategy: **$24,809 profit** on $16K capital (155% ROI) over 15 years with **2,830 trades**
- Best dip variant (2+ Red Days): **58.1% win rate**, Sharpe ratio **2.39**, profitable in almost every year

---

## Development Methodology

Acted as the **system architect and logic designer** throughout this multi-year research effort. Built the entire codebase through **iterative development, rigorous debugging, and systematic optimization**. Every strategy parameter, filter threshold, and optimization approach was personally designed, tested, and validated against historical data — including walk-forward analysis and out-of-sample testing to guard against overfitting.

---

## Project Structure

```
stocks_master/
│
├── data_collection/                  # Market data acquisition pipeline (14 scripts)
│   ├── yahoo_finance_scraper.py      # Yahoo Finance API + URL construction
│   ├── selenium_scraper.py           # Selenium-based dynamic scraping
│   ├── beautifulsoup_scraper.py      # BeautifulSoup HTML parser
│   ├── barchart_scraper.py           # Barchart.com data source
│   └── ...                           # S&P 500, Russell 2000, ETF ticker lists
│
├── strategies/                       # 589 trading strategy implementations
│   ├── gap_close/                    # Gap mean reversion strategies
│   │   ├── top_strategies/           # 19 best-performing indicator-filtered strategies
│   │   ├── two_indicator/            # Dual-indicator confirmation strategies
│   │   ├── high_frequency/           # Intraday 1-min/5-min candle strategies
│   │   ├── historical_2000_2025/     # 26-year backtests with validation
│   │   ├── qqq_research/             # QQQ cross-validation studies
│   │   └── forward_test_2025/        # Out-of-sample 2025 validation
│   ├── gap_and_go/                   # 405 momentum continuation strategies
│   │   ├── top_100/                  # Top 100 by Sharpe ratio
│   │   └── all_strategies/           # Full 1000-strategy grid search
│   ├── dip_buying/                   # 36 systematic dip-buying strategies (raw optimizations)
│   ├── dip_buying_clean/             # Clean dip analysis engine with all variants
│   │   ├── dip_analysis_engine.py    # Full 7-variant engine with reporting
│   │   └── quick_dip_check.py        # Lightweight single-strategy runner
│   └── core_optimizations/           # 58 parameter optimization scripts
│       ├── vix_atr_two_step.py       # Hierarchical VIX→ATR optimization
│       ├── cpci_range_optimizer.py   # Sentiment range optimization
│       ├── day_of_week_optimizer.py  # Weekday effect analysis
│       └── ...                       # Volume, MOVE index, inverse strategies
│
├── clean_strategies/                 # Production-ready framework (627 scripts)
│   ├── utils/                        # Base classes, indicator calculators
│   │   ├── base_strategy.py          # Abstract base class for all strategies
│   │   ├── trading_utils.py          # SMA, EMA, RSI, ATR, MACD, BB
│   │   ├── portfolio_manager.py      # Position sizing & analytics
│   │   └── walk_forward_analysis.py  # Walk-forward validation
│   ├── strategies/                   # Strategy modules by category
│   ├── standalone_strategies/        # 302 self-contained strategy scripts
│   └── docs/                         # Framework documentation
│
├── research/                         # Historical analysis by year/ticker (257 scripts)
│   ├── long_term_2009_2024/          # 15-year longitudinal study
│   ├── spy_2019/ through spy_2023/   # Per-year deep dives
│   ├── qqq_2024/                     # QQQ-specific analysis
│   ├── slv_2023/                     # Silver ETF analysis
│   └── early_research/               # Initial exploration & prototyping
│
├── utils/                            # Shared utility library
├── data/sample/                      # Sample datasets for demo
└── docs/                             # Methodology & performance reports
```

---

## Strategies Analyzed

### Gap Close (Mean Reversion) — 90+ Variations
Fade the gap direction and exit when price reverts to yesterday's close.
- **Bollinger Band Filters** — Trade only when price breaches upper/lower bands
- **RSI Overbought/Oversold** — Filter by RSI extremes (65, 70 thresholds)
- **MACD Crossover** — Enter after bearish/bullish MACD signals
- **Volume Spike** — Trade when volume exceeds the 20-day average
- **Consecutive Red/Green Days** — Enter after 2–3 consecutive down/up days
- **Moving Average Crossovers** — MA(5,10), MA(10,20) cross filters
- **Groette Gap Fill** — Refined entry with range-ratio and percentage filters
- **26-Year Historical Validation** — Every strategy profitable in every year 2000–2025

### Gap & Go (Momentum) — 405 Variations
Trade *with* the gap direction when it signals strong momentum.
- **OBV + Volume Trend** confirmation strategies
- **RSI + Bollinger Squeeze** breakout strategies
- **MACD + ADX Trending** confirmation
- **1,000-strategy grid search** narrowed to Top 100 by Sharpe ratio

### Dip Buying (Intraday Drop Recovery) — 36+ Variations
Systematic analysis of **intraday price drops** and their recovery patterns. Core thesis: when SPY drops during the trading day, the price tends to recover toward the close — creating a same-day buying opportunity with zero overnight risk.

**How it works:** Calculate the rolling 21-day average of intraday drops on red days. Each morning, set a limit buy at `Open - AvgDrop`. If filled, sell at close.

**Verified Results (2009–2024, $16K capital, no look-ahead bias):**

| Strategy | Trades | Win Rate | Total P&L | ROI | Sharpe |
|---|---|---|---|---|---|
| **Basic Dip (no filter)** | 2,830 | 56.0% | $24,809 | 155.1% | 1.11 |
| **2+ Consecutive Red Days** | 559 | 58.1% | $11,586 | 72.4% | **2.39** |
| **Monday Only** | 500 | 57.4% | $5,360 | 33.5% | 1.38 |
| **VIX > 15** | 1,995 | 56.6% | $22,650 | 141.6% | 1.30 |
| **Combined (Mon+VIX>15+Red)** | 173 | **59.0%** | $3,787 | 23.7% | 2.31 |

The basic dip strategy was **profitable in 14 out of 16 years** — including during the 2020 crash and 2022 bear market. The 2+ Consecutive Red Days variant achieves the best risk-adjusted returns with a 2.39 Sharpe ratio.

See `strategies/dip_buying_clean/` for the full analysis engine with year-by-year breakdowns and risk metrics.

### Parameter Optimization — 58 Scripts
- ATR period/threshold grid search (multiprocessing)
- VIX range optimization with binary search
- CPCI sentiment range optimization
- Two-step hierarchical VIX→ATR optimization
- Day-of-week exclusion analysis
- Economic event impact filtering
- Rolling 5-year window regime detection

### Machine Learning — Random Forest & Gradient Boosting
Trained on VIX, ATR, and CPCI features to predict gap-day outcomes.

---

## Performance Highlights

| Strategy | Win Rate | Sharpe Ratio | Total Profit | Trades |
|----------|----------|--------------|-------------|--------|
| Price Below BB Lower | 78.85% | 0.731 | $7,842 | 520 |
| MA 5/10 Cross + VIX Low | 71.28% | 0.685 | $9,136 | 693 |
| After 3 Red Days | 76.42% | 0.712 | $6,891 | 318 |
| RSI Overbought (70) | 74.15% | 0.698 | $7,214 | 445 |
| Volume Spike | 72.93% | 0.667 | $8,105 | 612 |
| Oversold Bounce | 77.31% | 0.724 | $5,987 | 284 |
| Base Gap (Unfiltered) | 68.00% | 0.580 | $8,270 | 1,247 |

*All results backtested on $16,000 initial capital, 2000–2024, with out-of-sample validation on 2025 data.*

---

## Tech Stack

| Category | Tools |
|----------|-------|
| **Core** | Python 3.10+, Pandas, NumPy, SciPy |
| **Machine Learning** | scikit-learn (Random Forest, Gradient Boosting) |
| **Visualization** | Matplotlib, Seaborn |
| **Performance** | Numba (JIT compilation), multiprocessing |
| **Data Collection** | Selenium, BeautifulSoup4, Requests, yfinance |
| **Analysis** | Custom backtesting framework, walk-forward analysis |

---

## Quick Start

```bash
# Clone the repository
git clone https:
cd stocks_master

# Install dependencies
pip install -r requirements.txt

# Run a top strategy backtest
python strategies/gap_close/top_strategies/base_gap_trading.py

# Run all top strategies
python strategies/gap_close/top_strategies/run_all_top_strategies.py

# Run parameter optimization (uses multiprocessing)
python strategies/core_optimizations/spy_atr_optimized.py

# Run dip buying analysis (all strategy variants)
python strategies/dip_buying_clean/dip_analysis_engine.py --spy data/sample/spy_daily.csv --vix data/sample/vix_daily.csv

# Quick dip strategy check
python strategies/dip_buying_clean/quick_dip_check.py --spy data/sample/spy_daily.csv
```

---

## Key Takeaways

1. **Gap mean reversion is a statistically robust edge** — 68%+ win rate unfiltered across 26 years, improving to 79%+ with proper filtering.

2. **VIX regime matters enormously** — Trading only when VIX is between 13–22 dramatically improves Sharpe ratios by filtering out both complacent and panic-driven markets.

3. **Multiple uncorrelated filters compound edge** — Combining VIX + ATR + pattern recognition (e.g., consecutive red days) reduces noise without over-fitting.

4. **Walk-forward validation is essential** — Strategies that looked good in-sample but failed out-of-sample were systematically eliminated.

5. **Scalable architecture** — The base strategy class pattern allowed rapid iteration: 302+ strategies were tested by simply subclassing and overriding `get_entry_conditions()`.

---

## Author

**Daniel Peer**  
daniel10peer@gmail.com

---

## License

This project is for educational and portfolio demonstration purposes. Not financial advice.
