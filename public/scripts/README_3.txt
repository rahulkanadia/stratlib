"""
Gap & Go Strategies Index
-------------------------
Overview of Gap & Go strategy variations that trade WITH the gap direction.

## Strategy Overview

Gap & Go strategies trade in the direction of the gap, expecting momentum continuation.
Each strategy combines two technical indicators for entry confirmation.

### Entry Logic:
1. Valid gap occurs (≥ 0.3%)
2. Both indicator conditions are met
3. Trade in direction of gap (gap up = long, gap down = short)

### Exit Logic:
- Profit target: 1% gain
- Stop loss: 0.5% loss
- Market close if neither hit

## Available Strategies

### Top Profit Performers
- **Rank 1**: Rsi Bearish + Bb Squeeze Active
- **Rank 2**: Obv Rising + Volume Trend Up
- **Rank 3**: Macd Bearish + Bb Narrow
- **Rank 4**: Downtrend Sma20 + Bb Narrow
- **Rank 5**: Bb Narrow + Stoch Neutral
- **Rank 6**: Bb Squeeze Active + Stoch Neutral
- **Rank 7**: Bb Narrow + Atr Expanding
- **Rank 8**: Momentum Negative + Bb Narrow
- **Rank 9**: Obv Rising + Stoch Bearish
- **Rank 10**: Low Volatility + Adx Trending
- **Rank 11**: Obv Rising + Mid Week
- **Rank 12**: Macd Bearish + Bb Squeeze Active
- **Rank 13**: Uptrend Sma50 + Momentum Negative
- **Rank 14**: Mfi Weak + Bb Narrow
- **Rank 15**: Normal Volume + Price Near Bb Lower

### Top Success Rate Performers
- **Rank 1**: Obv Rising + Volume Trend Up
- **Rank 2**: Low Volatility + Adx Trending
- **Rank 3**: Momentum Positive + Volume Trend Up
- **Rank 4**: Obv Rising + Stoch Bearish
- **Rank 5**: Atr Expanding + Cci Bullish
- **Rank 6**: Obv Rising + Mid Week
- **Rank 7**: Williams Overbought + Small Gap
- **Rank 8**: Trend Alignment + Mid Week
- **Rank 9**: Low Volatility + Cci Bullish
- **Rank 10**: Uptrend Sma20 + Low Volatility
- **Rank 11**: Uptrend Sma20 + Mid Week
- **Rank 12**: Rsi Bearish + Bb Squeeze Active
- **Rank 13**: Medium Gap + Gap Up
- **Rank 14**: Ema 8 Above 21 + Low Volatility
- **Rank 15**: Momentum Positive + Atr Expanding


## Most Popular Indicators

The following indicators appear most frequently in successful combinations:

- **Medium_Gap**: Used in 27 strategies
- **OBV_Rising**: Used in 24 strategies
- **Mid_Week**: Used in 24 strategies
- **CCI_Bullish**: Used in 19 strategies
- **Gap_Up**: Used in 19 strategies
- **Volume_Trend_Up**: Used in 17 strategies
- **BB_Narrow**: Used in 16 strategies
- **BB_Squeeze_Active**: Used in 15 strategies
- **Normal_Volume**: Used in 14 strategies
- **EMA_8_Above_21**: Used in 14 strategies
- **Low_Volatility**: Used in 13 strategies
- **Stoch_Neutral**: Used in 12 strategies
- **ATR_Expanding**: Used in 12 strategies
- **Uptrend_SMA20**: Used in 12 strategies
- **Uptrend_SMA50**: Used in 12 strategies


## Running Strategies

### Single Strategy:
```bash
cd gap_and_go_strategies
python gap_go_profit_01_rsi_bearish_bb_squeeze_active.py
```

### All Gap & Go Strategies:
```bash
cd ../..
python run_all.py --filter gap_go
```

## Creating Custom Combinations

Use the pattern from existing strategies:

```python
from utils import BaseStrategy

class GapGoCustomStrategy(BaseStrategy):
    def calculate_indicators(self, df):
        # Add your indicators
        return df
        
    def get_entry_conditions(self, df):
        # Valid gap + your two conditions
        valid_gap = (df['Gap_Up']) | (df['Gap_Down'])
        condition1 = # Your first indicator
        condition2 = # Your second indicator
        return valid_gap & condition1 & condition2
```

## Strategy Performance Notes

- **Minimum Trades**: All original strategies had 100+ trades
- **Time Period**: Tested on historical SPY data
- **Risk Management**: Built-in profit targets and stop losses
- **No Look-Ahead Bias**: All indicators properly shifted

## Original Data Source

These strategies were generated from combinations of 65+ technical indicators,
testing all pairs and ranking by profit and success rate.
Only the top performers are included here.
