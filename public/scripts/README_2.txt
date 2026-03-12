# Trading Strategies Framework

A clean, organized framework for backtesting and analyzing trading strategies. This project provides a standardized structure for implementing, testing, and comparing various trading strategies.

## 📁 Project Structure

```
clean_strategies/
├── strategies/                  # All trading strategies organized by type
│   ├── dip_strategies/         # DIP (Dip Into Profit) strategies
│   ├── gap_and_go_strategies/  # Gap & Go strategies
│   ├── spy_strategies/         # SPY-specific strategies
│   ├── ml_strategies/          # Machine Learning based strategies
│   └── other_strategies/       # Other miscellaneous strategies
├── utils/                      # Shared utilities and base classes
│   ├── trading_utils.py       # Common functions (indicators, stats, etc.)
│   ├── base_strategy.py       # Base strategy classes
│   └── __init__.py           # Package initialization
├── data/                      # Market data files (CSV format)
├── results/                   # Strategy results and reports
├── docs/                      # Additional documentation
└── run_all.py                # Script to run all strategies
```

## 🚀 Quick Start

### 1. Running a Single Strategy

```python
# Navigate to the strategy file
cd strategies/spy_strategies/

# Run the strategy
python spy_gap_fade.py
```

### 2. Understanding Strategy Output

Each strategy provides standardized output with these key metrics:

```
==================================================
Strategy Name - Performance Summary
==================================================
Total Trades:    125
Win Rate:        56.80%
Total Profit:    $12,450.32
ROI:             77.81%
Sharpe Ratio:    1.245
Max Drawdown:    -8.32%
Win/Loss Ratio:  1.52
==================================================
```

### 3. Creating a New Strategy

All strategies inherit from `BaseStrategy` or `LongShortStrategy`:

```python
from utils import BaseStrategy, calculate_rsi

class MyNewStrategy(BaseStrategy):
    def __init__(self, initial_investment=16000):
        super().__init__("My New Strategy", initial_investment)
        
    def calculate_indicators(self, df):
        """Calculate required indicators"""
        df['RSI'] = calculate_rsi(df['Close'])
        return df
        
    def get_entry_conditions(self, df):
        """Define when to enter trades"""
        return df['RSI'] < 30  # Buy when RSI < 30
        
    def get_exit_conditions(self, df, entry_index):
        """Define when to exit trades"""
        # Exit at market close (default)
        return super().get_exit_conditions(df, entry_index)
```

## 📊 Strategy Types

### 1. DIP Strategies
- **Concept**: Buy dips based on rolling average of red day drops
- **Example**: `dip_basic.py` - Basic DIP with optimizable window size
- **Key Parameters**: Window size, multiplier

### 2. Gap & Go Strategies
- **Concept**: Trade gaps in the direction of the gap with indicator confirmation
- **Example**: `gap_go_rsi_bb_squeeze.py` - Uses RSI and Bollinger Band squeeze
- **Key Parameters**: Gap size, profit target, stop loss

### 3. SPY Strategies
- **Concept**: Strategies specifically designed for SPY ETF
- **Example**: `spy_gap_fade.py` - Fade gaps (trade opposite direction)
- **Key Parameters**: Gap range percentages

## 🛠️ Utilities

### Trading Utils (`utils/trading_utils.py`)

Common functions available:
- `load_data()` - Load and prepare CSV data
- `calculate_rsi()` - RSI indicator
- `calculate_atr()` - Average True Range
- `calculate_bollinger_bands()` - Bollinger Bands
- `calculate_macd()` - MACD indicator
- `calculate_statistics()` - Comprehensive performance metrics
- `calculate_sharpe_ratio()` - Risk-adjusted returns
- `calculate_max_drawdown()` - Maximum drawdown

### Base Strategy (`utils/base_strategy.py`)

Provides:
- Standard backtesting framework
- Position sizing
- Trade tracking
- Performance calculation
- Results saving

## 📈 Data Requirements

Data files should be CSV format with these columns:
- `Date` - Trading date
- `Open` - Opening price
- `High` - High price
- `Low` - Low price
- `Close` - Closing price
- `Volume` - Trading volume

## 🎯 Best Practices

1. **One Strategy Per File**: Keep each strategy in its own file for clarity
2. **Descriptive Names**: Use clear, descriptive names for strategies and files
3. **Document Parameters**: Always document what parameters do and their defaults
4. **Validate Data**: Check for required columns and data quality
5. **Avoid Look-Ahead Bias**: Use `.shift()` for indicators to avoid future data
6. **Test Adequacy**: Aim for 100+ trades for statistical significance

## 📝 Adding New Strategies

1. Choose appropriate base class (`BaseStrategy` or `LongShortStrategy`)
2. Implement required methods:
   - `calculate_indicators()` - Add technical indicators
   - `get_entry_conditions()` - Define entry logic
   - `get_exit_conditions()` (optional) - Custom exit logic
3. Place in appropriate subfolder under `strategies/`
4. Test with sample data
5. Document strategy logic in docstring

## 🔧 Configuration

Default parameters:
- Initial Investment: $16,000
- Data Directory: `../data/`
- Results Directory: `../results/`

These can be customized when initializing strategies.

## 📊 Running Multiple Strategies

Use the `run_all.py` script to run all strategies and compare results:

```bash
python run_all.py
```

This will:
1. Run all strategies in the strategies folder
2. Generate a summary comparison
3. Save results to CSV for further analysis

## 🐛 Troubleshooting

### Common Issues:

1. **Import Errors**: Ensure you're running from the correct directory
2. **Data Not Found**: Check data file paths and ensure CSV files are in `data/`
3. **No Trades Generated**: Review entry conditions - they might be too restrictive
4. **Memory Issues**: For large datasets, consider processing in chunks

### Debug Mode:

Add debug prints to understand strategy behavior:

```python
# In calculate_indicators or get_entry_conditions
print(f"RSI values: {df['RSI'].describe()}")
print(f"Entry signals: {entry_signals.sum()} out of {len(df)} days")
```

## 📚 Further Development

Ideas for enhancement:
- Add portfolio strategies (multiple positions)
- Implement options strategies
- Add real-time data connections
- Create web dashboard for results
- Add Monte Carlo simulation
- Implement walk-forward optimization

---

Happy Trading! 📈 Remember: Past performance doesn't guarantee future results. Always backtest thoroughly and trade responsibly.