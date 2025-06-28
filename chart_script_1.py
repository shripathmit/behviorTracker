import plotly.graph_objects as go
import plotly.io as pio

# Data for the weekly behavior trend
days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
positive_percentages = [65, 72, 78, 81, 85]

# Create the line chart
fig = go.Figure()

# Add the line trace with markers
fig.add_trace(go.Scatter(
    x=days,
    y=positive_percentages,
    mode='lines+markers',
    name='Positive %',
    line=dict(color='#4CAF50', width=3),
    marker=dict(
        color='#4CAF50',
        size=8,
        line=dict(color='#2E7D2E', width=2)
    ),
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title="Weekly Positive Behavior Trends",
    xaxis_title="Day",
    yaxis_title="Positive %",
    yaxis=dict(range=[0, 100]),
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Save the chart
fig.write_image("weekly_behavior_trend.png")