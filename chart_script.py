import plotly.graph_objects as go
import plotly.io as pio

# Data from the provided JSON
time_labels = ["7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00"]
positive_behaviors = [3, 4, 3, 5, 2, 4, 3, 4, 2, 1, 3, 4, 5, 3, 2, 3]
challenging_behaviors = [1, 0, 1, 0, 2, 1, 2, 0, 3, 2, 1, 0, 0, 1, 2, 1]

# Create the grouped bar chart
fig = go.Figure()

# Add positive behaviors bars
fig.add_trace(go.Bar(
    x=time_labels,
    y=positive_behaviors,
    name='Positive',
    marker_color='#1FB8CD',
    cliponaxis=False
))

# Add challenging behaviors bars
fig.add_trace(go.Bar(
    x=time_labels,
    y=challenging_behaviors,
    name='Challenging',
    marker_color='#FFC185',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title='Daily Behavior Tracking',
    xaxis_title='Time',
    yaxis_title='Frequency',
    barmode='group',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Update y-axis to show range 0-5
fig.update_yaxes(range=[0, 5])

# Save the chart
fig.write_image('behavior_tracking_chart.png')